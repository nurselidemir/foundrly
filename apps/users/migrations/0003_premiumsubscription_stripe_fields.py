from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0002_alter_user_is_staff"),
    ]

    operations = [
        migrations.AddField(
            model_name="premiumsubscription",
            name="stripe_checkout_session_id",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name="premiumsubscription",
            name="stripe_customer_id",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name="premiumsubscription",
            name="stripe_subscription_id",
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
