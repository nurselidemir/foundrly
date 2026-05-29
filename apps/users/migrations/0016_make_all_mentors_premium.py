from django.db import migrations


def make_mentors_premium(apps, schema_editor):
    User = apps.get_model("users", "User")
    User.objects.filter(is_mentor=True).update(is_premium=True, is_verified_talent=True)


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0015_communityguide"),
    ]

    operations = [
        migrations.RunPython(make_mentors_premium, migrations.RunPython.noop),
    ]
