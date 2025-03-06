from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # ✅ Asegurar que las rutas de la API estén bien configuradas
    path('api/usuarios/', include('usuarios.urls')),
    path('api/conf_adm_lineas/', include('conf_adm_lineas.urls')),
    path('api/conf_adm_procesos/', include('conf_adm_procesos.urls')),
    # Registramos el sub-path para departamentos
    path('api/departamentos/', include('departamentos.urls')),

    # ✅ Endpoints para la autenticación con JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
