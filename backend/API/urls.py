from django.urls import path, include
from rest_framework.routers import DefaultRouter

from users.views import UserViewset, userapi, ClassUser, RegisterView, LoginView
from .views import api_root
from Menu.views import*

router = DefaultRouter()
router.register(r'users', UserViewset, basename='users')
# urlpatterns = router.urls

urlpatterns = [
    path('', api_root),
    path('',include(router.urls)),
    path('userapi/',UserViewset.as_view/(),name="userapi"),
    path('ClassUser/',ClassUser.as_view(),name="ClassUser"),
    path('register/',RegisterView.as_view(),name="register"),
    path('login/',LoginView.as_view(),name="login"),
    path('show/',GetMenuView.as_view(),name="show"),

]
