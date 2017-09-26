from login.forms import *
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout, login, authenticate
from django.views.decorators.csrf import csrf_protect
from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect
from django.template import RequestContext
from gencoui.models import GencoGrupo, AdminGrupoAlcance, GencoProyectos, GencoUsuarioGrupo
from django.utils import timezone


from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from .tokens import account_activation_token
from django.contrib.auth.models import User
from django.core.mail import EmailMessage


@csrf_protect
def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = User.objects.create_user(
            username=form.cleaned_data['username'],
            password=form.cleaned_data['password1'],
            email=form.cleaned_data['email'],
            is_active=False
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

            current_site = get_current_site(request)
            subject = 'Activate your getbeta account.'
            message = render_to_string('registration/acc_active_email.html', {
                'user':user, 'domain':current_site.domain,
                'protocol':request.is_secure() and 'https' or 'http',
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
            })
            # user.email_user(subject, message)
            toemail = form.cleaned_data.get('email')
            email = EmailMessage(subject, message, to=[toemail])
            try:
                email.send()
            except:
                render_to_response('registration/email_error.html',)
            return render_to_response('registration/confirm.html',)

            # return HttpResponseRedirect('/gencoui/')
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


def activate(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        # user = authenticate(username=user.username, password=user.password)
        # loggeduser = authenticate(remote_user=user.username) 
        # print loggeduser
        # login(request, loggeduser)
        # return redirect('home')
        return HttpResponseRedirect('/login/')
        # return HttpResponse('Thank you for your email confirmation. Now you can login your account.')
    else:
        return render_to_response('registration/activation_link_error.html',) 