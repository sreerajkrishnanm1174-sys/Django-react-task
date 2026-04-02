from django.urls import path
from users.views import*

urlpatterns = [
    # path('index/',index,name="index"),
    path('userapi/',userapi,name="userapi"),
]
