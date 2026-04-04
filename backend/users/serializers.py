from rest_framework import serializers
from .models import User,Role
from django.contrib.auth.hashers import check_password


class roleserializer(serializers.ModelSerializer):

    class Meta:
        model=Role
        fields= ["role_name"]
        
class userserializer(serializers.ModelSerializer):
    # role= roleserializer()
    class Meta:
       model=User
       fields= '__all__'
       depth=1

class RegisterSerializer(serializers.ModelSerializer):
    username=serializers.CharField()
    email=serializers.CharField()
    password=serializers.CharField()
    phone = serializers.CharField(max_length=15)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data.get('username') and User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({"username": "Username already exists"})

        if data.get('email') and User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already exists"})

        if data.get('phone') and User.objects.filter(phone=data['phone']).exists():
            raise serializers.ValidationError({"phone": "Phone already exists"})

        return data

    def create(self,validated_data):
        user=User.objects.create(username=validated_data["username"],email=validated_data["email"],phone=validated_data["phone"])
        user.set_password(validated_data["password"])
        user.save()
        return validated_data
        
class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user = User.objects.get(email=data["email"])
        except User.DoesNotExist:
            raise serializers.ValidationError({"user": "User does not exist"})

        if not check_password(data["password"], user.password):
            raise serializers.ValidationError({"password": "Wrong credentials"})

        return {
            "user": user
        }



