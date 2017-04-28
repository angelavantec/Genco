insert into admin_lenguaje_procesador(nombre, version, componente_binario, estado, id_icono, creado_por, fecha_creacion) values ('cheetha', 5, 'cheetha','alta',5,'admin', now());
insert into admin_lenguaje_procesador(nombre, version, componente_binario, estado, id_icono, creado_por, fecha_creacion) values ('xsl', 3, 'xsl','alta',1,'admin', now());

insert into genco_grupo(nombre, creado_por, fecha_creacion) values('default', 'admin', now());

insert into admin_proyecto_alcance(id_alcance,nombre, creado_por, fecha_creacion) values(1,'public', 'admin', now());
insert into admin_proyecto_alcance(id_alcance,nombre, creado_por, fecha_creacion) values(2,'private', 'admin', now());
insert into admin_proyecto_alcance(id_alcance,nombre, creado_por, fecha_creacion) values(3,'share', 'admin', now());


insert into admin_app_iconos (id_icono, nombre, tipo, upload, creado_por, fecha_creacion) values(0, 'genco', 'genco', 'icons/genco.svg', 'admin',now());
update admin_app_iconos set id_icono = 0 where nombre ='genco';

insert into genco_lenguajes(id_lenguaje, nombre, version, descripcion, id_icono, creado_por, fecha_creacion) values(0,'genco', '1', 'genco', 0, 'admin', now());
update genco_lenguajes set id_lenguaje = 0 where nombre ='genco';

insert into genco_tipodato(nombre, descripcion, id_lenguaje, creado_por, fecha_creacion) values('text', 'alfanumeric values', 0, 'admin', now());
insert into genco_tipodato(nombre, descripcion, id_lenguaje, creado_por, fecha_creacion) values('number', 'number values', 0, 'admin', now());
insert into genco_tipodato(nombre, descripcion, id_lenguaje, creado_por, fecha_creacion) values('date', 'date values', 0, 'admin', now());
insert into genco_tipodato(nombre, descripcion, id_lenguaje, creado_por, fecha_creacion) values('time', 'time values', 0, 'admin', now());
insert into genco_tipodato(nombre, descripcion, id_lenguaje, creado_por, fecha_creacion) values('datetime', 'datetime values', 0, 'admin', now());
insert into genco_tipodato(nombre, descripcion, id_lenguaje, creado_por, fecha_creacion) values('boolean', 'boolean values', 0, 'admin', now());		

insert into genco_tipodato(nombre, descripcion, id_lenguaje, creado_por, fecha_creacion) values('entity', 'entity reference', 0, 'admin', now());
update genco_tipodato set id_tipodato = 0 where nombre ='entity';