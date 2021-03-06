from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns, static, settings


urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'genco.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
	#url(r'^time/$', current_datetime),
    #url(r'^admin/', include(admin.site.urls)),  
     #(r'^', include('app.urls')),  
    url(r'^gencoui/', include('gencoui.urls',namespace="gencoui")),
    url(r'^login/', include('login.urls',namespace="login")),
    #url(r'^login/$', auth_views.login, name='login'),
    #url(r'^logout/$', auth_views.logout, {'next_page': '/login'}, name='logout'),
    #url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)