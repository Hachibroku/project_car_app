from rest_framework import generics
from .models import Vehicle, Job, Part, Tool
from .serializers import VehicleSerializer, JobSerializer, PartSerializer, ToolSerializer


class VehicleListCreate(generics.ListCreateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer


class VehicleRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

# Repeat the pattern for Job, Part, and Tool models.
