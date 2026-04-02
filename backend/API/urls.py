from django.urls import path,include
from users.views import*
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewset, basename='users')
# urlpatterns = router.urls

urlpatterns = [
    path('',include(router.urls)),
    path('userapi/',userapi,name="userapi"),
    path('ClassUser/',ClassUser.as_view(),name="ClassUser"),
]
