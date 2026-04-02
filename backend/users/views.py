from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .serializers import userserializer
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.filters import SearchFilter


# with using Viewset


class UserViewset(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = userserializer
    filter_backends= [SearchFilter]
    search_fields=["username","email","first_name"]

    # def list(self, request):
    #     search = request.GET.get("search")
    #     queryset = self.queryset

    #     if search:
    #         queryset = queryset.filter(username__icontains=search)

    #     serializer = userserializer(queryset, many=True)
    #     return Response({
    #         'status': 200,
    #         "data": serializer.data
    #     })


# CLASS BASE VIEW 

class ClassUser(APIView):

    def get(self,request):
        return Response("this is get ")
    
    def post(self,request):
        return Response("this is post ")





# function base view 

@api_view(['GET', 'POST', 'PUT' , 'PATCH' , 'DELETE'])
def userapi(request):
    if request.method == "GET":
        userobj=User.objects.all()
        serializer=userserializer(userobj, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        data =request.data
        serializer=userserializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    
    elif request.method == 'PUT':
        data =request.data
        obj=User.objects.get(id=data['id'])
        serializer=userserializer(obj , data=data ,partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    
    elif request.method == 'PATCH':
        data = request.data 
        obj = User.objects.get(id=data['id'])
        serializer=userserializer(obj,data=data ,partial=True )
        if serializer .is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    
    elif request.method == 'DELETE':
        data = request.data 
        obj_all= User.objects.all()
        serializer= userserializer(obj_all,many=True)
        obj = User.objects.get(id=data['id'])
        obj.delete()
        return Response(serializer.data)
    




        


        







# def index(request):
#     if request.method == "GET":

#         sample={
#             "name":"test",
#             "age":32,
#             "job":"testing.."
#         }
#         return Response(sample)
#     elif request.method ==  "POST":
#         return Response( "post is this ")