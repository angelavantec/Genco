"""
Django settings for genco project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'p+)=!ot84uzdqc-h2v9ac)4=)j-qt$=g@dwbx^g#g!gc7_a4_$'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'gencoui',
    'rest_framework',
    'corsheaders',
    'login',
    'widget_tweaks',
    'rest_framework.authtoken',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    # 'django.contrib.auth.middleware.RemoteUserMiddleware',    
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
)

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        # 'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_FILTER_BACKENDS': ('rest_framework.filters.DjangoFilterBackend',),
    'DEFAULT_PERMISSION_CLASSES': (
        #'rest_framework.permissions.IsAdminUser',
        'rest_framework.permissions.IsAuthenticated',
        # 'rest_framework.permissions.AllowAny',
    ),
    # 'DEFAULT_RENDERER_CLASSES': (
    #     'rest_framework.renderers.JSONRenderer',
    # ),
    #'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    #'PAGE_SIZE': 1
}

# REST_FRAMEWORK = {
# 'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAdminUser',),
# 'PAGINATE_BY': 10
# }

ROOT_URLCONF = 'genco.urls'

WSGI_APPLICATION = 'genco.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases

DATABASES = {
    'default': {
       'ENGINE': 'django.db.backends.mysql',
       'NAME': 'snippet',
       'USER': 'root',
       'PASSWORD': 'root',
       'HOST': '127.0.0.1',
       'PORT': '3306',
   }
   # 'default': {
   #      'ENGINE': 'django.db.backends.postgresql',
   #      'NAME': 'snippet',
   #      'USER': 'postgres',
   #      'PASSWORD': 'avantec09',
   #      'HOST': '127.0.0.1',
   #      'PORT': '5432',
   #  }
}

TEMPLATES = [
  {
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.i18n',
            ],
        },
  },
]

TEMPLATE_DIRS = (os.path.join(BASE_DIR, 'templates'),)

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/
from django.utils.translation import ugettext_lazy as _
LANGUAGES = (
    ('en', _('English')),
    ('es', _('Spanish')),
)

LANGUAGE_CODE = 'en-us'

LOCALE_PATHS = (
    os.path.join(BASE_DIR, 'locale'),
)

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)

LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = '/gencoui'
LOGOUT_REDIRECT_URL = '/login'

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_WHITELIST = (
        'http://127.0.0.1:8070',
        'http://localhost:9000',
        'http://localhost:8000'
    )

MEDIA_ROOT='C:/Users/Angel/GencoPy/genco'
MEDIA_URL='/media/'


EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'angel.avantec@gmail.com'
EMAIL_HOST_PASSWORD = 'arameo09'
EMAIL_PORT = 587