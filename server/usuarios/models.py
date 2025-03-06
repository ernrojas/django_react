from django.contrib.auth.models import AbstractUser
from django.db import models
from departamentos.models import Departamento

class Usuario(AbstractUser):
    ROLES_CHOICES = [
        ("Super Admin", "Super Admin"),
        ("Gerente", "Gerente"),
        ("Programador", "Programador"),
        ("Supervisor", "Supervisor"),
        ("Operador", "Operador"),
        ("Admin", "Admin"),
    ]

    telefono = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    departamento = models.ForeignKey(Departamento, on_delete=models.SET_NULL, null=True, blank=True)
    rol_usuario = models.CharField(max_length=50, choices=ROLES_CHOICES, blank=True, null=True)  # ✅ Agregar choices para validación
    asignar_linea = models.ManyToManyField('conf_adm_lineas.Linea', blank=True)

    def __str__(self):
        return self.username
