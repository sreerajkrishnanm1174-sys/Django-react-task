# serializers.py

from rest_framework import serializers
from django.db import transaction
from .models import *

class MenuItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'price', 'is_available', 'is_veg']


class MenuCategoriesSerializer(serializers.ModelSerializer):
    items = MenuItemsSerializer(many=True, read_only=True)

    class Meta:
        model = MenuCategory
        fields = ['id', 'name', 'display_order', 'items']


class MenuSerializer(serializers.ModelSerializer):
    categories = MenuCategoriesSerializer(many=True, read_only=True)

    class Meta:
        model = Menu
        fields = ['id', 'name', 'date', 'version', 'is_active', 'categories']


class MenuCreateItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['name', 'price', 'is_available', 'is_veg']


class MenuCreateCategorySerializer(serializers.ModelSerializer):
    items = MenuCreateItemSerializer(many=True)

    class Meta:
        model = MenuCategory
        fields = ['name', 'display_order', 'items']


class MenuCreateSerializer(serializers.ModelSerializer):
    categories = MenuCreateCategorySerializer(many=True)

    class Meta:
        model = Menu
        fields = ['name', 'date', 'version', 'is_active', 'categories']

    def create(self, validated_data):
        categories_data = validated_data.pop('categories', [])

        menu = Menu.objects.create(**validated_data)

        for cat_data in categories_data:
            items_data = cat_data.pop('items', [])

            category = MenuCategory.objects.create(
                menu=menu,
                **cat_data
            )

            MenuItem.objects.bulk_create([
                MenuItem(category=category, **item)
                for item in items_data
            ])

        return menu