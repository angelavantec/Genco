from django.conf.urls import patterns, include, url
from django.contrib import admin
from rest_framework.authtoken import views

from gencoui.views import * #current_datetime, index, details, archiveData, login, crudGencoGrupos, GencoGrupoCreate, GencoLenguajesCreate#, author_list_plaintext

router = routers.DefaultRouter()
router.register(r'groups', GencoGrupoViewSet)
router.register(r'langs', GencoLenguajesViewSet)
router.register(r'projects', GencoProyectosViewSet)
router.register(r'entornos', GencoEntornoViewSet)
router.register(r'envlangs', GencoEntornoLenguajesViewSet)
router.register(r'directorio', GencoDirectoriosViewSet)
router.register(r'archivo', GencoArchivosViewSet)
router.register(r'directorioelemento', GencoDirectorioElementosViewSet)
router.register(r'tipodatos', GencoTipodatoViewSet)
router.register(r'conversiontipodatos', GencoConversionTipodatoViewSet)
router.register(r'componentes', GencoComponentesViewSet)
router.register(r'plantillas', GencoPlantillasViewSet)
router.register(r'repositorio', GencoRepositorioViewSet)
router.register(r'entidad', GencoEntidadViewSet)
router.register(r'entidaddef', GencoEntidadDefinicionViewSet)
# router.register(r'archivo', AdminArchivoPlantillaViewSet)

urlpatterns = patterns('',	
	url(r'^$', index, name='index'),
	url(r'^module/(?P<id_module>\w+)$', get_module),
	url(r'^module/(?P<id_module>\w+)/(?P<key_module>\w+)/$', get_module),
	url(r'^module/(?P<id_module>\w+)/(?P<key_module>\w+)/(?P<key_project>\w+)/$', get_module),
	url(r'^code/$', archiveData),
	url(r'^', include(router.urls)),
	# url(r'^file/$', author_list_plaintext),
	#url(r'^gencoui/index.html', None),
	#url(r'^admin/', include(admin.site.urls)),
	url(r'^login/$', login),
	url(r'^p/(?P<id_grupo>\d+)$', details),
	url(r'^groupsg/$',GencoGrupoListView.as_view(template_name="gencoui/rndr_form_generic.html"), name="group-list"),
	url(r'^form/(?P<id_form>\d+)$', get_form),
	url(r'^create/(?P<id_template>\d+)$', tmpl),
	url(r'^groups/add$',GencoGrupoCreate.as_view(template_name="gencoui/gencogrupo_form.html"), name="group-add"),	
	# url(r'^langs/$',GencoLenguajesCreate.as_view()),	
	#url(r'^gencogrupo-detail/(?P<pk>[0-9]+)/$',gencogrupo_detail, name="gencogrupo-detail"),
	#url(r'^gencogrupo_detail/$',index),
	url('^', include('django.contrib.auth.urls')),	
	url(r'^api-token-auth/', views.obtain_auth_token),
	# url(r'^tmpl/(?P<id_plantilla>\d+)$', tmpl, name='tmpl'),
	url(r'^tmpl/(?P<id_plantilla>\d+)$', tmpl.as_view()),
	url(r'^tmpl_preview/(?P<id_plantilla>\d+)$', tmpl_preview.as_view()),
	url(r'^tree/(?P<id_proyecto>\d+)$', dir_template_tree.as_view()),
)