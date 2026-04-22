from django.urls import path, include
from rest_framework.routers import DefaultRouter

from orders.views import OrderViewSet
from users.views import GoogleLoginView, UserViewset, userapi, ClassUser, RegisterView, LoginView
from .views import api_root
from Menu.views import*

router = DefaultRouter()
router.register(r'user', UserViewset, basename='user')
# urlpatterns = router.urls

urlpatterns = [
    path('', api_root),
    path('',include(router.urls)),
    # path('userapi/',UserViewset.as_view/(),name="userapi"),
    path('ClassUser/',ClassUser.as_view(),name="ClassUser"),
    path('register/',RegisterView.as_view(),name="register"),
    path('login/',LoginView.as_view(),name="login"),
    path('show/',GetMenuView.as_view(),name="show"),
    path('menu-create/', CreateMenuView.as_view(), name='menu-create'),
    path('items/', ItemListView.as_view(), name='items-list'),
    path('categories/', CategoryListView.as_view(), name='categories-list'),
    path("menu-update/<int:pk>/", MenuUpdateView.as_view()),
    path('orders/', OrderViewSet.as_view({'get': 'list', 'post': 'create'}), name='orders'),
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
]
