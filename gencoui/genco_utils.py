import re
import ast


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


def ValuesQuerySetToDict(vqs):
    return [item for item in vqs]

dic = {}

dic['UI/abm 636a3dbd-1d9e-8f78'] = 1 
dic['UI/abm e460864b-bb5b-96b8'] = 2
dic['DAL/dao e948b17d-68f4-658e'] = 3

# lista = getIterableFromTags("[u'UI/abm 636a3dbd-1d9e-8f78', u'UI/abm e460864b-bb5b-96b8']")
# print updateDictTags(lista, dic)


print getIterableFromTags('{"DAL/dao 1-f8855815-1381-2b03":"1", "DAL/dao 1-936091e3-aa77-7566":"1", "UI/abm 2-40cc9bc4-b9de-be66":"2"}')

for key, value in dic.items():
	print "llave %s  valor %s" % (key, value)


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
