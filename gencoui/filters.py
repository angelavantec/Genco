import django_filters
from models import *
from serializers import *
from rest_framework import filters
from rest_framework import generics




class GencoEntornoLenguajesFilter(filters.FilterSet):
    id_env = django_filters.CharFilter(name="id_entorno")

    class Meta:
        model = GencoEntornoLenguajes
        fields = ['id_env']

        
class GencoTipodatoFilter(filters.FilterSet):
    id_lang = django_filters.CharFilter(name="id_lenguaje")

    class Meta:
        model = GencoTipodato
        fields = ['id_lang']

class GencoConversionTipodatoFilter(filters.FilterSet):
    id_tipodato = django_filters.CharFilter(name="id_tipodato")
    id_tipodato_cnv = django_filters.CharFilter(name="id_tipodato_cnv")

    class Meta:
        model = GencoConversionTipodato
        fields = ['id_tipodato__id_lenguaje', 'id_tipodato_cnv__id_lenguaje']

class GencoComponenteFilter(filters.FilterSet):
    id_env = django_filters.CharFilter(name="id_entorno")

    class Meta:
        model = GencoComponentes
        fields = ['id_env']        

class GencoPlantillasFilter(filters.FilterSet):
    id_comp = django_filters.CharFilter(name="id_componente")

    class Meta:
        model = GencoPlantillas
        fields = ['id_comp']  

class GencoEntidadFilter(filters.FilterSet):
    # id_repo = django_filters.CharFilter(name="id_repositorio")

    class Meta:
        model = GencoEntidad
        fields = ['id_repositorio']  

class GencoEntidadDefinicionFilter(filters.FilterSet):

    class Meta:
        model = GencoEntidadDefinicion
        fields = ['id_entidad']

class GencoDirectorioElementosFilter(filters.FilterSet):
    id_directorio = django_filters.CharFilter(name="id_directorio")
    id_plantilla = django_filters.CharFilter(name="id_plantilla")

    class Meta:
        model = GencoDirectorioElementos
        fields = ['id_directorio', 'id_plantilla']