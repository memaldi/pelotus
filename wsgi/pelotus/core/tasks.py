from core.models import MatchDay, Competition, GlobalBet, GlobalResults
from celeryapp import app
from django.core.cache import cache
import utils

TIMEOUT = 259200


@app.task
def match_day_ranking(match_day_id):
    match_day = MatchDay.objects.get(id=match_day_id)
    competition_points = utils.match_day_ranking(match_day)

    for competition in competition_points:
        for user in competition_points[competition]:
            cache.set('competition:{}:match_day:{}:user:{}:points'.format(
                competition, match_day.id, user),
                competition_points[competition][user], TIMEOUT)


@app.task
def global_ranking(global_results_id):
    global_results = GlobalResults.objects.get(id=global_results_id)
    competition_list = Competition.objects.filter(
        season=global_results.season).all()
    for competition in competition_list:
        global_bet_list = GlobalBet.objects.filter(
            competition=competition).all()
        for global_bet in global_bet_list:
            global_points = utils.get_user_global_points(global_bet.user,
                                                         competition,
                                                         global_results)

            cache.set('competiton:{}:global:user:{}:points'.format(
                competition.id, global_bet.user.id), global_points, TIMEOUT)
