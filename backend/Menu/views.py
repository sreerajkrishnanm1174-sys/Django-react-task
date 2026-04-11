from django.shortcuts import render
from .models import *
from users.models import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
from .serializers import *
from rest_framework.response import Response
from django.db.models import Count, Sum
from rest_framework.views import APIView
from rest_framework import status

from rest_framework import generics
# Create your views here.

# @api_view(['GET'])
# @permission_classes([All])
# def ShowMenu(request):
#     menu = Menu.objects.prefetch_related('categories')
#     # menu =Menu.objects.annotate(
#     #     post_count=Count('categories', distinct=True)
#     # )

#     # print(menu)
    
#     # return Response(status=None)
#     # serializer = MenuStatsSerializer(menu, many=True)
#     # serializer = MenuSerializer(menu, many=True)
#     # atomic view

    
#     return Response(serializer.data)



class GetMenuView(APIView):
    permission_classes = [IsAuthenticated]
 
    def get(self, request):
        date = request.query_params.get("date")  # e.g. ?date=2026-04-11
 
        menus = Menu.objects.all().order_by("-date", "-version")
 
        if date:
            menus = menus.filter(date=date)
 
        if not menus.exists():
            return Response(
                {"detail": "No menus found for the given date."},
                status=status.HTTP_404_NOT_FOUND,
            )
 
        serializer = MenuSerializer(menus, many=True)
        return Response(serializer.data)
 
class CreateMenuView(APIView):
    def post(self, request):
        serializer = MenuCreateSerializer(data=request.data)

        if serializer.is_valid():
            menu = serializer.save()
            return Response(
                {"message": "Menu created", "id": menu.id},
                status=201
            )

        print("ERROR:", serializer.errors)  # 👈 ADD THIS

        return Response(serializer.errors, status=400)



class CategoryListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MenuCategoriesSerializer

    def get_queryset(self):
        queryset = MenuCategory.objects.all().prefetch_related('items')

        # ✅ optional filter by menu
        menu_id = self.request.query_params.get("menu_id")
        if menu_id:
            queryset = queryset.filter(menu_id=menu_id)

        return queryset.order_by("menu", "name" )



class ItemListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MenuItemsSerializer

    def get_queryset(self):
        queryset = MenuItem.objects.all().select_related('category')

        # ✅ filter by category
        category_id = self.request.query_params.get("category_id")
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        # ✅ search support (important for dropdown)
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset