insert into admin_lenguaje_procesador(nombre, version, componente_binario, estado, id_icono, creado_por, fecha_creacion) values ('cheetha', 5, 'cheetha','alta',5,'admin', now());
insert into admin_lenguaje_procesador(nombre, version, componente_binario, estado, id_icono, creado_por, fecha_creacion) values ('xsl', 3, 'xsl','alta',1,'admin', now());

insert into genco_grupo(nombre, creado_por, fecha_creacion) values('default', 'admin', now());

insert into admin_proyecto_alcance(id_alcance,nombre, creado_por, fecha_creacion) values(1,'public', 'admin', now());
insert into admin_proyecto_alcance(id_alcance,nombre, creado_por, fecha_creacion) values(2,'private', 'admin', now());
insert into admin_proyecto_alcance(id_alcance,nombre, creado_por, fecha_creacion) values(3,'share', 'admin', now());
