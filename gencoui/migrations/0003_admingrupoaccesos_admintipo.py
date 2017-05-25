# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2017-05-25 01:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gencoui', '0002_admingrupoalcance'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdminGrupoAccesos',
            fields=[
                ('id_grupoaccesos', models.AutoField(primary_key=True, serialize=False)),
                ('auth_user_id', models.IntegerField()),
                ('id_elemento', models.IntegerField()),
            ],
            options={
                'db_table': 'admin_grupo_accesos',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AdminTipo',
            fields=[
                ('id_tipo', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=45)),
                ('creado_por', models.IntegerField()),
                ('fecha_creacion', models.DateTimeField()),
            ],
            options={
                'db_table': 'admin_tipo',
                'managed': False,
            },
        ),
    ]
