from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from apps.core.viewset_base import BaseViewSet
from ..models import Modalidad, Carrera
from ..serializers.serializer_carreras import CarreraSerializer
from ..forms.form_carreras import CarreraForm

class CarreraViewSet(BaseViewSet):
    """ViewSet para gestionar carreras académicas."""
    queryset = Carrera.objects.select_related('modalidad').all()
    serializer_class = CarreraSerializer
    form_class = CarreraForm
    search_fields = ['nombre', 'modalidad__nombre']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        estado = self.request.query_params.get('estado')
        modalidad_id = self.request.query_params.get('modalidad')
        search = self.request.query_params.get('search')
        
        if estado is not None:
            queryset = queryset.filter(estado=estado.lower() == 'true')
        if modalidad_id:
            queryset = queryset.filter(modalidad_id=modalidad_id)
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) | Q(modalidad__nombre__icontains=search)
            )
        
        return queryset
    
    def get_datatable_filters(self, request):
        """Filtros personalizados para datatable."""
        filters = {}
        
        modalidad_id = request.query_params.get('modalidad')
        if modalidad_id:
            filters['modalidad_id'] = modalidad_id
        
        # Filtro por estado
        estado = request.query_params.get('estado')
        if estado is not None:
            filters['estado'] = estado.lower() == 'true'
        
        return filters
    
    @action(detail=False, methods=['get'])
    def por_modalidad(self, request):
        """Lista carreras por modalidad."""
        modalidad_id = request.query_params.get('modalidad_id')
        if not modalidad_id:
            return Response(
                {'error': 'Se requiere modalidad_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        queryset = self.queryset.filter(modalidad_id=modalidad_id, estado=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)