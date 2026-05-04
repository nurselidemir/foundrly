from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("projects", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ApplicationMessage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("content", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "application",
                    models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="messages", to="projects.teamapplication"),
                ),
                (
                    "sender",
                    models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="sent_application_messages", to=settings.AUTH_USER_MODEL),
                ),
            ],
            options={"ordering": ["created_at"]},
        ),
    ]
