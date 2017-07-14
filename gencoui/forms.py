
from django.forms import ModelForm
from django import forms
from django.views.generic.edit import CreateView
from models import *
from django.utils.translation import ugettext_lazy as _

class GencoGrupoForm(ModelForm):
    class Meta:
        model = GencoGrupo
        fields = ['nombre',]
        labels = {'nombre': 'Name',}

    def __init__(self, *args, **kwargs):
	    super(GencoGrupoForm, self).__init__(*args, **kwargs)
	    for field in self.fields:
	        self.fields[field].widget.attrs.update({'class': 'form-control', 'ng-model': ''.join([self._meta.model.__name__ ,'.' ,field])})
	        print self._meta.model


class GencoLenguajesForm(ModelForm):
    class Meta:
        model = GencoLenguajes
        fields = ['nombre', 'descripcion', 'version', 'id_icono', 'extension']
        labels = {'nombre': 'Name','descripcion':'Description','id_icono':'Icon',}
    
    def __init__(self, *args, **kwargs):    
        genco_init(GencoLenguajesForm, self, *args, **kwargs)



class GencoProyectosForm(ModelForm):
    class Meta:
        model = GencoProyectos
        fields = ['nombre', 'descripcion']
        # exclude = ['creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion']
        labels = {'nombre': 'Name','descripcion':'Description'}
    
    def __init__(self, *args, **kwargs):    
        genco_init(GencoProyectosForm, self, *args, **kwargs)


class GencoTipodatoForm(ModelForm):
    class Meta:
        model = GencoTipodato
        fields = ['nombre', 'descripcion','contenedor','prefijo','longitud_maxima']
        # exclude = ['id', 'id_lenguaje','creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion']
        labels = {'nombre': 'Name','descripcion':'Description', 'contenedor':'Container','prefijo':'Prefix','longitud_maxima':'Max Length'}

    def __init__(self, *args, **kwargs):    
        genco_init(GencoTipodatoForm, self, *args, **kwargs)


class GencoEntornoForm(ModelForm):
    class Meta:
        model = GencoEntorno
        fields = ['nombre', 'descripcion','version']
        # exclude = ['id_icono', 'creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion', 'id_ws']
        labels = {'nombre': 'Name','descripcion':'Description'}

    def __init__(self, *args, **kwargs):
        genco_init(GencoEntornoForm, self, *args, **kwargs)
                
    # def __init__(self, *args, **kwargs):
    # 	super(GencoEntornoForm, self).__init__(*args, **kwargs)
    # 	for field in self.fields:
    # 		self.fields[field].widget.attrs.update({'class': 'form-control', 'ng-model': ''.join([self._meta.model.__name__ ,'.' ,field])})


class GencoComponentesForm(ModelForm):
    class Meta:
        model = GencoComponentes
        fields = ['nombre','descripcion']
        labels = {'nombre':'Name','descripcion':'Description'}

    def __init__(self, *args, **kwargs):
        genco_init(GencoComponentesForm, self, *args, **kwargs)
    # def __init__(self, *args, **kwargs):
    #     super(GencoComponentesForm, self).__init__(*args, **kwargs)
    #     for field in self.fields:
    #         self.fields[field].widget.attrs.update({'class': 'form-control', 'ng-model': ''.join([self._meta.model.__name__ ,'.' ,field])})            


class GencoPlantillasForm(ModelForm):
    class Meta:
        model = GencoPlantillas
        fields = ['nombre','descripcion']
        labels = {'nombre':'Name','descripcion':'Description'}
        # exclude = ['id_plantilla', 'id_componente','archivo', 'id_lenguaje','creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion']

    def __init__(self, *args, **kwargs):    
        genco_init(GencoPlantillasForm, self, *args, **kwargs)


class GencoEntidadForm(ModelForm):
    class Meta:
        model = GencoEntidad
        exclude = ['id_entidad', 'id_repositorio','url_repositorio','archivo_origen', 'creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion']

    def __init__(self, *args, **kwargs):    
        genco_init(GencoEntidadForm, self, *args, **kwargs)


class GencoEntidadDefinicionForm(ModelForm):
    es_pk = forms.BooleanField(required=True)
    obligatorio = forms.BooleanField(required=False)
    id_tipodato = forms.ModelChoiceField(queryset=GencoTipodato.objects.filter(id_lenguaje=1))

    class Meta:
        model = GencoEntidadDefinicion
        exclude = ['id_entidad','url_repositorio','archivo_origen', 'creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion']

    def __init__(self, *args, **kwargs):    
        super(GencoEntidadDefinicionForm, self).__init__(*args, **kwargs)
        for field in self.fields:
            if(field=='es_pk' or field=='obligatorio'):
                if (self.fields[field].required):
                    self.fields[field].widget.attrs.update({'required': 'required', 'ng-model': ''.join([self._meta.model.__name__ ,'.' ,field])})                    
                else:    
                    self.fields[field].widget.attrs.update({'class': '','ng-model': ''.join([self._meta.model.__name__ ,'.' ,field])})
            else:
                if (self.fields[field].required):
                    self.fields[field].widget.attrs.update({'required': 'required', 'class': 'form-control', 'ng-model': ''.join([self._meta.model.__name__ ,'.' ,field])})
                else:
                    self.fields[field].widget.attrs.update({'class': 'form-control', 'ng-model': ''.join([self._meta.model.__name__ ,'.' ,field])})    


class GencoEntidadDefinicionFormEdit(ModelForm):
    es_pk = forms.BooleanField(required=True)
    obligatorio = forms.BooleanField(required=False)

    class Meta:
        model = GencoEntidadDefinicion
        exclude = ['id_entidad','url_repositorio','archivo_origen', 'creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion']

    def __init__(self, *args, **kwargs):    
        super(GencoEntidadDefinicionFormEdit, self).__init__(*args, **kwargs)
        for field in self.fields:
            if(field=='es_pk' or field=='obligatorio'):
                if (self.fields[field].required):
                    self.fields[field].widget.attrs.update({'required': 'required', 'ng-model': ''.join([self._meta.model.__name__ ,'Edit.' ,field]), 'id': ''.join(['edit_' ,field])})                    
                else:    
                    self.fields[field].widget.attrs.update({'class': '','ng-model': ''.join([self._meta.model.__name__ ,'Edit.' ,field]), 'id': ''.join(['edit_' ,field])})
            else:
                if (self.fields[field].required):
                    self.fields[field].widget.attrs.update({'required': 'required', 'class': 'form-control', 'ng-model': ''.join([self._meta.model.__name__ ,'Edit.' ,field]), 'id': ''.join(['edit_' ,field])})
                else:
                    self.fields[field].widget.attrs.update({'class': 'form-control', 'ng-model': ''.join([self._meta.model.__name__ ,'Edit.' ,field]), 'id': ''.join(['edit_' ,field])}) 


class GencoRepositorioForm(ModelForm):
    class Meta:
        model = GencoRepositorio
        fields = ['nombre','descripcion']
        labels = {'nombre': 'Name','descripcion':'Description'}

    def __init__(self, *args, **kwargs):    
        genco_init(GencoRepositorioForm, self, *args, **kwargs)


class GencoDirectoriosForm(ModelForm):
    class Meta:
        model = GencoDirectorios
        exclude = ['id_proyecto', 'id_padre','creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion']

    def __init__(self, *args, **kwargs):    
        genco_init(GencoDirectoriosForm, self, *args, **kwargs)


class GencoArchivosForm(ModelForm):
    class Meta:
        model = GencoArchivos
        exclude = ['id_archivo', 'creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion']

    def __init__(self, *args, **kwargs):    
        genco_init(GencoArchivosForm, self, *args, **kwargs)

class GencoElementoEntidadForm(ModelForm):
    class Meta:
        model = GencoElementoEntidad
        exclude = ['id_elementoentidad', 'tags', 'creado_por', 'fecha_creacion']

    def __init__(self, *args, **kwargs):    
        genco_init(GencoElementoEntidadForm, self, *args, **kwargs)

def genco_init(mpodelform, self, *args, **kwargs):
	super(mpodelform, self).__init__(*args, **kwargs)
	for field in self.fields:
		self.fields[field].widget.attrs.update({'class': 'form-control', 'ng-model': ''.join([self._meta.model.__name__ ,'.' ,field])})
        # self.fields[field].required = True 

