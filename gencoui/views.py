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
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.core import serializers as renderSerializers
from models import *  #GencoLenguajes, GencoGrupo, GencoUsuarioGrupo, GencoProyectos, GencoEntorno, GencoDirectorios
from forms import *
from filters import *
from django.shortcuts import render, render_to_response
#from django.template.context_processors import csrf
from django.views.decorators.csrf import csrf_protect
from django.views.generic.edit import CreateView
import datetime
from django.utils import timezone
from django.forms.models import modelform_factory
from django.forms.models import model_to_dict
from serializers import * #GencoUsuarioGrupoSerializer, GencoGrupoSerializer, GencoLenguajesSerializer, GencoProyectosSerializer, GencoEntornoSerializer, GencoDirectoriosSerializer
from django.template import Context, loader

import difflib
from django.core.files import File


from Cheetah.Template import Template

from django.shortcuts import get_object_or_404

def current_datetime(request):
    now = datetime.datetime.now()
    html = "<html><body>It is now %s.</body></html>" % now
    return HttpResponse(html)




class GencoProyectosViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = GencoProyectos.objects.all()
    serializer_class = GencoProyectosSerializer
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.username, fecha_creacion=timezone.now())        
    
    def list(self, request):
        queryset = GencoProyectos.objects.filter(creado_por=request.user.username)
        serializer = GencoProyectosSerializer(queryset, many=True)
        return Response(serializer.data)


class GencoEntornoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = GencoEntorno.objects.all()
    serializer_class = GencoEntornoSerializer
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.username, fecha_creacion=timezone.now())        
    
    def list(self, request):
        queryset = GencoEntorno.objects.filter(creado_por=request.user.username)
        serializer = GencoEntornoSerializer(queryset, many=True)
        return Response(serializer.data)


class GencoDirectoriosViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = GencoDirectorios.objects.all()
    serializer_class = GencoDirectoriosSerializer
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.username, fecha_creacion=timezone.now())        
    
    def list(self, request):
        queryset = GencoDirectorios.objects.filter(creado_por=request.user.username)
        serializer = GencoDirectoriosSerializer(queryset, many=True)
        return Response(serializer.data)
 

class GencoArchivosViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = GencoArchivos.objects.all()
    serializer_class = GencoArchivosSerializer
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.username, fecha_creacion=timezone.now())        
    
    def list(self, request):
        queryset = GencoArchivos.objects.filter(creado_por=request.user.username)
        serializer = GencoArchivosSerializer(queryset, many=True)
        return Response(serializer.data)


class GencoDirectorioElementosViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = GencoDirectorioElementos.objects.all()
    serializer_class = GencoDirectorioElementosSerializer
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = GencoDirectorioElementosFilter
    filter_fields = ('id_directorio')
    
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.username, fecha_creacion=timezone.now())        
    
    def list(self, request):
        queryset = GencoDirectorioElementos.objects.filter(creado_por=request.user.username)
        serializer = GencoDirectorioElementosSerializer(queryset, many=True)
        return Response(serializer.data)


class GencoLenguajesViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = GencoLenguajes.objects.all()
    serializer_class = GencoLenguajesSerializer
    #authentication_classes = (TokenAuthentication, SessionAuthentication)  
    #permission_classes = (IsAuthenticated,)  
    #authentication_classes = (TokenAuthentication,)
    #def create(self, validated_data):
        #lang = GencoLenguajes(validated_data)
        #lang.creado_por = 'admin'
        #lang.fecha_creacion = timezone.now() 
        #return lang
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.username, fecha_creacion=timezone.now())        
    
    def list(self, request):
        queryset = GencoLenguajes.objects.filter(creado_por=request.user.username)
        serializer = GencoLenguajesSerializer(queryset, many=True)
        return Response(serializer.data)      


class GencoTipodatoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = GencoTipodato.objects.all()
    serializer_class = GencoTipodatoSerializer
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = GencoTipodatoFilter
    filter_fields = ('id_entorno')

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.username, fecha_creacion=timezone.now())        


class GencoEntornoLenguajesViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = GencoEntornoLenguajes.objects.all()
    serializer_class = GencoEntornoLenguajesSerializer
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = GencoEntornoLenguajesFilter
    filter_fields = ('id_entorno')

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.username, fecha_creacion=timezone.now())        
    
    # def list(self, request):
    #     queryset = GencoEntornoLenguajes.objects.filter(creado_por=request.user.username)
    #     serializer = GencoEntornoLenguajesSerializer(queryset, many=True)
    #     return Response(serializer.data) 


class GencoConversionTipodatoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = GencoConversionTipodato.objects.all()
    serializer_class = GencoConversionTipodatoSerializer
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = GencoConversionTipodatoFilter
    filter_fields = ('id_tipodato')

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.username, fecha_creacion=timezone.now())  


class GencoGrupoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = GencoGrupo.objects.all()
    serializer_class = GencoGrupoSerializer    
    #authentication_classes = (TokenAuthentication, SessionAuthentication)  
    #permission_classes = (IsAuthenticated,)  

    # def get_queryset(self):
    #     return self.request.user.accounts.filter(creado_por='angel')

    def list(self, request):
        queryset = GencoGrupo.objects.filter(creado_por=request.user.username)
        serializer = GencoGrupoSerializer(queryset, many=True)
        return Response(serializer.data)

# def author_list_plaintext(request):
# 	response = listView.object_list(
# 		request,
# 		queryset = GencoLenguajes.objects.all(),
# 		mimetype = text/plain,
# 		template_name = books/author_list.txt
# 	)
# 	response[Content-Disposition] = attachment; filename=authors.txt
# 	return response

class GencoComponentesViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = GencoComponentes.objects.all()
    serializer_class =GencoComponentesSerializer
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = GencoComponenteFilter
    filter_fields = ('id_entorno')

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.username, fecha_creacion=timezone.now())       


class GencoPlantillasViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = GencoPlantillas.objects.all()
    serializer_class = GencoPlantillasSerializer
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = GencoPlantillasFilter
    filter_fields = ('id_componente')

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.username, fecha_creacion=timezone.now())     


class GencoRepositorioViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = GencoRepositorio.objects.all()
    serializer_class = GencoRepositorioSerializer
    # filter_backends = (filters.DjangoFilterBackend,)    
    # filter_class = GencoRepositorioFilter
    # filter_fields = ('id_repositorio')

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.username, fecha_creacion=timezone.now())                         

    def list(self, request):
        queryset = GencoRepositorio.objects.filter(creado_por=request.user.username)
        serializer = GencoRepositorioSerializer(queryset, many=True)
        return Response(serializer.data)


class GencoEntidadViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = GencoEntidad.objects.all()
    serializer_class = GencoEntidadSerializer
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = GencoEntidadFilter
    # filter_fields = ('id_repo')

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.username, fecha_creacion=timezone.now())                         

    # def list(self, request):
    #     queryset = GencoEntidad.objects.filter(creado_por=request.user.username)
    #     serializer = GencoEntidadSerializer(queryset, many=True)
    #     return Response(serializer.data)        

class GencoEntidadDefinicionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = GencoEntidadDefinicion.objects.all()
    serializer_class = GencoEntidadDefinicionSerializer
    filter_backends = (filters.DjangoFilterBackend,)    
    filter_class = GencoEntidadDefinicionFilter
    # filter_fields = ('id_repositorio')

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user.username, fecha_creacion=timezone.now())                         

    # def list(self, request):
        # queryset = GencoEntidadDefinicion.objects.filter(creado_por=request.user.username)
        # serializer = GencoEntidadDefinicionSerializer(queryset, many=True)
        # return Response(serializer.data)

# class AdminArchivoPlantillaViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows users to be viewed or edited.
#     """
#     queryset = AdminArchivoPlantilla.objects.all()
#     serializer_class = AdminArchivoPlantillaSerializer


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


def get_module(request, id_module=None, key_env=None, key_project=None):

    # switcher = {
    #     'env': 'gencoui/rndr_env.html',
    #     'builds': 'gencoui/rndr_builds.html',
    #     'entities': 'gencoui/rndr_entities.html'
    # }

    if id_module == 'env':
        context = {'form_add_env': GencoEntornoForm, 'user': request.user.username}    
        return render(request,'gencoui/rndr_environments.html',context)
    elif id_module == 'editor':
        obj = get_object_or_404(GencoEntorno,id_entorno=key_env)
        context = {'form_create_template': GencoPlantillasForm, 'form_create_component': GencoComponentesForm, 'user': request.user.username, 'key_module':key_env, 'entorno': obj}    
        return render(request,'gencoui/rndr_editor.html',context)
    elif id_module == 'entities':
        context = {'form_add_repository': GencoRepositorioForm, 
                    'form_add_entity': GencoEntidadForm, 
                    'form_add_entitydef': GencoEntidadDefinicionForm,                     
                    'form_edit_entitydef': GencoEntidadDefinicionFormEdit,                     
                    'user': request.user.username}    
        return render(request,'gencoui/rndr_repository.html',context)        
    elif id_module == 'langs':
        context = {'form_add_lang': GencoLenguajesForm, 'form_add_type': GencoTipodatoForm,'user': request.user.username}    
        return render(request,'gencoui/rndr_langs.html',context)
    elif id_module == 'builds':
        env = get_object_or_404(GencoEntorno,id_entorno=key_env)
        prj = get_object_or_404(GencoProyectos,id_proyecto=key_project)
        context = {'form_create_file': GencoArchivosForm, 'form_create_folder': GencoDirectoriosForm, 'form_plantilla_entidad': GencoPlantillaEntidadForm, 'user': request.user.username, 'key_module':key_env, 'entorno': env, 'proyecto': prj}    
        return render(request,'gencoui/rndr_builds.html',context)            
    else:
        context = {'form_add_env': GencoEntornoForm, 'user': request.user.username}    
        return render(request,'gencoui/rndr_builds.html',context)
    # form = GencoEntornoForm()
    # context = {'form_add_env': GencoEntornoForm, 'user': request.user.username}
    # return render(request,switcher.get(id_module),context)



class tmpl(APIView):
    

    def get(self, request, id_plantilla=None):
        context = {'error':'', 'fileContent':'', 'templateName':''}
        print 'get'
        filename = os.path.join(id_plantilla)
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
        filename = os.path.join(id_plantilla)
        #     # a = ['a', 'b', 'c', 'd']
        #     # print filename
        #     # filename = filename.join(id_plantilla,'_rndr.tmpl'])
        #     # print id_plantilla
        #     # print filename
        writeFile(content, filename + '_rndr.tmpl', context)    
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
        print 'receibed'
        if request.POST.__contains__('editor'):
            lines2 = request.POST['editor']
            filename = os.path.join(id_plantilla)
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
        filename = os.path.join(id_plantilla)
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

        cliente = type('Client', (object,), 
                 {'surname':'render', 'firstname':'generic', 'email':'@gamial'})()

        t.clients = [cliente,cliente,cliente,cliente,cliente]     
        print t
        context['fileContent'] = str(t);

            # filename = os.path.join(id_plantilla)
            # print filename
            # writeFile(request.POST['editor'], filename + '_rndr.tmpl', context)

        return JsonResponse(context)   


def index(request):  
    #template = loader.get_template("gencoui/ng_menu.html")
    #return HttpResponse(template.render())  
    #return render_to_response('gencoui/desktop.html')
    #print os.path.dirname(os.path.dirname(__file__))
	#titulo = 'Generics'
	#link = 'Render'
    #data =  serializers.serialize('xml',GencoGrupo.objects.all())
    context = {'form_add_env': GencoEntornoForm, 'titulo': request.user.username, 'link': request.user.username}
    # return render(request, 'gencoui/rndr_main.html', context)    
    return render(request, 'gencoui/menu.html', context)    
    #return HttpResponse(serializers.serialize('json',GencoGrupo.objects.all()))



def details(request, id_grupo=None):
   return HttpResponse("It's working. %s" % id_grupo )

def login(request):
    return render(request, 'gencoui/login.html',context = {'titulo': request.user.username, 'link': request.user.username} )    

class GencoGrupoCreate(CreateView):
    model = GencoGrupo
    fields = ['nombre', 'descripcion']    

    def form_valid(self, form):
        print 'barrios' 
        save_log(self, self.request, form)   
        return HttpResponseRedirect(self.get_success_url())

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



class GencoLenguajesCreate(CreateView):
    model = GencoLenguajes
    fields = ['nombre', 'descripcion', 'id_grupo']

    def form_valid(self, form):
        save_log(self, request, form)        
        return HttpResponseRedirect(self.get_success_url())        

def save_log(self, request, form):
    self.object = form.save(commit=False)
    if self.object.creado_por is None or self.object.creado_por == '':
        self.object.creado_por = self.request.user.username
        self.object.fecha_creacion = timezone.now()
    else:   
        self.object.modificado_por = self.request.user.username
        self.object.fecha_modificacion = timezone.now() 
    self.object.save()
   

def crudGencoGrupos(request):
    # c = {}
    # c.update(csrf(request))
    GencoGruposFormSet = formset_factory(GencoGrupo, GencoGrupoForm)
    if request.method == "POST":
        formset = GencoGruposFormSet(request.POST)
        if formset.is_valid():
            formset.save()
            # Do something.
    else:
        #formset = GencoGruposFormSet(queryset=Bodega.objects.all())
        formset = GencoGruposFormSet()
    return render(request, "gencoui/crud.html", {"formset": formset,})
    #return render_to_response("gencoui/crud.html", c)

#@login_required(login_url='/admin/login/')
def archiveData(request):
	code = '''public class GencoDBtoXMLImpl implements GencoDBtoXML { 
	static Logger  logger = Logger.getLogger(GencoDBtoXMLImpl.class);)
	private SAXBuilder xconstructor = null;
	private Document xdoc;
	private Element xroot;
    private Hashtable<String, Cursor> htCursors    				= new Hashtable<String, Cursor>();
    private Hashtable<String, ResultSet> htResultset    		= new Hashtable<String, ResultSet>();
    private Hashtable<String, PreparedStatement> htStatement    = new Hashtable<String, PreparedStatement>();
    private String rootTagName 		= root;
    private String recordTagName 	= record;
    private String startParam       = <;
    private String endParam         = >;
    private boolean isSetParams;
    private ArrayList<String> listLogs = new ArrayList<String>();
    Properties prop = new Properties();
    
    public GencoDBtoXMLImpl(Hashtable<String, Cursor> htCursors){
     	this.htCursors = htCursors;	
    	
    }
    '''

        print request.user.username
        print request.user.id

	return HttpResponse(code)		

def logout(request):
    request.session.flush()
    return HttpResponseRedirect('/')    



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
    
    def put(self, request, id_proyecto=None):
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
                dirs.append( {'id': 't'+str(i.id_direlemento), 'parent': i.id_directorio_id, 'text': i.id_plantilla.nombre + '<sub style="color:#CCCCCC">'  + i.id_plantilla.id_lenguaje.nombre + '</sub>', 'icon':"glyphicon glyphicon-file", 'li_attr':{'data-renderas':"template", 'data-renderid': i.id_plantilla_id,'data-renderiddirtemplate': i.id_direlemento, 'data-rendername': i.id_plantilla.nombre}})
            else:
                dirs.append( {'id': 'f'+str(i.id_direlemento), 'parent': i.id_directorio_id, 'text': i.id_archivo.nombre + '<sub style="color:#CCCCCC">file</sub>', 'icon':"glyphicon glyphicon-file", 'li_attr':{'data-renderas':"file", 'data-renderid': i.id_archivo_id,'data-renderiddirtemplate': i.id_direlemento, 'data-rendername': i.id_archivo.nombre}})
        print dirs    

        return JsonResponse({'dirs':dirs}) 