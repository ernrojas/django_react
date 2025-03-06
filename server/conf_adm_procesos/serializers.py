from rest_framework import serializers
from .models import Proceso
from conf_adm_lineas.serializers import LineaSerializer

class ProcesoSerializer(serializers.ModelSerializer):
    lineas = LineaSerializer(many=True, read_only=True)

    class Meta:
        model = Proceso
        fields = ['id', 'nombre', 'activo', 'lineas']
