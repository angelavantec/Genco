import re



def getTagsTemplate(text, token):
	regex = ur"\[@"+token+"\] (.+?) \["+token+"@\]+?"
	tags = re.findall(regex, text)
	print(tags)


getTagsTemplate("President [@binder] Barack Obama [binder@] met Microsoft founder [@binder] abmjava 5a0c1d5a-5c64-d14e [binder@], yesterday.","binder")