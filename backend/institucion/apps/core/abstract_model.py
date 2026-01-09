from django.db import models
from django.db import transaction
from django.core.exceptions import ValidationError

class BaseManager(models.Manager):
    """
    Manager que filtra objetos inactivos por defecto.
    """
    def get_queryset(self):
        return super().get_queryset().filter(estado=True)
    
    def datatable(self, 
                  fields=None, 
                  filters=None, 
                  exclude=None, 
                  order_by=None, 
                  limit=None, 
                  offset=0,
                  search=None,
                  search_fields=None):
        """
        Retorna:
            dict con:
                - data: Lista de registros (como diccionarios si fields está definido, sino objetos)
                - count: Cantidad de registros retornados (con limit)
                - total: Cantidad total de registros (sin limit, solo con filtros)
        """
        from django.db.models import Q
        
        if filters and 'estado' in filters and filters['estado'] is False:
            queryset = self.model.all_objects.get_queryset()
        else:
            # Inicia con el queryset base (solo activos)
            queryset = self.get_queryset()
        
        if filters:
            queryset = queryset.filter(**filters)
        
        if exclude:
            queryset = queryset.exclude(**exclude)
        
        if search and search_fields:
            search_query = Q()
            for field in search_fields:
                search_query |= Q(**{f"{field}__icontains": search})
            queryset = queryset.filter(search_query)
        
        total = queryset.count()
        
        # Aplica ordenamiento
        if order_by:
            if isinstance(order_by, str):
                queryset = queryset.order_by(order_by)
            elif isinstance(order_by, (list, tuple)):
                queryset = queryset.order_by(*order_by)
        # Si no se especifica order_by, usa el ordenamiento del modelo o por defecto descendente por id
        elif not queryset.ordered:
            queryset = queryset.order_by('-id')
        
        # Aplica offset y limit (paginación)
        if offset:
            queryset = queryset[offset:]
        if limit:
            queryset = queryset[:limit]
        
        # Selecciona solo los campos especificados
        if fields:
            data = list(queryset.values(*fields))
        else:
            data = list(queryset)
        
        return {
            'data': data,
            'count': len(data),
            'total': total
        }

class AllObjectsManager(models.Manager):
    """
    Manager para acceder a todos los objetos, incluyendo inactivos.
    """
    def get_queryset(self):
        return super().get_queryset()

class BaseModel(models.Model):
    """
    Modelo base con soft delete.
    """
    created_at = models.DateTimeField(
        auto_now_add=True, 
        verbose_name="Fecha de creación"
    )
    updated_at = models.DateTimeField(
        auto_now=True, 
        verbose_name="Última modificación"
    )
    estado = models.BooleanField(
        default=True, 
        verbose_name="Está activo"
    )

    # Managers
    objects = BaseManager()
    all_objects = AllObjectsManager()

    class Meta:
        abstract = True
        ordering = ['-id'] 
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['estado']),
        ]

    def delete(self, using=None, keep_parents=False):
        """Soft delete: marca como inactivo en lugar de eliminar."""
        self.estado = False
        self.save(using=using, skip_validation=True)

    def hard_delete(self):
        """Eliminación real de la base de datos."""
        super().delete()

    def restore(self):
        """Restaura un objeto marcado como inactivo."""
        self.estado = True
        self.save(skip_validation=True)