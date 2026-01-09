from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response


class BaseViewSet(viewsets.ModelViewSet):
    """
    ViewSet base con operaciones comunes y soft delete.
    """
    form_class = None  # Debe definirse en la subclase
    
    def get_serializer_context(self):
        """Agrega la acción al contexto del serializer."""
        context = super().get_serializer_context()
        context['action'] = self.action
        return context
    
    def create(self, request, *args, **kwargs):
        """Crea un registro usando el formulario para validaciones."""
        form = self.form_class(data=request.data)
        
        if form.is_valid():
            instance = form.save_with_transaction()
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(
            {'errors': form.get_errors_as_dict()},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    def update(self, request, *args, **kwargs):
        """Actualiza un registro usando el formulario para validaciones."""
        instance = self.get_object()
        form = self.form_class(data=request.data, instance=instance)
        
        if form.is_valid():
            instance = form.save_with_transaction()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        
        return Response(
            {'errors': form.get_errors_as_dict()},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    def destroy(self, request, *args, **kwargs):
        """Soft delete: marca como inactivo."""
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def list(self, request, *args, **kwargs):
        """Lista registros usando datatable."""
        return self.datatable(request)
    
    @action(detail=True, methods=['patch'])
    def restore(self, request, pk=None):
        """Restaura un registro inactivo."""
        model = self.queryset.model
        try:
            instance = model.all_objects.get(pk=pk)
        except model.DoesNotExist:
            return Response(
                {'error': f'No {model.__name__} matches the given query.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        instance.restore()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['delete'])
    def hard_delete(self, request, pk=None):
        """Eliminación permanente."""
        model = self.queryset.model
        try:
            instance = model.all_objects.get(pk=pk)
        except model.DoesNotExist:
            return Response(
                {'error': f'No {model.__name__} matches the given query.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        instance.hard_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'])
    def activas(self, request):
        """Lista solo registros activos."""
        request.query_params._mutable = True
        request.query_params['estado'] = 'true'
        request.query_params._mutable = False
        return self.datatable(request)
    
    @action(detail=False, methods=['get'])
    def inactivas(self, request):
        """Lista solo registros inactivos."""
        request.query_params._mutable = True
        request.query_params['estado'] = 'false'
        request.query_params._mutable = False
        return self.datatable(request)
    
    @action(detail=False, methods=['get'])
    def datatable(self, request):
        """Endpoint para datatables con paginación y búsqueda."""
        fields = request.query_params.get('fields', '').split(',') if request.query_params.get('fields') else None
        search = request.query_params.get('search', None)
        search_fields = getattr(self, 'search_fields', [])
        limit = int(request.query_params.get('limit', 10))
        offset = int(request.query_params.get('offset', 0))
        
        filters = self.get_datatable_filters(request)
        
        result = self.queryset.model.objects.datatable(
            fields=fields,
            filters=filters,
            search=search,
            search_fields=search_fields,
            limit=limit,
            offset=offset
        )
        
        if not fields and result['data']:
            serializer = self.get_serializer(result['data'], many=True)
            result['data'] = serializer.data
        
        return Response(result)
    
    def get_datatable_filters(self, request):
        return {}
