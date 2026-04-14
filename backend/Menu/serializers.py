from rest_framework import serializers
from .models import Menu, MenuCategory, MenuItem, MenuItemPrice
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
        request = self.context.get('request')

        categories_data = validated_data.get('categories', [])

        menu = Menu.objects.create(
            name=validated_data.get('name'),
            date=validated_data.get('date'),
            version=validated_data.get('version'),
            is_active=validated_data.get('is_active'),
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