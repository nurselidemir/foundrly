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
            "is_staff",
            "is_superuser",
            "date_joined",
        ]
        read_only_fields = [
            "id",
            "is_verified_talent",
            "is_premium",
            "is_staff",
            "is_superuser",
            "date_joined",
        ]


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


class AdminUserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "title",
            "is_staff",
            "is_superuser",
        ]
        read_only_fields = ["id", "email", "full_name", "title"]

    def validate(self, attrs):
        request = self.context["request"]
        if not request.user.is_superuser:
            raise serializers.ValidationError("Bu islem sadece superuser tarafindan yapilabilir.")
        return attrs

    def update(self, instance, validated_data):
        instance.is_staff = validated_data.get("is_staff", instance.is_staff)
        instance.is_superuser = validated_data.get("is_superuser", instance.is_superuser)

        if instance.is_superuser:
            instance.is_staff = True

        if not instance.is_staff:
            instance.is_superuser = False

        instance.save(update_fields=["is_staff", "is_superuser"])
        return instance


class AdminUserDetailSerializer(serializers.ModelSerializer):
    recent_projects = serializers.SerializerMethodField()
    recent_applications = serializers.SerializerMethodField()
    recent_messages = serializers.SerializerMethodField()
    metrics = serializers.SerializerMethodField()

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
            "is_staff",
            "is_superuser",
            "is_active",
            "date_joined",
            "metrics",
            "recent_projects",
            "recent_applications",
            "recent_messages",
        ]

    def get_metrics(self, obj):
        return {
            "owned_projects_count": obj.projects.count(),
            "applications_count": obj.applications.count(),
            "accepted_memberships_count": obj.applications.filter(status="accepted").count(),
            "sent_messages_count": obj.sent_application_messages.count(),
            "verification_requests_count": obj.verification_requests.count(),
        }

    def get_recent_projects(self, obj):
        return [
            {
                "id": project.id,
                "title": project.title,
                "created_at": project.created_at,
            }
            for project in obj.projects.order_by("-created_at")[:5]
        ]

    def get_recent_applications(self, obj):
        return [
            {
                "id": application.id,
                "project_id": application.project_id,
                "project_title": application.project.title,
                "status": application.status,
                "created_at": application.created_at,
            }
            for application in obj.applications.select_related("project").order_by("-created_at")[:5]
        ]

    def get_recent_messages(self, obj):
        return [
            {
                "id": message.id,
                "application_id": message.application_id,
                "content": message.content,
                "created_at": message.created_at,
            }
            for message in obj.sent_application_messages.order_by("-created_at")[:5]
        ]


class AdminUserModerationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["is_active", "is_verified_talent", "is_premium"]

    def validate(self, attrs):
        request = self.context["request"]
        if not request.user.is_superuser:
            raise serializers.ValidationError("Bu islem sadece superuser tarafindan yapilabilir.")
        return attrs


class AdminVerificationRequestSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = VerificationRequest
        fields = [
            "id",
            "user",
            "requested_title",
            "portfolio_url",
            "note",
            "status",
            "reviewed_note",
            "created_at",
            "reviewed_at",
        ]

    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "email": obj.user.email,
            "full_name": obj.user.full_name,
            "title": obj.user.title,
            "is_verified_talent": obj.user.is_verified_talent,
        }
