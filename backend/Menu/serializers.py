from rest_framework import serializers
from .models import Menu, MenuCategory, MenuItem, MenuItemPrice


# ── READ serializers ────────────────────────────────────────────

class MenuItemPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItemPrice
        fields = ['id', 'quantity', 'price']


class MenuItemsSerializer(serializers.ModelSerializer):
    prices = MenuItemPriceSerializer(many=True, read_only=True)

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'is_available', 'is_veg', 'prices']


class MenuCategoriesSerializer(serializers.ModelSerializer):
    items = MenuItemsSerializer(many=True, read_only=True)

    class Meta:
        model = MenuCategory
        fields = ['id', 'name', 'items']


class MenuSerializer(serializers.ModelSerializer):
    categories = MenuCategoriesSerializer(many=True, read_only=True)

    class Meta:
        model = Menu
        fields = ['id', 'name', 'date', 'version', 'is_active', 'categories']


# ── WRITE serializers ───────────────────────────────────────────

class MenuItemPriceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItemPrice
        fields = ['quantity', 'price']


class MenuItemCreateSerializer(serializers.ModelSerializer):
    prices = MenuItemPriceCreateSerializer(many=True)

    class Meta:
        model = MenuItem
        fields = ['name', 'is_veg', 'is_available', 'prices']


class MenuCategoryCreateSerializer(serializers.ModelSerializer):
    items = MenuItemCreateSerializer(many=True)
    is_new = serializers.BooleanField(write_only=True)
    existing_id = serializers.IntegerField(
        write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = MenuCategory
        fields = ['name', 'is_new', 'existing_id', 'items']


class MenuCreateSerializer(serializers.ModelSerializer):
    categories = MenuCategoryCreateSerializer(many=True)

    class Meta:
        model = Menu
        fields = ['name', 'date', 'version', 'is_active', 'categories']

    def create(self, validated_data):
        categories_data = validated_data.pop('categories', [])

        menu = Menu.objects.create(**validated_data)

        for cat_data in categories_data:
            items_data = cat_data.pop('items', [])
            cat_data.pop('is_new', None)
            cat_data.pop('existing_id', None)

            category = MenuCategory.objects.create(menu=menu, **cat_data)

            for item_data in items_data:
                prices_data = item_data.pop('prices', [])

                menu_item, _ = MenuItem.objects.get_or_create(
                    name=item_data['name'],
                    defaults={
                        'category':     category,
                        'is_veg':       item_data.get('is_veg', False),
                        'is_available': item_data.get('is_available', True),
                    }
                )

                menu_item.category     = category
                menu_item.is_available = item_data.get('is_available', True)
                menu_item.save(update_fields=['category', 'is_available'])

                for price_data in prices_data:
                    if not price_data.get('quantity', '').strip():
                        continue

                    MenuItemPrice.objects.update_or_create(
                        item=menu_item,
                        quantity=price_data['quantity'].strip(),
                        defaults={'price': price_data['price']},
                    )

        return menu