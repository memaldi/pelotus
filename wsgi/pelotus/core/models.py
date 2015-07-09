from django.db import models
from django.contrib.auth.models import User
import datetime

# Create your models here.

# Season to which a community belongs
class Season(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    name = models.CharField(max_length=20)
    description = models.TextField(max_length=200)
    teams = models.ManyToManyField('Team', through='TeamInSeason')

    def __str__(self):              # __unicode__ on Python 2
        return self.name

# A group of users playing to Pelotus
class Community(models.Model):
    name = models.CharField(max_length=20, unique=True)
    description = models.TextField(max_length=200)

    def __str__(self):              # __unicode__ on Python 2
        return self.name

# Each instances of a Season with a Community
class Competition(models.Model):
    season = models.ForeignKey('Season')
    community = models.ForeignKey('Community')

class MatchDay(models.Model):
    number = models.IntegerField()
    start_date = models.DateTimeField()
    season = models.ForeignKey('Season')

    def __str__(self):
        return str(self.number)

class PlayerGoal(models.Model):
    player = models.ForeignKey('Player')
    match_day = models.ForeignKey('MatchDay')
    goals = models.IntegerField()

class Match(models.Model):
    home_team = models.ForeignKey('Team', related_name='home_team')
    foreign_team = models.ForeignKey('Team', related_name='foreign_team')
    match_day = models.ForeignKey('MatchDay')
    home_goals = models.IntegerField(default=None, blank=True, null=True)
    foreign_goals = models.IntegerField(default=None, blank=True, null=True)

    def __str__(self):              # __unicode__ on Python 2
        return '%s - %s (Match day %s)' % (self.home_team.name, self.foreign_team.name, self.match_day.number)

    def result(self):
        return '%s - %s' % (self.home_goals, self.foreign_goals)

class Player(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):              # __unicode__ on Python 2
        return self.name

class Team(models.Model):
    name = models.CharField(max_length=20)

    def current_season(self):
        return self.teaminseason_set.filter(season__start_date__lte=datetime.date.today(), season__end_date__gte=datetime.date.today()).first().season.name


    class Meta:
        ordering = ['name']

    def __str__(self):              # __unicode__ on Python 2
        return self.name

class TeamInSeason(models.Model):
    team = models.ForeignKey('Team')
    season = models.ForeignKey('Season')
    spanish_league = models.BooleanField(default=True)
    uefa_league = models.BooleanField(default=False)
    champions_league = models.BooleanField(default=False)
    kings_cup = models.BooleanField(default=False)
    players = models.ManyToManyField(Player, through='PlayerBelongsToTeam')


    def __str__(self):              # __unicode__ on Python 2
        return self.team.name

class PlayerBelongsToTeam(models.Model):
    player = models.ForeignKey('Player')
    team_in_season = models.ForeignKey('TeamInSeason')
    season = models.ForeignKey('Season')
    POSITION_CHOICES = (
        ('GK', 'GoalKeeper'),
        ('DF', 'Defender'),
        ('MF', 'Midfield'),
        ('FW', 'Forward'),
    )
    position = models.CharField(max_length=2, choices=POSITION_CHOICES, default='GK')

# class UserProfile(models.Model):
#     user = models.ForeignKey(User)
#     competitions = models.ManyToManyField(Competition, through='UserAdministration')

class UserAdministration(models.Model):
    user = models.ForeignKey(User)
    competition = models.ForeignKey(Competition)
    is_admin = models.BooleanField(default=False)

class Bet(models.Model):
    user = models.ForeignKey(User)
    match = models.ForeignKey('Match')
    home_goals = models.IntegerField()
    foreign_goals = models.IntegerField()

class GoalsBet(models.Model):
    user = models.ForeignKey(User)
    match_day = models.ForeignKey('MatchDay')
    forward = models.ForeignKey('Player', related_name='forward')
    midfield = models.ForeignKey('Player', related_name='midfield')
    defense = models.ForeignKey('Player', related_name='defense')
