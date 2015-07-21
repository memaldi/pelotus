from django.shortcuts import render
from django.contrib.auth.models import User
from core.models import MatchDay, Match
from django.forms.models import inlineformset_factory

# Create your views here.
def match_day(request, number):
    match_day = MatchDay.objects.get(number=number)
    MatchDayFormSet = inlineformset_factory(MatchDay, Match, can_delete=False)
    formset = MatchDayFormSet(instance=match_day)
    context = {'formset': formset, 'match_day': match_day}
    return render(request, 'userpanel/match_day.html', context)
