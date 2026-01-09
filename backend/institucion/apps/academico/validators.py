from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import re


def validate_nombre_no_vacio(value):
    """
    Valida que el nombre no esté vacío ni contenga solo espacios.
    """
    if not value or not value.strip():
        raise ValidationError(
            _('El nombre no puede estar vacío.'),
            code='nombre_vacio'
        )


def validate_nombre_sin_caracteres_especiales(value):
    """
    Valida que el nombre no contenga caracteres especiales peligrosos.
    """
    caracteres_prohibidos = ['<', '>', '{', '}', '[', ']', '\\', '|']
    if any(char in value for char in caracteres_prohibidos):
        raise ValidationError(
            _('El nombre contiene caracteres no permitidos.'),
            code='caracteres_invalidos'
        )


def validate_longitud_minima_nombre(value):
    """
    Valida que el nombre tenga al menos 3 caracteres.
    """
    if len(value.strip()) < 3:
        raise ValidationError(
            _('El nombre debe tener al menos 3 caracteres.'),
            code='nombre_muy_corto'
        )


def validate_nombre_alfanumerico(value):
    """
    Valida que el nombre solo contenga letras y espacios.
    """
    if not re.match(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$', value.strip()):
        raise ValidationError(
            _('El nombre solo puede contener letras y espacios.'),
            code='nombre_invalido'
        )
