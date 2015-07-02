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
    name = models.CharField(max_length=20, unique=True)
    description = models.TextField(max_length=200)

# Each instances of a Season with a Community
class Competition(models.Model):
    season = models.ForeignKey('Season')
    community = models.ForeignKey('Community')

class Team(models.Model):
    name = models.CharField(max_length=20)
    spanish_league = models.BooleanField(default=True)
    uefa_league = models.BooleanField(default=False)
    champions_league = models.BooleanField(default=False)
    kings_cup = models.BooleanField(default=False)

class MatchDay(models.Model):
    number = models.IntegerField()
    start_date = models.DateTimeField()
    season = models.ForeignKey('Season')

class Match(models.Model):
    home_team = models.ForeignKey('Team', related_name='home_team')
    foreign_team = models.ForeignKey('Team', related_name='foreign_team')
    match_day = models.ForeignKey('MatchDay')
    home_goals = models.IntegerField(default=None)
    foreign_goals = models.IntegerField(default=None)

class Player(models.Model):
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
    forward = models.ForeignKey('Player', related_name='forward')
    midfield = models.ForeignKey('Player', related_name='midfield')
    defense = models.ForeignKey('Player', related_name='defense')

