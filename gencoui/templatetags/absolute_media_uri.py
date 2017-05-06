from django.template import Library
import re
from django.core.urlresolvers import reverse

register = Library()

'''
Usage: {{ media|absolute_media_url:request }}
'''

def absolute_media_uri(media, request):
    return request.build_absolute_uri(reverse('media', args=[unicode(media)]))

register.filter(absolute_media_uri)