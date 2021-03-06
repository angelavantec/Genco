from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.forms.models import formset_factory
from django.views.generic.list import ListView
from rest_framework import viewsets
from rest_framework import routers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_protect
# from django.views.generic.list import listView

# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, Http404
from django.core import serializers as renderSerializers
from models import *  #GencoLenguajes, GencoGrupo, GencoUsuarioGrupo, GencoProyectos, GencoEntorno, GencoDirectorios
from forms import *
from filters import *
from django.shortcuts import render, render_to_response
#from django.template.context_processors import csrf
from django.views.generic.edit import CreateView
import datetime
from django.utils import timezone
from django.forms.models import modelform_factory
from django.forms.models import model_to_dict
from serializers import * #GencoUsuarioGrupoSerializer, GencoGrupoSerializer, GencoLenguajesSerializer, GencoProyectosSerializer, GencoEntornoSerializer, GencoDirectoriosSerializer
from django.template import Context, loader

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

import difflib
from django.core.files import File


from Cheetah.Template import Template

from django.shortcuts import get_object_or_404, get_list_or_404

from genco_utils import *

from django.db.models import Q


from rest_framework.exceptions import APIException

#BuildProjects imports
import random
import tarfile
import shutil

from wsgiref.util import FileWrapper

def current_datetime(request):
    now = datetime.datetime.now()
    html = "<html><body>It is now %s.</body></html>" % now
    return HttpResponse(html)


class AdminAppIconosViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = AdminAppIconosFilter
    filter_fields = ('tipo')
    serializer_class = AdminAppIconosSerializer

    def get_queryset(self):
        return AdminAppIconos.objects.all() #.filter(creado_por=self.request.user.id)
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

    # def perform_update(self, serializer):
    #     serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        obj = get_object_or_404(self.get_queryset(), id_icono=instance.id_icono)
        instance.delete()


class GencoProyectosViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = GencoProyectosFilter
    filter_fields = ('id_env')
    serializer_class = GencoProyectosSerializer

    def get_queryset(self):
        idWS=self.request.session.get('wskey', None)
        return GencoProyectos.objects.filter(id_proyecto__in=getAccessFilters(idWS, ACCESS_TYPE_PROJECT, self.request.user.id))
        # return GencoProyectos.objects.filter(creado_por=self.request.user.id)
    
    def perform_create(self, serializer):
        idWS=self.request.session.get('wskey', None)
        get_list_or_404(GencoUsuarioGrupo, auth_user_id=self.request.user.id, id_grupo=idWS)
        project=serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now(),id_ws=idWS)

        dirRoot = GencoDirectorios.objects.create(
        nombre='Root Folder',
        descripcion='Root Folder',
        id_proyecto=project,
        creado_por=self.request.user.id,
        fecha_creacion=timezone.now()
        )
        #registramos el permiso
        setAccessAuth(idWS, ACCESS_TYPE_PROJECT, self.request.user.id, project.pk)

    def perform_update(self, serializer):
        idWS=self.request.session.get('wskey', None)
        get_list_or_404(GencoUsuarioGrupo,  auth_user_id=self.request.user.id, id_grupo=idWS)
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        get_object_or_404(self.get_queryset(), id_proyecto=instance.id_proyecto)

        obj = GencoDirectorios.objects.filter(id_proyecto=instance.id_proyecto)
        refElements = '';
        
        for i  in obj:
            refElements += '<br><b>' + i.nombre + '</b> Folder'

        if obj.exists():
            raise APIException('This Element contains ' + refElements)

        instance.delete()
            

class GencoEntornoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    serializer_class = GencoEntornoSerializer

    def get_queryset(self):
        idWS=self.request.session.get('wskey', None)
        return GencoEntorno.objects.filter(id_entorno__in=getAccessFilters(idWS, ACCESS_TYPE_ENV, self.request.user.id))
    
    def perform_create(self, serializer):
        idWS=self.request.session.get('wskey', None)
        get_list_or_404(GencoUsuarioGrupo, auth_user_id=self.request.user.id, id_grupo=idWS)
        env = serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now(), id_ws=idWS) 
    
        # project = GencoProyectos.objects.create(
        # nombre='Default Project',
        # descripcion='Default Project',
        # #id_entorno = env,
        # creado_por=self.request.user.id,
        # fecha_creacion=timezone.now(),
        # id_ws=idWS
        # )
        # dirRoot = GencoDirectorios.objects.create(
        # nombre='root',
        # descripcion='Root Folder',
        # id_proyecto=project,
        # creado_por=self.request.user.id,
        # fecha_creacion=timezone.now()
        # )
        setAccessAuth(idWS, ACCESS_TYPE_ENV, self.request.user.id, env.pk)
        # setAccessAuth(idWS, ACCESS_TYPE_PROJECT, self.request.user.id, project.pk)

    def perform_update(self, serializer):
        idWS=self.request.session.get('wskey', None)
        get_list_or_404(GencoUsuarioGrupo,  auth_user_id=self.request.user.id, id_grupo=idWS)
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        obj = get_object_or_404(self.get_queryset(), id_entorno=instance.id_entorno)

        refElements = '';
        
        objLangs = GencoEntornoLenguajes.objects.filter(id_entorno__id_entorno=instance.id_entorno)        
        
        for i  in objLangs:
            refElements += '<br><b>' + i.id_lenguaje.nombre + '</b> language'

        objComponents = GencoComponentes.objects.filter(id_entorno__id_entorno=instance.id_entorno)        
        
        for i  in objComponents:
            refElements += '<br><b>' + i.nombre + '</b> component'

        if objLangs.exists() or objComponents.exists():
            raise APIException('This Element contains ' + refElements)

        instance.delete()
            

class GencoDirectoriosViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    serializer_class = GencoDirectoriosSerializer

    def get_queryset(self):
        # return GencoDirectorios.objects.filter(creado_por=self.request.user.id)
        idWS=self.request.session.get('wskey', None)
        return GencoDirectorios.objects.filter(id_proyecto__in=getAccessFilters(idWS, ACCESS_TYPE_PROJECT, self.request.user.id))

    
    def perform_create(self, serializer):
        obj = GencoDirectorios.objects.filter(nombre=serializer.validated_data['nombre'])
        if obj.exists():
            raise APIException('Already exists a folder with this name.')
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

    def perform_update(self, serializer):
        obj = GencoDirectorios.objects.filter(nombre=serializer.validated_data['nombre'])
        if obj.exists():
            raise APIException('Already exists a folder with this name.')
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        get_object_or_404(self.get_queryset(), id_directorio=instance.id_directorio)

        obj = GencoDirectorioElementos.objects.filter(id_directorio=instance.id_directorio)
        refElements = '';

        for i  in obj:
            refElements += '<br>' + ('Template ' + i.id_plantilla.nombre if i.id_plantilla else '') + '' + ('File ' + i.id_archivo.nombre if i.id_archivo else '')

        if obj.exists():
            raise APIException('This Element is referenced by ' + refElements)

        instance.delete()
            
    # def list(self, request):
    #     queryset = self.get_queryset()
    #     serializer = GencoDirectoriosSerializer(queryset, many=True)
    #     return Response(serializer.data)
 

class GencoArchivosViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    serializer_class = GencoArchivosSerializer

    def get_queryset(self):
        idWS=self.request.session.get('wskey', None)
        archivos=[]
        direle =  GencoDirectorioElementos.objects.filter(id_directorio__id_proyecto__in=getAccessFilters(idWS, ACCESS_TYPE_PROJECT, self.request.user.id), id_archivo__isnull=False)
        # direle = get_list_or_404(GencoDirectorioElementos, id_ws=idWS, id_archivo__isnull=False)
        for i in direle:
           archivos.append(i.id_archivo.id_archivo)
        return GencoArchivos.objects.filter(id_archivo__in=archivos)
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

    def perform_update(self, serializer):
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        obj = get_object_or_404(self.get_queryset(), id_archivo=instance.id_archivo)
        instance.delete()
            
    # def list(self, request):
    #     queryset = self.get_queryset()
    #     serializer = GencoArchivosSerializer(queryset, many=True)
    #     return Response(serializer.data)


class GencoDirectorioElementosViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = GencoDirectorioElementosFilter
    filter_fields = ('id_directorio')
    serializer_class = GencoDirectorioElementosSerializer

    def get_queryset(self):
        # return GencoDirectorioElementos.objects.filter(creado_por=self.request.user.id)
        idWS=self.request.session.get('wskey', None)
        return GencoDirectorioElementos.objects.filter(id_directorio__id_proyecto__in=getAccessFilters(idWS, ACCESS_TYPE_PROJECT, self.request.user.id))
    
    def perform_create(self, serializer):
        idWS=self.request.session.get('wskey', None)
        get_list_or_404(GencoUsuarioGrupo, auth_user_id=self.request.user.id, id_grupo=idWS)
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now(), id_ws=idWS) 

    def perform_update(self, serializer):
        idWS=self.request.session.get('wskey', None)
        get_list_or_404(GencoUsuarioGrupo,  auth_user_id=self.request.user.id, id_grupo=idWS)
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        obj = get_object_or_404(self.get_queryset(), id_direlemento=instance.id_direlemento)

        obj = GencoElementoEntidad.objects.filter(id_direlemento=instance.id_direlemento)
        refElements = '';
        
        for i  in obj:
            refElements += '<br><b>' + i.id_entidad.id_repositorio.nombre + '-</b>' + i.id_entidad.nombre

        if obj.exists():
            raise APIException('This Element is referenced by ' + refElements)

        instance.delete()
            
    # def list(self, request):
    #     queryset = self.get_queryset()
    #     serializer = GencoDirectorioElementosSerializer(queryset, many=True)
    #     return Response(serializer.data)


class GencoLenguajesViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    serializer_class = GencoLenguajesSerializer

    def get_queryset(self):
        idWS=self.request.session.get('wskey', None)
        return GencoLenguajes.objects.filter(id_lenguaje__in=getAccessFilters(idWS, ACCESS_TYPE_LANG, self.request.user.id))

    def perform_create(self, serializer):
        idWS=self.request.session.get('wskey', None)
        get_list_or_404(GencoUsuarioGrupo, auth_user_id=self.request.user.id, id_grupo=idWS)
        obj = serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now(), id_ws=idWS)
        #registramos el permiso
        setAccessAuth(idWS, ACCESS_TYPE_LANG, self.request.user.id, obj.pk)

    def perform_update(self, serializer):
        idWS=self.request.session.get('wskey', None)
        get_list_or_404(GencoUsuarioGrupo,  auth_user_id=self.request.user.id, id_grupo=idWS)
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        get_object_or_404(self.get_queryset(), id_lenguaje=instance.id_lenguaje)

        obj = GencoTipodato.objects.filter(id_lenguaje=instance.id_lenguaje)
        refElements = '';
        
        for i  in obj:
            refElements += '<br><b>' + i.nombre + '</b> datatype'

        if obj.exists():
            raise APIException('This Element contains ' + refElements)

        instance.delete()
            

  

class GencoTipodatoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = GencoTipodatoFilter
    #filter_fields = ('id_lang')
    serializer_class = GencoTipodatoSerializer

    def get_queryset(self):
        idWS=self.request.session.get('wskey', None)
        return GencoTipodato.objects.filter(id_lenguaje__in=getAccessFilters(idWS, ACCESS_TYPE_LANG, self.request.user.id))
    
    def perform_create(self, serializer):
        idWS=self.request.session.get('wskey', None)
        get_list_or_404(GencoUsuarioGrupo, auth_user_id=self.request.user.id, id_grupo=idWS)
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now())

    def perform_update(self, serializer):
        idWS=self.request.session.get('wskey', None)
        get_list_or_404(GencoUsuarioGrupo,  auth_user_id=self.request.user.id, id_grupo=idWS)
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        get_object_or_404(self.get_queryset(), id_tipodato=instance.id_tipodato)
        obj = GencoConversionTipodato.objects.filter(id_tipodato_cnv=instance.id_tipodato)
        refElements = '';
        
        for i  in obj:
            refElements += '<br>'+ i.id_lenguaje__nombre +'<b> ' + i.id_tipodato__nombre + '</b>'

        if obj.exists():
            raise APIException('This Element have ' + refElements)
        instance.delete()


class GencoEntornoLenguajesViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = GencoEntornoLenguajesFilter
    filter_fields = ('id_entorno')
    serializer_class = GencoEntornoLenguajesSerializer

    def get_queryset(self):
        idWS=self.request.session.get('wskey', None)
        return GencoEntornoLenguajes.objects.filter(id_entorno__in=getAccessFilters(idWS, ACCESS_TYPE_ENV, self.request.user.id))
        # return GencoEntornoLenguajes.objects.filter(creado_por=self.request.user.id)
    
    def perform_create(self, serializer):
        idWS=self.request.session.get('wskey', None)
        get_list_or_404(GencoUsuarioGrupo, auth_user_id=self.request.user.id, id_grupo=idWS)
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

    def perform_update(self, serializer):
        idWS=self.request.session.get('wskey', None)
        get_list_or_404(GencoUsuarioGrupo,  auth_user_id=self.request.user.id, id_grupo=idWS)
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        obj = get_object_or_404(self.get_queryset(), id_entornolenguaje=instance.id_entornolenguaje)
        instance.delete()
            
    # def list(self, request):
    #     queryset = self.get_queryset()
    #     serializer = GencoEntornoLenguajesSerializer(queryset, many=True)
    #     return Response(serializer.data) 


class GencoConversionTipodatoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = GencoConversionTipodatoFilter
    filter_fields = ('id_tipodato')
    serializer_class = GencoConversionTipodatoSerializer

    def get_queryset(self):
        idWS=self.request.session.get('wskey', None)
        return GencoConversionTipodato.objects.filter(id_tipodato_cnv__id_lenguaje__in=getAccessFilters(idWS, ACCESS_TYPE_LANG, self.request.user.id))
    
    def perform_create(self, serializer):
        idWS=self.request.session.get('wskey', None)
        get_list_or_404(GencoUsuarioGrupo, auth_user_id=self.request.user.id, id_grupo=idWS)
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

    def perform_update(self, serializer):
        idWS=self.request.session.get('wskey', None)
        get_list_or_404(GencoUsuarioGrupo, auth_user_id=self.request.user.id, id_grupo=idWS)
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        get_object_or_404(self.get_queryset(), id_conversion=instance.id_conversion)
        instance.delete()


class GencoGrupoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    serializer_class = GencoGrupoSerializer    

    def get_queryset(self):
        return GencoConversionTipodato.objects.filter(creado_por=self.request.user.id)
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

    def perform_update(self, serializer):
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        obj = get_object_or_404(self.get_queryset(), id_grupo=instance.id_grupo)

        refElements = '';
        for i  in obj:
            refElements += '<br>' + ('Group ' + i.nombre if i.id_plantilla else '') + '' + ('File ' + i.id_archivo.nombre if i.id_archivo else '')

        if queryset.exists():
            raise APIException('This Element is referenced by ' + refElements)

        instance.delete()
            
    # def list(self, request):
    #     queryset = self.get_queryset()
    #     serializer = GencoConversionTipodatoSerializer(queryset, many=True)
    #     return Response(serializer.data) 



class GencoComponentesViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = GencoComponenteFilter
    filter_fields = ('id_entorno')
    serializer_class = GencoComponentesSerializer    

    def get_queryset(self):
        idWS=self.request.session.get('wskey', None)
        return GencoComponentes.objects.filter(id_entorno__in=getAccessFilters(idWS, ACCESS_TYPE_ENV, self.request.user.id))
        # return GencoComponentes.objects.filter(creado_por=self.request.user.id)
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

    def perform_update(self, serializer):
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        obj = get_object_or_404(self.get_queryset(), id_componente=instance.id_componente)
        instance.delete()
            
    # def list(self, request):
    #     queryset = self.get_queryset()
    #     serializer = GencoComponentesSerializer(queryset, many=True)
    #     return Response(serializer.data)      


class GencoPlantillasViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = GencoPlantillasFilter
    filter_fields = ('id_componente')
    serializer_class = GencoPlantillasSerializer    

    def get_queryset(self):
        idWS=self.request.session.get('wskey', None)
        components = GencoComponentes.objects.filter(id_entorno__in=getAccessFilters(idWS, ACCESS_TYPE_ENV, self.request.user.id))
        return GencoPlantillas.objects.filter(id_componente__in=components)
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

    def perform_update(self, serializer):
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        obj = get_object_or_404(self.get_queryset(), id_plantilla=instance.id_plantilla)
        instance.delete()
            
    # def list(self, request):
    #     queryset = self.get_queryset()
    #     serializer = GencoPlantillasSerializer(queryset, many=True)
    #     return Response(serializer.data)     


class GencoRepositorioViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    serializer_class = GencoRepositorioSerializer

    def get_queryset(self):
        idWS=self.request.session.get('wskey', None)
        return GencoRepositorio.objects.filter(id_repositorio__in=getAccessFilters(idWS, ACCESS_TYPE_REPO, self.request.user.id))
        # return GencoRepositorio.objects.filter(creado_por=self.request.user.id)
    
    def perform_create(self, serializer):
        idWS=self.request.session.get('wskey', None)
        get_list_or_404(GencoUsuarioGrupo, auth_user_id=self.request.user.id, id_grupo=idWS)
        repo = serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now(), id_ws=idWS)
        #asignamos permisos
        setAccessAuth(idWS, ACCESS_TYPE_REPO, self.request.user.id, repo.pk)

    def perform_update(self, serializer):
        idWS=self.request.session.get('wskey', None)
        get_list_or_404(GencoUsuarioGrupo,  auth_user_id=self.request.user.id, id_grupo=idWS)
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        get_object_or_404(self.get_queryset(), id_repositorio=instance.id_repositorio)
        
        obj = GencoEntidad.objects.filter(id_repositorio=instance.id_repositorio)
        refElements = '';
        for i  in obj:
            refElements += '<br>Entity <b>' + i.nombre + '</b>'

        if obj.exists():
            raise APIException('This Element contains ' + refElements)

        instance.delete()


class GencoEntidadViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = GencoEntidadFilter
    serializer_class = GencoEntidadSerializer

    def get_queryset(self):
        return GencoEntidad.objects.filter(creado_por=self.request.user.id)
    
    def perform_create(self, serializer):
        entity = serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now())
        tipoPK = get_object_or_404(GencoTipodato.objects.filter(id_tipodato=GENCO_ENTITY_ID_TYPE_ID))
        GencoEntidadDefinicion.objects.create(
        id_entidad=entity,
        nombre='ID',
        id_tipodato=tipoPK,
        es_pk='true',
        obligatorio='true',
        creado_por=self.request.user.id,
        fecha_creacion=timezone.now()
        )


    def perform_update(self, serializer):
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        obj = get_object_or_404(self.get_queryset(), id_entidad=instance.id_entidad)
        instance.delete()
            
    # def list(self, request):
    #     queryset = self.get_queryset()
    #     serializer = GencoEntidadSerializer(queryset, many=True)
    #     return Response(serializer.data)     

class GencoEntidadDefinicionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = GencoEntidadDefinicionFilter
    serializer_class = GencoEntidadDefinicionSerializer

    def get_queryset(self):
        return GencoEntidadDefinicion.objects.filter(creado_por=self.request.user.id)
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

    def perform_update(self, serializer):
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        obj = get_object_or_404(self.get_queryset(), id_entidaddef=instance.id_entidaddef)
        instance.delete()
            
    # def list(self, request):
    #     queryset = self.get_queryset()
    #     serializer = GencoEntidadDefinicionSerializer(queryset, many=True)
    #     return Response(serializer.data)  


class GencoPlantillaEntidadViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    #queryset = GencoElementoEntidad.objects.all()
    serializer_class = GencoElementoEntidadSerializer
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = GencoElementoEntidadFilter
    filter_fields = ('id_direlemento', 'id_entidad')

    def get_queryset(self):
        return GencoElementoEntidad.objects.filter(creado_por=self.request.user.id)

    def perform_create(self, serializer):
        dict = {}
        list = []
        obj = GencoPlantillas.objects.get(id_plantilla=serializer.validated_data['id_direlemento'].id_plantilla.id_plantilla)
        # cargamos la lista de tags de la entidad
        if(obj.tags != None):
            list = getIterableFromTags(obj.tags)
            dict = updateDictTags(list,dict)
            serializer.validated_data['tags'] = json.dumps(dict);
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now())

    def perform_update(self, serializer):
        dict = {}
        list = []
        obj = GencoPlantillas.objects.get(id_plantilla=serializer.validated_data['id_direlemento'].id_plantilla.id_plantilla)
        # cargamos la lista de tags de la entidad
        if(obj.tags != None):
            list = getIterableFromTags(obj.tags)
            # cargamos el dicionario de tags desde la vista Builds
            dict = getIterableFromTags(serializer.validated_data['tags'])
            dict = updateDictTags(list,dict)
        serializer.validated_data['tags'] = json.dumps(dict);
        serializer.save()      

    def perform_destroy(self, instance):
        obj = get_object_or_404(self.get_queryset(), id_elementoentidad=instance.id_elementoentidad)
        instance.delete()    


def get_form(request, id_form=None):
    template_name = 'gencoui/rndr_form_generic.html'
    print id_form
    switcher = {
        '0': GencoGrupoForm(),
        '1': GencoEntornoForm(),
        '2': GencoPlantillasForm()
    }

    # form = GencoEntornoForm()
    return render(request,template_name,{'form':switcher.get(id_form)})

@login_required
def get_module(request, id_module=None, key_env=None, key_project=None):
    idWS=request.session.get('wskey', None)
    env=None

    if id_module == 'env':
        context = {'form_add_env': GencoProyectosForm, 'user': request.user, 'form_project': GencoProyectosForm}
        return render(request,'gencoui/rndr_environments.html',context)
    elif id_module == 'editor':
        # obj = get_object_or_404(GencoEntorno, id_ws=request.user.id, id_entorno=key_env)
        queryset=GencoEntorno.objects.filter(id_entorno__in=getAccessFilters(idWS, ACCESS_TYPE_ENV, request.user.id))
        env = get_object_or_404(queryset, id_entorno=key_env)    
        context = {'form_create_template': GencoPlantillasForm, 'form_create_component': GencoComponentesForm, 'user': request.user, 'key_module':key_env, 'entorno': env, 'icon': env.id_icono.upload}    
        return render(request,'gencoui/rndr_editor.html',context)
    elif id_module == 'entities':
        context = {'form_add_repository': GencoRepositorioForm, 
                    'form_add_entity': GencoEntidadForm, 
                    'form_add_entitydef': GencoEntidadDefinicionForm,                     
                    'form_edit_entitydef': GencoEntidadDefinicionFormEdit,                     
                    'user': request.user}    
        return render(request,'gencoui/rndr_repository.html',context)        
    elif id_module == 'langs':
        context = {'form_add_lang': GencoLenguajesForm, 'form_add_type': GencoTipodatoForm,'user': request.user}    
        return render(request,'gencoui/rndr_langs.html',context)
    elif id_module == 'builds':
        
        #queryset=GencoEntorno.objects.filter(id_entorno__in=getAccessFilters(idWS, ACCESS_TYPE_ENV, request.user.id))
        #env = get_object_or_404(queryset, id_entorno=key_env)
        env = None;
        prj = get_object_or_404(GencoProyectos,id_proyecto=key_project)
        

        context = {'form_create_file': GencoArchivosForm, 'form_create_folder': GencoDirectoriosForm, 'form_element_entity': GencoElementoEntidadForm,
                    'user': request.user, 'proyecto': prj}    
        return render(request,'gencoui/rndr_builds.html',context)            
    else:
        raise Http404
    # form = GencoEntornoForm()
    # context = {'form_add_env': GencoEntornoForm, 'user': request.user.username}
    # return render(request,switcher.get(id_module),context)

@login_required
def get_view(request, id_module=None, key_lang=None, key_env=None, key_project=None):
    idWS=request.session.get('wskey', None)
    env=None

    if id_module == 'env':
        context = {'form_add_env': GencoEntornoForm, 'user': request.user}
        return render(request,'gencoui/rndr_environments.html',context)
    elif id_module == 'editor':
        queryset=GencoEntorno.objects.filter(id_entorno__in=getAccessFilters(idWS, ACCESS_TYPE_ENV, request.user.id))
        env = get_object_or_404(queryset, id_entorno=key_env)    
        context = {'form_create_template': GencoPlantillasForm, 'form_create_component': GencoComponentesForm, 'user': request.user, 'key_module':key_env, 'entorno': env, 'icon': env.id_icono.upload}    
        return render(request,'gencoui/rndr_editor.html',context)
    elif id_module == 'entities':
        context = {'form_add_repository': GencoRepositorioForm, 
                    'form_add_entity': GencoEntidadForm, 
                    'form_add_entitydef': GencoEntidadDefinicionForm,                     
                    'form_edit_entitydef': GencoEntidadDefinicionFormEdit,                     
                    'user': request.user}    
        return render(request,'gencoui/rndr_repository.html',context)        
    elif id_module == 'langs':
        conversions = GencoConversionTipodato.objects.filter(id_tipodato_cnv__id_lenguaje=key_lang)
        context = {'key_lang': key_lang, 'user': request.user, 'conversions':conversions}    
        return render(request,'gencoui/rndr_langs_view.html',context)
    elif id_module == 'builds':
        env = get_object_or_404(GencoEntorno, creado_por=request.user.id, id_entorno=key_env)
        prj = get_object_or_404(GencoProyectos,id_proyecto=key_project)
        

        context = {'form_create_file': GencoArchivosForm, 'form_create_folder': GencoDirectoriosForm, 'form_element_entity': GencoElementoEntidadForm,
                    'user': request.user, 'key_module':key_env, 'entorno': env, 'proyecto': prj, 'icon': env.id_icono.upload}    
        return render(request,'gencoui/rndr_builds.html',context)            
    else:
        raise Http404



class tmpl(APIView):
    

    def get(self, request, id_plantilla=None):
        context = {'error':'', 'fileContent':'', 'templateName':''}
        print 'get'
        filename = os.path.join('user_templates/'+id_plantilla)
        readFile(filename + '_rndr.tmpl', context)
        # obj = GencoPlantillas.objects.get(id_plantilla=id_plantilla)
        obj = GencoPlantillas.objects.get(id_plantilla=id_plantilla)
        # print obj
        # from django.core import serializers
        # serialized_obj = renderSerializers.serialize('json', [obj,], fields=('nombre','descripcion'))
        # context['templateObj'] = serialized_obj
        context['templateName'] = obj.nombre
        # return HttpResponse(context['fileContent'])
        return JsonResponse(context);
    def post(self, request, id_plantilla=None):
        context = {'error':'', 'fileContent':'', 'templateName':''}
        # print (request.data['editor'])
        # print (request.data.editor)
        # received_json_data=json.loads(request.data)
        # print received_json_data
        
        # # if request.POST.__contains__('editor'):
        content = request.data['editor']
        filename = os.path.join('user_templates/'+id_plantilla)
        #     # a = ['a', 'b', 'c', 'd']
        #     # print filename
        #     # filename = filename.join(id_plantilla,'_rndr.tmpl'])
        #     # print id_plantilla
        #     # print filename
        writeFile(content, filename + '_rndr.tmpl', context)  


        tags = getTagsTemplate(content,"")
        # print tags
        # dic = {}
        # dic['UI/abm 636a3dbd-1d9e-8f78'] = 1 
        # dic['UI/abm e460864b-bb5b-96b8'] = 2
        # dic['DAL/dao e948b17d-68f4-658e'] = 3

        GencoPlantillas.objects.filter(id_plantilla=id_plantilla).update(tags=json.dumps(tags))
        
        direlements = GencoDirectorioElementos.objects.filter(id_plantilla=id_plantilla)
        dictTagsElement = {}
        dictTagsElementUpd = {}
        for item in direlements:
            dictTagsElement = {}
            elementEntity = GencoElementoEntidad.objects.filter(id_direlemento=item.id_direlemento)

            for itemEntity in elementEntity:
                if itemEntity.tags != None:
                    dictTagsElement = getIterableFromTags(itemEntity.tags)             
                    dictTagsElementUpd = updateDictTags(tags, dictTagsElement)
                    GencoElementoEntidad.objects.filter(id_elementoentidad=itemEntity.id_elementoentidad).update(tags=json.dumps(dictTagsElementUpd))
            # se = GencoEntidadDefinicion.o 

        return JsonResponse(context)


import os


def tmplx(request, id_plantilla=None):
    context = {'error':'', 'fileContent':'', 'templateName':''}
    # form submission must be Post
    # if request.method == 'POST':
    #     # form must contain 'content' field
    #     if request.POST.__contains__('editor'):
    #         fileName = getNewFileName()
    #         writeFile(request.POST['editor'], fileName, context)
    #         readFile(fileName, context)
    #         deleteFile(fileName, context)
    #     else:
    #         context['error'] += 'Request doen not contain any content to create the file.\n'
    # else:
    #     context['error'] += 'Request type must be POST.\n'
    
    # return render(request, 'index.html', context)
    # lines1 = '''
    #  cat 
    # dog
    # horse'''.strip().splitlines()
    # FILES = '/var/tmp'


    if request.method == "POST":
        print (request)
        received_json_data=json.loads(request.body)
        print received_json_data
        print 'received'
        if request.POST.__contains__('editor'):
            lines2 = request.POST['editor']
            filename = os.path.join('user_templates/'+id_plantilla)
            # a = ['a', 'b', 'c', 'd']
            print filename
            # filename = filename.join(id_plantilla,'_rndr.tmpl'])
            # print id_plantilla
            # print filename
            writeFile(request.POST['editor'], filename + '_rndr.tmpl', context)
            # print request.POST['editor'].strip().splitlines()
            # print lines1 #lines2.strip().splitlines()
            # for line in difflib.unified_diff(lines1, lines2, fromfile='file1', tofile='file2', lineterm=''):
                # print line
           #request.POST['editor'] 
        # print request.POST
    elif request.method == "GET":
        print 'get'
        filename = os.path.join('user_templates/'+id_plantilla)
        readFile(filename + '_rndr.tmpl', context)
        # obj = GencoPlantillas.objects.get(id_plantilla=id_plantilla)
        obj = GencoPlantillas.objects.get(id_plantilla=id_plantilla)
        # print obj
        # from django.core import serializers
        # serialized_obj = renderSerializers.serialize('json', [obj,], fields=('nombre','descripcion'))
        # context['templateObj'] = serialized_obj
        context['templateName'] = obj.nombre
        # return HttpResponse(context['fileContent'])
        return JsonResponse(context);

    return JsonResponse(context)


class tmpl_preview(APIView):
    
    def put(self, request, id_plantilla=None):
        context = {'error':'', 'fileContent':''}

        request.data['editor']
        tmpl = request.data['editor']
        t = Template(tmpl)
        t.title = 'Generics 2016'

        templateBeta=get_object_or_404(GencoPlantillas,pk=id_plantilla)
        print templateBeta.id_lenguaje.nombre

        # direccion = type('Direccion', (object,), 
        #          {'name':'1-90 street'})()

        # cliente = type('Client', (object,), 
        #          {'surname':'render', 'firstname':'generic', 'email':'@gamial', 'direccion':direccion})()



        # t.clients = [cliente,cliente,cliente,cliente,cliente]

        t.entities = getDataTest(2,templateBeta.id_lenguaje.id_lenguaje)

        # t.entities = getDataBuild(2, templateBeta.id_lenguaje.id_lenguaje, None)
        
        try:
            context['fileContent'] = str(t);
            # context['theme'] = 'ace/mode/python'
            context['theme'] = 'ace/mode/'+templateBeta.id_lenguaje.nombre
        except Exception as e:
            raise APIException('An error ocurred... ' + str(e))
            #context['error'] = str(e);         

            # filename = os.path.join(id_plantilla)
            # print filename
            # writeFile(request.POST['editor'], filename + '_rndr.tmpl', context)

        # print cliente
        

        return JsonResponse(context)   

@login_required
def index(request):  
    id_ws=request.session.get('wskey', None)
    # print idWS
    if id_ws == None:
        # ws=GencoGrupo.objects.filter(creado_por=request.user.id)
        ws = get_list_or_404(GencoGrupo, creado_por=request.user.id)
        for item in ws:
            request.session['wskey'] = item.id_grupo
            request.session['wsname'] = item.nombre
    else:
        ws=GencoUsuarioGrupo.objects.filter(id_grupo__id_grupo=int(id_ws), auth_user_id=request.user.id)
        # ws = get_object_or_404(GencoGrupo, pk=idWS)
        if ws.exists():
            for wsi  in ws:
                request.session['wskey'] = wsi.id_grupo.id_grupo
                request.session['wsname'] = wsi.id_grupo.nombre
        else:
            raise Http404
   
    # workspaces = GencoUsuarioGrupo.objects.filter(auth_user_id=request.user.id)
    workspaces=None

    context = {'form_add_env': GencoEntornoForm, 'titulo': request.user.username, 'user': request.user, 'workspaces':workspaces,'form_project': GencoProyectosForm}
    return render(request, 'gencoui/menu.html', context)  


class GencoGrupoListView(ListView):

    model = GencoGrupo
    queryset = GencoGrupo.objects.all() 
    template_name = 'rndr_form_generic.html'
    search_value = ''

    def get_context_data(self, **kwargs):
        context = super(GencoGrupoListView, self).get_context_data(**kwargs)        
        context['now'] = timezone.now()

        context['form'] = GencoGrupoForm(initial={'nombre': self.search_value})        
        return context

    def get_queryset(self):
        form = GencoGrupoForm(self.request.GET)

        if form.is_valid():  
            self.search_value = form.cleaned_data['nombre']                  
        else:
            try:
                self.search_value = form.data['nombre']
            except:
                self.search_value = '' 

        if (self.search_value != ''):
            return GencoGrupo.objects.filter(nombre__icontains=self.search_value)
        else:
            return GencoGrupo.objects.all()


class AdminAppIconosListView(ListView):

    model = AdminAppIconos
    queryset = AdminAppIconos.objects.all() 


# Path for the files used by file handler
def getNewFileName():
    td = (datetime.datetime.now()-datetime.datetime(1970,1,1)).total_seconds()
    td = int(td)
    fileName = str(td) + "_" + str(randint(1, 10000))
    return os.path.join(FILES, fileName)

def openFile(fileName, mode, context):
    # open file using python's open method
    # by default file gets opened in read mode
    try:
        fileHandler = open(fileName, mode)
        return {'opened':True, 'handler':fileHandler}
    except IOError:
        context['error'] += 'Unable to open file ' + fileName + '\n'
    except:
        context['error'] += 'Unexpected exception in openFile method.\n'
    return {'opened':False, 'handler':None}

def readFile(fileName, context):
    # open file in read-only mode
    context['fileContent'] = ''
    fileHandler = openFile(fileName, 'r+', context)
    
    if fileHandler['opened']:
        # create Django File object using python's file object
        file = File(fileHandler['handler'])
        
        # we have atleast empty file now
        context['fileContent'] = ''
        # use chunks to iterate over the file in chunks.
        # this is helpful when file is large enough.
        # '10' represents the size of each chunk
        print 'inicio'
        for chunk in file.chunks(1024):
            context['fileContent'] += chunk
        print 'fin'
        # make sure to close the file before exit
        file.close()

def writeFile(content, fileName, context):
    # open file write mode
    fileHandler = openFile(fileName, 'w', context)
    
    if fileHandler['opened']:
        # create Django File object using python's file object
        file = File(fileHandler['handler'])
        # write content into the file
        file.write(content.encode('UTF-8'))
        # flush content so that file will be modified.
        file.flush()
        # close file
        file.close()

def deleteFile(fileName, context):
    try:
        os.remove(fileName)
    except:
        context['error'] += 'Exception raised while deleting temp file.\n'
    pass


class dir_template_tree(APIView):
    
    def get(self, request, id_proyecto=None):

        idWS=request.session.get('wskey', False)
        if not idWS:  
            raise Http404
        
        context = {'error':'none', 'fileContent':'none'}
        
        gd = GencoDirectorios
        gdSet = gd.objects.filter(id_proyecto__in=getAccessFilters(idWS, ACCESS_TYPE_PROJECT, request.user.id), id_proyecto=id_proyecto).order_by('id_directorio')
        a = GencoDirectorioElementos
        e = a.objects.filter(id_directorio__in=gdSet).order_by('id_directorio')

        dirs = []
        templates = {}
        id_padre = ''

        for i  in gdSet:         
            if i.id_padre_id is None:
                id_padre = '#'
            else:
                id_padre = i.id_padre_id

            dirs.append({'id': i.id_directorio, 'parent': id_padre, 'text': i.nombre, 'icon':"glyphicon glyphicon-folder-open", 'li_attr':{'data-renderas':"folder",'data-renderid': i.id_directorio, 'data-rendername':i.nombre}})
       

        for i  in e:
            print i.id_directorio.nombre
            

            # if i.id_directorio.nombre != tmp_dir: 
                # childrens[dir_label + "children"] = templates
                # templates = {}
                # childrens = {}
            if i.id_plantilla > 0:    
                dirs.append( {'id': 't'+str(i.id_direlemento), 'parent': i.id_directorio_id, 'text': i.id_plantilla.nombre + '<sub style="color:#CCCCCC">'  + i.id_plantilla.id_lenguaje.nombre + '</sub>', 'icon':"glyphicon glyphicon-file", 'li_attr':{'data-renderas':"template", 'data-renderid': i.id_plantilla_id,'data-renderiddirtemplate': i.id_direlemento, 'data-rendername': i.id_plantilla.nombre, 'data-rendertags':i.id_plantilla.tags, 'data-renderaslist': i.entidades_en_lista}})
            else:
                dirs.append( {'id': 'f'+str(i.id_direlemento), 'parent': i.id_directorio_id, 'text': i.id_archivo.nombre + '<sub style="color:#CCCCCC">file</sub>', 'icon':"glyphicon glyphicon-file", 'li_attr':{'data-renderas':"file", 'data-renderid': i.id_archivo_id,'data-renderiddirtemplate': i.id_direlemento, 'data-rendername': i.id_archivo.nombre}})
        print dirs    

        return JsonResponse({'dirs':dirs})



class dir_elemento_entidad_tree(APIView):
    
    def get(self, request, id_direlemento=None, id_repositorio=None):
        context = {'error':'none'}
        gencoElementoEntidad = GencoElementoEntidad
        elementoEntidad = gencoElementoEntidad.objects.filter(id_direlemento=id_direlemento, id_entidad__id_repositorio=id_repositorio)
        gencoEntidad = GencoEntidad.objects.filter(id_repositorio=id_repositorio).values()


        dirs = []
        tags = {}
        id_padre = ''
        nombreEntidad = ''

        for elemento  in elementoEntidad:         
            dirs.append({'id': elemento.id_elementoentidad, 'parent': '#', 'text': elemento.id_direlemento.id_plantilla.nombre + '<sub style="color:#CCCCCC">@</sub>' + '<b>' + elemento.id_entidad.nombre + '</b>' , 'icon':"glyphicon glyphicon-folder-open", 'li_attr':{'data-renderas':"template",'data-renderid': elemento.id_elementoentidad, 'data-renderiddirtemplate': elemento.id_direlemento.id_direlemento, 'data-rendername':elemento.id_direlemento.id_plantilla.nombre, 'data-renderentity': elemento.id_entidad.id_entidad}})
            
            print 'tags'
            print elemento.tags

            if elemento.tags: 
                tags = getIterableFromTags(elemento.tags)

                for key, value in tags.items():
                    print gencoEntidad
                    nombreEntidad = next((item for item in gencoEntidad if item.get("id_entidad") == int(float(value))),{'nombre':''})
                    print nombreEntidad
                    dirs.append( {'id': key + str(elemento.id_elementoentidad), 'parent': elemento.id_elementoentidad, 'text': key + '<sub style="color:#CCCCCC">@</sub>' + '<b>' + str(nombreEntidad.get('nombre')) + '</b>', 'icon':"glyphicon glyphicon-file", 'li_attr':{'data-renderas':"file", 'data-renderid': key, 'data-rendername': key, 'data-renderentity': value}})        
        print dirs    

        return JsonResponse({'dirs':dirs})



class langs_tree(APIView):
    
    def get(self, request):
        idWS=request.session.get('wskey', False)
        if not idWS:  
            raise Http404
        group = None
        groupName=''
        cloneDate=''
        originDesc=''
        # langs = GencoLenguajes.objects.filter(creado_por=request.user.id, id_lenguaje__gt=1).order_by('id_lenguaje')
        # tipodatos = GencoTipodato.objects.filter(creado_por=request.user.id).order_by('id_lenguaje')
        langs = GencoLenguajes.objects.filter(id_lenguaje__in=getAccessFilters(idWS, ACCESS_TYPE_LANG, request.user.id)).order_by('id_lenguaje')
        tipodatos = GencoTipodato.objects.filter(id_lenguaje__in=langs).order_by('id_lenguaje')

        dirs = []
        id_padre = ''

        for i  in langs:
            groupName=''
            cloneDate=''
            originDesc=''
            origin=''
            if i.id_ws_origen is not None:
                group = get_object_or_404(GencoGrupo, id_grupo=i.id_ws_origen)
                groupName = group.nombre
                cloneDate = i.fecha_creacion.strftime("%d/%m/%y")
                originDesc='Cloned from ' + groupName
                origin='Cloned'
            if i.id_ws != int(idWS):
                group = get_object_or_404(GencoGrupo, id_grupo=i.id_ws)
                groupName = group.nombre
                originDesc='Shared by ' + groupName
                origin='Shared'  
            dirs.append({'id': i.id_lenguaje, 'parent': '#', 'text': i.nombre + '<sub style="color:#CCCCCC">'+ origin + '</sub>'  , 'icon':"glyphicon glyphicon-folder-open", 'li_attr':{'data-renderas':"language",'data-renderid': i.id_lenguaje, 'data-rendername':i.nombre, 'data-cloned':originDesc + ' ' + cloneDate}})
       

        for i  in tipodatos:          
            dirs.append( {'id': 'type'+str(i.id_tipodato), 'parent': i.id_lenguaje.id_lenguaje, 'text': i.nombre + '<sub style="color:#CCCCCC"></sub>', 'icon':"glyphicon glyphicon-file", 'li_attr':{'data-renderas':"datatype", 'data-renderid': i.id_tipodato, 'data-rendername': i.nombre}})
        print dirs    

        return JsonResponse({'dirs':dirs})


class langs_tree_view(APIView):
    
    def get(self, request, id_lenguaje=None):

        langs = GencoLenguajes.objects.filter(id_lenguaje=id_lenguaje, id_lenguaje__gt=GENCO_LANG_ID)
        tipodatos = GencoTipodato.objects.filter(id_lenguaje__id_lenguaje=id_lenguaje)

        dirs = []
        id_padre = ''

        for i  in langs:         
            dirs.append({'id': i.id_lenguaje, 'parent': '#', 'text': i.nombre, 'icon':"glyphicon glyphicon-folder-open", 'li_attr':{'data-renderas':"language",'data-renderid': i.id_lenguaje, 'data-rendername':i.nombre}})
       

        for i  in tipodatos:          
            dirs.append( {'id': 'type'+str(i.id_tipodato), 'parent': i.id_lenguaje.id_lenguaje, 'text': i.nombre + '<sub style="color:#CCCCCC"></sub>', 'icon':"glyphicon glyphicon-file", 'li_attr':{'data-renderas':"datatype", 'data-renderid': i.id_tipodato, 'data-rendername': i.nombre}})
        print dirs    

        return JsonResponse({'dirs':dirs})



class repo_tree(APIView):
    
    def get(self, request):
        idWS=request.session.get('wskey', False)
        if not idWS:  
            raise Http404
        group = None
        groupName=''
        cloneDate=''
        originDesc=''
        repo = GencoRepositorio.objects.filter(id_repositorio__in=getAccessFilters(idWS, ACCESS_TYPE_REPO, request.user.id)).order_by('id_repositorio')
        entity = GencoEntidad.objects.filter(id_repositorio__in=repo).order_by('id_repositorio')

        repos = []
        id_padre = ''

        for i  in repo: 
            groupName=''
            cloneDate=''
            if i.id_ws_origen is not None:
                group = get_object_or_404(GencoGrupo, id_grupo=i.id_ws_origen)
                groupName = group.nombre
                cloneDate = i.fecha_creacion.strftime("%d/%m/%y")
                originDesc='Cloned from'
            if i.id_ws != int(idWS):
                originDesc='Shared by'
            repos.append({'id': i.id_repositorio, 'parent': '#', 'text': i.nombre + '<sub style="color:#CCCCCC">' + originDesc + ' ' + groupName + ' ' + cloneDate + '</sub>', 'icon':"glyphicon glyphicon-folder-open", 'li_attr':{'data-renderas':"repository",'data-renderid': i.id_repositorio, 'data-rendername':i.nombre}})
       

        for i  in entity:          
            repos.append( {'id': 'entity'+str(i.id_entidad), 'parent': i.id_repositorio.id_repositorio, 'text': i.nombre + '<sub style="color:#CCCCCC"></sub>', 'icon':"glyphicon glyphicon-file", 'li_attr':{'data-renderas':"entity", 'data-renderid': i.id_entidad, 'data-rendername': i.nombre}}) 

        return JsonResponse({'dirs':repos})


class component_template_tree(APIView):
    
    def get(self, request, id_entorno=None):
        idWS=request.session.get('wskey', False)
        comp = GencoComponentes.objects.filter(id_entorno=id_entorno, id_entorno__in=getAccessFilters(idWS, ACCESS_TYPE_ENV, request.user.id)).order_by('id_componente')
        template = GencoPlantillas.objects.filter(id_componente__in=comp).order_by('id_plantilla')

        comps = []
        id_padre = ''

        for i  in comp:         
            comps.append({'id': i.id_componente, 'parent': '#', 'text': i.nombre, 'icon':"glyphicon glyphicon-folder-open", 'li_attr':{'data-renderas':"component",'data-renderid': i.id_componente, 'data-rendername':i.nombre}})
       

        for i  in template:          
            comps.append( {'id': 'template'+str(i.id_plantilla), 'parent': i.id_componente.id_componente, 'text': i.nombre + '<sub style="color:#CCCCCC">'+ i.id_lenguaje.nombre +'</sub>', 'icon':"glyphicon glyphicon-file", 'li_attr':{'data-renderas':"template", 'data-renderid': i.id_plantilla, 'data-rendername': i.nombre}}) 

        return JsonResponse({'dirs':comps})     


class env_component_template_tree(APIView):
    
    def get(self, request, id_entorno=None):
        idWS=request.session.get('wskey', False)


        #comp = GencoComponentes.objects.filter(id_entorno=id_entorno, id_entorno__in=getAccessFilters(idWS, ACCESS_TYPE_ENV, request.user.id)).order_by('id_componente')

        env = GencoEntorno.objects.filter(id_entorno__in=getAccessFilters(idWS, ACCESS_TYPE_ENV, request.user.id)).order_by('id_entorno')
        envs = []
        for e in env:
            

            comp = GencoComponentes.objects.filter(id_entorno=e.id_entorno, id_entorno__in=getAccessFilters(idWS, ACCESS_TYPE_ENV, request.user.id)).order_by('id_componente')
            template = GencoPlantillas.objects.filter(id_componente__in=comp).order_by('id_plantilla')

            comps = []
            id_padre = ''

            for i  in comp:         
                comps.append({'id': i.id_componente, 'parent': '#', 'text': i.nombre, 'icon':"glyphicon glyphicon-folder-open", 'li_attr':{'data-renderas':"component",'data-renderid': i.id_componente, 'data-rendername':i.nombre}})
           

            for i  in template:          
                comps.append( {'id': 'template'+str(i.id_plantilla), 'parent': i.id_componente.id_componente, 'text': i.nombre + '<sub style="color:#CCCCCC">'+ i.id_lenguaje.nombre +'</sub>', 'icon':"glyphicon glyphicon-file", 'li_attr':{'data-renderas':"template", 'data-renderid': i.id_plantilla, 'data-rendername': i.nombre}}) 

            envs.append({'idEnv': e.id_entorno, 'nombre': e.nombre, 'dirs':comps})
                
        return JsonResponse({'envs':envs})

class build_component_template_tree(APIView):
    
    def get(self, request):
        idWS=request.session.get('wskey', False)


        #comp = GencoComponentes.objects.filter(id_entorno=id_entorno, id_entorno__in=getAccessFilters(idWS, ACCESS_TYPE_ENV, request.user.id)).order_by('id_componente')

        env = GencoEntorno.objects.filter(id_entorno__in=getAccessFilters(idWS, ACCESS_TYPE_ENV, request.user.id)).order_by('id_entorno')
        envs = []
        for e in env:
            

            comp = GencoComponentes.objects.filter(id_entorno=e.id_entorno, id_entorno__in=getAccessFilters(idWS, ACCESS_TYPE_ENV, request.user.id)).order_by('id_componente')
            template = GencoPlantillas.objects.filter(id_componente__in=comp).order_by('id_plantilla')

            comps = []
            id_padre = ''

            for i  in comp:         
                comps.append({'id': i.id_componente, 'parent': '#', 'text': i.nombre, 'icon':"glyphicon glyphicon-folder-open", 'li_attr':{'data-renderas':"component",'data-renderid': i.id_componente, 'data-rendername':i.nombre}})
           

            for i  in template:          
                comps.append( {'id': 'template'+str(i.id_plantilla), 'parent': i.id_componente.id_componente, 'text': i.nombre + '<sub style="color:#CCCCCC">'+ i.id_lenguaje.nombre +'</sub>', 'icon':"glyphicon glyphicon-file", 'li_attr':{'data-renderas':"template", 'data-renderid': i.id_plantilla, 'data-rendername': i.nombre}}) 

            envs.append({'idEnv': e.id_entorno, 'nombre': e.nombre, 'dirs':comps})
                
        return JsonResponse({'envs':envs})          

class processors(APIView):
    
    def get(self, request):

        comp = AdminLenguajeProcesador.objects.filter(estado='ALTA').order_by('id_lenguajeprocesador')

        comps = []        
        for i  in comp:         
            comps.append({'id_lenguajeprocesador': i.id_lenguajeprocesador, 'nombre': i.nombre, 'descripcion': i.descripcion, 'version': i.version, 'id_icono': 'http://127.0.0.1:8000/media/' + str(i.id_icono.upload)})

        return JsonResponse({'processor':comps}) 


class getEntities(APIView):
    
    def get(self, request):

        entities = GencoEntidad.objects.filter(creado_por=request.user.id).order_by('id_entidad')

        comps = []        
        for i  in comp:         
            comps.append({'id_lenguajeprocesador': i.id_lenguajeprocesador, 'nombre': i.nombre, 'descripcion': i.descripcion, 'version': i.version, 'id_icono': 'http://127.0.0.1:8000/media/' + str(i.id_icono.upload)})

        return JsonResponse({'processor':comps})                


def getDataTest(tipo, id_lenguaje):
    
    a = []
    b = []
    f = []
    dict = {}
    counter=0
    # tipo=2
    # direccion = type('Direccion', (object,), 
                  # {'name':'1-90 street'})()

    # cliente = type('Client', (object,), 
    #              {'surname':'render', 'firstname':'generic', 'email':'@gamial', 'direccion':direccion})()
    
    types = GencoTipodato.objects.filter(id_lenguaje=GENCO_LANG_ID).order_by('id_tipodato')
    typesCnv = GencoConversionTipodato.objects.filter(id_tipodato__id_lenguaje=GENCO_LANG_ID, id_tipodato_cnv__id_lenguaje=id_lenguaje)
    
    for i in typesCnv:
        try:
            dict[i.id_tipodato.id_tipodato] = i
        except ValueError as e:
            print str(e)            
            dict={}

    # if tipo == 1:
    for i  in types:
        counter = counter+1
        cnv = dict.get(i.id_tipodato)

        if cnv==None:
            field = type('field', (object,),{'name':'Field'+ str(counter), 'type':str(i.nombre), 'typecnv': '', 'prefixcnv': '', 'length':'', 'isKey':True, 'mandatory':True})()    
        else:
            field = type('field', (object,),{'name':'Field'+ str(counter), 'type':str(i.nombre), 'typecnv': cnv.id_tipodato_cnv, 'prefixcnv': str(i.prefijo), 'length':'', 'isKey':False, 'mandatory':False})()
        
        f.append(field)

    # if tipo==1:    
    #     a.append(type('entity', (object,),{'name': 'A', 'fields': f, 'links':[]})())

    if tipo == 2:
        b.append(type('entity', (object,),{'name': 'B', 'fields': f})())
        f=[]
        counter=0
        for i  in types:
            counter = counter+1
            cnv = dict.get(i.id_tipodato)

            if cnv==None:
                field = type('field', (object,),{'name':'Field'+ str(counter), 'type':str(i.nombre), 'typecnv': '', 'prefixcnv': '', 'length':'', 'isKey':True, 'mandatory':True})()    
            else:
                field = type('field', (object,),{'name':'Field'+ str(counter), 'type':str(i.nombre), 'typecnv': cnv.id_tipodato_cnv, 'prefixcnv': str(i.prefijo), 'length':'', 'isKey':False, 'mandatory':False})()
            
            f.append(field)

        a.append(type('main', (object,),{'name': 'A', 'fields': f, 'links': b})())

    

    return a


def getDataBuild(id_lenguaje, id_entidad, dictCnv):
    
    # a = []
    b = []
    fields = []
    fieldsref = []
    links = []
    # dict = {}
    
    # if id_entidad == None:
    #     entidades = GencoElementoEntidad.objects.filter(id_direlemento=id_direlemento).order_by('id_direlemento','id_entidad')
    # else:
    #     entidades = GencoElementoEntidad.objects.filter(id_direlemento=id_direlemento, id_entidad=id_entidad)
    # # types = GencoTipodato.objects.filter(id_lenguaje=1).order_by('id_tipodato')    
    # typesCnv = GencoConversionTipodato.objects.filter(id_tipodato__id_lenguaje=1, id_tipodato_cnv__id_lenguaje=id_lenguaje)
    
    # for cni in typesCnv:
    #     try:
    #         dict[cni.id_tipodato.id_tipodato] = cni
    #     except ValueError as e:
    #         print str(e)            
    #         dict={}

    # for i in entidades:

    definicionField = GencoEntidadDefinicion.objects.filter(id_entidad=id_entidad)
    for ii in definicionField:
        
        if ii.id_tipodato == None:
            definicionLnk = GencoEntidadDefinicion.objects.filter(id_entidad=ii.entidad_ref)
            for iii in definicionLnk:
                print 'ref'
                print ii.entidad_ref
                print ('%s   %i',iii.nombre,  iii.id_tipodato)
                if iii.id_tipodato == None:
                    field = type('field', (object,),{'name':iii.nombre, 'type':'entity', 'typecnv': '', 'prefixcnv': '', 'length':iii.longitud, 'isKey':iii.es_pk, 'mandatory':iii.obligatorio})()    
                else:
                    cnv = dictCnv.get(iii.id_tipodato.id_tipodato)
                    if cnv==None:
                        field = type('field', (object,),{'name':iii.nombre, 'type':str(iii.id_tipodato.nombre), 'typecnv': '', 'prefixcnv': '', 'length':iii.longitud, 'isKey':iii.es_pk, 'mandatory':iii.obligatorio})()    
                    else:
                        field = type('field', (object,),{'name':iii.nombre, 'type':str(iii.id_tipodato.nombre), 'typecnv': cnv.id_tipodato_cnv, 'prefixcnv': str(iii.id_tipodato.prefijo), 'length':iii.longitud, 'isKey':iii.es_pk, 'mandatory':iii.obligatorio})()
                
                fieldsref.append(field)

            links.append(type('entity', (object,),{'name': ii.nombre, 'fields': fieldsref, 'links':[]})())
            fieldsref=[]
        else:
            cnv = dictCnv.get(ii.id_tipodato.id_tipodato)
            if cnv==None:
                field = type('field', (object,),{'name':ii.nombre, 'type':str(ii.id_tipodato.nombre), 'typecnv': '', 'prefixcnv': '', 'length':ii.longitud, 'isKey':ii.es_pk, 'mandatory':ii.obligatorio})()    
            else:
                field = type('field', (object,),{'name':ii.nombre, 'type':str(ii.id_tipodato.nombre), 'typecnv': cnv.id_tipodato_cnv, 'prefixcnv': str(ii.id_tipodato.prefijo), 'length':ii.longitud, 'isKey':ii.es_pk, 'mandatory':ii.obligatorio})()
        
            fields.append(field)

        # print links
        # for x in links:
        #     print x.name

        # a.append(type('entity', (object,),{'name': i.id_entidad.nombre, 'fields': fields, 'links':links})())
        # fields=[]
        # links=[]

    # if tipo == 2:
    #     b.append(type('entity', (object,),{'name': 'B', 'fields': f})())
    #     f=[]
    #     counter=0
    #     for i  in types:
    #         counter = counter+1
    #         cnv = dict.get(i.id_tipodato)

    #         if cnv==None:
    #             field = type('field', (object,),{'name':'Field'+ str(counter), 'type':str(i.nombre), 'typecnv': '', 'prefixcnv': str(i.prefijo)})()    
    #         else:
    #             field = type('field', (object,),{'name':'Field'+ str(counter), 'type':str(i.nombre), 'typecnv': cnv.id_tipodato_cnv, 'prefixcnv': str(i.prefijo)})()
            
    #         f.append(field)

    #     a.append(type('main', (object,),{'name': 'A', 'fields': f, 'links': b})())

    
    a = type('entity', (object,),{'name': ii.id_entidad.nombre, 'fields': fields, 'links':links})()

    return a


def getDataBuildTags(id_lenguaje, id_entidad):
    
    a = []
    fields = []
    fieldsref = []
    links = []
    dict = {}

    typesCnv = GencoConversionTipodato.objects.filter(id_tipodato__id_lenguaje=GENCO_LANG_ID, id_tipodato_cnv__id_lenguaje=id_lenguaje)
    
    for cni in typesCnv:
        try:
            dict[cni.id_tipodato.id_tipodato] = cni
        except ValueError as e:
            print str(e)            
            dict={}



        definicionField = GencoEntidadDefinicion.objects.filter(id_entidad=i.id_entidad)
        for ii in definicionField:
            
            if ii.id_tipodato == None:
                definicionLnk = GencoEntidadDefinicion.objects.filter(id_entidad=ii.entidad_ref)
                for iii in definicionLnk:
                    print 'ref'
                    print ii.entidad_ref
                    print ('%s   %i',iii.nombre,  iii.id_tipodato)
                    if iii.id_tipodato == None:
                        field = type('field', (object,),{'name':iii.nombre, 'type':'entity', 'typecnv': '', 'prefixcnv': '', 'length':iii.longitud, 'isKey':iii.es_pk, 'mandatory':iii.obligatorio})()    
                    else:
                        cnv = dict.get(iii.id_tipodato.id_tipodato)
                        if cnv==None:
                            field = type('field', (object,),{'name':iii.nombre, 'type':str(iii.id_tipodato.nombre), 'typecnv': '', 'prefixcnv': '', 'length':iii.longitud, 'isKey':iii.es_pk, 'mandatory':iii.obligatorio})()    
                        else:
                            field = type('field', (object,),{'name':iii.nombre, 'type':str(iii.id_tipodato.nombre), 'typecnv': cnv.id_tipodato_cnv, 'prefixcnv': str(iii.id_tipodato.prefijo), 'length':iii.longitud, 'isKey':iii.es_pk, 'mandatory':iii.obligatorio})()
                    
                    fieldsref.append(field)

                links.append(type('entity', (object,),{'name': ii.nombre, 'fields': fieldsref, 'links':[]})())
                fieldsref=[]
            else:
                cnv = dict.get(ii.id_tipodato.id_tipodato)
                if cnv==None:
                    field = type('field', (object,),{'name':ii.nombre, 'type':str(ii.id_tipodato.nombre), 'typecnv': '', 'prefixcnv': '', 'length':ii.longitud, 'isKey':ii.es_pk, 'mandatory':ii.obligatorio})()    
                else:
                    field = type('field', (object,),{'name':ii.nombre, 'type':str(ii.id_tipodato.nombre), 'typecnv': cnv.id_tipodato_cnv, 'prefixcnv': str(ii.id_tipodato.prefijo), 'length':ii.longitud, 'isKey':ii.es_pk, 'mandatory':ii.obligatorio})()
            
                fields.append(field)


        a.append(type('entity', (object,),{'name': i.id_entidad.nombre, 'fields': fields, 'links':links})())
        fields=[]
        links=[]

    return a

class searchLangs(APIView):

    def get(self, request, keysearch=None, page=None):
        
        next='0'
        prev='0'
        offset='0'
        npages=3
        pagerange=''
        # try:
        #     page = request.data['page']        
        # except:
        #     page=1

        # try:    
        #     keysearch = request.data['keysearch']
        # except:
        #     keysearch=''
        if keysearch=='*':
            langs = GencoLenguajes.objects.extra(tables=('auth_user',),where=('genco_lenguajes.creado_por=auth_user.id',),select={'user':'username'}).filter(id_lenguaje__gt=GENCO_LANG_ID).exclude(creado_por=request.user.id)
        else:   
            langs = GencoLenguajes.objects.extra(tables=('auth_user',),where=('genco_lenguajes.creado_por=auth_user.id',),select={'user':'username'}).filter(nombre__istartswith=keysearch, id_lenguaje__gt=GENCO_LANG_ID).exclude(creado_por=request.user.id)


        paginator = Paginator(langs, npages)
        #page = request.GET.get('page')

        try:
            langs = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            langs = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            langs = paginator.page(paginator.num_pages)

        offset = str(paginator.num_pages)
        serializer = SearchLangSerializer(langs, many=True, context={'request': request})

        if langs.has_next():
            next = str(langs.next_page_number())
        else:
            next = offset
            page = offset

        if langs.has_previous():
            prev = str(langs.previous_page_number())
        else:
            prev = page

        # limit=0
        # inirange=0
        # endrange=nrange
        # if int(page)+npages < offset:
        #     limit = int(page)+npages
        #     if int(page)%nrange==0:
        #         inirange = int(page)
        #         endrange = inirange + nrange
            
        # else:
        #     limit = int(offset)

        
        # for x in range(int(page), limit):
        #     rangepag.append(x)

        # print str(rangepag)
        # #type(langs.page_range)
        # print paginator.page_range
        # #print langs.start_index()
        # #print langs.end_index()

        # print int(page)%2
       
        # print ('%s - %s'% (inirange, endrange))

        pagerange = page_range(int(page), int(offset), npages)

        return Response({'current': page, 'next': next, 'previous': prev, 'offset':offset, 'pagerange':pagerange,'langs' :serializer.data})

#sample data {"langs":"[1, 2]"}  [<id_lenguaje>,...]
class CloneLang(APIView):
    
    def post(self, request):
        clonelangs=[]
        clonetypes=[]
        datatypes=None
        dataconversions=None
        cloneIdlang=0 
        typeoriginId=0

        context = {'status':'' ,'error':'', 'response':''}
        langsclone = request.data['langs']
       
        if langsclone: 
            langsItr = getIterableFromTags(langsclone)
        
        idWS=self.request.session.get('wskey', None)
        # get_list_or_404(GencoUsuarioGrupo, auth_user_id=request.user.id, id_grupo=idWS)
        langs = GencoLenguajes.objects.filter(id_lenguaje__in=langsItr, id_lenguaje__gt=GENCO_LANG_ID)        

        for lang in langs:
            cloneIdlang = lang.id_lenguaje
            lang.pk = None
            lang.creado_por = request.user.id
            lang.creado_el = timezone.now()
            lang.modificado_por = None
            lang.fecha_modificacion = None
            lang.id_ws_origen = lang.id_ws
            lang.id_ws = int(idWS)
            
            try:
                lang.save()
                setAccessAuth(idWS, ACCESS_TYPE_LANG, request.user.id, lang.pk)
                # access = AdminGrupoAccesos.objects.create( 
                # auth_user_id = request.user.id,
                # id_grupo=GencoGrupo.objects.get(pk=idWS),
                # id_elemento=lang.pk,
                # id_tipo=ACCESS_TYPE_LANG,
                # creado_por = request.user.id,
                # fecha_creacion=timezone.now()
                # )
                print lang.id_lenguaje
                datatypes = GencoTipodato.objects.filter(id_lenguaje=cloneIdlang)
                for datatype in datatypes:
                    typeoriginId = datatype.id_tipodato
                    print datatype.id_tipodato
                    datatype.pk = None
                    datatype.id_lenguaje = lang
                    datatype.creado_por = request.user.id
                    datatype.creado_el = timezone.now()
                    datatype.modificado_por = None
                    datatype.fecha_modificacion = None
                    try:
                        datatype.save()
                        print typeoriginId
                        dataconversions = GencoConversionTipodato.objects.filter(id_tipodato_cnv__id_tipodato=typeoriginId)
                        for dataconversion in dataconversions:
                        #     print dataconversion.id_conversion
                            dataconversion.pk = None
                            #dataconversion.id_tipodato = datatype.id_tipodato
                            #la conversion debe ser hacia el nuevo id que creamos
                            dataconversion.id_tipodato_cnv = datatype
                            dataconversion.creado_por = request.user.id
                            dataconversion.creado_el = timezone.now()
                            dataconversion.modificado_por = None
                            dataconversion.fecha_modificacion = None
                            try:
                                dataconversion.save()                                
                            except Exception as e:
                                print str(e)
                                raise APIException('An error ocurred cloning type conversion. Please contatct support. ' + str(e))       

                    except Exception as e:
                        print str(e)
                        raise APIException('An error ocurred cloning datatype(s). Please contatct support. ' + str(e))


            except Exception as e:
                print str(e)
                raise APIException('An error ocurred cloning language(s). Please contatct support.' + str(e))   
            # clonelangs.append(lang)
            # datatypes = GencoTipodato.objects.filter(id_lenguaje=lang.id_lenguaje)
            # for datatype in datatypes:
                # datatype.id_lenguaje



        # print ' user %s'%request.user.id
        # try:
        #     langsclonedids = GencoLenguajes.objects.bulk_create(clonelangs)
        #     context['response'] += 'Languages was cloned.\n'
        #     context['status'] = 1
        #     for datatype in langsclonedids:
        #         print str(datatype.id_lenguaje);
        # except  Exception as e:
        #     context['error'] += 'Languages was not cloned.\n'
        #     context['status'] = 0
        #     print str(e)
        
        return JsonResponse(context)


class searchRepo(APIView):

    def get(self, request, keysearch=None, page=None):
        
        next='0'
        prev='0'
        offset='0'
        npages=3
        pagerange=''

        if keysearch=='*':
            repos = GencoRepositorio.objects.extra(tables=('auth_user',),where=('genco_repositorio.creado_por=auth_user.id',),select={'user':'username'}).exclude(creado_por=request.user.id)
        else:   
            repos = GencoRepositorio.objects.extra(tables=('auth_user',),where=('genco_repositorio.creado_por=auth_user.id',),select={'user':'username'}).filter(nombre__istartswith=keysearch).exclude(creado_por=request.user.id)

        paginator = Paginator(repos, npages)

        try:
            repos = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            repos = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            repos = paginator.page(paginator.num_pages)

        offset = str(paginator.num_pages)
        serializer = SearchRepoSerializer(repos, many=True, context={'request': request})

        if repos.has_next():
            next = str(repos.next_page_number())
        else:
            next = offset
            page = offset

        if repos.has_previous():
            prev = str(repos.previous_page_number())
        else:
            prev = page

        pagerange = page_range(int(page), int(offset), npages)

        return Response({'current': page, 'next': next, 'previous': prev, 'offset':offset, 'pagerange':pagerange,'repos' :serializer.data})



class CloneRepo(APIView):
    
    def post(self, request):
        clonerepos=[]
        cloneentities=[]
        entities=None
        cloneIdrepo=0 
        entityOriginId=0

        context = {'status':'' ,'error':'', 'response':''}
        reposclone = request.data['repos']
       
        if reposclone: 
            reposItr = getIterableFromTags(reposclone)

        idWS=self.request.session.get('wskey', None)    
        repos = GencoRepositorio.objects.filter(id_repositorio__in=reposItr)

        for repo in repos:
            cloneIdrepo = repo.id_repositorio
            repo.pk = None
            repo.creado_por = request.user.id
            repo.creado_el = timezone.now()
            repo.modificado_por = None
            repo.fecha_modificacion = None
            repo.id_ws_origen = repo.id_ws
            repo.id_ws = int(idWS)

            try:
                repo.save()
                setAccessAuth(idWS, ACCESS_TYPE_REPO, request.user.id, repo.pk)
                entities = GencoEntidad.objects.filter(id_repositorio=cloneIdrepo)
                for entity in entities:
                    entityOriginId = entity.id_entidad
                    entity.pk = None
                    entity.id_repositorio = repo
                    entity.creado_por = request.user.id
                    entity.creado_el = timezone.now()
                    entity.modificado_por = None
                    entity.fecha_modificacion = None
                    try:
                        entity.save()
         
                        entidaddefs = GencoEntidadDefinicion.objects.filter(id_entidad__id_entidad=entityOriginId)
                        for entidaddef in entidaddefs:
                            entidaddef.pk = None
                            #la conversion debe ser hacia el nuevo id que creamos
                            entidaddef.id_entidad = entity
                            entidaddef.creado_por = request.user.id
                            entidaddef.creado_el = timezone.now()
                            entidaddef.modificado_por = None
                            entidaddef.fecha_modificacion = None
                            try:
                                entidaddef.save()
                            except Exception as e:
                                print str(e)
                                raise APIException('An error ocurred cloning type entity definition. Please contatct support. ' + str(e))       

                    except Exception as e:
                        print str(e)
                        raise APIException('An error ocurred cloning entities. Please contatct support. ' + str(e))


            except Exception as e:
                print str(e)
                raise APIException('An error ocurred cloning repositories. Please contatct support.' + str(e))   

        
        return JsonResponse(context)



class searchProjects(APIView):

    def get(self, request, keysearch=None, page=None):
        
        next='0'
        prev='0'
        offset='0'
        npages=3
        pagerange=''

        if keysearch=='*':
            projects = GencoProyectos.objects.extra(tables=('auth_user',),where=('genco_proyectos.creado_por=auth_user.id',),select={'user':'username'}).exclude(creado_por=request.user.id)
        else:   
            projects = GencoProyectos.objects.extra(tables=('auth_user',),where=('genco_proyectos.creado_por=auth_user.id',),select={'user':'username'}).filter(nombre__istartswith=keysearch)


        paginator = Paginator(projects, npages)
        #page = request.GET.get('page')

        try:
            projects = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            projects = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            projects = paginator.page(paginator.num_pages)

        offset = str(paginator.num_pages)
        serializer = SearchProjectSerializer(projects, many=True, context={'request': request})

        if projects.has_next():
            next = str(projects.next_page_number())
        else:
            next = offset
            page = offset

        if projects.has_previous():
            prev = str(projects.previous_page_number())
        else:
            prev = page

        pagerange = page_range(int(page), int(offset), npages)

        return Response({'current': page, 'next': next, 'previous': prev, 'offset':offset, 'pagerange':pagerange,'projects' :serializer.data})


class GencoDatatype(APIView):

    def get(self, request):
        
        tipos = GencoTipodato.objects.filter(id_lenguaje=GENCO_LANG_ID)
        serializer = GencoTipodatoSerializer(tipos, many=True)

        return Response(serializer.data)


class BuildProject(APIView):

    def get(self, request, id_proyecto=None, id_repositorio=None):
        
        idWS=request.session.get('wskey', False)
        project = GencoProyectos.objects.filter(id_proyecto=id_proyecto, id_proyecto__in=getAccessFilters(idWS, ACCESS_TYPE_PROJECT, request.user.id))
        generatedFiles=[]
        buildFolders={}
        buildFolderPath=''
        buildFolderParent=''


        hash = random.getrandbits(128)
        mainBuild = 'user_files/'+str(hash)
        os.makedirs(mainBuild)
        print project
        directorios = GencoDirectorios.objects.filter(id_proyecto=project).order_by('id_directorio')
       
        for dirprj in directorios:
            
            if dirprj.id_padre==None:
                buildFolderParent=mainBuild+'/'
            else:    
                buildFolderParent = buildFolders.get(dirprj.id_padre.id_directorio) + '/'

            
            buildFolderPath=buildFolderParent + dirprj.nombre
            os.makedirs(buildFolderPath)
            buildFolders[dirprj.id_directorio]=buildFolderPath
            dirBuild=buildFolderPath

            direlement = GencoDirectorioElementos.objects.filter(id_directorio=dirprj)

            for item in direlement:
                tags=[]
                if item.id_plantilla == None:
                    print 'Bajando archivo.......'
                    archivo = GencoArchivos.objects.get(pk=item.id_archivo.id_archivo)
                    print archivo.upload.path
                    shutil.copyfile(archivo.upload.path, dirBuild + '/' + archivo.nombre)
                    
                else:    

                    
                    print 'Generando archivos..........'
                    print item.id_direlemento
                    print item.id_plantilla.id_lenguaje.nombre


                    ids=[]
                    contextTag={}    
                    tmpl=''
                    tmplBase=''
                    tmplInner=''
                    tInner=None
                    plantilla=None
                    xx=None
                    entitiesArr=[]
                    entitiesInnerArr=[]
                    dictCnv={}
                    tInner=None
                    t=None
                    tagsVal=[]
                    tagsValCant=0
                    fileOutList=None
                    # if item.id_plantilla.tags != None:
                        # xx=GencoElementoEntidad.objects.get(pk=item.id_direlemento)
                        # for key, value in dic.items():
                        #     print "llave %s  valor %s" % (key, value)
           
                        # tags = getIterableFromTags(item.id_plantilla.tags)
                        # ids = getIdsFromIterable(tags) 
                        # contextTag = {'error':'', 'fileContent':'', 'templateName':''}
                        # for id in ids:
                        #     filename = os.path.join('user_templates/'+str(id))
                        #     readFile(filename + '_rndr.tmpl', contextTag)
                        #     tmpl = contextTag['fileContent']
                        #     tInner = Template(tmpl)
                        #     # t.entities = getDataBuild(item.id_direlemento, item.id_plantilla.id_lenguaje, itemL.id_entidad)
                        #     print 'INNER ...........................................'
                        #     plantilla = GencoPlantillas.objects.get(pk=int(id))
                        #     tInner.entities = getDataBuildTags(plantilla.id_lenguaje, int(id))
                        #     print tmpl;

                    typesCnv = GencoConversionTipodato.objects.filter(id_tipodato__id_lenguaje=GENCO_LANG_ID, id_tipodato_cnv__id_lenguaje=item.id_plantilla.id_lenguaje)
                    for cni in typesCnv:
                        try:
                            dictCnv[cni.id_tipodato.id_tipodato] = cni
                        except ValueError as e:
                            print str(e)            
                            dictCnv={}    


                    context = {'error':'', 'fileContent':'', 'templateName':''}
                    filename = os.path.join('user_templates/'+str(item.id_plantilla.id_plantilla))
                    readFile(filename + '_rndr.tmpl', context)

                    context['templateName'] = item.id_plantilla.nombre
                    print context['fileContent']

                    tmplBase = context['fileContent']
                    

                    # if item.entidades_en_lista == None:
                    #     # templateBeta=get_object_or_404(GencoPlantillas,pk=id_plantilla)
                    #     t.entities = getDataBuild(item.id_direlemento, item.id_plantilla.id_lenguaje, item)
                        
                    #     # getDataBuild(item.id_direlemento, direlement.id_plantilla)
                    #     writefilename = os.path.join(dirBuild + '/' + str(item.id_plantilla.nombre) + '.' + str(item.id_plantilla.id_lenguaje.extension)) 
                                   
                    #     with open(writefilename, 'w') as f:
                    #         myfile = File(f)
                    #         myfile.write(str(t))
                    #         myfile.closed
                    #         f.closed
                    #         generatedFiles.append(writefilename)
                    # else:

                    entidades = GencoElementoEntidad.objects.filter(id_direlemento=item.id_direlemento, id_entidad__id_repositorio__in=getAccessFilters(idWS, ACCESS_TYPE_REPO, request.user.id), id_entidad__id_repositorio=id_repositorio)

                    for itemLE in entidades:
                        tagsVal=[]
                        tagsValCant=0
                        tmpl=tmplBase
                        entitiesArr=[]
                        entitiesInnerArr=[]


                        # if item.entidades_en_lista == None:
                        entitiesArr.append(getDataBuild(item.id_plantilla.id_lenguaje, itemLE.id_entidad, dictCnv))                            
                        
                        if item.id_plantilla.tags != None:
                            tags = getIterableFromTags(itemLE.tags)
                            for key, value in tags.items():
                                print "llave %s  valor %s" % (key, value)
                                id = getIdsFromText(key)
                                print id
                                if value > 0:
                                    contextInner = {'error':'', 'fileContent':'', 'templateName':''}
                                    filename = os.path.join('user_templates/'+str(id))
                                    readFile(filename + '_rndr.tmpl', contextInner)

                                    tmplInner = contextInner['fileContent']
                                    #Angel Barrios - getbeta
                                    #quitamos los tags del tagTemplate ya que solo hay 2 nivele
                                    # tags = getTagsTemplate(tmplInner,"")
                                    # for tag in tags:
                                    #     tmplInner = tmplInner.replace('[@ ' + tag + ' @]', '')



                                    tInner = Template(tmplInner)
                                    entitiesInnerArr.append(getDataBuild(id, value, dictCnv))                            
                                    tInner.entities = entitiesInnerArr
                                    print 'STRREPLACE1========================================='
                                    print tmpl
                                    print 'STRREPLACE2========================================='
                                    print str(tInner)
                                    print key                                        
                                    print 'STRREPLACE3========================================='
                                    # tmpl = tmpl.replace('[@ ' + key + ' @]', str(tInner))
                                    tmpl = tmpl.replace('[@ ' + key + ' @]', ' $tagsVal['+str(tagsValCant)+'] ')
                                    tagsVal.append(str(tInner))
                                    tagsValCant=tagsValCant+1;
                                else:
                                    tmpl = tmpl.replace('[@ ' + key + ' @]', '')

                                    # print tmpl

                        t = Template(tmpl)
                        t.entities = entitiesArr
                        t.tagsVal=tagsVal

                        if item.entidades_en_lista == 1:
                            if fileOutList==None:
                                writefilename = os.path.join(dirBuild + '/' + str(item.id_plantilla.nombre) + '.' + str(item.id_plantilla.id_lenguaje.extension))
                                fileOutList = open(writefilename, 'w')
                            print 'AS LIST======================================'
                            print tmpl
                            fileOutList.write(str(t))

                        else:                            
                            writefilename = os.path.join(dirBuild + '/' + str(itemLE.id_entidad.nombre) + '.' + str(item.id_plantilla.id_lenguaje.extension))                             
                            with open(writefilename, 'w') as f:
                                myfile = File(f)
                                myfile.write(str(t))
                                myfile.closed
                                f.closed
                                generatedFiles.append(writefilename)
                            

                    
                    if entidades.exists() and item.entidades_en_lista==1:
                        with open(writefilename, 'w') as f:
                            fileOutList.close()
                            fileOutList=None
                            generatedFiles.append(writefilename)

                        # else:
                            # if item.id_plantilla.tags != None:
                            #     tags = getIterableFromTags(itemLE.tags)
                            #     for key, value in tags.items():
                            #         print "llave %s  valor %s" % (key, value)
                                    
                            # entitiesArr.append(getDataBuild(item.id_plantilla.id_lenguaje, itemLE.id_entidad, dictCnv))
                            # pass

                    # if item.entidades_en_lista == 1:                        
                    #     t = Template(tmpl)
                    #     t.entities = entitiesArr
                    #     writefilename = os.path.join(dirBuild + '/' + str(item.id_plantilla.nombre) + '.' + str(item.id_plantilla.id_lenguaje.extension)) 
                    #     with open(writefilename, 'w') as f:
                    #             myfile = File(f)
                    #             myfile.write(str(t))
                    #             myfile.closed
                    #             f.closed
                    #             generatedFiles.append(writefilename)
                # getDataBuild(item.id_direlemento, direlement.id_plantilla)
                    

                    
        # tar = tarfile.open(mainBuild + ".tar", "w")
        # for name in generatedFiles:
        #     tar.add(name)
        # tar.close()
                   
        zip_name = mainBuild
        directory_name = mainBuild

            # Create 'path\to\zip_file.zip'
        shutil.make_archive(zip_name, 'zip', directory_name) 
                    # for name in generatedFiles:                    
                    # shutil.rmtree(dirBuild)

        
        #zip_file = open(mainBuild+'.zip', 'rb')        
        #response = HttpResponse(zip_file, content_type='application/zip')
        
        response = HttpResponse(open(mainBuild+'.zip', 'rb').read(), content_type='application/binary')
        #response['Content-Disposition'] = 'attachment; filename="%s"' % str(hash)+'.zip'
        response['Content-Disposition'] = 'attachment; filename=takeatool.zip'
        
        shutil.rmtree(mainBuild, ignore_errors=False, onerror=None)
        #os.remove(mainBuild+'.zip')
        
        return response

        # serializer = GencoProyectosSerializer(project, many=True)
        # # return JsonResponse({'project':project})
        # return Response(serializer.data)


from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)
    view = context
    print view
    if response is not None:
        # response.data = {}
        errors = []
        for field, value in response.data.items():
            errors.append("{} : {}".format(field, " ".join(value)))
            print field

 
        response.data['errors'] = errors
        response.data['status'] = False
 
        #response.data['exception'] = str(exc)
 
    return response
    # view = context['view']
    # response = exception_handler(exc, context)
    # fields = view.get_serialzer().get_fields()
    # details = {}
    # for k, v in response.data['detail'].items():
    #     try:
    #         field = fields[k]
    #         label = getattr(field, 'label', '')
    #         if label:
    #             detail[label] = v
    #         else:
    #             detail[k] = v
    #     except KeyError:
    #         detail[k] = v

    # response.data['detail'] = detail
    # return response