from django.shortcuts import render
from core.models import MatchDay, Bet, UserAdministration, Competition, TeamInSeason, Team, Player, GoalsBet, GlobalResults, GlobalBet, PlayerBelongsToTeam, PlayerGoal
from django.forms.models import inlineformset_factory
from django.contrib.auth.decorators import login_required
from django.template.defaultfilters import dictsortreversed
from django.core.cache import cache
from core import utils
from core.decorators import community_required
import datetime
import json

# Create your views here.

TIMEOUT = 259200


@login_required
@community_required
def match_days(request, competition_id):
    print request
    if request.method == 'GET':
        competition = Competition.objects.get(id=competition_id)
        context = {'competition': competition}
        return render(request, 'userpanel/match_days.html', context)


@login_required
@community_required
def match_day(request, competition_id, match_day_id):
    user = request.user
    competition = Competition.objects.get(id=competition_id)
    match_day = MatchDay.objects.get(id=match_day_id)
    if request.method == 'GET':
        match_set = match_day.match_set.all()
        bet_list = []
        for match in match_set:
            bet = Bet.objects.filter(user=user, match=match,
                                     match_day=match_day,
                                     competition=competition).first()
            if bet is None:
                bet = Bet(user=user, match=match, match_day=match_day,
                          competition=competition)
                bet.save()
            bet_list.append(bet)
        context = {'user': user, 'match_day': match_day, 'bet_list': bet_list,
                   'competition': competition}
        return render(request, 'userpanel/match_day.html', context)
    if request.method == 'POST':
        bet_list = []
        for bet in Bet.objects.filter(user=user, match_day=match_day).all():
            if request.POST['home_team-bet-id-%s' % bet.id] != '':
                bet.home_goals = request.POST['home_team-bet-id-%s' % bet.id]
            else:
                bet.home_goals = None
            if request.POST['foreign_team-bet-id-%s' % bet.id] != '':
                bet.foreign_goals = request.POST['foreign_team-bet-id-%s' %
                                                 bet.id]
            else:
                bet.foreign_goals = None
            bet.save()
            bet_list.append(bet)
        context = {'user': user, 'match_day': match_day, 'bet_list': bet_list,
                   'competition': competition, 'correct': True}
        return render(request, 'userpanel/match_day.html', context)


@login_required
@community_required
def scorers(request, competition_id, match_day_id):
    user = request.user
    competition = Competition.objects.get(id=competition_id)
    match_day = MatchDay.objects.get(id=match_day_id)
    team_list = []
    team_in_season_list = TeamInSeason.objects.filter(
        season=competition.season, spanish_league=True)
    for team_in_season in team_in_season_list:
        team_list.append(team_in_season.team)
    team_list.sort()

    correct = None

    goals_bet = GoalsBet.objects.filter(user=user, match_day=match_day).first()
    if request.method == 'POST':
        if goals_bet is None:
            goals_bet = GoalsBet(user=user, match_day=match_day)

        if request.POST.get("defender-player", "None") != "None":
            defender_player = Player.objects.get(
                id=int(request.POST["defender-player"]))
            goals_bet.defense = defender_player
        if request.POST.get("midfield-player", "None") != "None":
            midfield_player = Player.objects.get(
                id=int(request.POST["midfield-player"]))
            goals_bet.midfield = midfield_player
        if request.POST.get("forward-player", "None") != "None":
            forward_player = Player.objects.get(
                id=int(request.POST["forward-player"]))
            goals_bet.forward = forward_player

        goals_bet.save()
        correct = True

    goals_teams = {}
    if goals_bet is not None:
        if goals_bet.defense is not None:
            defense_team = goals_bet.defense.playerbelongstoteam_set.get(
                season=competition.season).team_in_season.team
            goals_teams["defense_team"] = defense_team.id

        if goals_bet.midfield is not None:
            midfield_team = goals_bet.midfield.playerbelongstoteam_set.get(
                season=competition.season).team_in_season.team
            goals_teams["midfield_team"] = midfield_team.id

        if goals_bet.forward is not None:
            forward_team = goals_bet.forward.playerbelongstoteam_set.get(
                season=competition.season).team_in_season.team
            goals_teams["forward_team"] = forward_team.id

    context = {'user': user, 'competition': competition,
               'match_day': match_day, 'team_list': team_list,
               'goals_bet': goals_bet, 'goals_teams': goals_teams}
    if correct:
        context['correct'] = True
    return render(request, 'userpanel/scorers.html', context)


@login_required
@community_required
def global_bets(request, competition_id):
    user = request.user
    competition = Competition.objects.get(id=competition_id)
    global_bet_result = GlobalResults.objects.filter(
        season=competition.season).first()

    spanish_league_teams = []
    for tis in TeamInSeason.objects.filter(season=competition.season,
                                           spanish_league=True):
        spanish_league_teams.append(tis.team)
    spanish_league_teams.sort()

    kings_cup_teams = []
    for tis in TeamInSeason.objects.filter(season=competition.season,
                                           kings_cup=True):
        kings_cup_teams.append(tis.team)
    kings_cup_teams.sort()

    uefa_teams = []
    for tis in TeamInSeason.objects.filter(season=competition.season,
                                           uefa_league=True):
        uefa_teams.append(tis.team)
    uefa_teams.sort()

    champions_teams = []
    for tis in TeamInSeason.objects.filter(season=competition.season,
                                           champions_league=True):
        champions_teams.append(tis.team)
    champions_teams.sort()

    goalkeepers = []
    for pbt in PlayerBelongsToTeam.objects.filter(season=competition.season,
                                                  position='GK'):
        goalkeepers.append(pbt.player)
    goalkeepers.sort()

    global_bet = GlobalBet.objects.filter(user=user,
                                          competition=competition).first()

    if request.method == 'POST':
        if global_bet is None:
            global_bet = GlobalBet(user=user, competition=competition)

        if request.POST["winter-champion"] != "None":
            global_bet.winter_champion = Team.objects.get(
                id=int(request.POST["winter-champion"]))

        if request.POST["league-champion"] != "None":
            global_bet.league_champion = Team.objects.get(
                id=int(request.POST["league-champion"]))

        if request.POST["kings-champion"] != "None":
            global_bet.kings_cup_champion = Team.objects.get(
                id=int(request.POST["kings-champion"]))

        if request.POST["uefa-champion"] != "None":
            global_bet.uefa_champion = Team.objects.get(
                id=int(request.POST["uefa-champion"]))

        if request.POST["champions-champion"] != "None":
            global_bet.champions_league_champion = Team.objects.get(
                id=int(request.POST["champions-champion"]))

        global_bet.save()
        global_bet.uefa_positions.clear()

        if request.POST["uefa-position-1"] != "None":
            global_bet.uefa_positions.add(Team.objects.get(
                id=int(request.POST["uefa-position-1"])))

        if request.POST["uefa-position-2"] != "None":
            global_bet.uefa_positions.add(Team.objects.get(
                id=int(request.POST["uefa-position-2"])))

        global_bet.champions_positions.clear()

        if request.POST["champions-position-1"] != "None":
            global_bet.champions_positions.add(Team.objects.get(
                id=int(request.POST["champions-position-1"])))

        if request.POST["champions-position-2"] != "None":
            global_bet.champions_positions.add(Team.objects.get(
                id=int(request.POST["champions-position-2"])))

        if request.POST["champions-position-3"] != "None":
            global_bet.champions_positions.add(Team.objects.get(
                id=int(request.POST["champions-position-3"])))

        if request.POST["champions-position-4"] != "None":
            global_bet.champions_positions.add(Team.objects.get(
                id=int(request.POST["champions-position-4"])))

        global_bet.demotion_positions.clear()

        if request.POST["demotion-position-1"] != "None":
            global_bet.demotion_positions.add(Team.objects.get(
                id=int(request.POST["demotion-position-1"])))

        if request.POST["demotion-position-2"] != "None":
            global_bet.demotion_positions.add(Team.objects.get(
                id=int(request.POST["demotion-position-2"])))

        if request.POST["demotion-position-3"] != "None":
            global_bet.demotion_positions.add(Team.objects.get(
                id=int(request.POST["demotion-position-3"])))

        if request.POST["best-goalkeeper"] != "None":
            global_bet.best_goalkeeper = Player.objects.get(
                id=int(request.POST["best-goalkeeper"]))

        global_bet.save()

    global_bet_list = []
    global_charts = {}
    winter_champion_chart = {}
    league_champion_chart = {}
    uefa_champion_chart = {}
    kings_cup_champion_chart = {}
    champions_league_champion_chart = {}

    if global_bet_result.date_limit_reached():
        for gb in GlobalBet.objects.filter(competition=competition):
            if gb.winter_champion is not None:
                if gb.winter_champion not in winter_champion_chart:
                    winter_champion_chart[gb.winter_champion] = 0
                winter_champion_chart[gb.winter_champion] = winter_champion_chart[gb.winter_champion] + 1

                if gb.league_champion not in league_champion_chart:
                    league_champion_chart[gb.league_champion] = 0
                league_champion_chart[gb.league_champion] = league_champion_chart[gb.league_champion] + 1

                if gb.uefa_champion not in uefa_champion_chart:
                    uefa_champion_chart[gb.uefa_champion] = 0
                uefa_champion_chart[gb.uefa_champion] = uefa_champion_chart[gb.uefa_champion] + 1

                if gb.kings_cup_champion not in kings_cup_champion_chart:
                    kings_cup_champion_chart[gb.kings_cup_champion] = 0
                kings_cup_champion_chart[gb.kings_cup_champion] = kings_cup_champion_chart[gb.kings_cup_champion] + 1

                if gb.champions_league_champion not in champions_league_champion_chart:
                    champions_league_champion_chart[gb.champions_league_champion] = 0
                champions_league_champion_chart[gb.champions_league_champion] = champions_league_champion_chart[gb.champions_league_champion] + 1



            global_bet_list.append({'user': gb.user.username, 'global_bet': gb})

    global_charts['winter_champion'] = []
    for key, value in winter_champion_chart.items():
        if key is not None:
            global_charts['winter_champion'].append([key.name, value])

    global_charts['league_champion'] = []
    for key, value in league_champion_chart.items():
        if key is not None:
            global_charts['league_champion'].append([key.name, value])

    global_charts['uefa_champion'] = []
    for key, value in uefa_champion_chart.items():
        if key is not None:
            global_charts['uefa_champion'].append([key.name, value])

    global_charts['kings_cup_champion'] = []
    for key, value in kings_cup_champion_chart.items():
        if key is not None:
            global_charts['kings_cup_champion'].append([key.name, value])

    global_charts['champions_league_champion'] = []
    for key, value in champions_league_champion_chart.items():
        if key is not None:
            global_charts['champions_league_champion'].append(
                [key.name, value])

    context = {'user': user, 'competition': competition,
               'global_bet_result': global_bet_result,
               'global_bet': global_bet,
               'spanish_league_teams': spanish_league_teams,
               'kings_cup_teams': kings_cup_teams, 'uefa_teams': uefa_teams,
               'champions_teams': champions_teams, 'goalkeepers': goalkeepers,
               'global_bet_list': global_bet_list,
               'global_charts': json.dumps(global_charts)}

    return render(request, 'userpanel/global_bets.html', context)


@login_required
@community_required
def match_day_ranking(request, competition_id, match_day_id):
    user = request.user
    competition = Competition.objects.get(id=competition_id)
    match_day = MatchDay.objects.get(id=match_day_id)
    if request.method == 'GET':
        user_point_list = []
        user_scorers_dict = {}
        for ua in UserAdministration.objects.filter(competition=competition):
            user_points = None
            if cache.get(
                'competition:{}:match_day:{}:user:{}:points'.format(
                    competition.id, match_day.id, ua.user.id)) is not None:
                user_points = cache.get(
                    'competition:{}:match_day:{}:user:{}:points'.format(
                        competition.id, match_day.id, ua.user.id))
            else:
                user_points = utils.get_user_match_day_points(ua.user,
                                                              match_day,
                                                              competition)
            cache.set('competition:{}:match_day:{}:user:{}:points'.format(
                competition.id, match_day.id, ua.user.id), user_points,
                TIMEOUT)

            user_bet_list = []
            for bet in Bet.objects.filter(
                    match_day=match_day,
                    user=ua.user).order_by('match__home_team__name'):
                user_bet_list.append(bet)

            user_point_list.append({'user': ua.user, 'points': user_points,
                                    'bets': user_bet_list})

            user_scorers = GoalsBet.objects.filter(user=ua.user,
                                                   match_day=match_day).first()
            user_scorers_dict[ua.user.username] = user_scorers

        player_goal_dict = {}

        for pg in PlayerGoal.objects.filter(match_day=match_day):
            player_goal_dict[pg.player] = pg

        context = {'user': user, 'competition': competition,
                   'match_day': match_day, 'user_point_list': user_point_list,
                   'user_scorers_dict': user_scorers_dict,
                   'player_goal_dict': player_goal_dict}

        return render(request, 'userpanel/match_day_ranking.html', context)


@login_required
@community_required
def global_ranking(request, competition_id):
    user = request.user
    competition = Competition.objects.get(id=competition_id)
    user_point_list = []
    global_bet_points = {}
    match_points = {}

    global_results = GlobalResults.objects.filter(
        season=competition.season).first()

    for ua in competition.useradministration_set.all():
        total_user_points = 0
        for match_day in competition.season.matchday_set.all():
            if cache.get(
                    'competition:{}:match_day:{}:user:{}:points'.format(
                        competition.id, match_day.id, ua.user.id)) is not None:
                user_points = cache.get(
                    'competition:{}:match_day:{}:user:{}:points'.format(
                        competition.id, match_day.id, ua.user.id))
            else:
                user_points = utils.get_user_match_day_points(ua.user,
                                                              match_day,
                                                              competition)
            cache.set(
                'competition:{}:match_day:{}:user:{}:points'.format(
                    competition.id, match_day.id, ua.user.id),
                user_points, TIMEOUT)
            total_user_points += user_points

        global_points = 0
        if cache.get(
                'competiton:{}:global:user:{}:points'.format(
                    competition.id, ua.user.id)) is not None:
            global_points = cache.get(
                'competiton:{}:global:user:{}:points'.format(
                    competition.id, ua.user.id))
        else:
            global_points = utils.get_user_global_points(ua.user,
                                                         competition,
                                                         global_results)
        cache.set(
            'competiton:{}:global:user:{}:points'.format(
                competition.id, ua.user.id), global_points, TIMEOUT)
        global_bet_points[ua.user] = global_points

        match_points[ua.user] = total_user_points

        total_user_points += global_points

        user_point_list.append({'user': ua.user, 'points': total_user_points})
    context = {'user': user, 'competition': competition,
               'match_day': match_day, 'user_point_list': user_point_list,
               'global_points': global_bet_points,
               'match_points': match_points}

    return render(request, 'userpanel/global-ranking.html', context)


@login_required
@community_required
def community_dashboard(request, competition_id):
    user = request.user
    competition = Competition.objects.get(id=competition_id)
    if request.method == 'GET':
        context = {}
        context['competition'] = competition

        user_point_list = []
        for ua in competition.useradministration_set.all():
            total_user_points = 0
            for match_day in competition.season.matchday_set.all():
                if cache.get('competition:{}:match_day:{}:user:{}:points'.format(competition.id, match_day.id, ua.user.id)) != None:
                    user_points = cache.get('competition:{}:match_day:{}:user:{}:points'.format(competition.id, match_day.id, ua.user.id))
                else:
                    user_points = utils.get_user_match_day_points(ua.user, match_day, competition)
                cache.set('competition:{}:match_day:{}:user:{}:points'.format(competition.id, match_day.id, ua.user.id), user_points, TIMEOUT)
                total_user_points += user_points

            if cache.get(
                    'competiton:{}:global:user:{}:points'.format(
                        competition.id, ua.user.id)) is not None:
                global_points = cache.get(
                    'competiton:{}:global:user:{}:points'.format(
                        competition.id, ua.user.id))
            else:
                global_results = GlobalResults.objects.filter(
                    season=competition.season).first()
                global_points = utils.get_user_global_points(
                    ua.user, competition, global_results)
                cache.set(
                    'competiton:{}:global:user:{}:points'.format(
                        competition.id, ua.user.id), global_points, TIMEOUT)

            total_user_points += global_points

            user_point_list.append({'user': ua.user,
                                    'points': total_user_points})

        user_point_list = dictsortreversed(user_point_list, 'points')
        if len(user_point_list) <= 12:
            limited_user_point_list = user_point_list
        else:
            limited_user_point_list = []
            user_index = 0

            for item in user_point_list:
                if item['user'] == user:
                    break
                user_index += 1

            lower_bound = user_index - 6
            if lower_bound < 0:
                lower_bound = 0

            upper_bound = lower_bound + 11
            if upper_bound >= len(user_point_list):
                upper_bound = len(user_point_list)
            if upper_bound - lower_bound < 12:
                lower_bound = lower_bound -  (11 - (upper_bound - lower_bound))

                print user_index, lower_bound, upper_bound

            for i in range(lower_bound, upper_bound):
                user_dict = user_point_list[i]
                user_dict['position'] = i + 1
                limited_user_point_list.append(user_dict)

        context['user_list'] = limited_user_point_list

        next_match_day = MatchDay.objects.filter(season=competition.season, start_date__gt=datetime.datetime.now()).first()
        context['next_match_day'] = next_match_day

        if next_match_day is not None:
            match_set = next_match_day.match_set.all()
            next_match_day_bet_list = []
            for match in match_set:
                bet = Bet.objects.filter(user=user, match=match, match_day=next_match_day, competition=competition).first()
                if bet == None:
                    bet = Bet(user=user, match=match, match_day=next_match_day, competition=competition)
                    bet.save()
                next_match_day_bet_list.append(bet)
            context['next_match_day_bet_list'] = next_match_day_bet_list

        user_scorers = GoalsBet.objects.filter(user=user, match_day=next_match_day).first()
        context['goals_bet'] = user_scorers

        player_goal_dict = {}

        for pg in PlayerGoal.objects.filter(match_day=next_match_day):
            player_goal_dict[pg.player] = pg

        context['player_goal_dict'] = player_goal_dict

        return render(request, 'userpanel/community_dashboard.html', context)
