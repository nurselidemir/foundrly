from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("projects", "0001_initial"),
        ("users", "0004_remove_premiumsubscription_stripe_checkout_session_id_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="UserReview",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("rating", models.PositiveSmallIntegerField()),
                ("comment", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "application",
                    models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="user_reviews", to="projects.teamapplication"),
                ),
                (
                    "reviewee",
                    models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="received_reviews", to=settings.AUTH_USER_MODEL),
                ),
                (
                    "reviewer",
                    models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="written_reviews", to=settings.AUTH_USER_MODEL),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddConstraint(
            model_name="userreview",
            constraint=models.UniqueConstraint(fields=("application", "reviewer"), name="unique_application_reviewer_review"),
        ),
    ]
