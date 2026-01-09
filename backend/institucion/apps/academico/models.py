from django.db import models
from django.core.exceptions import ValidationError
from apps.core.abstract_model import BaseModel
from .validators import (
    validate_nombre_no_vacio,
    validate_nombre_sin_caracteres_especiales,
    validate_longitud_minima_nombre,
    validate_nombre_alfanumerico
)


class Modalidad(BaseModel):
    """
    Modelo para gestionar las modalidades académicas.
    """
    nombre = models.CharField(
        max_length=100,
        verbose_name="Nombre de la modalidad",
        unique=True,
        validators=[
            validate_nombre_no_vacio,
            validate_nombre_sin_caracteres_especiales,
            validate_longitud_minima_nombre,
            validate_nombre_alfanumerico
        ]
    )

    class Meta:
        verbose_name = "Modalidad"
        verbose_name_plural = "Modalidades"
        ordering = ['nombre']

    def __str__(self):
        return self.nombre

    def clean(self):
        """
        Validaciones personalizadas del modelo.
        """
        super().clean()
        
        # Limpiar nombre
        if self.nombre:
            self.nombre = self.nombre.strip()

    def save(self, *args, **kwargs):
        """
        Sobrescribe save para ejecutar validaciones.
        """
        skip_validation = kwargs.pop('skip_validation', False)
        if not skip_validation:
            self.full_clean()
        super().save(*args, **kwargs)


class Carrera(BaseModel):
    """
    Modelo para gestionar las carreras académicas.
    """
    nombre = models.CharField(
        max_length=150,
        verbose_name="Nombre de la carrera",
        validators=[
            validate_nombre_no_vacio,
            validate_nombre_sin_caracteres_especiales,
            validate_longitud_minima_nombre,
            validate_nombre_alfanumerico
        ]
    )
    modalidad = models.ForeignKey(
        Modalidad,
        on_delete=models.PROTECT,
        verbose_name="Modalidad",
        related_name="carreras"
    )

    class Meta:
        verbose_name = "Carrera"
        verbose_name_plural = "Carreras"
        ordering = ['nombre']

    def __str__(self):
        return f"{self.nombre} - {self.modalidad.nombre}"

    def clean(self):
        """
        Validaciones personalizadas del modelo.
        """
        super().clean()

        # Limpiar nombre
        if self.nombre:
            self.nombre = self.nombre.strip()

    def save(self, *args, **kwargs):
        """
        Sobrescribe save para ejecutar validaciones.
        """
        skip_validation = kwargs.pop('skip_validation', False)
        if not skip_validation:
            self.full_clean()
        super().save(*args, **kwargs)
