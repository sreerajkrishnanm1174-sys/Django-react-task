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

        if role == "chef":
            menus = Menu.objects.all()
            serializer = MenuSerializer(menus, many=True)
            return Response(serializer.data)

        return Response(
            {"error": "You have no permission"},
            status=status.HTTP_403_FORBIDDEN
        )





