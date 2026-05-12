from django.db.models import Avg, Q
from django.utils import timezone
from rest_framework import serializers

from apps.users.models import (
    FriendRequest,
    MentorRequest,
    PremiumSubscription,
    User,
    UserReview,
    VerificationRequest,
)


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
            "profile_picture",
            "is_verified_talent",
            "is_premium",
            "is_mentor",
            "mentor_credits",
            "mentor_price",
            "mentor_balance",
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


class PublicUserReviewSerializer(serializers.ModelSerializer):
    reviewer = serializers.SerializerMethodField()
    project = serializers.SerializerMethodField()

    class Meta:
        model = UserReview
        fields = [
            "id",
            "reviewer",
            "project",
            "rating",
            "comment",
            "created_at",
        ]

    def get_reviewer(self, obj):
        return {
            "id": obj.reviewer.id,
            "full_name": obj.reviewer.full_name,
            "title": obj.reviewer.title,
            "is_verified_talent": obj.reviewer.is_verified_talent,
        }

    def get_project(self, obj):
        return {
            "id": obj.application.project_id,
            "title": obj.application.project.title,
        }


class PublicUserProfileSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    recent_projects = serializers.SerializerMethodField()
    eligible_review_applications = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "full_name",
            "title",
            "bio",
            "skills",
            "interests",
            "profile_picture",
            "is_verified_talent",
            "is_premium",
            "date_joined",
            "average_rating",
            "reviews_count",
            "reviews",
            "recent_projects",
            "eligible_review_applications",
        ]

    def get_average_rating(self, obj):
        value = obj.received_reviews.aggregate(avg=Avg("rating"))["avg"]
        return round(value, 1) if value is not None else None

    def get_reviews_count(self, obj):
        return obj.received_reviews.count()

    def get_reviews(self, obj):
        reviews = (
            obj.received_reviews.select_related(
                "reviewer",
                "application__project",
            ).all()[:10]
        )
        return PublicUserReviewSerializer(reviews, many=True).data

    def get_recent_projects(self, obj):
        projects = obj.projects.order_by("-created_at")[:3]
        return [
            {
                "id": project.id,
                "title": project.title,
                "summary": project.summary,
                "created_at": project.created_at,
            }
            for project in projects
        ]

    def get_eligible_review_applications(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated or request.user.id == obj.id:
            return []

        from apps.projects.models import TeamApplication

        applications = (
            TeamApplication.objects.select_related("project", "project__owner", "applicant")
            .filter(status="accepted")
            .filter(
                (
                    Q(project__owner=request.user, applicant=obj)
                    | Q(project__owner=obj, applicant=request.user)
                )
            )
        )
        applications = applications.exclude(
            user_reviews__reviewer=request.user
        )
        return [
            {
                "application_id": application.id,
                "project_id": application.project_id,
                "project_title": application.project.title,
                "counterpart_role": obj.title,
            }
            for application in applications.distinct()[:10]
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
        user.mentor_credits = 3
        user.save(update_fields=["is_premium", "mentor_credits"])
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
        fields = ["is_active", "is_verified_talent", "is_premium", "is_mentor", "mentor_price"]

    def validate(self, attrs):
        request = self.context["request"]
        if not request.user.is_staff:
            raise serializers.ValidationError("Bu islem sadece admin kullanicilar icindir.")
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


class UserReviewCreateSerializer(serializers.ModelSerializer):
    application_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = UserReview
        fields = [
            "id",
            "application_id",
            "rating",
            "comment",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Puan 1 ile 5 arasinda olmali.")
        return value

    def validate(self, attrs):
        request = self.context["request"]
        profile_user = self.context["profile_user"]
        application_id = attrs["application_id"]

        from apps.projects.models import TeamApplication

        try:
            application = TeamApplication.objects.select_related("project__owner", "applicant").get(
                pk=application_id,
                status="accepted",
            )
        except TeamApplication.DoesNotExist as exc:
            raise serializers.ValidationError("Gecerli bir accepted proje kaydi bulunamadi.") from exc

        if request.user.id == profile_user.id:
            raise serializers.ValidationError("Kullanici kendisine yorum birakamaz.")

        valid_pair = {
            application.project.owner_id,
            application.applicant_id,
        } == {request.user.id, profile_user.id}

        if not valid_pair:
            raise serializers.ValidationError(
                "Yorum birakmak icin bu kullanici ile kabul edilmis ayni projede yer alman gerekiyor."
            )

        if UserReview.objects.filter(application=application, reviewer=request.user).exists():
            raise serializers.ValidationError("Bu proje icin bu kullaniciya zaten yorum biraktin.")

        attrs["application"] = application
        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        profile_user = self.context["profile_user"]
        application = validated_data.pop("application")
        validated_data.pop("application_id", None)
        return UserReview.objects.create(
            reviewer=request.user,
            reviewee=profile_user,
            application=application,
            **validated_data,
        )


class MentorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "full_name", "title", "bio", "skills", "profile_picture", "is_mentor", "mentor_price"]


class MentorRequestSerializer(serializers.ModelSerializer):
    mentor_details = MentorSerializer(source="mentor", read_only=True)
    user_details = MentorSerializer(source="user", read_only=True)

    class Meta:
        model = MentorRequest
        fields = [
            "id",
            "mentor",
            "mentor_details",
            "user",
            "user_details",
            "message",
            "status",
            "price_at_request",
            "offered_price",
            "commission_rate",
            "created_at",
        ]
        read_only_fields = ["id", "user", "price_at_request", "commission_rate", "created_at"]

    def validate(self, attrs):
        user = self.context["request"].user
        if not user.is_premium:
            raise serializers.ValidationError("Mentor destegi sadece premium kullanicilar icindir.")

        mentor = attrs["mentor"]
        if not mentor.is_mentor:
            raise serializers.ValidationError("Secilen kullanici bir mentor degildir.")

        # Price is now offered by the mentor later, so we just check credits if they want a free session
        # but even if they don't have credits, they can request, and the mentor will offer a price.
        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        # We'll use price_at_request=0 to indicate it's an offer-based request initially
        # If user had credits, we'll mark it as 0 (free)
        price = -1 # -1 means "Waiting for offer"
        if user.mentor_credits > 0:
            user.mentor_credits -= 1
            user.save(update_fields=["mentor_credits"])
            price = 0 # 0 means "Free session used"

        return MentorRequest.objects.create(
            user=user, 
            price_at_request=price,
            commission_rate=0.20,
            **validated_data
        )


class FriendRequestSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.full_name", read_only=True)
    receiver_name = serializers.CharField(source="receiver.full_name", read_only=True)

    class Meta:
        model = FriendRequest
        fields = ["id", "sender", "sender_name", "receiver", "receiver_name", "status", "created_at"]
        read_only_fields = ["id", "sender", "status", "created_at"]
