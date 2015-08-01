from django.shortcuts import render
from django.contrib.auth.models import User
from core.models import MatchDay, Match, Bet, UserAdministration, Competition
from django.forms.models import inlineformset_factory
from django.contrib.auth.decorators import login_required
import datetime

# Create your views here.

@login_required
def match_days(request, competition_id):
    user = request.user
    if request.method == 'GET':
        competition = Competition.objects.get(id=competition_id)
        context = {'competition': competition}
        return render(request, 'userpanel/match_days.html', context)

@login_required
def match_day(request, competition_id, match_day_id):
    user = request.user
    competition = Competition.objects.get(id=competition_id)
    match_day = MatchDay.objects.get(id=match_day_id)
    if request.method == 'GET':
        match_set = match_day.match_set.all()
        bet_list = []
        for match in match_set:
            bet = Bet.objects.filter(user=user, match=match, match_day=match_day, competition=competition).first()
            if bet == None:
                bet = Bet(user=user, match=match, match_day=match_day, competition=competition)
                bet.save()
            bet_list.append(bet)
        context = {'user': user, 'match_day': match_day, 'bet_list': bet_list, 'competition': competition}
        return render(request, 'userpanel/match_day.html', context)
    if request.method == 'POST':
        bet_list = []
        for bet in Bet.objects.filter(user=user, match_day=match_day).all():
            if request.POST['home_team-bet-id-%s' % bet.id] != '':
                bet.home_goals = request.POST['home_team-bet-id-%s' % bet.id]
            else:
                bet.home_goals = None
            if request.POST['foreign_team-bet-id-%s' % bet.id] != '':
                bet.foreign_goals = request.POST['foreign_team-bet-id-%s' % bet.id]
            else:
                bet.foreign_goals = None
            bet.save()
            bet_list.append(bet)
        context = {'user': user, 'match_day': match_day, 'bet_list': bet_list, 'competition': competition, 'correct': True}
        return render(request, 'userpanel/match_day.html', context)

@login_required
def community_dashboard(request, competition_id):
    user = request.user
    competition = Competition.objects.get(id=competition_id)
    if request.method == 'GET':
        context = {}
        context['competition'] = competition

        user_point_dict = {}
        for user_administration in competition.useradministration_set.all():
            user_points = 0
            for bet in Bet.objects.filter(user=user_administration.user, competition=competition):
                if bet.home_goals != None and bet.foreign_goals != None and bet.match.home_goals != None and bet.match.foreign_goals != None:
                    if bet.home_goals == bet.match.home_goals and bet.foreign_goals == bet.match.foreign_goals:
                        user_points += 8
                    elif bet.home_goals < bet.foreign_goals and bet.match.home_goals < bet.match.foreign_goals:
                        user_points += 5
                    elif bet.home_goals > bet.foreign_goals and bet.match.home_goals > bet.match.foreign_goals:
                        user_points += 5
                    elif bet.home_goals == bet.foreign_goals and bet.match.home_goals == bet.match.foreign_goals:
                        user_points += 5
            user_point_dict[user_administration.user] = user_points
        context['user_point_dict'] = user_point_dict

        next_match_day = MatchDay.objects.filter(season=competition.season, start_date__gt=datetime.datetime.now()).first()
        context['next_match_day'] = next_match_day

        match_set = next_match_day.match_set.all()
        next_match_day_bet_list = []
        for match in match_set:
            bet = Bet.objects.filter(user=user, match=match, match_day=next_match_day, competition=competition).first()
            if bet == None:
                bet = Bet(user=user, match=match, match_day=next_match_day, competition=competition)
                bet.save()
            next_match_day_bet_list.append(bet)
        context['next_match_day_bet_list'] = next_match_day_bet_list

        return render(request, 'userpanel/community_dashboard.html', context)
