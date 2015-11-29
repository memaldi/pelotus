# Util classes
from core.models import MatchDay, Competition, Bet, GoalsBet, PlayerGoal


def match_day_ranking(match_day):
    competition_points = {}
    for competition in Competition.objects.filter(season=match_day.season):
        competition_points[competition.id] = {}
        for ua in competition.useradministration_set.all():
            user_points = get_user_match_day_points(ua.user, match_day, competition)
            competition_points[competition.id][ua.user.id] = user_points

    return competition_points

def get_user_match_day_points(user, match_day, competition):
    user_points = 0
    total_bet = 0
    mached_bets = 0
    for bet in Bet.objects.filter(user=user, match_day=match_day, competition=competition):
        if (bet.home_goals > bet.foreign_goals and bet.match.home_goals > bet.match.foreign_goals) or (bet.home_goals < bet.foreign_goals and bet.match.home_goals < bet.match.foreign_goals) or (bet.home_goals == bet.foreign_goals and bet.match.home_goals == bet.match.foreign_goals) and (None not in [bet.home_goals, bet.foreign_goals, bet.match.home_goals, bet.match.foreign_goals]):
           user_points += 5
           matched_bets += 1

        if (bet.home_goals == bet.match.home_goals and bet.foreign_goals == bet.match.foreign_goals) and (None not in [bet.home_goals, bet.foreign_goals, bet.match.home_goals, bet.match.foreign_goals]):
            user_points += 3
        total_bet += 1

    if matched_bets >= total_bet:
        user_points += 10

    goals_bet = GoalsBet.objects.filter(user=user, match_day=match_day).first()
    if goals_bet != None:
        player_goal = PlayerGoal.objects.filter(match_day=match_day, player=goals_bet.forward).first()
        if player_goal != None:
            user_points += player_goal.goals

        player_goal = PlayerGoal.objects.filter(match_day=match_day, player=goals_bet.midfield).first()
        if player_goal != None:
            user_points += player_goal.goals * 3

        player_goal = PlayerGoal.objects.filter(match_day=match_day, player=goals_bet.defense).first()
        if player_goal != None:
            user_points += player_goal.goals * 5

    return user_points
