import autocomplete_light.shortcuts as al
from core.models import Community

al.register(Community,
    search_fields = ['^name', 'name'],
    attrs={
        # This will set the input placeholder attribute:
        'placeholder': 'Community name',
        # This will set the yourlabs.Autocomplete.minimumCharacters
        # options, the naming conversion is handled by jQuery
        'data-autocomplete-minimum-characters': 3,
    },
    widget_attrs={
        'data-widget-maximum-values': 4,
        # Enable modern-style widget !
        'class': 'modern-style',
    },
)
