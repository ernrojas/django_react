from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProcesoViewSet

router = DefaultRouter()
router.register(r'procesos', ProcesoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
