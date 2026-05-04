from django.conf import settings
from django.db import models


class Project(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=255)
    summary = models.TextField()
    problem_statement = models.TextField(blank=True)
    tech_stack = models.JSONField(default=list, blank=True)
    needed_roles = models.JSONField(default=list, blank=True)
    is_premium_highlighted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title


class TeamApplication(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="applications")
    applicant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="applications")
    message = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("accepted", "Accepted"),
            ("rejected", "Rejected"),
        ],
        default="pending",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["project", "applicant"], name="unique_project_application")
        ]

    def __str__(self) -> str:
        return f"{self.applicant.full_name} -> {self.project.title}"


class ApplicationMessage(models.Model):
    application = models.ForeignKey(
        TeamApplication,
        on_delete=models.CASCADE,
        related_name="messages",
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_application_messages",
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"{self.sender.email} -> application {self.application_id}"
