from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0012_mentorrequest_meeting_time_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="CommunityEventRegistration",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("event", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="registrations", to="users.communityevent")),
                ("user", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="event_registrations", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddConstraint(
            model_name="communityeventregistration",
            constraint=models.UniqueConstraint(fields=("user", "event"), name="unique_event_registration"),
        ),
    ]
