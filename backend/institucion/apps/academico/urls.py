from rest_framework.routers import DefaultRouter
from .views.view_carreras import  CarreraViewSet
from .views.view_modalidad import ModalidadViewSet

router = DefaultRouter(trailing_slash=False)

router.register(r'modalidades', ModalidadViewSet, basename='modalidad')
router.register(r'carreras', CarreraViewSet, basename='carrera')

urlpatterns = router.urls
