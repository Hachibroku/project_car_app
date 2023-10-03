from django.urls import path
from .api_views import (
    VehicleListCreate,
    VehicleRetrieveUpdateDestroy,
    JobListCreate,
    JobRetrieveUpdateDestroy,
    PartListCreate,
    PartRetrieveUpdateDestroy,
    ToolListCreate,
    ToolRetrieveUpdateDestroy,
)

urlpatterns = [
    path('api/vehicles/', VehicleListCreate.as_view(), name='vehicle_list_create'),
    path('api/vehicles/<int:pk>/', VehicleRetrieveUpdateDestroy.as_view(), name='vehicle_retrieve_update_destroy'),
    path('api/jobs/', JobListCreate.as_view(), name='job_list_create'),
    path('api/jobs/<int:pk>/', JobRetrieveUpdateDestroy.as_view(), name='job_retrieve_update_destroy'),
    path('api/parts/', PartListCreate.as_view(), name='part_list_create'),
    path('api/parts/<int:pk>/', PartRetrieveUpdateDestroy.as_view(), name='part_retrieve_update_destroy'),
    path('api/tools/', ToolListCreate.as_view(), name='tool_list_create'),
    path('api/tools/<int:pk>/', ToolRetrieveUpdateDestroy.as_view(), name='tool_retrieve_update_destroy'),
]
