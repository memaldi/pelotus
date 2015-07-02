from django.shortcuts import render
from core.forms import CommunityForm

# Create your views here.
def home(request):
	return render(request, 'core/home.html')

# def join(request):
# 	return render_to_response('core/join.html')

def registration_community(request):
	print request.method
	if request.method == 'GET':
		community_form = CommunityForm()
		context = {'community_form': community_form}
		return render(request, 'core/registration_community.html', context)
	elif request.method == 'POST':
		f = CommunityForm(request.POST)
		new_community = f.save()
		return render(request, 'userpanel/community_dashboard.html')