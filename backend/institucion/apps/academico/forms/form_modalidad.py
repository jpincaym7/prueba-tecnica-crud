from django import forms
from django.core.exceptions import ValidationError
from apps.core.form_abstract import BaseForm
from ..models import Modalidad, Carrera


class ModalidadForm(BaseForm):
    """
    Formulario para gestionar modalidades académicas.
    """
    
    class Meta:
        model = Modalidad
        fields = ['nombre']
        widgets = {
            'nombre': forms.TextInput(attrs={
                'placeholder': 'Ingrese el nombre de la modalidad',
                'maxlength': '100'
            })
        }
        labels = {
            'nombre': 'Nombre de la Modalidad'
        }
        help_texts = {
            'nombre': 'Nombre único de la modalidad (mínimo 3 caracteres)'
        }

    def clean_nombre(self):
        """
        Validación adicional del campo nombre.
        """
        nombre = self.cleaned_data.get('nombre', '')
        
        nombre = nombre.strip()
        
        if not nombre:
            raise ValidationError('El nombre no puede estar vacío.')
        
        nombre = nombre.title()
        
        queryset = Modalidad.all_objects.filter(nombre__iexact=nombre)
        
        if self.instance and self.instance.pk:
            queryset = queryset.exclude(pk=self.instance.pk)
        
        if queryset.exists():
            raise ValidationError('Ya existe una modalidad con este nombre.')
        
        return nombre