from django.db import migrations


def normalize_mentor_request_pricing(apps, schema_editor):
    User = apps.get_model("users", "User")
    MentorRequest = apps.get_model("users", "MentorRequest")

    for request in MentorRequest.objects.select_related("mentor").all():
        mentor_price = request.mentor.mentor_price or 0
        changed_fields = []

        if request.price_at_request is None or request.price_at_request <= 0:
            request.price_at_request = mentor_price
            changed_fields.append("price_at_request")

        if request.offered_price is None or request.offered_price <= 0:
            request.offered_price = request.price_at_request or mentor_price
            changed_fields.append("offered_price")

        if request.status in {"paid_reserved", "mentor_completed", "released"} and (request.reserved_amount is None or request.reserved_amount <= 0):
            request.reserved_amount = request.offered_price or request.price_at_request or mentor_price
            changed_fields.append("reserved_amount")

        if changed_fields:
            request.save(update_fields=changed_fields)

    User.objects.filter(mentor_credits__gt=0).update(mentor_credits=0)


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0018_enrich_demo_profiles_and_projects"),
    ]

    operations = [
        migrations.RunPython(normalize_mentor_request_pricing, noop_reverse),
    ]
