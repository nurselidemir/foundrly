from django.utils import timezone
from rest_framework import serializers

from apps.users.models import PremiumSubscription, User, VerificationRequest


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "title",
            "bio",
            "skills",
            "interests",
            "is_verified_talent",
            "is_premium",
            "date_joined",
        ]
        read_only_fields = ["id", "is_verified_talent", "is_premium", "date_joined"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "password",
            "full_name",
            "title",
            "bio",
            "skills",
            "interests",
        ]
        read_only_fields = ["id"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        return User.objects.create_user(password=password, **validated_data)


class PremiumSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PremiumSubscription
        fields = [
            "plan",
            "price_label",
            "status",
            "started_at",
            "updated_at",
        ]
        read_only_fields = ["price_label", "status", "started_at", "updated_at"]


class PremiumSubscribeSerializer(serializers.Serializer):
    plan = serializers.ChoiceField(choices=["monthly", "yearly"])

    def create(self, validated_data):
        user = self.context["request"].user
        plan = validated_data["plan"]
        price_label = "$5 / ay" if plan == "monthly" else "$48 / yil"

        subscription, _ = PremiumSubscription.objects.update_or_create(
            user=user,
            defaults={
                "plan": plan,
                "price_label": price_label,
                "status": PremiumSubscription.STATUS_ACTIVE,
            },
        )

        user.is_premium = True
        user.save(update_fields=["is_premium"])
        return subscription


class VerificationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationRequest
        fields = [
            "id",
            "requested_title",
            "portfolio_url",
            "note",
            "status",
            "reviewed_note",
            "created_at",
            "reviewed_at",
        ]
        read_only_fields = ["id", "status", "reviewed_note", "created_at", "reviewed_at"]

    def validate(self, attrs):
        user = self.context["request"].user

        if not user.is_premium:
            raise serializers.ValidationError("Verified Talent basvurusu sadece premium kullanicilar icindir.")

        if user.is_verified_talent:
            raise serializers.ValidationError("Kullanici zaten verified talent rozetine sahip.")

        if VerificationRequest.objects.filter(user=user, status=VerificationRequest.STATUS_PENDING).exists():
            raise serializers.ValidationError("Kullanicinin bekleyen bir verified talent basvurusu zaten var.")

        return attrs

    def create(self, validated_data):
        return VerificationRequest.objects.create(user=self.context["request"].user, **validated_data)


class VerificationReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationRequest
        fields = ["status", "reviewed_note"]

    def validate_status(self, value):
        if value not in {
            VerificationRequest.STATUS_APPROVED,
            VerificationRequest.STATUS_REJECTED,
        }:
            raise serializers.ValidationError("Inceleme sonucu approved veya rejected olmali.")
        return value

    def update(self, instance, validated_data):
        status = validated_data["status"]
        instance.status = status
        instance.reviewed_note = validated_data.get("reviewed_note", "")
        instance.reviewed_at = timezone.now()
        instance.save(update_fields=["status", "reviewed_note", "reviewed_at"])

        user = instance.user
        user.is_verified_talent = status == VerificationRequest.STATUS_APPROVED
        user.save(update_fields=["is_verified_talent"])
        return instance
