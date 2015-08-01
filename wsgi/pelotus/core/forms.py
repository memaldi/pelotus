from django import forms
from django.forms import ModelForm
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from core.models import Community
import autocomplete_light

class UserCreateForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2")

    def save(self, commit=True):
        user = super(UserCreateForm, self).save(commit=False)
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user

class CommunityForm(ModelForm):
    #name = forms.CharField(required=True)

    class Meta:
        model = Community
        fields = ['name', 'description']

    # def save(self, commit=True):
    #     community = super(CommunityForm, self).save(commit=False)
    #     community.name = self.cleaned_data["name"]
    #     if commit:
    #         community.save()
    #     return community

class CommunitySearchForm(autocomplete_light.ModelForm):
    class Meta:
        model = Community
        fields = ['name']
        widgets = {
            'name': autocomplete_light.TextWidget('CommunityAutocomplete'),
        }

    def clean(self):
        cleaned_data = super(CommunitySearchForm, self).clean()
        name = cleaned_data.get("name")

        community = Community.objects.filter(name=name).all()
        if len(community) == 0:
            raise forms.ValidationError('Community "%s" does not exist!' % name)
            
        return cleaned_data
