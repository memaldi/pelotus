# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Bet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('home_goals', models.IntegerField()),
                ('foreign_goals', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Community',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=20)),
                ('description', models.CharField(max_length=100)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Competition',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('community', models.ForeignKey(to='core.Community')),
                ('season', models.ForeignKey(to='core.Season')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='GoalsBet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('home_goals', models.IntegerField(default=None)),
                ('foreign_goals', models.IntegerField(default=None)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='MatchDay',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('number', models.IntegerField()),
                ('start_date', models.DateTimeField()),
                ('season', models.ForeignKey(to='core.Season')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PlayerBelongsToTeam',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('position', models.CharField(default=b'GK', max_length=2, choices=[(b'GK', b'GoalKeeper'), (b'DF', b'Defender'), (b'MF', b'Midfield'), (b'FW', b'Forward')])),
                ('player', models.ForeignKey(to='core.Player')),
                ('season', models.ForeignKey(to='core.Season')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=20)),
                ('spanish_league', models.BooleanField(default=True)),
                ('uefa_league', models.BooleanField(default=False)),
                ('champions_league', models.BooleanField(default=False)),
                ('kings_cup', models.BooleanField(default=False)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('communities', models.ForeignKey(to='core.Community')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='match',
            name='foreign_team',
            field=models.ForeignKey(related_name='foreign_team', to='core.Team'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='match',
            name='home_team',
            field=models.ForeignKey(related_name='home_team', to='core.Team'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='match',
            name='match_day',
            field=models.ForeignKey(to='core.MatchDay'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='goalsbet',
            name='defense',
            field=models.ForeignKey(related_name='defense', to='core.Player'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='goalsbet',
            name='forward',
            field=models.ForeignKey(related_name='forward', to='core.Player'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='goalsbet',
            name='match_day',
            field=models.ForeignKey(to='core.MatchDay'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='goalsbet',
            name='midfield',
            field=models.ForeignKey(related_name='midfield', to='core.Player'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='goalsbet',
            name='user_profile',
            field=models.ForeignKey(to='core.UserProfile'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='bet',
            name='match',
            field=models.ForeignKey(to='core.Match'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='bet',
            name='user_profile',
            field=models.ForeignKey(to='core.UserProfile'),
            preserve_default=True,
        ),
    ]
