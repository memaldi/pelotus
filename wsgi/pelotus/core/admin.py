from django.contrib import admin
from core.models import *

# Register your models here.
admin.site.register(Season)
admin.site.register(Community)
admin.site.register(Competition)
admin.site.register(Team)
admin.site.register(MatchDay)
admin.site.register(Match)
admin.site.register(Player)
admin.site.register(PlayerBelongsToTeam)
admin.site.register(UserProfile)
admin.site.register(Bet)
admin.site.register(GoalsBet)