from django.contrib import admin
from .models import Vehicle, Job, Part, Tool

admin.site.register(Vehicle)
admin.site.register(Job)
admin.site.register(Part)
admin.site.register(Tool)
