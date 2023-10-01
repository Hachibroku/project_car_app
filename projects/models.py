from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import datetime

class Vehicle(models.Model):
    name = models.CharField(max_length=255, help_text="Name of the Vehicle")
    make = models.CharField(max_length=255, help_text="Make of the Vehicle")
    model = models.CharField(max_length=255, help_text="Model of the Vehicle")
    year = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1886),  # The year the first car was made
            MaxValueValidator(datetime.date.today().year)],  # Current year
        help_text="Manufacturing Year of the Vehicle"
    )

    def __str__(self):
        return f"{self.name} - {self.make} {self.model} ({self.year})"


class Job(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=255, help_text="Title of the Job")
    description = models.TextField(help_text="Description of the Job")
    estimated_time = models.DurationField(help_text="Estimated Time to complete the Job")

    def __str__(self):
        return f"{self.title} - {self.vehicle.name}"


class Part(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='parts')
    name = models.CharField(max_length=255, help_text="Name of the Part")
    part_number = models.CharField(max_length=255, blank=True, null=True, help_text="Part Number if available")

    def __str__(self):
        return f"{self.name} - {self.job.title}"


class Tool(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='tools')
    name = models.CharField(max_length=255, help_text="Name of the Tool")

    def __str__(self):
        return f"{self.name} - {self.job.title}"
