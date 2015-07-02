from django import forms
from django.forms import ModelForm
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from core.models import Community

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