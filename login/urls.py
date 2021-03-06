from django.conf.urls import patterns, include, url
from login.views import *
from django.contrib.auth import views as auth_views
 
urlpatterns = patterns('',
    #url(r'^$', 'django.contrib.auth.views.login'),
    #url(r'^logout/$', logout_page),
    #url(r'^accounts/login/$', 'django.contrib.auth.views.login'), # If user is not login it will redirect to login page
    url(r'^register/$', register),
    url(r'^register/success/$', register_success),
    url(r'^$', auth_views.login, name='login'),
    url(r'^logout/$', auth_views.logout, {'next_page': '/login'}, name='logout'),
    url(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',activate, name='activate'),
    url(r'^user/password/reset/$', auth_views.password_reset, {'post_reset_redirect' : '/login/user/password/reset/done/'}, name='password_reset'),
    (r'^user/password/reset/done/$', auth_views.password_reset_done),
    url(r'^user/password/reset/(?P<uidb64>[0-9A-Za-z]+)/(?P<token>.+)/$', auth_views.password_reset_confirm, {'post_reset_redirect':'/login/user/password/done/'}, name="password_reset_confirm"),
    (r'^user/password/done/$', auth_views.password_reset_complete),
    #url(r'^home/$', home),
)