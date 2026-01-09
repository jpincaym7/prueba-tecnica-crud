from django import forms
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils.timezone import localtime


class BaseForm(forms.ModelForm):
    """
    Formulario base con métodos comunes y validaciones.
    Recuerda: Las validaciones SIEMPRE van en el formulario, NO en el serializer.
    """

    class Meta:
        abstract = True

    def __init__(self, *args, **kwargs):
        """Inicializa el formulario y agrega clases CSS comunes."""
        super().__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            # Agrega clases CSS Bootstrap por defecto
            if isinstance(field.widget, (forms.TextInput, forms.NumberInput, 
                                        forms.EmailInput, forms.PasswordInput)):
                field.widget.attrs.update({'class': 'form-control'})
            elif isinstance(field.widget, forms.Textarea):
                field.widget.attrs.update({'class': 'form-control', 'rows': 3})
            elif isinstance(field.widget, forms.Select):
                field.widget.attrs.update({'class': 'form-select'})
            elif isinstance(field.widget, forms.CheckboxInput):
                field.widget.attrs.update({'class': 'form-check-input'})

    def to_array(self):
        """
        Convierte el formulario completo a un diccionario para el frontend.
        Incluye: datos limpios, errores y metadata de los campos.
        """
        response = {
            'valid': self.is_valid(),
            'errors': {},
            'data': {},
            'fields': {}
        }
        
        # Agregar errores si existen
        if self.errors:
            for field, error_list in self.errors.items():
                response['errors'][field] = [str(error) for error in error_list]
        
        # Agregar datos limpios si el formulario es válido
        if response['valid']:
            for field_name in self.cleaned_data:
                value = self.cleaned_data[field_name]
                
                # Maneja diferentes tipos de datos
                if hasattr(value, 'isoformat'):  # DateTime, Date, Time
                    response['data'][field_name] = value.isoformat()
                elif hasattr(value, 'pk'):  # ForeignKey u otros modelos
                    response['data'][field_name] = value.pk
                elif isinstance(value, (list, tuple)):  # ManyToMany
                    response['data'][field_name] = [item.pk if hasattr(item, 'pk') else item for item in value]
                else:
                    response['data'][field_name] = value
        
        # Agregar metadata de los campos
        for field_name, field in self.fields.items():
            response['fields'][field_name] = {
                'label': field.label or field_name,
                'required': field.required,
                'disabled': field.disabled,
                'help_text': field.help_text or '',
                'widget_type': field.widget.__class__.__name__
            }
        
        return response

    def to_dict(self):
        """Alias de to_array para mayor claridad."""
        return self.to_array()

    def save_with_transaction(self, commit=True, **kwargs):
        """
        Guarda el formulario dentro de una transacción atómica.
        Útil para operaciones que requieren consistencia de datos.
        """
        if not self.is_valid():
            raise ValidationError("El formulario contiene errores y no puede ser guardado.")
        
        with transaction.atomic():
            instance = super().save(commit=False)
            
            # Permite agregar lógica adicional antes de guardar
            if hasattr(self, 'pre_save'):
                self.pre_save(instance)
            
            if commit:
                instance.save()
                self.save_m2m()
            
            # Permite agregar lógica adicional después de guardar
            if hasattr(self, 'post_save'):
                self.post_save(instance)
            
            return instance

    def get_errors_as_dict(self):
        """
        Retorna los errores del formulario como un diccionario limpio.
        Útil para enviar errores al frontend en formato JSON.
        """
        if not self.errors:
            return {}
        
        errors = {}
        for field, error_list in self.errors.items():
            errors[field] = [str(error) for error in error_list]
        
        return errors

    def get_errors_as_list(self):
        """
        Retorna todos los errores del formulario como una lista plana.
        Útil para mostrar todos los errores juntos.
        """
        errors = []
        for field, error_list in self.errors.items():
            for error in error_list:
                if field == '__all__':
                    errors.append(str(error))
                else:
                    errors.append(f"{field}: {str(error)}")
        
        return errors

    def clean_texto(self, field_name):
        """
        Limpia y valida campos de texto.
        Elimina espacios extras y valida que no esté vacío.
        """
        data = self.cleaned_data.get(field_name, '')
        if isinstance(data, str):
            data = data.strip()
            if not data:
                raise ValidationError(f"El campo {field_name} no puede estar vacío.")
        return data

    def validate_unique_field(self, field_name, error_message=None):
        """
        Valida que un campo sea único en la base de datos.
        Excluye la instancia actual si estamos editando.
        """
        value = self.cleaned_data.get(field_name)
        if not value:
            return value
        
        model = self.Meta.model
        queryset = model.objects.filter(**{field_name: value})
        
        # Si estamos editando, excluye la instancia actual
        if self.instance and self.instance.pk:
            queryset = queryset.exclude(pk=self.instance.pk)
        
        if queryset.exists():
            if not error_message:
                error_message = f"Ya existe un registro con este {field_name}."
            raise ValidationError(error_message)
        
        return value

    def is_creating(self):
        """Retorna True si estamos creando un nuevo registro."""
        return not (self.instance and self.instance.pk)

    def is_updating(self):
        """Retorna True si estamos actualizando un registro existente."""
        return bool(self.instance and self.instance.pk)

    def get_changed_fields(self):
        """
        Retorna un diccionario con los campos que han cambiado.
        Solo funciona cuando se está actualizando.
        """
        if not self.is_updating():
            return {}
        
        changed = {}
        for field_name in self.changed_data:
            if field_name in self.cleaned_data:
                changed[field_name] = {
                    'old': getattr(self.instance, field_name, None),
                    'new': self.cleaned_data[field_name]
                }
        
        return changed

    def set_field_required(self, field_name, required=True):
        """Cambia dinámicamente si un campo es requerido."""
        if field_name in self.fields:
            self.fields[field_name].required = required

    def set_field_disabled(self, field_name, disabled=True):
        """Deshabilita o habilita un campo dinámicamente."""
        if field_name in self.fields:
            self.fields[field_name].disabled = disabled

    def add_error_to_field(self, field_name, error_message):
        """Agrega un error personalizado a un campo específico."""
        self.add_error(field_name, error_message)

    def has_changed_field(self, field_name):
        """Verifica si un campo específico ha cambiado."""
        return field_name in self.changed_data
