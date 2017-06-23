from login.forms import *
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_protect
from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect
from django.template import RequestContext
from gencoui.models import GencoGrupo, AdminGrupoAlcance, GencoProyectos, GencoUsuarioGrupo
from django.utils import timezone


@csrf_protect
def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = User.objects.create_user(
            username=form.cleaned_data['username'],
            password=form.cleaned_data['password1'],
            email=form.cleaned_data['email']
            )
            workspace = GencoGrupo.objects.create(
            nombre=form.cleaned_data['username'] + 'WS',
            descripcion='Default Workspace',
            id_alcance=AdminGrupoAlcance.objects.get(pk=1),
            creado_por=user.pk,
            fecha_creacion=timezone.now()
            )
            access = GencoUsuarioGrupo.objects.create( 
            auth_user_id = user.pk,
            id_grupo=workspace,
            creado_por = user.pk,
            fecha_creacion=timezone.now()
            )
            return HttpResponseRedirect('/gencoui/')
    else:
        form = RegistrationForm()
    variables = RequestContext(request, {
    'form': form
    })
 
    return render_to_response(
    'registration/register.html',
    variables,
    )
 
def register_success(request):
    return render_to_response(
    'registration/success.html',
    )