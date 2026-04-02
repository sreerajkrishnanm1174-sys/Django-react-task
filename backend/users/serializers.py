from rest_framework import serializers
from .models import User,Role



class roleserializer(serializers.ModelSerializer):

    class Meta:
        model=Role
        fields= ["role_name"]
        
class userserializer(serializers.ModelSerializer):
    class Meta:
       model=User
       fields= '__all__'
       depth=1