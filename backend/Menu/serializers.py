from rest_framework import serializers
from .models import Menu, MenuCategory, MenuItem, MenuItemPrice
from users.models import User
import json


# ── READ serializers ────────────────────────────────────────────

class MenuItemPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItemPrice
        fields = ['id', 'quantity', 'price']


class MenuItemsSerializer(serializers.ModelSerializer):
    prices = MenuItemPriceSerializer(many=True, read_only=True)

    class Meta:
        model = MenuItem
        fields = ['id', 'name',"image", 'is_available', 'is_veg', 'prices']


class MenuCategoriesSerializer(serializers.ModelSerializer):
    items = MenuItemsSerializer(many=True, read_only=True)

    class Meta:
        model = MenuCategory
        fields = ['id', 'name', 'items']
        
class updatedBySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id",'username', "first_name", "last_name","email", "phone","role","profile"]

class MenuSerializer(serializers.ModelSerializer):
    categories = MenuCategoriesSerializer(many=True, read_only=True)
    updated_by = updatedBySerializer(read_only=True)

    class Meta:
        model = Menu
        fields = ['id', 'name', 'date', 'version', 'is_active', 'categories', 'updated_by']


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
        fields = ['name', 'date', 'version', 'is_active', 'categories', 'updated_by']

    def create(self, validated_data):
        request = self.context.get('request')
        print("Received data for menu creation:", validated_data)  # Debug log
        categories_data = validated_data.get('categories', [])

        menu = Menu.objects.create(
            name=validated_data.get('name'),
            date=validated_data.get('date'),
            version=validated_data.get('version'),
            is_active=validated_data.get('is_active'),
            updated_by=validated_data.get('updated_by')
        )

        for ci, cat_data in enumerate(categories_data):

            category = MenuCategory.objects.create(
                menu=menu,
                name=cat_data.get('name')
            )

            for ii, item_data in enumerate(cat_data.get('items', [])):

                image = request.FILES.get(f'image_{ci}_{ii}')
                print(f"Received image for item {item_data.get('name')}: {image}")  

                item = MenuItem.objects.create(
                    category=category,
                    name=item_data.get('name'),
                    image=image,
                    is_veg=item_data.get('is_veg', False),
                    is_available=item_data.get('is_available', True),
                )

                for price in item_data.get('prices', []):
                    if price.get('quantity') and price.get('price'):
                        MenuItemPrice.objects.create(
                            item=item,
                            quantity=price['quantity'],
                            price=price['price'],
                        )

        return menu
    



class MenuItemPriceUpdateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = MenuItemPrice
        fields = ['id', 'quantity', 'price']


class MenuItemUpdateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    prices = MenuItemPriceUpdateSerializer(many=True)

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'image', 'is_available', 'is_veg', 'prices']


class MenuCategoryUpdateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    items = MenuItemUpdateSerializer(many=True)

    class Meta:
        model = MenuCategory
        fields = ['id', 'name', 'items']


class MenuUpdateSerializer(serializers.ModelSerializer):
    categories = MenuCategoryUpdateSerializer(many=True)

    class Meta:
        model = Menu
        fields = ['id', 'name', 'date', 'version', 'is_active', 'categories', 'updated_by']

    # 🔥 FIX: Parse JSON string from FormData
    def to_internal_value(self, data):
        categories = data.get("categories")

        if isinstance(categories, str):
            try:
                data._mutable = True  # required for QueryDict
                data["categories"] = json.loads(categories)
            except Exception:
                raise serializers.ValidationError({
                    "categories": "Invalid JSON format"
                })

        return super().to_internal_value(data)

    def update(self, instance, validated_data):
        request = self.context.get("request")
        categories_data = validated_data.pop("categories", [])

        # ─── Update Menu ───
        instance.name = validated_data.get("name", instance.name)
        instance.date = validated_data.get("date", instance.date)
        instance.version = validated_data.get("version", instance.version)
        instance.is_active = validated_data.get("is_active", instance.is_active)
        instance.save()

        existing_categories = {c.id: c for c in instance.categories.all()}

        for ci, cat_data in enumerate(categories_data):
            items_data = cat_data.pop("items", [])
            cat_id = cat_data.get("id")

            # ─── CATEGORY ───
            if cat_id and cat_id in existing_categories:
                category = existing_categories[cat_id]
                category.name = cat_data.get("name", category.name)
                category.save()
            else:
                category = MenuCategory.objects.create(menu=instance, **cat_data)

            existing_items = {i.id: i for i in category.items.all()}

            for ii, item_data in enumerate(items_data):
                prices_data = item_data.pop("prices", [])
                item_id = item_data.get("id")

                image = request.FILES.get(f'image_{ci}_{ii}')

                # ─── ITEM ───
                if item_id and item_id in existing_items:
                    item = existing_items[item_id]
                    item.name = item_data.get("name", item.name)
                    item.is_veg = item_data.get("is_veg", item.is_veg)
                    item.is_available = item_data.get("is_available", item.is_available)

                    if image:
                        item.image = image

                    item.save()
                else:
                    item = MenuItem.objects.create(
                        category=category,
                        image=image,
                        **item_data
                    )

                existing_prices = {p.id: p for p in item.prices.all()}

                for price_data in prices_data:
                    price_id = price_data.get("id")

                    # ─── PRICE ───
                    if price_id and price_id in existing_prices:
                        price = existing_prices[price_id]
                        price.quantity = price_data.get("quantity", price.quantity)
                        price.price = price_data.get("price", price.price)
                        price.save()
                    else:
                        MenuItemPrice.objects.create(item=item, **price_data)

        return instance