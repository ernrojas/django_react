# departamentos/views.py
from rest_framework import viewsets
from .models import Departamento
from .serializers import DepartamentoSerializer

class DepartamentoViewSet(viewsets.ModelViewSet):
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer
