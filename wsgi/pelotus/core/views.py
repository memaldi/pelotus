from django.shortcuts import render
from core.forms import CommunityForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse

# Create your views here.
def home(request):
	return render(request, 'core/home.html')

# def join(request):
# 	return render_to_response('core/join.html')

def registration_community(request):
	if request.method == 'GET':
		community_form = CommunityForm()
		context = {'community_form': community_form}
		return render(request, 'core/registration_community.html', context)
	elif request.method == 'POST':
		f = CommunityForm(request.POST)
		if f.is_valid():
			new_community = f.save()
			return render(request, 'userpanel/community_dashboard.html')
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
		if login_form.is_valid():
			return HttpResponseRedirect(request.build_absolute_uri(reverse('userpanel.views.dashboard')))
		else:
			context = {'form': login_form}
			return render(request, 'core/login.html', context)
