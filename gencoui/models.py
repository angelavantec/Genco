# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from __future__ import unicode_literals

from django.db import models


class AdminAppIconos(models.Model):
    id_icono = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    tipo = models.CharField(max_length=45)
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()    
    upload = models.FileField(upload_to='icons')

    class Meta:
        managed = False        
        db_table = 'admin_app_iconos'
        
class AdminGrupoAccesos(models.Model):
    id_grupoaccesos = models.AutoField(primary_key=True)
    auth_user_id = models.IntegerField()
    id_grupo = models.ForeignKey('GencoGrupo', models.DO_NOTHING, db_column='id_grupo')
    id_elemento = models.IntegerField()
    id_tipo = models.CharField(max_length=10)
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()  

    class Meta:
        managed = False
        db_table = 'admin_grupo_accesos'

class AdminLenguajeProcesador(models.Model):
    id_lenguajeprocesador = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=200, blank=True, null=True)
    version = models.IntegerField()
    componente_binario = models.CharField(max_length=200)
    id_icono = models.ForeignKey(AdminAppIconos, models.DO_NOTHING, db_column='id_icono')
    estado = models.CharField(max_length=15)
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()
    modificado_por = models.IntegerField()
    fecha_modificacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'admin_lenguaje_procesador'

    def __unicode__(self):
        return '%s %i' % (self.nombre, self.version )         


class AdminOrigendatos(models.Model):
    id_origendatos = models.AutoField(primary_key=True)
    nombre = models.CharField(unique=True, max_length=100)
    descripcion = models.CharField(max_length=100, blank=True, null=True)
    tipo_conexion = models.CharField(max_length=10)
    url_jdbc = models.CharField(max_length=200, blank=True, null=True)
    usuario_jdbc = models.CharField(max_length=30, blank=True, null=True)
    clave_jdbc = models.CharField(max_length=30, blank=True, null=True)
    nombre_jndi = models.CharField(max_length=30, blank=True, null=True)
    hora_sistema = models.CharField(max_length=30, blank=True, null=True)
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()
    modificado_por = models.IntegerField()
    fecha_modificacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'admin_origendatos'


class AdminGrupoAlcance(models.Model):
    id_alcance = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=100, blank=True, null=True)
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()
    modificado_por = models.IntegerField()
    fecha_modificacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'admin_grupo_alcance'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=80)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=30)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class GencoArchivos(models.Model):
    id_archivo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=150, blank=True, null=True)
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()
    upload = models.FileField(upload_to='user_templates')

    class Meta:
        managed = False
        db_table = 'genco_archivos'


class GencoComponentes(models.Model):
    id_componente = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=200, blank=True, null=True)
    id_entorno = models.ForeignKey('GencoEntorno', models.DO_NOTHING, db_column='id_entorno')
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()
    modificado_por = models.IntegerField()
    fecha_modificacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'genco_componentes'


class GencoConversionTipodato(models.Model):
    id_conversion = models.AutoField(primary_key=True)
    id_tipodato = models.ForeignKey('GencoTipodato', models.DO_NOTHING, db_column='id_tipodato', related_name='tipodato_origen')
    id_tipodato_cnv = models.ForeignKey('GencoTipodato', models.DO_NOTHING, db_column='id_tipodato_cnv', related_name='tipodato_cnv')
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()
    modificado_por = models.IntegerField()
    fecha_modificacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'genco_conversion_tipodato'
        unique_together = (('id_tipodato', 'id_tipodato_cnv'),)


class GencoDirectorioElementos(models.Model):
    id_direlemento = models.AutoField(primary_key=True)
    id_directorio = models.ForeignKey('GencoDirectorios', models.DO_NOTHING, db_column='id_directorio')
    id_plantilla = models.ForeignKey('GencoPlantillas', models.DO_NOTHING, db_column='id_plantilla', blank=True, null=True)
    id_archivo = models.ForeignKey(GencoArchivos, models.DO_NOTHING, db_column='id_archivo', blank=True, null=True)
    entidades_en_lista = models.IntegerField(blank=True, null=True)
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()
    id_ws = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'genco_directorio_elementos'

    def __unicode__(self):
        return '%s' % (self.id_direlemento)    

class GencoDirectorios(models.Model):
    id_directorio = models.AutoField(primary_key=True)
    id_proyecto = models.ForeignKey('GencoProyectos', models.DO_NOTHING, db_column='id_proyecto')
    id_padre = models.ForeignKey('self', models.DO_NOTHING, db_column='id_padre', blank=True, null=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=200, blank=True, null=True)
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()
    modificado_por = models.IntegerField()
    fecha_modificacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'genco_directorios'

    def __unicode__(self):
        return '%s' % (self.nombre)     

class GencoElementoEntidad(models.Model):
    id_elementoentidad = models.AutoField(primary_key=True)
    id_entidad = models.ForeignKey('GencoEntidad', models.DO_NOTHING, db_column='id_entidad')
    id_direlemento = models.ForeignKey(GencoDirectorioElementos, models.DO_NOTHING, db_column='id_direlemento')
    tags = models.CharField(max_length=1024, blank=True, null=True)
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'genco_elemento_entidad'


class GencoEntidad(models.Model):
    id_entidad = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=100, blank=True, null=True)
    id_repositorio = models.ForeignKey('GencoRepositorio', models.DO_NOTHING, db_column='id_repositorio')
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()
    modificado_por = models.IntegerField()
    fecha_modificacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'genco_entidad'
        unique_together = (('nombre', 'id_repositorio'),)

    def __unicode__(self):
        return '%s' % (self.nombre) 

class GencoEntidadDefinicion(models.Model):
    id_entidaddef = models.AutoField(primary_key=True)
    id_entidad = models.ForeignKey(GencoEntidad, models.DO_NOTHING, db_column='id_entidad')
    nombre = models.CharField(max_length=50)
    id_tipodato = models.ForeignKey('GencoTipodato', models.DO_NOTHING, db_column='id_tipodato', blank=True, null=True)
    longitud = models.IntegerField(blank=True, null=True)
    precision = models.IntegerField(blank=True, null=True)
    es_pk = models.CharField(max_length=10, blank=True, null=True)
    es_fk = models.CharField(max_length=10, blank=True, null=True)
    obligatorio = models.CharField(max_length=10, blank=True, null=True)
    entidad_ref = models.ForeignKey(GencoEntidad, models.DO_NOTHING, db_column='entidad_ref', related_name='entidad_ref', blank=True, null=True)
    regexpr = models.CharField(max_length=200, blank=True, null=True)
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField(blank=True, null=True)
    modificado_por = models.IntegerField()
    fecha_modificacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'genco_entidad_definicion'
        unique_together = (('id_entidad', 'nombre'),)

    def __unicode__(self):
        return '%s' % (self.nombre) 

class GencoEntorno(models.Model):
    id_entorno = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=100, blank=True, null=True)
    # id_grupo = models.ForeignKey('GencoGrupo', models.DO_NOTHING, db_column='id_grupo')
    version = models.CharField(max_length=10, blank=True, null=True)
    id_icono = models.ForeignKey(AdminAppIconos, models.DO_NOTHING, db_column='id_icono')
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()
    modificado_por = models.IntegerField()
    fecha_modificacion = models.DateTimeField(blank=True, null=True)
    id_ws = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'genco_entorno'


class GencoEntornoLenguajes(models.Model):
    id_entornolenguaje = models.AutoField(primary_key=True)
    id_entorno = models.ForeignKey(GencoEntorno, models.DO_NOTHING, db_column='id_entorno')
    id_lenguaje = models.ForeignKey('GencoLenguajes', models.DO_NOTHING, db_column='id_lenguaje')
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'genco_entorno_lenguajes'
        unique_together = (('id_entorno', 'id_lenguaje'),)


class GencoGrupo(models.Model):
    id_grupo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=200, blank=True, null=True)
    id_alcance = models.ForeignKey(AdminGrupoAlcance, models.DO_NOTHING, db_column='id_alcance')
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()
    modificado_por = models.IntegerField()
    fecha_modificacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'genco_grupo'

    def __unicode__(self):
        return '%s' % (self.nombre)    


class GencoLenguajes(models.Model):
    id_lenguaje = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=30)
    version = models.CharField(max_length=10)
    descripcion = models.CharField(max_length=100, blank=True, null=True)
    id_icono = models.ForeignKey(AdminAppIconos, models.DO_NOTHING, db_column='id_icono')
    extension = models.CharField(max_length=15)
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()
    modificado_por = models.IntegerField()
    fecha_modificacion = models.DateTimeField(blank=True, null=True)
    id_ws = models.IntegerField()
    id_ws_origen = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'genco_lenguajes'

    def __unicode__(self):
        return '%s' % (self.nombre)        


class GencoParametros(models.Model):
    id_parametro = models.AutoField(primary_key=True)
    nombre = models.CharField(unique=True, max_length=45)
    descripcion = models.CharField(max_length=200, blank=True, null=True)
    valor_numerico = models.IntegerField(blank=True, null=True)
    valor_alfanumerico = models.CharField(max_length=200, blank=True, null=True)
    id_proyecto = models.ForeignKey('GencoProyectos', models.DO_NOTHING, db_column='id_proyecto')
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()
    modificado_por = models.IntegerField()
    fecha_modificacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'genco_parametros'


class GencoPlantillas(models.Model):
    id_plantilla = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=200, blank=True, null=True)
    id_lenguaje = models.ForeignKey(GencoLenguajes, models.DO_NOTHING, db_column='id_lenguaje')
    id_lenguajeprocesador = models.ForeignKey(AdminLenguajeProcesador, models.DO_NOTHING, db_column='id_lenguajeprocesador')
    id_componente = models.ForeignKey(GencoComponentes, models.DO_NOTHING, db_column='id_componente')
    archivo = models.CharField(max_length=100, blank=True, null=True)
    tags = models.CharField(max_length=512, blank=True, null=True)
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()
    modificado_por = models.IntegerField()
    fecha_modificacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'genco_plantillas'
        unique_together = (('nombre', 'id_componente'),)

    def __unicode__(self):
        return '%s' % (self.nombre) 

class GencoProyectoRepositorio(models.Model):
    id_repositorio = models.ForeignKey('GencoRepositorio', models.DO_NOTHING, db_column='id_repositorio')
    id_proyecto = models.ForeignKey('GencoProyectos', models.DO_NOTHING, db_column='id_proyecto')

    class Meta:
        managed = False
        db_table = 'genco_proyecto_repositorio'
        unique_together = (('id_repositorio', 'id_proyecto'),)


class GencoProyectos(models.Model):
    id_proyecto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=45)
    descripcion = models.CharField(max_length=200, blank=True, null=True)
    #id_entorno = models.ForeignKey(GencoEntorno, models.DO_NOTHING, db_column='id_entorno')
    grupo = models.CharField(max_length=50, blank=True, null=True)
    ref_archivo_constructor = models.CharField(max_length=100, blank=True, null=True)
    empaquetado = models.CharField(max_length=45, blank=True, null=True)
    url = models.CharField(max_length=100, blank=True, null=True)
    version = models.CharField(max_length=45, blank=True, null=True)
    # id_alcance = models.ForeignKey(AdminProyectoAlcance, models.DO_NOTHING, db_column='id_alcance')
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()
    modificado_por = models.IntegerField()
    fecha_modificacion = models.DateTimeField(blank=True, null=True)
    id_ws = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'genco_proyectos'


class GencoRepositorio(models.Model):
    id_repositorio = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=100, blank=True, null=True)
    url_ext_repositorio = models.CharField(max_length=300, blank=True, null=True)
    token_ext_repositorio = models.CharField(max_length=256, blank=True, null=True)
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()
    modificado_por = models.IntegerField()
    fecha_modificacion = models.DateTimeField(blank=True, null=True)
    id_ws = models.IntegerField()
    id_ws_origen = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'genco_repositorio'


class GencoTipodato(models.Model):
    id_tipodato = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=30)
    descripcion = models.CharField(max_length=100, blank=True, null=True)
    id_lenguaje = models.ForeignKey(GencoLenguajes, models.DO_NOTHING, db_column='id_lenguaje')
    contenedor = models.CharField(max_length=100, blank=True, null=True)
    prefijo = models.CharField(max_length=10, blank=True, null=True)
    longitud_maxima = models.IntegerField(blank=True, null=True)
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()
    modificado_por = models.IntegerField()
    fecha_modificacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'genco_tipodato'
    
    def __unicode__(self):
        return '%s' % (self.nombre) 

class GencoUsuarioGrupo(models.Model):
    id_usuariogrupo = models.AutoField(primary_key=True)
    auth_user_id = models.IntegerField()
    id_grupo = models.ForeignKey(GencoGrupo, models.DO_NOTHING, db_column='id_grupo')
    creado_por = models.IntegerField()
    fecha_creacion = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'genco_usuario_grupo'
