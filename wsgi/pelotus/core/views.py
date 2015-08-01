from django.shortcuts import render, redirect
from core.forms import CommunityForm, CommunitySearchForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login as auth_login
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from core.models import UserAdministration

# Create your views here.
def home(request):
	return render(request, 'core/home.html')

# def join(request):
# 	return render_to_response('core/join.html')

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

def join_community(request):
	if request.method == 'POST':
		community_search_form = CommunitySearchForm(request.POST)
		if community_search_form.is_valid():
			return redirect(request.POST.get('next','/userpanel/community-dashboard/'))
		else:
			community_form = CommunityForm()
			context = {'community_form': community_form, 'community_search_form': community_search_form}
			return render(request, 'core/registration_community.html', context)
