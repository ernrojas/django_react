from django.contrib import admin
from .models import Linea

@admin.register(Linea)
class LineaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre')  # Muestra en la lista del admin
    search_fields = ('nombre',)  # Barra de búsqueda
    ordering = ('id',)  # Ordenación por defecto
