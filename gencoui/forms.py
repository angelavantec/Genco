
from django.forms import ModelForm
from django import forms
from django.views.generic.edit import CreateView
from models import *

class GencoGrupoForm(ModelForm):
    class Meta:
        model = GencoGrupo
        fields = ['nombre',]

    def __init__(self, *args, **kwargs):
	    super(GencoGrupoForm, self).__init__(*args, **kwargs)
	    for field in self.fields:
	        self.fields[field].widget.attrs.update({'class': 'form-control', 'ng-model': ''.join([self._meta.model.__name__ ,'.' ,field])})
	        print self._meta.model


class GencoLenguajesForm(ModelForm):
    class Meta:
        model = GencoLenguajes
        exclude = ['id','creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion']
    
    def __init__(self, *args, **kwargs):    
        genco_init(GencoLenguajesForm, self, *args, **kwargs)


class GencoTipodatoForm(ModelForm):
    class Meta:
        model = GencoTipodato
        exclude = ['id', 'id_lenguaje','creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion']

    def __init__(self, *args, **kwargs):    
        genco_init(GencoTipodatoForm, self, *args, **kwargs)


class GencoEntornoForm(ModelForm):
	class Meta:
		model = GencoEntorno
		exclude = [ 'creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion']

	def __init__(self, *args, **kwargs):
		super(GencoEntornoForm, self).__init__(*args, **kwargs)
		for field in self.fields:
			self.fields[field].widget.attrs.update({'class': 'form-control', 'ng-model': ''.join([self._meta.model.__name__ ,'.' ,field])})


class GencoComponentesForm(ModelForm):
    class Meta:
        model = GencoComponentes
        fields = ['nombre','descripcion']
        # exclude = [ 'creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion']

    def __init__(self, *args, **kwargs):
        super(GencoComponentesForm, self).__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].widget.attrs.update({'class': 'form-control', 'ng-model': ''.join([self._meta.model.__name__ ,'.' ,field])})            


class GencoPlantillasForm(ModelForm):
    class Meta:
        model = GencoPlantillas
        exclude = ['id_plantilla', 'id_componente','archivo', 'id_lenguaje','creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion']

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
