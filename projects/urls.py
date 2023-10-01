from django.urls import path
from .api_views import VehicleListCreate, VehicleRetrieveUpdateDestroy

urlpatterns = [
    path('api/vehicles/', VehicleListCreate.as_view(), name='vehicle_list_create'),
    path('api/vehicles/<int:pk>/', VehicleRetrieveUpdateDestroy.as_view(), name='vehicle_retrieve_update_destroy'),
    # other urls here
]
