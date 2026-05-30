from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email alani zorunludur.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser is_staff=True olmali.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser is_superuser=True olmali.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    bio = models.TextField(blank=True)
    skills = models.JSONField(default=list, blank=True)
    interests = models.JSONField(default=list, blank=True)
    profile_picture = models.ImageField(upload_to="profiles/", blank=True, null=True)
    is_verified_talent = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)
    is_mentor = models.BooleanField(default=False)
    mentor_credits = models.IntegerField(default=0)
    mentor_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    mentor_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        ordering = ["-date_joined"]

    def __str__(self) -> str:
        return self.email


class PremiumSubscription(models.Model):
    PLAN_MONTHLY = "monthly"
    PLAN_YEARLY = "yearly"
    STATUS_ACTIVE = "active"
    STATUS_CANCELED = "canceled"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="premium_subscription")
    plan = models.CharField(
        max_length=20,
        choices=[
            (PLAN_MONTHLY, "Monthly"),
            (PLAN_YEARLY, "Yearly"),
        ],
    )
    price_label = models.CharField(max_length=50)
    status = models.CharField(
        max_length=20,
        choices=[
            (STATUS_ACTIVE, "Active"),
            (STATUS_CANCELED, "Canceled"),
        ],
        default=STATUS_ACTIVE,
    )

    started_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-started_at"]

    def __str__(self) -> str:
        return f"{self.user.email} - {self.plan}"


class VerificationRequest(models.Model):
    STATUS_PENDING = "pending"
    STATUS_APPROVED = "approved"
    STATUS_REJECTED = "rejected"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="verification_requests")
    requested_title = models.CharField(max_length=255)
    portfolio_url = models.URLField(blank=True)
    note = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            (STATUS_PENDING, "Pending"),
            (STATUS_APPROVED, "Approved"),
            (STATUS_REJECTED, "Rejected"),
        ],
        default=STATUS_PENDING,
    )
    reviewed_note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.user.email} - {self.status}"


class MentorRequest(models.Model):
    STATUS_PENDING = "pending"
    STATUS_OFFERED = "offered"
    STATUS_PAID_RESERVED = "paid_reserved"
    STATUS_MENTOR_COMPLETED = "mentor_completed"
    STATUS_RELEASED = "released"
    STATUS_DISPUTED = "disputed"
    STATUS_DECLINED = "declined"
    STATUS_REFUNDED = "refunded"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="mentor_requests")
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="mentor_sessions")
    message = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=[
            (STATUS_PENDING, "Pending"),
            (STATUS_OFFERED, "Offered"),
            (STATUS_PAID_RESERVED, "Paid Reserved"),
            (STATUS_MENTOR_COMPLETED, "Mentor Completed"),
            (STATUS_RELEASED, "Released"),
            (STATUS_DISPUTED, "Disputed"),
            (STATUS_DECLINED, "Declined"),
            (STATUS_REFUNDED, "Refunded"),
        ],
        default=STATUS_PENDING,
    )
    meeting_time = models.DateTimeField(null=True, blank=True)
    user_confirmed = models.BooleanField(default=False)
    price_at_request = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    offered_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    reserved_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.20)
    mentor_completed_at = models.DateTimeField(null=True, blank=True)
    user_confirmed_at = models.DateTimeField(null=True, blank=True)
    released_at = models.DateTimeField(null=True, blank=True)
    disputed_at = models.DateTimeField(null=True, blank=True)
    dispute_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.user.email} -> {self.mentor.email}"


class MentorRequestMessage(models.Model):
    mentor_request = models.ForeignKey(
        MentorRequest,
        on_delete=models.CASCADE,
        related_name="messages",
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sent_mentor_request_messages",
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"{self.sender.email} -> mentor request {self.mentor_request_id}"


class UserReview(models.Model):
    reviewer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="written_reviews",
    )
    reviewee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="received_reviews",
    )
    application = models.ForeignKey(
        "projects.TeamApplication",
        on_delete=models.CASCADE,
        related_name="user_reviews",
    )
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["application", "reviewer"],
                name="unique_application_reviewer_review",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.reviewer.email} -> {self.reviewee.email} ({self.rating})"


class FriendRequest(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_friend_requests")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_friend_requests")
    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("accepted", "Accepted"),
            ("rejected", "Rejected"),
        ],
        default="pending",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["sender", "receiver"], name="unique_friend_request")
        ]

    def __str__(self) -> str:
        return f"{self.sender.email} -> {self.receiver.email} ({self.status})"


class CommunityThread(models.Model):
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="community_threads",
    )
    topic = models.CharField(max_length=255)
    stats_label = models.CharField(max_length=120, blank=True)
    signal_label = models.CharField(max_length=80, blank=True)
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.topic


class CommunityEvent(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=120)
    tag = models.CharField(max_length=80)
    event_date = models.DateField()
    is_online = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["event_date", "-created_at"]

    def __str__(self) -> str:
        return self.title


class CommunityEventRegistration(models.Model):
    user = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        related_name="event_registrations",
    )
    event = models.ForeignKey(
        CommunityEvent,
        on_delete=models.CASCADE,
        related_name="registrations",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["user", "event"], name="unique_event_registration")
        ]

    def __str__(self) -> str:
        return f"{self.user_id}-{self.event_id}"


class CommunityGuide(models.Model):
    title = models.CharField(max_length=255)
    read = models.CharField(max_length=80)
    tone = models.CharField(max_length=80)
    summary = models.TextField()
    bullets = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title
