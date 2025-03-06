# departamentos/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DepartamentoViewSet

router = DefaultRouter()
router.register(r'', DepartamentoViewSet, basename='departamento')

urlpatterns = [
    # Al no especificar un prefijo aquí, la ruta base será /departamentos/
    path('', include(router.urls)),
]
