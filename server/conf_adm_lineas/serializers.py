from rest_framework import serializers
from .models import Linea

class LineaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Linea
        fields = ['id', 'nombre']