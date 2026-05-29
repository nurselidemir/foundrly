from django.db import migrations, models


def migrate_mentor_request_statuses(apps, schema_editor):
    MentorRequest = apps.get_model("users", "MentorRequest")

    for request in MentorRequest.objects.all():
        if request.status == "accepted":
            request.status = "paid_reserved" if request.user_confirmed else "offered"
            if request.price_at_request > 0:
                request.reserved_amount = request.price_at_request
            elif request.offered_price > 0:
                request.reserved_amount = request.offered_price
            request.save(update_fields=["status", "reserved_amount"])
        elif request.status == "completed":
            request.status = "released"
            if request.price_at_request > 0:
                request.reserved_amount = request.price_at_request
            elif request.offered_price > 0:
                request.reserved_amount = request.offered_price
            request.save(update_fields=["status", "reserved_amount"])


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0013_communityeventregistration"),
    ]

    operations = [
        migrations.AddField(
            model_name="mentorrequest",
            name="dispute_reason",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="mentorrequest",
            name="disputed_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="mentorrequest",
            name="mentor_completed_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="mentorrequest",
            name="released_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="mentorrequest",
            name="reserved_amount",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddField(
            model_name="mentorrequest",
            name="user_confirmed_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="mentorrequest",
            name="status",
            field=models.CharField(
                choices=[
                    ("pending", "Pending"),
                    ("offered", "Offered"),
                    ("paid_reserved", "Paid Reserved"),
                    ("mentor_completed", "Mentor Completed"),
                    ("released", "Released"),
                    ("disputed", "Disputed"),
                    ("declined", "Declined"),
                    ("refunded", "Refunded"),
                ],
                default="pending",
                max_length=20,
            ),
        ),
        migrations.RunPython(migrate_mentor_request_statuses, migrations.RunPython.noop),
    ]
