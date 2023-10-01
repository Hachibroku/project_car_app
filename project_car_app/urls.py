from django.contrib import admin
from django.urls import include, path, re_path
from projects.views import FrontendAppView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('projects/', include('projects.urls')),
    re_path(r'^.*$', FrontendAppView.as_view()),
]
