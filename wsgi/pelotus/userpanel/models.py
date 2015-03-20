from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# Season to which a community belongs
class Season(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.CharField(max_length=200)

# A group of users playing to Pelotus
class Community(models.Model):
    name = models.CharField(max_length=20)
    description = models.CharField(max_length=100)

# Each instances of a Season with a Community
class Competition(models.Model):
    season = models.ForeignKey('Season')
    community = models.ForeignKey('Community')

class Team(models.model):
    name = models.CharField(max_length=20)
    spanish_league = models.BooleanField(default=True)
    uefa_league = models.BooleanField(default=False)
    champions_league = models.BooleanField(default=False)
    kings_cup = models.BooleanField(default=False)

class MatchDay(models.model):
    number = models.IntegerField()
    start_date = models.DateTimeField()
    season = models.ForeignKey('Season')

class Match(models.model):
    home_team = models.ForeignKey('Team')
    foreign_team = models.ForeignKey('Team')
    match_day = models.ForeignKey('MatchDay')
    home_goals = models.IntegerField(default=None)
    foreign_goals = models.IntegreField(default=None)

class Player(models.model):
    name = models.CharField(max_length=50)

class PlayerBelongsToTeam(models.Model):
    player = models.ForeignKey('Player')
    season = models.ForeignKey('Season')
    POSITION_CHOICES = (
        ('GK', 'GoalKeeper'),
        ('DF', 'Defender'),
        ('MF', 'Midfield'),
        ('FW', 'Forward'),
    )
    position = models.CharField(max_length=2, choices=POSITION_CHOICES, default='GK')

class UserProfile(models.Model):
    user = models.ForeignKey(User)
    communities = models.ForeignKey('Community')

class Bet(models.Model):
    user_profile = models.ForeignKey('UserProfile')
    match = models.ForeignKey('Match')
    home_goals = models.IntegerField()
    foreign_goals = models.IntegerField()

class GoalsBet(models.Model):
    user_profile = models.ForeignKey('UserProfile')
    match_day = models.ForeignKey('MatchDay')
    forward = models.ForeignKey('Player')
    midfield = models.ForeignKey('Player')
    defense = modls.ForeignKey('Player')

