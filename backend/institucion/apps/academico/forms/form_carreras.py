from django import forms
from django.core.exceptions import ValidationError
from apps.core.form_abstract import BaseForm
from ..models import Modalidad, Carrera

class CarreraForm(BaseForm):
    """
    Formulario para gestionar carreras académicas.
    """
    
    class Meta:
        model = Carrera
        fields = ['nombre', 'modalidad']
        widgets = {
            'nombre': forms.TextInput(attrs={
                'placeholder': 'Ingrese el nombre de la carrera',
                'maxlength': '150'
            }),
            'modalidad': forms.Select(attrs={
                'class': 'form-select'
            })
        }
        labels = {
            'nombre': 'Nombre de la Carrera',
            'modalidad': 'Modalidad'
        }
        help_texts = {
            'nombre': 'Nombre único de la carrera (mínimo 3 caracteres)',
            'modalidad': 'Seleccione la modalidad a la que pertenece esta carrera'
        }

    def __init__(self, *args, **kwargs):
        """
        Inicialización del formulario.
        """
        super().__init__(*args, **kwargs)
        
        # Filtrar solo modalidades activas
        self.fields['modalidad'].queryset = Modalidad.objects.filter(estado=True)
        
        # Personalizar el texto vacío del select
        self.fields['modalidad'].empty_label = "Seleccione una modalidad"

    def clean_nombre(self):
        """
        Validación adicional del campo nombre.
        """
        nombre = self.cleaned_data.get('nombre', '')
        
        # Limpiar espacios
        nombre = nombre.strip()
        
        if not nombre:
            raise ValidationError('El nombre no puede estar vacío.')
        
        # Convertir a título para consistencia
        nombre = nombre.title()
        
        return nombre

    def clean_modalidad(self):
        """
        Validación del campo modalidad.
        """
        modalidad = self.cleaned_data.get('modalidad')
        
        if not modalidad:
            raise ValidationError('Debe seleccionar una modalidad.')
        
        # Validar que la modalidad esté activa
        if not modalidad.estado:
            raise ValidationError('La modalidad seleccionada está inactiva.')
        
        return modalidad

    def clean(self):
        """
        Validaciones generales del formulario.
        """
        cleaned_data = super().clean()
        nombre = cleaned_data.get('nombre')
        modalidad = cleaned_data.get('modalidad')
        
        if nombre:
            queryset = Carrera.all_objects.filter(nombre__iexact=nombre)
            
            if self.instance and self.instance.pk:
                queryset = queryset.exclude(pk=self.instance.pk)
            
            if queryset.exists():
                carrera_existente = queryset.first()
                raise ValidationError(
                    f'Ya existe la carrera "{nombre}" con la modalidad "{carrera_existente.modalidad.nombre}". '
                    'No se puede tener el mismo nombre de carrera con múltiples modalidades.'
                )
        
        return cleaned_data