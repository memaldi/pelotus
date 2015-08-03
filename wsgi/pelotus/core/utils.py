# Util classes
from core.models import MatchDay, Competition, Bet


def match_day_ranking(match_day):
    competition_points = {}
    for competition in Competition.objects.filter(season=match_day.season):
        competition_points[competition.id] = {}
        for ua in competition.useradministration_set.all():
            user_points = 0
            for bet in Bet.objects.filter(user=ua.user, match_day=match_day, competition=competition):
                if (bet.home_goals > bet.foreign_goals and bet.match.home_goals > bet.match.foreign_goals) or (bet.home_goals < bet.foreign_goals and bet.match.home_goals < bet.match.foreign_goals) or (bet.home_goals == bet.foreign_goals and bet.match.home_goals == bet.match.foreign_goals) and (None not in [bet.home_goals, bet.foreign_goals, bet.match.home_goals, bet.match.foreign_goals]):
                   user_points += 5

                if (bet.home_goals == bet.match.home_goals and bet.foreign_goals == bet.match.foreign_goals) and (None not in [bet.home_goals, bet.foreign_goals, bet.match.home_goals, bet.match.foreign_goals]):
                    user_points += 3

            competition_points[competition.id][ua.user.id] = user_points

    return competition_points
