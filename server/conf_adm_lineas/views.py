from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework import viewsets
from .models import Linea
from .serializers import LineaSerializer

class LineaViewSet(viewsets.ModelViewSet):
    queryset = Linea.objects.all()
    serializer_class = LineaSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]  # Requiere autenticación y permisos de modelo
