import re
import ast
from django.db import models
from django.db import connection
from models import AdminGrupoAccesos, GencoLenguajes, GencoEntorno, GencoGrupo
from itertools import chain
from django.utils import timezone


def getAccessFilters(id_grupo, id_tipo, user_id):
	#id_grupo = id del workspace
	ownAccess = None
	sharedAccess = None
	allAccess = []

	# if id_tipo == 'lang':
	# 	ownAccess = GencoLenguajes.objects.filter(creado_por=user_id)

	# 	for i in ownAccess.iterator():
	# 		allAccess.append(i.id_lenguaje)

	# elif id_tipo == 'env':
	# 	ownAccess = GencoEntorno.objects.filter(creado_por=user_id)

	# 	for i in ownAccess.iterator():
	# 		allAccess.append(i.id_entorno)
		
	sharedAccess = AdminGrupoAccesos.objects.filter(auth_user_id=user_id, id_grupo__id_grupo=id_grupo, id_tipo=id_tipo)

	for i in sharedAccess.iterator():
		allAccess.append(i.id_elemento)

	print user_id
	print 'Accesos !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1'
	print allAccess	
	return allAccess

def setAccessAuth(id_grupo, id_tipo, user_id, id_elemento):

	access = AdminGrupoAccesos.objects.create( 
	auth_user_id = user_id,
	id_grupo=GencoGrupo.objects.get(pk=id_grupo),
	id_elemento=id_elemento,
	id_tipo=id_tipo,
	creado_por = user_id,
	fecha_creacion=timezone.now()
	)

class MY_UTIL():
	
    def exeCloneProc(self, cloneLangs, user_id):
        cursor = connection.cursor()
        ret = cursor.callproc("cloneLangs", (cloneLangs, user_id))# calls PROCEDURE named LOG_MESSAGE which resides in MY_UTIL Package
        cursor.close()
        return ret


def getTagsTemplate(text, token):
	regex = ur"\[@"+token+" (.+?) "+token+"@\]+?"
	tags = re.findall(regex, text)
	return tags


# out = getTagsTemplate("President [@binder] Barack Obama [binder@] met Microsoft founder [@binder] abmjava 5a0c1d5a-5c64-d14e [binder@], [@ DAL/dao 506fd3c3-7b4a-4c8d @] yesterday.","")
# print out


def getIterableFromTags(text):
	Iterable = ast.literal_eval(text)
	return Iterable



def updateDictTags(list, dict):
	exists = None

	for item in list:
		exists = dict.get(item)
		if exists == None:
			# si el elemento no existe en el diccionario lo agregamos con un valor default -1 el cual no corresponde a ninguna entidad
			dict[item] = -1

	for key, value in dict.items():
		try:
			list.index(key)
		except ValueError:
			# si en el diccionario de origen no existe un item de la lista entonces se remueve del diccionario, esto es actualizar el diccionario 
			del dict[key]

	return dict		


def page_range(page, last, span=5):
    """Return a range of page numbers around page, containing span pages
    (if possible). Page numbers run from 1 to last.

    >>> list(page_range(2, 10))
    [1, 2, 3, 4, 5]
    >>> list(page_range(4, 10))
    [2, 3, 4, 5, 6]
    >>> list(page_range(9, 10))
    [6, 7, 8, 9, 10]

    """
    return range(max(min(page - (span - 1) // 2, last - span + 1), 1),
                 min(max(page + span // 2, span), last) + 1)





# dic = {}

# dic['UI/abm 636a3dbd-1d9e-8f78'] = 1 
# dic['UI/abm e460864b-bb5b-96b8'] = 2
# dic['DAL/dao e948b17d-68f4-658e'] = 3

# lista = getIterableFromTags("[u'UI/abm 636a3dbd-1d9e-8f78', u'UI/abm e460864b-bb5b-96b8']")
# print str(lista)
# print updateDictTags(lista, dic)


# print getIterableFromTags('{"DAL/dao 1-f8855815-1381-2b03":"1", "DAL/dao 1-936091e3-aa77-7566":"1", "UI/abm 2-40cc9bc4-b9de-be66":"2"}')

# for key, value in dic.items():
# 	print "llave %s  valor %s" % (key, value)


# print dic

# for key, value in dic.items():
	# print "llave %s  valor %s" % (key, value)
	# try:
	# 	lista.index(key)
	# except ValueError:	
	# 	del dic[key]

# print dic


# lista = getIterableFromTags("[u'UI/abm 636a3dbd-1d9e-8f78', u'UI/abm e460864b-bb5b-96b8', u'DAL/dao e948b17d-68f4-658e']")

# print updateDictTags(lista, dic)

#print dic.get('UI/abm e460864b-bb5b-96b8')
#print dic.get('UI/abm e460864b-bb5b-96b8 x')

# lista = getListTags("[u'UI/abm 636a3dbd-1d9e-8f78', u'UI/abm e460864b-bb5b-96b8', u'DAL/dao e948b17d-68f4-658e']")
# for item in lista:
# 	print item
