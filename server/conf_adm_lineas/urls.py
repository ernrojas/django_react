from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LineaViewSet

router = DefaultRouter()
router.register(r'lineas', LineaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
