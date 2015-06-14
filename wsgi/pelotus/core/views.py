from django.shortcuts import render_to_response

# Create your views here.
def home(request):
	return render_to_response('core/home.html')

# def join(request):
# 	return render_to_response('core/join.html')