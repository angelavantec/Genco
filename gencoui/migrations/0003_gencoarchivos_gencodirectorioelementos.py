# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-10-18 21:58
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gencoui', '0002_authgroup_authgrouppermissions_authpermission_authuser_authusergroups_authuseruserpermissions_django'),
    ]

    operations = [
        migrations.CreateModel(
            name='GencoArchivos',
            fields=[
                ('id_archivo', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=50)),
                ('descripcion', models.CharField(blank=True, max_length=150, null=True)),
                ('creado_por', models.CharField(max_length=30)),
                ('fecha_creacion', models.DateTimeField()),
                ('upload', models.FileField(upload_to='user_templates')),
            ],
            options={
                'db_table': 'genco_archivos',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='GencoDirectorioElementos',
            fields=[
                ('id_direlemento', models.AutoField(primary_key=True, serialize=False)),
                ('creado_por', models.CharField(max_length=30)),
                ('fecha_creacion', models.DateTimeField()),
            ],
            options={
                'db_table': 'genco_directorio_elementos',
                'managed': False,
            },
        ),
    ]
