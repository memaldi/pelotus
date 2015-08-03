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

class GlobalResults(admin.TabularInline):
	model = GlobalResults
	extra = 1

@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
	list_display = ('name', 'description', 'start_date', 'end_date')
	inlines = (GlobalResults,)

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

class CompetitionAdmin(admin.TabularInline):
	model = Competition
	extra = 1

@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
	list_display = ('name', 'description',)
	search_fields = ['name', 'description']
	inlines = (CompetitionAdmin,)

class MatchAdminTabular(admin.TabularInline):
	model = Match
	extra = 10

class PlayerGoalAdmin(admin.TabularInline):
	model = PlayerGoal
	extra = 5

# @admin.register(Match)
# class MatchAdmin(admin.ModelAdmin):
# 	list_display = ('home_team', 'foreign_team', 'match_day', 'result')
# 	inlines = (PlayerGoalAdmin,)

@admin.register(MatchDay)
class MatchDayAdmin(admin.ModelAdmin):
	list_display = ('number', 'start_date', 'season',)
	list_display_links = ('number', 'start_date')
	inlines = (MatchAdminTabular, PlayerGoalAdmin)

	def save_model(self, request, obj, form, change):
		super(MatchDayAdmin)
		


class UserAdministrationAdmin(admin.TabularInline):
	model = UserAdministration
	extra = 5

@admin.register(Competition)
class CompetitionsAdmin(admin.ModelAdmin):
	list_display = ('season', 'community')
	inlines = (UserAdministrationAdmin,)

@admin.register(Bet)
class BetAdmin(admin.ModelAdmin):
	list_display = ('user', 'match', 'home_goals', 'foreign_goals')

@admin.register(GoalsBet)
class GoalsBetAdmin(admin.ModelAdmin):
	list_display = ('user', 'match_day', 'forward', 'midfield', 'defense')

@admin.register(GlobalBet)
class GlobalBetAdmin(admin.ModelAdmin):
	list_display = ('user',)
