from core.models import UserAdministration, Competition
from django.shortcuts import render, redirect

def community_required(function=None):
    def _dec(view_func):
        def _view(request, *args, **kwargs):
            user = request.user
            competition = Competition.objects.get(id=kwargs['competition_id'])
            ua = UserAdministration.objects.filter(user=user, competition=competition).first()
            if ua == None:
                return redirect('/registration/community/')
            else:
                return view_func(request, *args, **kwargs)

        _view.__name__ = view_func.__name__
        _view.__dict__ = view_func.__dict__
        _view.__doc__ = view_func.__doc__

        return _view

    if function is None:
        return _dec
    else:
        return _dec(function)
