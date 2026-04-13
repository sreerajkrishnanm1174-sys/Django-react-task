from .models import DiningTable, Order, OrderItem
from rest_framework import serializers  

class DiningTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiningTable
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item_price', 'quantity', 'price', 'subtotal']

        
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'order_id', 'table', 'menu', 'total_amount', 'created_at', 'items']