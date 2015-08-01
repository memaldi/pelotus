from django.conf.urls import patterns, include, url
from django.views.generic.edit import CreateView
#from django.contrib.auth.forms import UserCreationForm
from core.forms import UserCreateForm

import autocomplete_light
autocomplete_light.autodiscover()

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'core.views.home', name='home'),
    # url(r'^openshift/', include('openshift.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^join/', CreateView.as_view(
    							template_name='core/join.html',
    							form_class=UserCreateForm,
    							success_url="/registration/community/")),
    url(r'^login/', 'core.views.login', name='login'),
    url(r'^registration/community/', 'core.views.registration_community', name='registration_community'),
    url(r'^registration/join-community/', 'core.views.join_community', name='join_community'),
    url(r'^userpanel/competition/(?P<competition_id>\d+)/dashboard/', 'userpanel.views.community_dashboard', name="community_dashboard"),
    url(r'^userpanel/match-day/(?P<id>\d+)$', 'userpanel.views.match_day', name='match_day'),
    # Uncomment the next line to enable the admin:
    (r'^grappelli/', include('grappelli.urls')),
    (r'^admin/', include(admin.site.urls)),
    url(r'^autocomplete/', include('autocomplete_light.urls')),
)
