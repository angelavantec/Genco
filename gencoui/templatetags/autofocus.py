from django.template import Library
import re

register = Library()

def autofocus(value, token):
	value.field.widget.attrs["autofocus"] = token
	return value

register.filter(autofocus)