from django.shortcuts import render
from django.contrib.auth.models import User
from core.models import MatchDay, Match, Bet
from django.forms.models import inlineformset_factory
from django.contrib.auth.decorators import login_required

# Create your views here.

@login_required
def match_day(request, id):
    user = request.user
    match_day = MatchDay.objects.get(id=id)
    if request.method == 'GET':
        match_set = match_day.match_set.all()
        bet_list = []
        for match in match_set:
            bet = Bet.objects.filter(user=user, match=match, match_day=match_day).first()
            if bet == None:
                bet = Bet(user=user, match=match, match_day=match_day)
                bet.save()
            bet_list.append(bet)
        context = {'user': user, 'match_day': match_day, 'bet_list': bet_list}
        return render(request, 'userpanel/match_day.html', context)
    if request.method == 'POST':
        for bet in Bet.objects.filter(user=user, match_day=match_day).all():
            bet.home_goals = request.POST['home_team-bet-id-%s' % bet.id]
            bet.foreign_goals = request.POST['foreign_team-bet-id-%s' % bet.id]
            bet.save()
