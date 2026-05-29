from django.db.models import Avg, Q
from django.utils import timezone
from rest_framework import serializers

from apps.users.models import (
    CommunityEvent,
    CommunityEventRegistration,
    CommunityGuide,
    CommunityThread,
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
    active_application_id = serializers.SerializerMethodField()

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
            "active_application_id",
        ]

    def get_active_application_id(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated or request.user.id == obj.id:
            return None

        from apps.projects.models import TeamApplication

        application = (
            TeamApplication.objects.filter(
                status__in=["accepted", "pending"]
            )
            .filter(
                (
                    Q(project__owner=request.user, applicant=obj)
                    | Q(project__owner=obj, applicant=request.user)
                )
            )
            .first()
        )
        return application.id if application else None

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
        price_label = "₺199 / ay" if plan == "monthly" else "₺1.990 / yil"

        subscription, _ = PremiumSubscription.objects.update_or_create(
            user=user,
            defaults={
                "plan": plan,
                "price_label": price_label,
                "status": PremiumSubscription.STATUS_ACTIVE,
            },
        )

        user.is_premium = True
        user.mentor_credits = 1
        user.save(update_fields=["is_premium", "mentor_credits"])
        return subscription


class ShowcaseProjectSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(read_only=True)
    summary = serializers.CharField(read_only=True)
    problem_statement = serializers.CharField(read_only=True)
    tech_stack = serializers.ListField(child=serializers.CharField(), read_only=True)
    needed_roles = serializers.ListField(child=serializers.CharField(), read_only=True)
    is_premium_highlighted = serializers.BooleanField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    owner = serializers.SerializerMethodField()

    def get_owner(self, obj):
        return {
            "id": obj.owner.id,
            "full_name": obj.owner.full_name,
            "title": obj.owner.title,
            "is_verified_talent": obj.owner.is_verified_talent,
            "is_premium": obj.owner.is_premium,
        }


class ShowcaseUserSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    recent_projects_count = serializers.SerializerMethodField()

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
            "average_rating",
            "recent_projects_count",
            "date_joined",
        ]

    def get_average_rating(self, obj):
        value = obj.received_reviews.aggregate(avg=Avg("rating"))["avg"]
        return round(value, 1) if value is not None else None

    def get_recent_projects_count(self, obj):
        return obj.projects.count()


class CommunityThreadSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = CommunityThread
        fields = [
            "id",
            "author",
            "topic",
            "stats_label",
            "signal_label",
            "created_at",
        ]

    def get_author(self, obj):
        return {
            "id": obj.author.id,
            "full_name": obj.author.full_name,
            "title": obj.author.title,
            "is_verified_talent": obj.author.is_verified_talent,
        }


class CommunityEventSerializer(serializers.ModelSerializer):
    is_registered = serializers.SerializerMethodField()

    class Meta:
        model = CommunityEvent
        fields = [
            "id",
            "title",
            "description",
            "location",
            "tag",
            "event_date",
            "is_online",
            "is_featured",
            "is_registered",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_is_registered(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.registrations.filter(user=request.user).exists()


class CommunityEventRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityEventRegistration
        fields = ["id", "event", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_event(self, value):
        if not value.is_featured:
            raise serializers.ValidationError("Sadece aktif etkinliklere kayit olunabilir.")
        return value

    def create(self, validated_data):
        registration, _ = CommunityEventRegistration.objects.get_or_create(
            user=self.context["request"].user,
            event=validated_data["event"],
        )
        return registration


class CommunityGuideSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityGuide
        fields = [
            "id",
            "title",
            "read",
            "tone",
            "summary",
            "bullets",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


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
            "is_mentor",
            "is_verified_talent",
            "is_premium",
            "is_staff",
            "is_superuser",
        ]
        read_only_fields = [
            "id",
            "email",
            "full_name",
            "title",
            "is_mentor",
            "is_verified_talent",
            "is_premium",
        ]

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

    def update(self, instance, validated_data):
        is_mentor = validated_data.get("is_mentor")
        if is_mentor is True:
            validated_data["is_premium"] = True
            validated_data.setdefault("is_verified_talent", True)
        return super().update(instance, validated_data)


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
    status_label = serializers.SerializerMethodField()

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
            "meeting_time",
            "user_confirmed",
            "price_at_request",
            "offered_price",
            "reserved_amount",
            "commission_rate",
            "mentor_completed_at",
            "user_confirmed_at",
            "released_at",
            "disputed_at",
            "dispute_reason",
            "status_label",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "status",
            "meeting_time",
            "user_confirmed",
            "price_at_request",
            "offered_price",
            "reserved_amount",
            "commission_rate",
            "mentor_completed_at",
            "user_confirmed_at",
            "released_at",
            "disputed_at",
            "dispute_reason",
            "status_label",
            "created_at",
        ]

    def validate(self, attrs):
        user = self.context["request"].user
        request = self.context.get("request")
        if request and request.method == "POST" and not user.is_premium:
            raise serializers.ValidationError("Mentor destegi sadece premium kullanicilar icindir.")

        mentor = attrs.get("mentor")
        if mentor is None:
            raise serializers.ValidationError({"mentor": "Mentor secimi zorunludur."})
        if not mentor.is_mentor:
            raise serializers.ValidationError("Secilen kullanici bir mentor degildir.")

        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        price = -1
        if user.mentor_credits > 0:
            user.mentor_credits -= 1
            user.save(update_fields=["mentor_credits"])
            price = 0

        return MentorRequest.objects.create(
            user=user,
            status=MentorRequest.STATUS_PENDING,
            price_at_request=price,
            commission_rate=0.20,
            **validated_data
        )

    def get_status_label(self, obj):
        labels = {
            MentorRequest.STATUS_PENDING: "Talep iletildi",
            MentorRequest.STATUS_OFFERED: "Teklif bekliyor",
            MentorRequest.STATUS_PAID_RESERVED: "Odeme rezerve edildi",
            MentorRequest.STATUS_MENTOR_COMPLETED: "Mentor tamamlandi dedi",
            MentorRequest.STATUS_RELEASED: "Odeme mentore aktarildi",
            MentorRequest.STATUS_DISPUTED: "Itiraz incelemede",
            MentorRequest.STATUS_DECLINED: "Mentor reddetti",
            MentorRequest.STATUS_REFUNDED: "Iade edildi",
            "accepted": "Kullanici onayi bekliyor",
            "completed": "Tamamlandi",
        }
        return labels.get(obj.status, obj.status)


class MentorRequestMentorActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["offer", "decline", "mark_completed"])
    offered_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    meeting_time = serializers.DateTimeField(required=False)

    def validate(self, attrs):
        instance = self.context["request_instance"]
        action = attrs["action"]

        if action == "offer":
            if instance.status != MentorRequest.STATUS_PENDING:
                raise serializers.ValidationError("Sadece yeni taleplere teklif verilebilir.")
            if attrs.get("meeting_time") is None:
                raise serializers.ValidationError({"meeting_time": "Gorusme zamani zorunludur."})
            if instance.price_at_request == 0:
                attrs["offered_price"] = 0
            elif attrs.get("offered_price") is None or attrs["offered_price"] <= 0:
                raise serializers.ValidationError({"offered_price": "Ucret teklifi pozitif olmalidir."})

        if action == "decline" and instance.status not in {MentorRequest.STATUS_PENDING, MentorRequest.STATUS_OFFERED}:
            raise serializers.ValidationError("Bu talep bu asamada reddedilemez.")

        if action == "mark_completed" and instance.status != MentorRequest.STATUS_PAID_RESERVED:
            raise serializers.ValidationError("Odeme rezerve edilmeden gorusme tamamlanmis sayilamaz.")

        return attrs


class MentorRequestUserActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["accept_offer", "confirm_completion", "open_dispute"])
    dispute_reason = serializers.CharField(required=False, allow_blank=False)

    def validate(self, attrs):
        instance = self.context["request_instance"]
        action = attrs["action"]

        if action == "accept_offer" and instance.status != MentorRequest.STATUS_OFFERED:
            raise serializers.ValidationError("Su an teklif kabul edilemez.")

        if action == "confirm_completion" and instance.status != MentorRequest.STATUS_MENTOR_COMPLETED:
            raise serializers.ValidationError("Mentor gorusmeyi tamamlamadan onay verilemez.")

        if action == "open_dispute":
            if instance.status not in {MentorRequest.STATUS_PAID_RESERVED, MentorRequest.STATUS_MENTOR_COMPLETED}:
                raise serializers.ValidationError("Bu talep icin su an itiraz acilamaz.")
            if not attrs.get("dispute_reason"):
                raise serializers.ValidationError({"dispute_reason": "Itiraz nedeni zorunludur."})

        return attrs


class FriendRequestSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.full_name", read_only=True)
    receiver_name = serializers.CharField(source="receiver.full_name", read_only=True)

    class Meta:
        model = FriendRequest
        fields = ["id", "sender", "sender_name", "receiver", "receiver_name", "status", "created_at"]
        read_only_fields = ["id", "sender", "status", "created_at"]
