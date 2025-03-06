from django.contrib import admin
from .models import Proceso

@admin.register(Proceso)
class ProcesoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'activo', 'get_lineas')  # Muestra columnas personalizadas
    list_filter = ('activo',)  # Filtro lateral por estado
    search_fields = ('nombre',)  # Barra de búsqueda
    ordering = ('id',)  # Ordenación

    def get_lineas(self, obj):
        return ", ".join([linea.nombre for linea in obj.lineas.all()])
    get_lineas.short_description = "Líneas Asignadas"  # Nombre en el admin
