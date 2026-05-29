from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0014_mentorrequest_workflow_upgrade"),
    ]

    operations = [
        migrations.CreateModel(
            name="CommunityGuide",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255)),
                ("read", models.CharField(max_length=80)),
                ("tone", models.CharField(max_length=80)),
                ("summary", models.TextField()),
                ("bullets", models.JSONField(blank=True, default=list)),
                ("is_published", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]
