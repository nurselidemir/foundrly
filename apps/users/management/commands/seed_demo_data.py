from decimal import Decimal

from django.core.management.base import BaseCommand

from apps.projects.models import ApplicationMessage, Project, TeamApplication
from apps.users.models import (
    FriendRequest,
    MentorRequest,
    PremiumSubscription,
    User,
    UserReview,
    VerificationRequest,
)


class Command(BaseCommand):
    help = "Foundrly demo sunumu icin ornek kullanici, proje ve akis verileri olusturur."

    def handle(self, *args, **options):
        admin = self._upsert_user(
            email="nurselidemiir@gmail.com",
            password="Nurseli1",
            full_name="Nurseli Demir",
            title="Kurucu & Platform Yoneticisi",
            bio="Foundrly platform yonetimi, topluluk stratejisi ve demo akislarindan sorumlu.",
            skills=["Django", "React", "Product Strategy"],
            interests=["startup", "community", "ai"],
            is_staff=True,
            is_superuser=True,
        )

        founder = self._upsert_user(
            email="founder@joinfoundrly.com",
            password="Founder123!",
            full_name="Mert Aydin",
            title="AI Girisim Kurucusu",
            bio="Universite projelerini urune donusturmeyi seven kurucu.",
            skills=["Product", "Growth", "AI"],
            interests=["hackathon", "startup", "product"],
            is_premium=True,
            is_verified_talent=True,
        )

        builder = self._upsert_user(
            email="builder@joinfoundrly.com",
            password="Builder123!",
            full_name="Selin Kara",
            title="Backend Gelistirici",
            bio="Erken asama girisimlerde hizli MVP cikarmayi seven backend gelistirici.",
            skills=["Python", "Django", "PostgreSQL"],
            interests=["backend", "fintech", "startup"],
            is_premium=True,
        )

        designer = self._upsert_user(
            email="designer@joinfoundrly.com",
            password="Designer123!",
            full_name="Ece Yildiz",
            title="UI/UX Tasarimcisi",
            bio="Hackathon ve startup takimlari icin hizli urun deneyimleri tasarlar.",
            skills=["Figma", "UI", "UX Research"],
            interests=["design", "community", "mobile"],
        )

        mentor = self._upsert_user(
            email="mentor@joinfoundrly.com",
            password="Mentor123!",
            full_name="Kerem Tunc",
            title="Startup Mentoru",
            bio="Erken asama SaaS ve yapay zeka ekiplerine mentorluk verir.",
            skills=["Fundraising", "SaaS", "Go To Market"],
            interests=["mentorship", "saas", "ai"],
            is_mentor=True,
            mentor_price=Decimal("45.00"),
            mentor_credits=3,
        )

        self._ensure_premium(founder, "yearly", "Yillik Premium")
        self._ensure_premium(builder, "monthly", "Aylik Premium")

        project_ai = self._upsert_project(
            owner=founder,
            title="CampusMind AI",
            summary="Universite ogrencileri icin calisma planlayici ve yapay zeka destekli buddy platformu.",
            problem_statement="Ders, proje ve hackathon yogunlugu icinde ogrenciler ekip ve odak problemi yasiyor.",
            tech_stack=["React", "Django", "Open Source AI"],
            needed_roles=["Backend Developer", "UI/UX Designer"],
            is_premium_highlighted=True,
        )
        project_hackathon = self._upsert_project(
            owner=designer,
            title="HackSprint Takimi",
            summary="48 saatlik universite hackathonu icin urun, tasarim ve AI odakli ekip kuruluyor.",
            problem_statement="Hackathon surecinde hizli koordinasyon ve sunum materyali eksigi var.",
            tech_stack=["Next.js", "Figma", "Supabase"],
            needed_roles=["Frontend Developer", "Product Manager"],
            is_premium_highlighted=False,
        )
        project_fintech = self._upsert_project(
            owner=builder,
            title="PocketLedger",
            summary="Gen Z kullanicilari icin mikro butce ve harcama analiz platformu.",
            problem_statement="Kullanici davranislarini anlamli finansal aksiyonlara cevirmek zor.",
            tech_stack=["Django", "PostgreSQL", "Data Viz"],
            needed_roles=["Data Scientist", "Growth Builder"],
            is_premium_highlighted=True,
        )

        accepted_application = self._upsert_application(
            project=project_ai,
            applicant=builder,
            message="Django ve PostgreSQL deneyimimle backend katmanini hizla ayaga kaldirabilirim.",
            status="accepted",
        )
        pending_application = self._upsert_application(
            project=project_ai,
            applicant=designer,
            message="Arayuz ve kullanici akisini hackathon hizinda tasarlayabilirim.",
            status="pending",
        )
        self._upsert_application(
            project=project_hackathon,
            applicant=founder,
            message="Sunum, urun hikayesi ve ekip koordinasyonunda aktif rol alabilirim.",
            status="pending",
        )

        self._upsert_message(
            application=accepted_application,
            sender=founder,
            content="Harika, backend mimarisini bu hafta birlikte netlestirelim.",
        )
        self._upsert_message(
            application=accepted_application,
            sender=builder,
            content="Tamamdir, ilk API planini ve veritabani taslagini hazirlayacagim.",
        )

        self._upsert_review(
            reviewer=founder,
            reviewee=builder,
            application=accepted_application,
            rating=5,
            comment="Teslim hizli, iletisim guclu ve urun mantigini cok iyi anliyor.",
        )
        self._upsert_review(
            reviewer=builder,
            reviewee=founder,
            application=accepted_application,
            rating=5,
            comment="Kurucu olarak yonu net ciziyor ve ekip koordinasyonunu cok iyi tasiyor.",
        )

        VerificationRequest.objects.update_or_create(
            user=designer,
            requested_title="UI/UX Designer",
            defaults={
                "portfolio_url": "https://joinfoundrly.com/portfolio/ece-yildiz",
                "note": "Hackathon ve mobil uygulama deneyimlerim icin verified rozetine basvuruyorum.",
                "status": VerificationRequest.STATUS_PENDING,
                "reviewed_note": "",
                "reviewed_at": None,
            },
        )

        MentorRequest.objects.update_or_create(
            user=founder,
            mentor=mentor,
            message="Yatirimci sunumu ve MVP konumlandirmasi icin 30 dakikalik mentorluk talep ediyorum.",
            defaults={
                "status": "pending",
                "price_at_request": mentor.mentor_price,
                "offered_price": mentor.mentor_price,
                "commission_rate": Decimal("0.20"),
            },
        )

        FriendRequest.objects.update_or_create(
            sender=builder,
            receiver=founder,
            defaults={"status": "accepted"},
        )
        FriendRequest.objects.update_or_create(
            sender=designer,
            receiver=builder,
            defaults={"status": "pending"},
        )

        self.stdout.write(self.style.SUCCESS("Demo verileri hazir."))
        self.stdout.write(
            "Admin: nurselidemiir@gmail.com / Nurseli1 | Founder: founder@joinfoundrly.com / Founder123! | Builder: builder@joinfoundrly.com / Builder123!"
        )

    def _upsert_user(self, email, password, **defaults):
        user, created = User.objects.get_or_create(email=email, defaults=defaults)
        if not created:
            for key, value in defaults.items():
                setattr(user, key, value)
        user.set_password(password)
        user.save()
        return user

    def _ensure_premium(self, user, plan, price_label):
        user.is_premium = True
        user.save(update_fields=["is_premium"])
        PremiumSubscription.objects.update_or_create(
            user=user,
            defaults={
                "plan": plan,
                "price_label": price_label,
                "status": PremiumSubscription.STATUS_ACTIVE,
            },
        )

    def _upsert_project(self, **defaults):
        project, _ = Project.objects.update_or_create(
            owner=defaults["owner"],
            title=defaults["title"],
            defaults=defaults,
        )
        return project

    def _upsert_application(self, **defaults):
        application, _ = TeamApplication.objects.update_or_create(
            project=defaults["project"],
            applicant=defaults["applicant"],
            defaults=defaults,
        )
        return application

    def _upsert_message(self, application, sender, content):
        ApplicationMessage.objects.get_or_create(
            application=application,
            sender=sender,
            content=content,
        )

    def _upsert_review(self, reviewer, reviewee, application, rating, comment):
        UserReview.objects.update_or_create(
            reviewer=reviewer,
            application=application,
            defaults={
                "reviewee": reviewee,
                "rating": rating,
                "comment": comment,
            },
        )
