from rest_framework import serializers
from .models import User,Role,Profile
from django.contrib.auth.hashers import check_password
from django.db import transaction


class roleserializer(serializers.ModelSerializer):

    class Meta:
        model=Role
        fields= ["role_name"]
        
class profileserializer(serializers.ModelSerializer):

    class Meta:
        model=Profile
        fields= ["bio"]
                
class userserializer(serializers.ModelSerializer):
    profile = profileserializer(read_only=True)
    class Meta:
       model=User
       fields= ["id","username","email","phone","role","profile"]
       depth=1

class RegisterSerializer(serializers.ModelSerializer):
    username=serializers.CharField()
    first_name=serializers.CharField()
    last_name=serializers.CharField()
    email=serializers.CharField()
    password=serializers.CharField()
    phone = serializers.CharField(max_length=15)
    bio=serializers.CharField()

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone','bio', 'first_name', 'last_name']
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

    def create(self, validated_data):
        with transaction.atomic():
            user = User.objects.create_user(
                username=validated_data["username"],
                first_name=validated_data["first_name"],
                last_name=validated_data["last_name"],
                email=validated_data["email"],
                password=validated_data["password"],
                phone=validated_data["phone"]
            )

            Profile.objects.create(
                user=user,
                bio=validated_data.get("bio", "")
            )

        return user
class LoginResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = userserializer()
    
class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)
    

    def validate(self, data):
        try:
            user = User.objects.get(email=data["email"])
        except User.DoesNotExist:
            raise serializers.ValidationError({"user": "User does not exist"})

        if not check_password(data["password"], user.password):
            raise serializers.ValidationError({"password": "Wrong password  "})

        return {
            "user": user
        }



