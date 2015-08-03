from core.models import MatchDay, Competition, Bet
from celeryapp import app
from django.core.cache import cache
import utils

TIMEOUT = 259200

@app.task
def match_day_ranking(match_day_id):
    match_day = MatchDay.objects.get(id=match_day_id)
    competition_points = utils.match_day_ranking(match_day)

    for competition in competition_points:
        print competition
        print competition_points[competition]
        for user in competition_points[competition]:
            cache.set('competition:{}:match_day:{}:user:{}:points'.format(competition, match_day.id, user), competition_points[competition][user], TIMEOUT)
