from django.shortcuts import render
from .models import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import *
from rest_framework.response import Response
from django.db.models import Count, Sum
# Create your views here.

@api_view(['GET'])
@permission_classes([AllowAny])
def ShowMenu(request):
    menu = Menu.objects.prefetch_related('categories')
    # menu =Menu.objects.annotate(
    #     post_count=Count('categories', distinct=True)
    # )

    # print(menu)
    
    # return Response(status=None)
    # serializer = MenuStatsSerializer(menu, many=True)
    # serializer = MenuSerializer(menu, many=True)
    # atomic view

    
    return Response(serializer.data)