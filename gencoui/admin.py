from django.contrib import admin
from django.utils import timezone
# Register your models here.
# from models import GencoConversionTipodato, GencoUsuarioGrupo, GencoProyectoPlantilla, GencoGrupo#, GencoUsuarios
from models import *
# class GencoLenguajesAdmin(admin.ModelAdmin):
# 	list_display = ('nombre_lenguaje', 'desc_lenguaje')
# 	search_fields = ['nombre_lenguaje']
#   #  fields = ['nombre_lenguaje', 'desc_lenguaje','genco_grupos_id_grupo']
# 	fieldsets = [
#         (None,               {'fields':['nombre_lenguaje', 'desc_lenguaje','genco_grupos_id_grupo']}),
#         ('Date information', {'fields': ['creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion'], 'classes': ['collapse']}),
#     ]    
    		
# admin.site.register(GencoLenguajes, GencoLenguajesAdmin)
# admin.site.register(GencoGrupos)

class GencoConversionTipodatoAdmin(admin.ModelAdmin):
	fieldsets = [
	(None, {'fields':['id_tipodato', 'id_tipodato_cnv',]}),
	('Bitacora',{'fields':['creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion',]}),]
	readonly_fields = ['creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion',]

	def save_model(self, request, obj, form, change):
		obj.creado_por = request.user
		obj.save()

# class GencoUsuariosAdmin(admin.ModelAdmin):
# 	fieldsets = [
# 	(None, {'fields':['usuario', 'password', 'nombre', 'apellido',]}),
# 	('Bitacora',{'fields':['creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion',]}),]
# 	readonly_fields = ['creado_por', 'fecha_creacion', 'modificado_por', 'fecha_modificacion',]

# 	def save_model(self, request, obj, form, change):
# 		if obj.creado_por is None or obj.creado_por == '':
# 			obj.creado_por = request.user.username
# 			obj.fecha_creacion = timezone.now()
# 		else:	
# 			obj.modificado_por = request.user.username
# 			obj.fecha_modificacion = timezone.now()	
# 			obj.save()		



# admin.site.register(GencoConversionTipodato, GencoConversionTipodatoAdmin)
# #admin.site.register(GencoUsuarios, GencoUsuariosAdmin)
# admin.site.register(GencoUsuarioGrupo)
# admin.site.register(GencoProyectoPlantilla)
# admin.site.register(GencoGrupo)


admin.site.register(AdminLenguajeProcesador)
admin.site.register(AdminOrigendatos)
# admin.site.register(AdminProyectoAlcance)
admin.site.register(GencoComponentes)
admin.site.register(GencoConversionTipodato)
admin.site.register(GencoDirectorios)
admin.site.register(GencoEntidad)
admin.site.register(GencoEntorno)
admin.site.register(GencoEntornoLenguajes)
admin.site.register(GencoGrupo)
admin.site.register(GencoLenguajes)
admin.site.register(GencoParametros)
admin.site.register(GencoPlantillas)
admin.site.register(GencoProyectos)
admin.site.register(GencoTipodato)
admin.site.register(GencoUsuarioGrupo)
