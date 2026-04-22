import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
User = get_user_model()

@pytest.fixture
def user():
    return User.objects.create_user(username = "testuser", email="test@email.com", password="test")

@pytest.fixture
def admin_user():
    return User.objects.create_superuser(username="admin", email="admin@email.com", password="admin123")

@pytest.fixture
def auth_client(user):
    client = APIClient()
    token, _ = Token.objects.get_or_create(user=user)
    client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    return client

@pytest.fixture
def admin_client(admin_user):
    client = APIClient()
    token, _ = Token.objects.get_or_create(user=admin_user)
    client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    return client