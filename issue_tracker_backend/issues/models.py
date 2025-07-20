from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Issue(models.Model):
    STATUS_CHOICES = [
        ("OPEN", "Open"),
        ("IN_PROGRESS", "In Progress"),
        ("CLOSED", "Closed"),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="OPEN")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_issues")
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_issues")
    created_at = models.DateTimeField(auto_now_add=True)

    tags = models.CharField(max_length=255, blank=True) 
    priority = models.CharField(max_length=10, choices=[("LOW", "Low"), ("MEDIUM", "Medium"), ("HIGH", "High")], default="MEDIUM")

    def __str__(self):
        return self.title
    

class BoardInvitation(models.Model):
    invited_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_invites")
    invited_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_invites")
    created_at = models.DateTimeField(auto_now_add=True)

