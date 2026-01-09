from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from apps.core.viewset_base import BaseViewSet
from ..models import Modalidad, Carrera
from ..serializers.serializer_modalidad import ModalidadSerializer
from ..forms.form_modalidad import ModalidadForm

class ModalidadViewSet(BaseViewSet):
    """ViewSet para gestionar modalidades académicas."""
    queryset = Modalidad.objects.all()
    serializer_class = ModalidadSerializer
    form_class = ModalidadForm
    search_fields = ['nombre']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        estado = self.request.query_params.get('estado')
        search = self.request.query_params.get('search')
        
        if estado is not None:
            queryset = queryset.filter(estado=estado.lower() == 'true')
        if search:
            queryset = queryset.filter(nombre__icontains=search)
        
        return queryset
    
    def get_datatable_filters(self, request):
        """Filtros personalizados para datatable."""
        filters = {}
        
        # Filtro por estado
        estado = request.query_params.get('estado')
        if estado is not None:
            filters['estado'] = estado.lower() == 'true'
        
        return filters
    
    def destroy(self, request, *args, **kwargs):
        """Valida carreras activas antes de eliminar."""
        instance = self.get_object()
        if instance.carreras.filter(estado=True).exists():
            return Response(
                {'error': 'No se puede eliminar una modalidad con carreras activas.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)