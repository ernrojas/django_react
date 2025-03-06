from django.db import models
from conf_adm_lineas.models import Linea

class Proceso(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    activo = models.BooleanField(default=True)
    lineas = models.ManyToManyField(Linea, blank=True)

    def __str__(self):
        return self.nombre
