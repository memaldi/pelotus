from django.shortcuts import render, redirect
from core.forms import CommunityForm, CommunitySearchForm, UserCreateForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required
from core.models import Community, UserAdministration, Competition
from django.contrib.auth.models import User

# Create your views here.
def home(request):
	user = request.user
	current_competition = None
	if not user.is_anonymous():
		for ua in UserAdministration.objects.filter(user=user):
			if ua.competition.season.is_current():
				current_competition = ua.competition
				break
	print current_competition
	context = {'user': user, 'competition': current_competition}
	return render(request, 'core/home.html', context)

# def join(request):
# 	return render_to_response('core/join.html')

def join(request):
	if request.method == 'GET':
		form = UserCreateForm()
		context = {'form': form}
		return render(request, 'core/join.html', context)
	elif request.method == 'POST':
		form = UserCreateForm(request.POST)
		if form.is_valid():
			user = User.objects.create_user(form.data['username'], form.data['email'], form.data['password1'])
			user.save()
			user = authenticate(username=form.data['username'], password=form.data['password1'])
			if user.is_active:
				auth_login(request, user)
			return redirect('/registration/community/')
		else:
			context = {'form': form}
			return render(request, 'core/join.html', context)

def registration_community(request):
	if request.method == 'GET':
		community_form = CommunityForm()
		community_search_form = CommunitySearchForm()
		context = {'community_form': community_form, 'community_search_form': community_search_form}
		return render(request, 'core/registration_community.html', context)
	elif request.method == 'POST':
		f = CommunityForm(request.POST)
		if f.is_valid():
			new_community = f.save()
			return render(request, '/userpanel/community-dashboard.html')
		else:
			context = {'community_form': f}
			return render(request, 'core/registration_community.html', context)

def login(request):
	if request.method == 'GET':
		login_form = AuthenticationForm(request)
		context = {'form': login_form}
		return render(request, 'core/login.html', context)
	elif request.method == 'POST':
		login_form = AuthenticationForm(data=request.POST)
		print request.POST.get('next')
		if login_form.is_valid():
			username = login_form.data['username']
			password = login_form.data['password']
			user = authenticate(username=username, password=password)
			if user.is_active:
				auth_login(request, user)
				user_administrations = UserAdministration.objects.filter(user=user)
				for user_administration in user_administrations:
						if user_administration.competition.season.is_current():
							return redirect(request.POST.get('next','/userpanel/competition/%s/dashboard/' % user_administration.competition.id))
		else:
			context = {'form': login_form}
			return render(request, 'core/login.html', context)

@login_required
def logout(request):
	auth_logout(request)
	return redirect('/')

def join_community(request):
	user = request.user
	if request.method == 'POST':
		community_search_form = CommunitySearchForm(request.POST)
		print community_search_form
		community = Community.objects.filter(name=community_search_form.data['name']).first()
		current_competition = None
		for competition in Competition.objects.filter(community=community):
			if competition.season.is_current():
				current_competition = competition
				break

		if current_competition != None:
			ua = UserAdministration.objects.filter(user=user, competition=current_competition).first()
			if ua != None:
				ua = UserAdministration(user=user, competition=current_competition, is_admin=False)
				ua.save()

			return redirect('/userpanel/competition/%s/dashboard/' % current_competition.id )
		else:
			community_form = CommunityForm()
			context = {'community_form': community_form, 'community_search_form': community_search_form}
			return render(request, 'core/registration_community.html', context)
