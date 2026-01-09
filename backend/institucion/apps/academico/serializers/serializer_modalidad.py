from rest_framework import serializers
from apps.core.helper_serializer import BaseSerializer
from ..models import Modalidad


class ModalidadSerializer(BaseSerializer):
    """
    Serializer único para Modalidad con campos dinámicos.
    """
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()
    
    class Meta:
        model = Modalidad
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def __init__(self, *args, **kwargs):
        if 'context' not in kwargs:
            kwargs['context'] = {}
        
        action = kwargs['context'].get('action')
        
        if action in ['list', 'activas', 'inactivas']:
            kwargs['context']['exclude_fields'] = ['display', 'id_display', 'updated_at']
        elif action == 'retrieve':
            kwargs['context']['exclude_fields'] = ['display', 'id_display']
        elif 'exclude_fields' not in kwargs['context']:
            kwargs['context']['exclude_fields'] = []
        
        super().__init__(*args, **kwargs)
