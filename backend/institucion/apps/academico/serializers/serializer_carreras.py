from rest_framework import serializers
from apps.core.helper_serializer import BaseSerializer
from ..models import Carrera
from .serializer_modalidad import ModalidadSerializer


class CarreraSerializer(BaseSerializer):
    """
    Serializer único para Carrera con campos dinámicos.
    """
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()
    modalidad_nombre = serializers.CharField(source='modalidad.nombre', read_only=True)
    
    class Meta:
        model = Carrera
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def __init__(self, *args, **kwargs):
        if 'context' not in kwargs:
            kwargs['context'] = {}
        
        action = kwargs['context'].get('action')
        
        if action in ['list', 'activas', 'inactivas']:
            kwargs['context']['exclude_fields'] = ['updated_at', 'modalidad', 'display', 'id_display']
        elif action == 'retrieve':
            kwargs['context']['exclude_fields'] = ['modalidad_nombre', 'display', 'id_display']
        elif 'exclude_fields' not in kwargs['context']:
            kwargs['context']['exclude_fields'] = []
        
        super().__init__(*args, **kwargs)
    
    def to_representation(self, instance):
        """Personaliza la representación según la acción."""
        data = super().to_representation(instance)
        
        if self.context.get('action') == 'retrieve' and 'modalidad' in data:
            data['modalidad'] = ModalidadSerializer(instance.modalidad).data
        
        return data