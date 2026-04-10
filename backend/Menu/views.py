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
        role = getattr(request.user, "role", None)

        
        menus = Menu.objects.all()
        serializer = MenuSerializer(menus, many=True)
        return Response(serializer.data)

        return Response(
            {"error": "You have no permission"},
            status=status.HTTP_403_FORBIDDEN
        )

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

        return queryset.order_by('display_order')



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