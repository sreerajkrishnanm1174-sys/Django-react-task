from django.shortcuts import render

from orders.models import Order
from orders.serializers import OrderSerializer
from rest_framework import viewsets

# Create your views here.

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = []  # Allow unrestricted access for testing
    queryset = Order.objects.all()
    serializer_class = OrderSerializer  
