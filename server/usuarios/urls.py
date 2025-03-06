from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, get_current_user

# ✅ Registrar la vista de usuarios con un router
router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)

urlpatterns = [
    path('', include(router.urls)),  # ✅ Esto incluye automáticamente /usuarios/
    path('me/', get_current_user, name="current-user"),  # ✅ Corregir la ruta a 'me/'
]
