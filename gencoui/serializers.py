from models import * #GencoUsuarioGrupo, GencoGrupo, GencoLenguajes, GencoProyectos, GencoEntorno, GencoDirectorios
from rest_framework import serializers
from django.utils import timezone
from django.core import serializers as renderSerializers
import json



class AdminAppIconosSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = AdminAppIconos
        read_only_fields = ('creado_por','fecha_creacion')   


class GencoUsuarioGrupoSerializer(serializers.ModelSerializer):
    #group_listing = serializers.HyperlinkedIdentityField(view_name='group-list')
    
    class Meta:        
        model = GencoUsuarioGrupo
        fields = ('id_usuariogrupo', 'id_grupo', 'user_id', )


# class GencoUsuarioSerializer(serializers.ModelSerializer):  
    
#     class Meta:        
#         model = GencoUsuarios
#         fields = ('id_usuario', )


class GencoGrupoSerializer(serializers.ModelSerializer):  
    #langs = serializers.StringRelatedField(many=True)
    class Meta:        
        model = GencoGrupo
        fields = ('id_grupo', 'nombre', 'creado_por','fecha_creacion','modificado_por','fecha_modificacion')
        read_only_fields = ('creado_por','fecha_creacion','modificado_por','fecha_modificacion',)
   
    # def create(self, validated_data):
    #     print 'creating object '
    #     lang = GencoGrupo(**validated_data)
    #     lang.creado_por = 'admin'
    #     lang.fecha_creacion = timezone.now()
    #     print 'created'
    #     return GencoGrupo.objects.create(creado_por='admin',fecha_creacion=timezone.now(), **validated_data)
        
    # def create(self, validated_data):
    #     print serializers.request.user.username
    #     return GencoGrupo.objects.create(creado_por='admin',fecha_creacion=timezone.now(), **validated_data)


class GencoLenguajesSerializer(serializers.ModelSerializer):  
    #groups = GencoGrupoSerializer(many=True, read_only=True)
    #groups = serializers.StringRelatedField(many=True)
    #group = GencoGrupoSerializer()
    icon= AdminAppIconosSerializer(many=False, source="id_icono", read_only=True)

    class Meta:        
        model = GencoLenguajes
        fields = ('id_lenguaje', 'nombre', 'descripcion', 'version', 'id_icono', 'icon','creado_por','fecha_creacion','modificado_por','fecha_modificacion')
        read_only_fields = ('id_lenguaje', 'creado_por','fecha_creacion','modificado_por','fecha_modificacion',)

    # def create(self, validated_data):
    # 	print 'creating object '
    #     lang = GencoLenguajes(**validated_data)
    #     lang.creado_por = 'admin'
    #     lang.fecha_creacion = timezone.now()
    #     print 'created'
    #     return lang
    # def create(self, validated_data):
    # 	print serializers.request.user.username
    # 	return GencoLenguajes.objects.create(creado_por='admin',fecha_creacion=timezone.now(), **validated_data)


# class PageSearchLangSerializer(serializers.Serializer):    
#     current = serializers.IntegerField()
#     next = serializers.IntegerField()
#     offset = serializers.IntegerField()
#     langs = SearchLangSerializer()

class SearchLangSerializer(serializers.Serializer):
    user = serializers.CharField(max_length=30)
    id_lenguaje = serializers.IntegerField()
    nombre = serializers.CharField(max_length=100)
    descripcion = serializers.CharField(max_length=100)
    id_icono = AdminAppIconosSerializer()


class GencoTipodatoSerializer(serializers.ModelSerializer):  
    #groups = GencoGrupoSerializer(many=True, read_only=True)
    # id_lenguaje = serializers.StringRelatedField(many=False)
    #group = GencoGrupoSerializer()
    # lang= GencoLenguajesSerializer(many=False, source="id_lenguaje", read_only=True)
    class Meta:        
        model = GencoTipodato
        fields = ('id_tipodato', 'nombre', 'descripcion', 'id_lenguaje', 'contenedor', 'prefijo', 'longitud_maxima')
        read_only_fields = ('id_tipodato', 'creado_por','fecha_creacion','modificado_por','fecha_modificacion',)


class GencoEntornoLenguajesSerializer(serializers.ModelSerializer):  
    # id_lenguaje = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    # id_lenguaje = serializers.StringRelatedField(many=False)
    # env = serializers.SerializerMethodField('get_entorno')
    lang= GencoLenguajesSerializer(many=False, source="id_lenguaje", read_only=True)
  
    class Meta:        
        model = GencoEntornoLenguajes
        fields = ('id_entorno', 'id_lenguaje', 'lang', 'id_entornolenguaje')
        read_only_fields = ('creado_por','fecha_creacion',)


class GencoConversionTipodatoSerializer(serializers.ModelSerializer):  
    # id_lenguaje = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    # id_lenguaje = serializers.StringRelatedField(many=False)
    # env = serializers.SerializerMethodField('get_entorno')
    tipo_origen= GencoTipodatoSerializer(many=False, source="id_tipodato", read_only=True)
    tipo_cnv= GencoTipodatoSerializer(many=False, source="id_tipodato_cnv", read_only=True)
  
    class Meta:        
        model = GencoConversionTipodato
        fields = ('id_tipodato', 'id_tipodato_cnv', 'id_conversion', 'tipo_origen', 'tipo_cnv')
        read_only_fields = ('creado_por','fecha_creacion',)

class GencoProyectosSerializer(serializers.ModelSerializer):

    class Meta:
        model = GencoProyectos
        read_only_fields = ('creado_por','fecha_creacion','modificado_por','fecha_modificacion',)      


class GencoEntornoSerializer(serializers.ModelSerializer):
    icon= AdminAppIconosSerializer(many=False, source="id_icono", read_only=True)

    class Meta:
        model = GencoEntorno
        read_only_fields = ('creado_por','fecha_creacion','modificado_por','fecha_modificacion',)      


class GencoComponentesSerializer(serializers.ModelSerializer):  

    class Meta:        
        model = GencoComponentes
        exclude = ('creado_por','fecha_creacion','modificado_por','fecha_modificacion')
        read_only_fields = ('id_componente', 'creado_por','fecha_creacion','modificado_por','fecha_modificacion',)


class AdminLenguajeProcesadorSerializer(serializers.ModelSerializer):  
    icon= AdminAppIconosSerializer(many=False, source="id_icono", read_only=True)

    class Meta:        
        model = AdminLenguajeProcesador
        exclude = ('creado_por','fecha_creacion','modificado_por','fecha_modificacion')
        read_only_fields = ('id_lenguajeprocesador', 'creado_por','fecha_creacion','modificado_por','fecha_modificacion',)


class GencoPlantillasSerializer(serializers.ModelSerializer):  
    lang= GencoLenguajesSerializer(many=False, source="id_lenguaje", read_only=True)
    proc= AdminLenguajeProcesadorSerializer(many=False, source="id_lenguajeprocesador", read_only=True)
    class Meta:        
        model = GencoPlantillas
        exclude = ('creado_por','fecha_creacion','modificado_por','fecha_modificacion', 'archivo')
        read_only_fields = ('id_plantilla', 'creado_por','fecha_creacion','modificado_por','fecha_modificacion',)

class GencoRepositorioSerializer(serializers.ModelSerializer):  
   
    class Meta:        
        model = GencoRepositorio
        fields = ('id_repositorio', 'nombre', 'descripcion')
        read_only_fields = ('id_repositorio', 'creado_por','fecha_creacion',)        


class GencoEntidadDefinicionRefSerializer(serializers.ModelSerializer):     

    class Meta:        
        model = GencoEntidadDefinicion
        # fields = ('id_entidad', 'id_repositorio', 'nombre', 'descripcion')
        exclude = ('creado_por','fecha_creacion','modificado_por','fecha_modificacion',)
        read_only_fields = ('id_entidad_ref','creado_por','fecha_creacion','modificado_por','fecha_modificacion',) 

class GencoEntidadSerializer(serializers.ModelSerializer):
   
    class Meta:        
        model = GencoEntidad
        # fields = ('id_entidad', 'id_repositorio', 'nombre', 'descripcion')
        exclude = ('creado_por','fecha_creacion','modificado_por','fecha_modificacion',)
        read_only_fields = ('id_entidad','creado_por','fecha_creacion','modificado_por','fecha_modificacion',)  

class GencoEntidadDefinicionSerializer(serializers.ModelSerializer):  
    entidad = GencoEntidadSerializer(many=False, source="entidad_ref", read_only=True)
    tipodato = GencoTipodatoSerializer(many=False, source="id_tipodato", read_only=True)
    # id_tipodato =  serializers.StringRelatedField(many=False)
    ref_pk = serializers.SerializerMethodField()

    def get_ref_pk(self, obj):
        print obj.entidad_ref
        array_pk = []

        if(obj.entidad_ref==None):
            return None
        else:    
            # data = GencoEntidadDefinicion.objects.get(id_entidad=obj.entidad_ref, es_pk='true')
            # data = GencoEntidadDefinicion.objects.all()
            data = GencoEntidadDefinicion.objects.prefetch_related('id_tipodato').filter(id_entidad=obj.entidad_ref, es_pk='true')
            # print data[0].nombre
            # print data[0].id_tipodato
            # from django.core import serializers            
            # serialized_obj = renderSerializers.serialize('json', [data,], fields=('nombre','id_tipodato'))
            # print serialized_obj.id_tipodato__nombre
            for item in data:
                array_pk.append({'nombre': item.nombre, 'tipodato': item.id_tipodato.nombre})
            return array_pk 
            # json.dumps(array_pk)
            
        
        # serialized_obj = renderSerializers.serialize('json', [data,], fields=('nombre','id_tipodato'))
        # print serialized_obj


    class Meta:        
        model = GencoEntidadDefinicion
        # fields = ('id_entidad', 'id_repositorio', 'nombre', 'descripcion')
        exclude = ('creado_por','fecha_creacion','modificado_por','fecha_modificacion',)
        read_only_fields = ('id_entidad_ref',)


class GencoDirectoriosSerializer(serializers.ModelSerializer):

    class Meta:
        model = GencoDirectorios
        read_only_fields = ('creado_por','fecha_creacion','modificado_por','fecha_modificacion',)     


class GencoDirectorioElementosSerializer(serializers.ModelSerializer):
    # id_dir= GencoDirectoriosSerializer(many=False, source='id_directorio', read_only=True)
    # id_tmpl= GencoPlantillasSerializer(many=False, source='id_plantillas', read_only=True)

    class Meta:
        model = GencoDirectorioElementos
        exclude = ('creado_por','fecha_creacion',) 
        read_only_fields = ('creado_por','fecha_creacion',) 


class GencoArchivosSerializer(serializers.ModelSerializer):

    class Meta:
        model = GencoArchivos
        read_only_fields = ('creado_por','fecha_creacion','modificado_por','fecha_modificacion',)   



class GencoElementoEntidadSerializer(serializers.ModelSerializer):
    # entidad = GencoEntidadSerializer(many=False, source="id_entidad", read_only=True)
    # plantilla = GencoEntidadSerializer(many=False, source="id_direlemento__id_plantilla", read_only=True)

    class Meta:
        model = GencoElementoEntidad
        read_only_fields = ('creado_por','fecha_creacion',) 

# class AdminArchivoPlantillaSerializer(serializers.ModelSerializer):  

#     class Meta:        
#         model = AdminArchivoPlantilla
#         exclude = ('modificado_por','fecha_modificacion')
#         read_only_fields = ('modificado_por','fecha_modificacion',)        