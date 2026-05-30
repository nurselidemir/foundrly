from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0016_make_all_mentors_premium"),
    ]

    operations = [
        migrations.CreateModel(
            name="MentorRequestMessage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("content", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "mentor_request",
                    models.ForeignKey(
                        on_delete=models.deletion.CASCADE,
                        related_name="messages",
                        to="users.mentorrequest",
                    ),
                ),
                (
                    "sender",
                    models.ForeignKey(
                        on_delete=models.deletion.CASCADE,
                        related_name="sent_mentor_request_messages",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["created_at"],
            },
        ),
    ]
