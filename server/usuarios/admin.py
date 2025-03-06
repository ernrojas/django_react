from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

class CustomUserAdmin(UserAdmin):
    model = Usuario
    list_display = ("username", "email", "first_name", "last_name", "telefono", "departamento", "rol_usuario")  # ✅ Asegurar que el campo existe
    list_filter = ("is_staff", "is_active", "rol_usuario")  # ✅ Agregar solo si es un campo válido
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Información Personal", {"fields": ("first_name", "last_name", "email", "telefono", "direccion", "departamento", "rol_usuario")}),
        ("Permisos", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Fechas Importantes", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "first_name", "last_name", "password1", "password2", "rol_usuario"),
        }),
    )
    search_fields = ("username", "email")
    ordering = ("username",)

admin.site.register(Usuario, CustomUserAdmin)
