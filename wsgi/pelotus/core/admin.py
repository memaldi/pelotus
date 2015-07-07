from django.contrib import admin
from core.models import *

# Register your models here.
#admin.site.register(Season)
# admin.site.register(Community)
# admin.site.register(Competition)
# admin.site.register(MatchDay)
# admin.site.register(Match)
# #admin.site.register(PlayerBelongsToTeam)
# admin.site.register(UserProfile)
# admin.site.register(UserAdministration)
# admin.site.register(Bet)
# admin.site.register(GoalsBet)

@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
	list_display = ('name', 'description', 'start_date', 'end_date')

class PlayerBelongsToTeamInLine(admin.TabularInline):
	model = PlayerBelongsToTeam
	extra = 1

class TeamInSeasonAdmin(admin.TabularInline):
	model = TeamInSeason
	extra = 1

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
	list_display = ('name', 'current_season',)
	search_fields = ['name']
	inlines = (TeamInSeasonAdmin,)
	# inlines = (PlayerBelongsToTeamInLine,)

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
	list_display = ('name',)
	search_fields = ['name']
	inlines = (PlayerBelongsToTeamInLine,)
