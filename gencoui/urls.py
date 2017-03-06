from django.conf.urls import patterns, include, url
from django.contrib import admin
from rest_framework.authtoken import views

from gencoui.views import * #current_datetime, index, details, archiveData, login, crudGencoGrupos, GencoGrupoCreate, GencoLenguajesCreate#, author_list_plaintext

router = routers.DefaultRouter()
router.register(r'groups', GencoGrupoViewSet, base_name="groups")
router.register(r'langs', GencoLenguajesViewSet, base_name="langs")
router.register(r'projects', GencoProyectosViewSet, base_name="projects")
router.register(r'entornos', GencoEntornoViewSet, base_name="entornos")
router.register(r'envlangs', GencoEntornoLenguajesViewSet, base_name="envlangs")
router.register(r'directorio', GencoDirectoriosViewSet, base_name="directorio")
router.register(r'archivo', GencoArchivosViewSet, base_name="archivo")
router.register(r'directorioelemento', GencoDirectorioElementosViewSet, base_name="directorioelemento")
router.register(r'tipodatos', GencoTipodatoViewSet, base_name="tipodatos")
router.register(r'conversiontipodatos', GencoConversionTipodatoViewSet, base_name="conversiontipodatos")
router.register(r'componentes', GencoComponentesViewSet, base_name="componentes")
router.register(r'plantillas', GencoPlantillasViewSet, base_name="plantillas")
router.register(r'repositorio', GencoRepositorioViewSet, base_name="repositorio")
router.register(r'entidad', GencoEntidadViewSet, base_name="entidad")
router.register(r'entidaddef', GencoEntidadDefinicionViewSet, base_name="entidaddef")
router.register(r'plantillaentidad', GencoPlantillaEntidadViewSet, base_name="plantillaentidad")
# router.register(r'archivo', AdminArchivoPlantillaViewSet)

urlpatterns = patterns('',	
	url(r'^$', index, name='index'),
	url(r'^module/(?P<id_module>\w+)$', get_module),
	url(r'^module/(?P<id_module>\w+)/(?P<key_env>\w+)/$', get_module),
	url(r'^module/(?P<id_module>\w+)/(?P<key_env>\w+)/(?P<key_project>\w+)/$', get_module),
	url(r'^', include(router.urls)),
	# url(r'^file/$', author_list_plaintext),
	#url(r'^gencoui/index.html', None),
	#url(r'^admin/', include(admin.site.urls)),
	url(r'^groupsg/$',GencoGrupoListView.as_view(template_name="gencoui/rndr_form_generic.html"), name="group-list"),
	url(r'^form/(?P<id_form>\d+)$', get_form),
	url(r'^create/(?P<id_template>\d+)$', tmpl),
	# url(r'^langs/$',GencoLenguajesCreate.as_view()),	
	#url(r'^gencogrupo-detail/(?P<pk>[0-9]+)/$',gencogrupo_detail, name="gencogrupo-detail"),
	#url(r'^gencogrupo_detail/$',index),
	#url('^', include('django.contrib.auth.urls')),	
	url(r'^api-token-auth/', views.obtain_auth_token),
	# url(r'^tmpl/(?P<id_plantilla>\d+)$', tmpl, name='tmpl'),
	url(r'^tmpl/(?P<id_plantilla>\d+)$', tmpl.as_view()),
	url(r'^tmpl_preview/(?P<id_plantilla>\d+)$', tmpl_preview.as_view()),
	url(r'^tree/(?P<id_proyecto>\d+)$', dir_template_tree.as_view()),
	url(r'^dir_item_tree/(?P<id_direlemento>\d+)/(?P<id_repositorio>\d+)$', dir_elemento_entidad_tree.as_view()),
	# url(r'^template_entity/(?P<id_proyecto>\d+)$', template_entity.as_view()),
)