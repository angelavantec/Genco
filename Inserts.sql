insert into admin_app_iconos (nombre, tipo, upload, creado_por, fecha_creacion) values('genco', 'lang', 'icons/cheetah.svg', 1,now());

insert into admin_lenguaje_procesador(nombre, version, componente_binario, estado, id_icono, creado_por, fecha_creacion) values ('cheetha', 5, 'cheetha','alta',1,1, now());

insert into admin_grupo_alcance(id_alcance,nombre, creado_por, fecha_creacion) values(1,'public', 1, now());
insert into admin_grupo_alcance(id_alcance,nombre, creado_por, fecha_creacion) values(2,'private', 1, now());
insert into admin_grupo_alcance(id_alcance,nombre, creado_por, fecha_creacion) values(3,'share', 1, now());

-- insert into genco_grupo(nombre, creado_por, fecha_creacion) values('default', 1, now());

insert into genco_lenguajes(nombre, version, descripcion, id_icono, creado_por, fecha_creacion) values('genco', '1', 'genco', 1, 1, now());

insert into genco_tipodato(nombre, descripcion, id_lenguaje, creado_por, fecha_creacion) values('text', 'alfanumeric values', 1, 1, now());
insert into genco_tipodato(nombre, descripcion, id_lenguaje, creado_por, fecha_creacion) values('number', 'number values', 1, 1, now());
insert into genco_tipodato(nombre, descripcion, id_lenguaje, creado_por, fecha_creacion) values('date', 'date values', 1, 1, now());
insert into genco_tipodato(nombre, descripcion, id_lenguaje, creado_por, fecha_creacion) values('time', 'time values', 1, 1, now());
insert into genco_tipodato(nombre, descripcion, id_lenguaje, creado_por, fecha_creacion) values('datetime', 'datetime values', 1, 1, now());
insert into genco_tipodato(nombre, descripcion, id_lenguaje, creado_por, fecha_creacion) values('boolean', 'boolean values', 1, 1, now());		

insert into genco_tipodato(nombre, descripcion, id_lenguaje, creado_por, fecha_creacion) values('entity', 'entity reference', 1, 1, now());



insert into admin_app_iconos (nombre, tipo, upload, creado_por, fecha_creacion) values('java', 'lang', 'icons/java.svg', 1,now());
insert into admin_app_iconos (nombre, tipo, upload, creado_por, fecha_creacion) values('javascript', 'lang', 'icons/javascript.svg', 1,now());
insert into admin_app_iconos (nombre, tipo, upload, creado_por, fecha_creacion) values('GWT', 'env', 'icons/gwt.svg', 1,now());
insert into admin_app_iconos (nombre, tipo, upload, creado_por, fecha_creacion) values('ZK', 'env', 'icons/zk.svg', 1,now());