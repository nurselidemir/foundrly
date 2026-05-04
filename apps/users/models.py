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
    is_verified_talent = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)

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
