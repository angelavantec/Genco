
mysql> source C:\Users\Angel\Desktop\creaTab.sql

insert into admin_lenguaje_procesador(nombre, version, componente_binario
, estado, creado_por, fecha_creacion) values ('cheetha', 5, 'cheetha','alta','admin', now());

insert into genco_grupo(nombre, creado_por, fecha_creacion) values('default', 'admin', now());

insert into admin_proyecto_alcance(id_alcance,nombre, creado_por, fecha_creacion) values(1,'public', 'admin', now());
insert into admin_proyecto_alcance(id_alcance,nombre, creado_por, fecha_creacion) values(2,'private', 'admin', now());
insert into admin_proyecto_alcance(id_alcance,nombre, creado_por, fecha_creacion) values(3,'share', 'admin', now());
