from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .serializers import userserializer
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