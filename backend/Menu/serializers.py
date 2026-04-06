from rest_framework import serializers
from .models import*


class MenuItemsSerializer(serializers.ModelSerializer):
    class Meta :
       model=MenuItem
       fields= '__all__'

class MenuCategoriesSerializer(serializers.ModelSerializer):
    class Meta :
       model=MenuCategory
       fields= '__all__'

class MenuSerializer(serializers.ModelSerializer):
    categories = MenuCategoriesSerializer(many=True)

    class Meta :
       model=Menu
       fields= ['id', 'name', 'categories']

class MenuStatsSerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField()
    # total_likes = serializers.IntegerField()

    class Meta:
        model = Menu
        fields = ['id', 'name', 'post_count', ]