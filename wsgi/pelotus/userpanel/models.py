from django.db import models

# Create your models here.

class Season(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.CharField(max_length=200)

class Community(models.Model):
    name = models.CharField(max_length=20)
    description = models.CharField(max_length=100)

class Competition(models.Model):
    season = models.ForeignKey('Season')
    community = models.ForeignKey('Community')

