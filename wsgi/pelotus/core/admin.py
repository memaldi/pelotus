from django.contrib import admin
from core.models import *
from core.tasks import match_day_ranking
from django.forms.models import BaseInlineFormSet

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
	list_filter = ('teaminseason__spanish_league', 'teaminseason__uefa_league', 'teaminseason__champions_league')

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
	max_num = 10
	def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
		if db_field.name == 'home_team':
			kwargs['queryset'] = Team.objects.filter(teaminseason__spanish_league=True)
		elif db_field.name == 'foreign_team':
			kwargs['queryset'] = Team.objects.filter(teaminseason__spanish_league=True)
		return super(MatchAdminTabular, self).formfield_for_foreignkey(db_field, request, **kwargs)

class PlayerGoalAdmin(admin.TabularInline):
	model = PlayerGoal
	extra = 5

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
	list_display = ('id', 'home_team', 'foreign_team', 'match_day', 'result')

@admin.register(MatchDay)
class MatchDayAdmin(admin.ModelAdmin):
	list_display = ('number', 'start_date', 'season',)
	list_display_links = ('number', 'start_date')
	inlines = (MatchAdminTabular, PlayerGoalAdmin)

	# def save_model(self, request, obj, form, change):
	# 	super(MatchDayAdmin)
	# 	print obj
	# 	match_day_ranking.delay(obj.id)

class UserAdministrationAdminInline(admin.TabularInline):
	model = UserAdministration
	extra = 5

@admin.register(Competition)
class CompetitionsAdmin(admin.ModelAdmin):
	list_display = ('season', 'community')
	inlines = (UserAdministrationAdminInline,)

@admin.register(UserAdministration)
class UserAdministrationAdmin(admin.ModelAdmin):
	list_display = ('id', 'user', 'competition')

@admin.register(Bet)
class BetAdmin(admin.ModelAdmin):
	list_display = ('id', 'user', 'match', 'home_goals', 'foreign_goals', 'match_day')
	list_filter = ('match_day', 'user')

@admin.register(GoalsBet)
class GoalsBetAdmin(admin.ModelAdmin):
	list_display = ('user', 'match_day', 'forward', 'midfield', 'defense')

@admin.register(GlobalBet)
class GlobalBetAdmin(admin.ModelAdmin):
	list_display = ('user',)
