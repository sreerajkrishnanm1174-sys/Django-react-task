import pytest
from Menu.models import Menu
import json
@pytest.mark.django_db
def test_login_success(client, user):
    response = client.post("/api/login/", {
        "email":  "test@email.com",
        "password": "test"
    })
    assert response.status_code == 200 
    assert "access" in response.data
    assert "refresh" in response.data

@pytest.mark.django_db
def test_menu_list_authenticated(auth_client):
    Menu.objects.create(date="2026-04-20", version=1)

    response = auth_client.get("/api/show/")

    assert response.status_code == 200
    assert len(response.data) == 1


@pytest.mark.django_db
def test_create_menu(auth_client):
    payload = {
        "name": "Today's Menu",
        "date": "2026-04-20",
        "version": 1,
        "is_active": True,
        "categories": [
            {
                "name": "Main Course",
                "items": [
                    {
                        "name": "Rice",
                        "is"
                        "is_veg": True,
                        "is_available": True,
                        "prices": [
                            {"quantity": "Full", "price": "100.00"}
                        ]
                    }
                ]
            }
        ]
    }

    response = auth_client.post(
        "/api/menu-create/",
        {"data": json.dumps(payload)},  # ✅ CRITICAL FIX
        format="multipart"              # ✅ matches FILE upload design
    )

    print(response.data)

    assert response.status_code == 201
    assert "id" in response.data
