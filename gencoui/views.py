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

from django.shortcuts import get_object_or_404

from genco_utils import *


from rest_framework.exceptions import APIException


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
    serializer_class = GencoProyectosSerializer

    def get_queryset(self):
        return GencoProyectos.objects.filter(creado_por=self.request.user.id)
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

    def perform_update(self, serializer):
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        obj = get_object_or_404(self.get_queryset(), id_proyecto=instance.id_proyecto)
        instance.delete()
            
    # def list(self, request):
    #     queryset = self.get_queryset()
    #     serializer = GencoProyectosSerializer(queryset, many=True)
    #     return Response(serializer.data)


class GencoEntornoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    serializer_class = GencoEntornoSerializer

    def get_queryset(self):
        return GencoEntorno.objects.filter(creado_por=self.request.user.id)
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

    def perform_update(self, serializer):
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        obj = get_object_or_404(self.get_queryset(), id_entorno=instance.id_entorno)
        instance.delete()
            
    # def list(self, request):
    #     queryset = self.get_queryset()
    #     serializer = GencoEntornoSerializer(queryset, many=True)
    #     return Response(serializer.data)


class GencoDirectoriosViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    serializer_class = GencoDirectoriosSerializer

    def get_queryset(self):
        return GencoDirectorios.objects.filter(creado_por=self.request.user.id)
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

    def perform_update(self, serializer):
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        obj = get_object_or_404(self.get_queryset(), id_directorio=instance.id_directorio)

        refElements = '';
        for i  in obj:
            refElements += '<br>' + ('Template ' + i.id_plantilla.nombre if i.id_plantilla else '') + '' + ('File ' + i.id_archivo.nombre if i.id_archivo else '')

        if queryset.exists():
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
        return GencoArchivos.objects.filter(creado_por=self.request.user.id)
    
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
        return GencoDirectorioElementos.objects.filter(creado_por=self.request.user.id)
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

    def perform_update(self, serializer):
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
        return GencoLenguajes.objects.filter(creado_por=self.request.user.id, id_lenguaje__gt=1)
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

    def perform_update(self, serializer):
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        obj = get_object_or_404(self.get_queryset(), id_lenguaje=instance.id_lenguaje)

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
        return GencoTipodato.objects.filter(creado_por=self.request.user.id, )
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

    def perform_update(self, serializer):
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        obj = get_object_or_404(self.get_queryset(), id_tipodato=instance.id_tipodato)
        instance.delete()
            
    # def list(self, request):
    #     queryset = self.get_queryset()
    #     serializer = GencoTipodatoSerializer(queryset, many=True)
    #     return Response(serializer.data)        


class GencoEntornoLenguajesViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = GencoEntornoLenguajesFilter
    filter_fields = ('id_entorno')
    serializer_class = GencoEntornoLenguajesSerializer

    def get_queryset(self):
        return GencoEntornoLenguajes.objects.filter(creado_por=self.request.user.id)
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

    def perform_update(self, serializer):
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
        return GencoConversionTipodato.objects.filter(creado_por=self.request.user.id)
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

    def perform_update(self, serializer):
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        obj = get_object_or_404(self.get_queryset(), id_conversion=instance.id_conversion)
        instance.delete()
            
    # def list(self, request):
    #     queryset = self.get_queryset()
    #     serializer = GencoConversionTipodatoSerializer(queryset, many=True)
    #     return Response(serializer.data) 


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
        return GencoComponentes.objects.filter(creado_por=self.request.user.id)
    
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
        return GencoPlantillas.objects.filter(creado_por=self.request.user.id)
    
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
        return GencoRepositorio.objects.filter(creado_por=self.request.user.id)
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

    def perform_update(self, serializer):
        serializer.save(modificado_por=self.request.user.id, fecha_modificacion=timezone.now())          
    
    def perform_destroy(self, instance):
        obj = get_object_or_404(self.get_queryset(), id_repositorio=instance.id_repositorio)
        obj = GencoEntidad.objects.filter(id_repositorio=instance.id_repositorio)
        refElements = '';
        for i  in obj:
            refElements += '<br>Entity <b>' + i.nombre + '</b>'

        if obj.exists():
            raise APIException('This Element is referenced by ' + refElements)

        instance.delete()
            
    # def list(self, request):
    #     queryset = self.get_queryset()
    #     serializer = GencoRepositorioSerializer(queryset, many=True)
    #     return Response(serializer.data)  


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
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now()) 

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
        list = getIterableFromTags(obj.tags)
        dict = updateDictTags(list,dict)
        serializer.validated_data['tags'] = json.dumps(dict);
        serializer.save(creado_por=self.request.user.id, fecha_creacion=timezone.now())

    def perform_update(self, serializer):
        dict = {}
        list = []
        obj = GencoPlantillas.objects.get(id_plantilla=serializer.validated_data['id_direlemento'].id_plantilla.id_plantilla)
        # cargamos la lista de tags de la entidad
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

    # switcher = {
    #     'env': 'gencoui/rndr_env.html',
    #     'builds': 'gencoui/rndr_builds.html',
    #     'entities': 'gencoui/rndr_entities.html'
    # }

    if id_module == 'env':
        context = {'form_add_env': GencoEntornoForm, 'user': request.user}
        return render(request,'gencoui/rndr_environments.html',context)
    elif id_module == 'editor':
        obj = get_object_or_404(GencoEntorno, creado_por=request.user.id, id_entorno=key_env)
        context = {'form_create_template': GencoPlantillasForm, 'form_create_component': GencoComponentesForm, 'user': request.user, 'key_module':key_env, 'entorno': obj, 'icon': obj.id_icono.upload}    
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
        env = get_object_or_404(GencoEntorno, creado_por=request.user.id, id_entorno=key_env)
        prj = get_object_or_404(GencoProyectos,id_proyecto=key_project)
        

        context = {'form_create_file': GencoArchivosForm, 'form_create_folder': GencoDirectoriosForm, 'form_element_entity': GencoElementoEntidadForm,
                    'user': request.user, 'key_module':key_env, 'entorno': env, 'proyecto': prj, 'icon': env.id_icono.upload}    
        return render(request,'gencoui/rndr_builds.html',context)            
    else:
        raise Http404
    # form = GencoEntornoForm()
    # context = {'form_add_env': GencoEntornoForm, 'user': request.user.username}
    # return render(request,switcher.get(id_module),context)



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
        print (request.data['editor'])
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
        # dic = {}
        # dic['UI/abm 636a3dbd-1d9e-8f78'] = 1 
        # dic['UI/abm e460864b-bb5b-96b8'] = 2
        # dic['DAL/dao e948b17d-68f4-658e'] = 3

        GencoPlantillas.objects.filter(id_plantilla=id_plantilla).update(tags=json.dumps(tags))
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

        # direccion = type('Direccion', (object,), 
        #          {'name':'1-90 street'})()

        # cliente = type('Client', (object,), 
        #          {'surname':'render', 'firstname':'generic', 'email':'@gamial', 'direccion':direccion})()



        # t.clients = [cliente,cliente,cliente,cliente,cliente]

        t.entities = getDataTest(2,4)
        
        try:
            context['fileContent'] = str(t);
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
    context = {'form_add_env': GencoEntornoForm, 'titulo': request.user.username, 'user': request.user}
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
        context = {'error':'none', 'fileContent':'none'}
        a = GencoDirectorioElementos
        e = a.objects.filter(id_directorio__id_proyecto=id_proyecto).order_by('id_directorio')
        gd = GencoDirectorios
        gdSet = gd.objects.filter(id_proyecto=id_proyecto).order_by('id_directorio')

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
        # if request.user.IsAuthenticated:
        #     print 'logueado'
        print 'usuario'
        print request.user.id
        langs = GencoLenguajes.objects.filter(creado_por=request.user.id, id_lenguaje__gt=1).order_by('id_lenguaje')
        tipodatos = GencoTipodato.objects.filter(creado_por=request.user.id).order_by('id_lenguaje')

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

        repo = GencoRepositorio.objects.filter(creado_por=request.user.id).order_by('id_repositorio')
        entity = GencoEntidad.objects.filter(creado_por=request.user.id).order_by('id_entidad')

        repos = []
        id_padre = ''

        for i  in repo:         
            repos.append({'id': i.id_repositorio, 'parent': '#', 'text': i.nombre, 'icon':"glyphicon glyphicon-folder-open", 'li_attr':{'data-renderas':"repository",'data-renderid': i.id_repositorio, 'data-rendername':i.nombre}})
       

        for i  in entity:          
            repos.append( {'id': 'entity'+str(i.id_entidad), 'parent': i.id_repositorio.id_repositorio, 'text': i.nombre + '<sub style="color:#CCCCCC"></sub>', 'icon':"glyphicon glyphicon-file", 'li_attr':{'data-renderas':"entity", 'data-renderid': i.id_entidad, 'data-rendername': i.nombre}}) 

        return JsonResponse({'dirs':repos})


class component_template_tree(APIView):
    
    def get(self, request, id_entorno=None):

        comp = GencoComponentes.objects.filter(id_entorno=id_entorno, creado_por=request.user.id).order_by('id_componente')
        template = GencoPlantillas.objects.filter(id_componente__id_entorno=id_entorno, creado_por=request.user.id).order_by('id_plantilla')

        comps = []
        id_padre = ''

        for i  in comp:         
            comps.append({'id': i.id_componente, 'parent': '#', 'text': i.nombre, 'icon':"glyphicon glyphicon-folder-open", 'li_attr':{'data-renderas':"component",'data-renderid': i.id_componente, 'data-rendername':i.nombre}})
       

        for i  in template:          
            comps.append( {'id': 'template'+str(i.id_plantilla), 'parent': i.id_componente.id_componente, 'text': i.nombre + '<sub style="color:#CCCCCC"></sub>', 'icon':"glyphicon glyphicon-file", 'li_attr':{'data-renderas':"template", 'data-renderid': i.id_plantilla, 'data-rendername': i.nombre}}) 

        return JsonResponse({'dirs':comps})     


class processors(APIView):
    
    def get(self, request):

        comp = AdminLenguajeProcesador.objects.filter(estado='ALTA').order_by('id_lenguajeprocesador')

        comps = []        
        for i  in comp:         
            comps.append({'id_lenguajeprocesador': i.id_lenguajeprocesador, 'nombre': i.nombre, 'descripcion': i.descripcion, 'version': i.version, 'id_icono': 'http://localhost:8000/media/' + str(i.id_icono.upload)})

        return JsonResponse({'processor':comps}) 


class getEntities(APIView):
    
    def get(self, request):

        entities = GencoEntidad.objects.filter(creado_por=request.user.id).order_by('id_entidad')

        comps = []        
        for i  in comp:         
            comps.append({'id_lenguajeprocesador': i.id_lenguajeprocesador, 'nombre': i.nombre, 'descripcion': i.descripcion, 'version': i.version, 'id_icono': 'http://localhost:8000/media/' + str(i.id_icono.upload)})

        return JsonResponse({'processor':comps})                


def getDataTest(tipo, id_lenguaje):
    
    a = []
    b = []
    f = []
    dict = {}
    counter=0
    # direccion = type('Direccion', (object,), 
                  # {'name':'1-90 street'})()

    # cliente = type('Client', (object,), 
    #              {'surname':'render', 'firstname':'generic', 'email':'@gamial', 'direccion':direccion})()
    
    types = GencoTipodato.objects.filter(id_lenguaje=7).order_by('id_tipodato')
    typesCnv = GencoConversionTipodato.objects.filter(id_tipodato__id_lenguaje=7, id_tipodato_cnv__id_lenguaje=4)
    
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
            field = type('field', (object,),{'name':'Field'+ str(counter), 'type':str(i.nombre), 'typecnv': '', 'prefixcnv': str(i.prefijo)})()    
        else:
            field = type('field', (object,),{'name':'Field'+ str(counter), 'type':str(i.nombre), 'typecnv': cnv.id_tipodato_cnv, 'prefixcnv': str(i.prefijo)})()
        
        f.append(field)

    if tipo==1:    
        a.append(type('entity', (object,),{'name': 'A', 'fields': f})())

    if tipo == 2:
        b.append(type('entity', (object,),{'name': 'B', 'fields': f})())
        f=[]
        counter=0
        for i  in types:
            counter = counter+1
            cnv = dict.get(i.id_tipodato)

            if cnv==None:
                field = type('field', (object,),{'name':'Field'+ str(counter), 'type':str(i.nombre), 'typecnv': '', 'prefixcnv': str(i.prefijo)})()    
            else:
                field = type('field', (object,),{'name':'Field'+ str(counter), 'type':str(i.nombre), 'typecnv': cnv.id_tipodato_cnv, 'prefixcnv': str(i.prefijo)})()
            
            f.append(field)

        a.append(type('main', (object,),{'name': 'A', 'fields': f, 'links': b})())

    

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
            langs = GencoLenguajes.objects.extra(tables=('auth_user',),where=('genco_lenguajes.creado_por=auth_user.id',),select={'user':'username'}).filter(id_lenguaje__gt=1).exclude(creado_por=request.user.id)
        else:   
            langs = GencoLenguajes.objects.extra(tables=('auth_user',),where=('genco_lenguajes.creado_por=auth_user.id',),select={'user':'username'}).filter(nombre__icontains=keysearch, id_lenguaje__gt=1).exclude(creado_por=request.user.id)


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
        typeorigin=0     
        # my_util = MY_UTIL()

        context = {'status':'' ,'error':'', 'response':''}
        langsclone = request.data['langs']
        print langsclone
       
        if langsclone: 
            langsItr = getIterableFromTags(langsclone)
        #     print str(langsItr)
        #     for item in langsItr:
        #       print item
    
        print langsItr
        # try:
        #     ret = my_util.exeCloneProc(langsItr, request.user.id)
        #     context['response'] += 'Languages was cloned.\n'
        #     context['status'] = 1
        # except Exception as e:
        #     context['error'] += 'Languages was not cloned. Please contact support :( \n'
        #     context['status'] = 0
        #     print str(e)
        

        langs = GencoLenguajes.objects.filter(id_lenguaje__in=langsItr, id_lenguaje__gt=1)

        for lang in langs:
            cloneIdlang = lang.id_lenguaje
            lang.pk = None
            lang.creado_por = request.user.id
            lang.creado_el = timezone.now()
            lang.modificado_por = None
            lang.fecha_modificacion = None
            print lang.id_lenguaje
            try:
                lang.save()
                print lang.id_lenguaje
                datatypes = GencoTipodato.objects.filter(id_lenguaje=cloneIdlang)
                for datatype in datatypes:
                    typeorigin = datatype
                    print datatype.id_tipodato
                    datatype.pk = None
                    datatype.id_lenguaje = lang
                    datatype.creado_por = request.user.id
                    datatype.creado_el = timezone.now()
                    datatype.modificado_por = None
                    datatype.fecha_modificacion = None
                    try:
                        datatype.save()
                        dataconversions = GencoConversionTipodato.objects.filter(id_tipodato_cnv=typeorigin.id_tipodato)
                        for dataconversion in dataconversions:
                        #     print dataconversion.id_conversion
                            dataconversion.pk = None
                            #dataconversion.id_tipodato = datatype.id_tipodato
                            #la conversion debe ser hacia el nuevo id que creamos
                            dataconversion.id_tipodato_cnv = dataconversion.id_tipodato
                            dataconversion.creado_por = request.user.id
                            dataconversion.creado_el = now()
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



class GencoDatatype(APIView):

    def get(self, request):
        
        tipos = GencoTipodato.objects.filter(id_lenguaje=1)
        serializer = GencoTipodatoSerializer(tipos, many=True)

        return Response(serializer.data)
