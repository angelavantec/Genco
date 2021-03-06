# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2017-05-25 00:21
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gencoui', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdminGrupoAlcance',
            fields=[
                ('id_alcance', models.IntegerField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=50)),
                ('descripcion', models.CharField(blank=True, max_length=100, null=True)),
                ('creado_por', models.IntegerField()),
                ('fecha_creacion', models.DateTimeField()),
                ('modificado_por', models.IntegerField()),
                ('fecha_modificacion', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'admin_grupo_alcance',
                'managed': False,
            },
        ),
    ]
