from rest_framework import serializers
from .models import Usuario
from conf_adm_lineas.models import Linea
from departamentos.serializers import DepartamentoSerializer
from departamentos.models import Departamento

class LineaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Linea
        fields = ["id", "nombre"]

class UsuarioSerializer(serializers.ModelSerializer):
    # Campo para leer (mostrar) el departamento
    departamento_obj = DepartamentoSerializer(source='departamento', read_only=True)
    # Campo para escribir el departamento (se espera un id)
    departamento = serializers.PrimaryKeyRelatedField(
        queryset=Departamento.objects.all(),
        allow_null=True,
        required=False
    )
    asignar_linea_nombres = serializers.StringRelatedField(
        many=True,
        source="asignar_linea",
        read_only=True
    )

    class Meta:
        model = Usuario
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "telefono",
            "direccion",
            "departamento",       # Campo para escritura (solo el id)
            "departamento_obj",   # Campo para lectura (objeto Departamento)
            "rol_usuario",
            "asignar_linea",
            "asignar_linea_nombres",
        ]
