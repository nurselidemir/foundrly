"""
Foundrly Demo Seed — hocaya gösterimi için hazırlanmış tam demo verisi.

Hesaplar:
  Admin   → admin@foundrly.com    / Admin123!
  Mentor  → mentor@foundrly.com   / Mentor123!
  User    → user@foundrly.com     / User123!

Ek kullanıcılar (eşleşme/akış doldurmak için):
  Founder → founder@foundrly.com  / Founder123!
  Builder → builder@foundrly.com  / Builder123!
  Designer → designer@foundrly.com / Designer123!
"""
from decimal import Decimal
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.projects.models import ApplicationMessage, Project, TeamApplication
from apps.users.models import (
    CommunityEvent,
    CommunityGuide,
    CommunityThread,
    FriendRequest,
    MentorRequest,
    PremiumSubscription,
    User,
    UserReview,
    VerificationRequest,
)


class Command(BaseCommand):
    help = "Foundrly demo sunumu için örnek veri oluşturur (DB temizleyip yeniden doldurur)."

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Demo verileri oluşturuluyor..."))

        # ── 1. Temel demo hesapları ──────────────────────────────────────────
        admin = self._upsert_user(
            email="admin@foundrly.com",
            password="Admin123!",
            full_name="Nurseli Demir",
            title="Platform Yöneticisi",
            bio=(
                "Foundrly'nin kurucu yöneticisi. Platform stratejisi, topluluk yönetimi "
                "ve kullanıcı deneyiminden sorumludur."
            ),
            skills=["Django", "React", "Product Strategy", "PostgreSQL"],
            interests=["startup", "community", "ai", "product"],
            is_staff=True,
            is_superuser=True,
            is_premium=True,
            is_verified_talent=True,
        )

        mentor = self._upsert_user(
            email="mentor@foundrly.com",
            password="Mentor123!",
            full_name="Kerem Tunç",
            title="Startup Mentörü & SaaS Uzmanı",
            bio=(
                "10+ yıl deneyimli SaaS girişimci ve angel investor. "
                "Erken aşama startuplara fundraising, GTM stratejisi ve ürün-pazar uyumu konularında mentorluk verir."
            ),
            skills=["Fundraising", "SaaS", "Go To Market", "Product Management", "Angel Investing"],
            interests=["mentorship", "saas", "ai", "startup", "fintech"],
            is_mentor=True,
            is_premium=True,
            is_verified_talent=True,
            mentor_price=Decimal("25.00"),
            mentor_credits=5,
        )

        regular_user = self._upsert_user(
            email="user@foundrly.com",
            password="User123!",
            full_name="Ayşe Kaya",
            title="Frontend Geliştirici",
            bio=(
                "React ve TypeScript konusunda uzmanlaşmış frontend geliştirici. "
                "Hackathon ekiplerinde aktif rol almayı ve startup projelerinde yer almayı seviyor."
            ),
            skills=["React", "TypeScript", "Tailwind CSS", "Next.js"],
            interests=["frontend", "startup", "hackathon", "mobile"],
        )

        # ── 2. Eşleşme ve akış için ek kullanıcılar ────────────────────────
        founder = self._upsert_user(
            email="founder@foundrly.com",
            password="Founder123!",
            full_name="Mert Aydın",
            title="AI Girişim Kurucusu",
            bio=(
                "Üniversite projelerini ürüne dönüştürmeyi seven kurucu. "
                "Yapay zeka ve veri odaklı startup ekiplerinde aktif."
            ),
            skills=["Product Management", "Growth", "AI", "Python"],
            interests=["hackathon", "startup", "product", "ai"],
            is_premium=True,
            is_verified_talent=True,
        )

        builder = self._upsert_user(
            email="builder@foundrly.com",
            password="Builder123!",
            full_name="Selin Kara",
            title="Backend Geliştirici",
            bio=(
                "Erken aşama girişimlerde hızlı MVP çıkarmayı seven backend geliştirici. "
                "Django, FastAPI ve PostgreSQL konusunda 4 yıl deneyim."
            ),
            skills=["Python", "Django", "PostgreSQL", "FastAPI", "Docker"],
            interests=["backend", "fintech", "startup", "devops"],
            is_premium=True,
        )

        designer = self._upsert_user(
            email="designer@foundrly.com",
            password="Designer123!",
            full_name="Ece Yıldız",
            title="UI/UX Tasarımcısı",
            bio=(
                "Hackathon ve startup takımları için hızlı kullanıcı deneyimleri tasarlar. "
                "Figma uzmanı, mobil-first yaklaşım."
            ),
            skills=["Figma", "UI Design", "UX Research", "Prototyping", "Design Systems"],
            interests=["design", "community", "mobile", "startup"],
        )

        data_scientist = self._upsert_user(
            email="data@foundrly.com",
            password="Data123!",
            full_name="Emre Çelik",
            title="Veri Bilimci",
            bio=(
                "Makine öğrenmesi ve veri analizi konusunda uzman. "
                "Kaggle master, açık kaynak projelere aktif katkı sağlıyor."
            ),
            skills=["Python", "Machine Learning", "TensorFlow", "Data Analysis", "SQL"],
            interests=["ai", "data", "research", "startup"],
            is_verified_talent=True,
        )

        # ── 3. Premium abonelikler ──────────────────────────────────────────
        self._ensure_premium(admin, "yearly", "$48 / yıl")
        self._ensure_premium(mentor, "yearly", "$48 / yıl")
        self._ensure_premium(founder, "yearly", "$48 / yıl")
        self._ensure_premium(builder, "monthly", "$5 / ay")

        # ── 4. Projeler ─────────────────────────────────────────────────────
        project_ai = self._upsert_project(
            owner=founder,
            title="CampusMind AI",
            summary=(
                "Üniversite öğrencileri için yapay zeka destekli çalışma planlayıcı ve proje buddy platformu. "
                "Kullanıcıların ders, proje ve hackathon hedeflerini AI ile optimize etmesini sağlar."
            ),
            problem_statement=(
                "Ders, proje ve hackathon yoğunluğu içinde öğrenciler ekip ve odak problemi yaşıyor. "
                "Doğru kişilerle bir araya gelmek için harcanan zaman değerli üretim zamanını tüketiyor."
            ),
            tech_stack=["React", "Django", "PostgreSQL", "OpenAI API", "Celery"],
            needed_roles=["Backend Developer", "UI/UX Designer", "Machine Learning Engineer"],
            is_premium_highlighted=True,
        )

        project_fintech = self._upsert_project(
            owner=builder,
            title="PocketLedger",
            summary=(
                "Gen Z kullanıcıları için mikro bütçe ve harcama analiz platformu. "
                "Banka entegrasyonu ve kişiselleştirilmiş finansal tavsiyeler sunar."
            ),
            problem_statement=(
                "Kullanıcı davranışlarını anlamlı finansal aksiyonlara çevirmek zor. "
                "Mevcut fintech uygulamaları Y ve Z kuşağının ihtiyaçlarını karşılamıyor."
            ),
            tech_stack=["Django", "PostgreSQL", "React", "Data Visualization", "Plaid API"],
            needed_roles=["Data Scientist", "Growth Builder", "Frontend Developer"],
            is_premium_highlighted=True,
        )

        project_hackathon = self._upsert_project(
            owner=designer,
            title="HackSprint Takım Koordinatörü",
            summary=(
                "48 saatlik üniversite hackathonları için takım koordinasyon ve sunum yönetim platformu. "
                "Gerçek zamanlı görev dağılımı ve sunum materyali oluşturma."
            ),
            problem_statement=(
                "Hackathon sürecinde hızlı koordinasyon ve sunum materyali eksikliği var. "
                "Ekipler kritik saatleri planlama ve senkronizasyonla harcıyor."
            ),
            tech_stack=["Next.js", "Figma", "Supabase", "WebSocket", "Vercel"],
            needed_roles=["Frontend Developer", "Product Manager", "Backend Developer"],
            is_premium_highlighted=False,
        )

        project_data = self._upsert_project(
            owner=data_scientist,
            title="TrendAI - Sosyal Medya Analitik Platformu",
            summary=(
                "Startup'lar için sosyal medya trendlerini gerçek zamanlı analiz eden AI destekli platform. "
                "Rakip analizi, sentiment analizi ve içerik önerileri sunar."
            ),
            problem_statement=(
                "Küçük startuplar büyük veri analitik araçlarına erişemiyor. "
                "Sosyal medya trendlerini manuel takip etmek zaman alıcı ve hatalı."
            ),
            tech_stack=["Python", "FastAPI", "React", "TensorFlow", "Redis", "PostgreSQL"],
            needed_roles=["Frontend Developer", "DevOps Engineer", "UX Designer"],
            is_premium_highlighted=False,
        )

        project_user = self._upsert_project(
            owner=regular_user,
            title="EduConnect - Öğrenci Mentörlük Platformu",
            summary=(
                "Üniversite öğrencilerini mezunlarla ve sektör profesyonelleriyle buluşturan mentörlük platformu. "
                "Kariyer rehberliği ve proje desteği odaklı."
            ),
            problem_statement=(
                "Öğrenciler kariyer planlaması ve proje geliştirme konularında yeterli rehberliğe ulaşamıyor. "
                "Mevcut platform ve ağlar hem pahalı hem de erişimsiz."
            ),
            tech_stack=["React", "Node.js", "MongoDB", "Socket.io", "Tailwind CSS"],
            needed_roles=["Backend Developer", "UI/UX Designer", "Mobile Developer"],
            is_premium_highlighted=False,
        )

        # ── 5. Başvurular ───────────────────────────────────────────────────
        # CampusMind'a builder kabul edildi
        accepted_app_ai_builder = self._upsert_application(
            project=project_ai,
            applicant=builder,
            message=(
                "Django ve PostgreSQL deneyimimle backend katmanını hızla ayağa kaldırabilirim. "
                "Daha önce 3 farklı startup MVP'sinde lead backend geliştirici olarak çalıştım."
            ),
            status="accepted",
        )

        # CampusMind'a regular_user beklemede
        pending_app_ai_user = self._upsert_application(
            project=project_ai,
            applicant=regular_user,
            message=(
                "React ve TypeScript ile tam yığın geliştirme deneyimim var. "
                "Öğrenci platformları için kullanıcı arayüzü tasarlamayı çok seviyorum."
            ),
            status="pending",
        )

        # CampusMind'a designer beklemede
        self._upsert_application(
            project=project_ai,
            applicant=designer,
            message=(
                "Arayüz ve kullanıcı akışını hackathon hızında tasarlayabilirim. "
                "Eğitim uygulamaları için özel UX deneyimim var."
            ),
            status="pending",
        )

        # PocketLedger'a data_scientist kabul edildi
        accepted_app_fintech = self._upsert_application(
            project=project_fintech,
            applicant=data_scientist,
            message=(
                "Veri analizi ve ML pipeline konusundaki deneyimimle fintech ürününüzün "
                "analitik altyapısını tasarlayabilirim. Plaid API entegrasyonu üzerinde daha önce çalıştım."
            ),
            status="accepted",
        )

        # HackSprint'e founder başvurdu
        self._upsert_application(
            project=project_hackathon,
            applicant=founder,
            message=(
                "Sunum, ürün hikayesi ve ekip koordinasyonunda aktif rol alabilirim. "
                "5 hackathon deneyimim ve 2 birincilik ödülüm var."
            ),
            status="pending",
        )

        # HackSprint'e regular_user kabul edildi
        accepted_app_hackathon = self._upsert_application(
            project=project_hackathon,
            applicant=regular_user,
            message=(
                "Next.js ve Tailwind ile hızlı prototip geliştirebilirim. "
                "UI kit'i ilk 4 saatte hazır ederim."
            ),
            status="accepted",
        )

        # EduConnect'e builder başvurdu
        self._upsert_application(
            project=project_user,
            applicant=builder,
            message=(
                "Node.js ve Express deneyimimle backend'i hızlıca ayağa kaldırabilirim. "
                "Mentörlük platformları için özel ilgim var."
            ),
            status="pending",
        )

        # ── 6. Mesajlar (kabul edilen başvurularda) ─────────────────────────
        # CampusMind mesaj akışı
        self._upsert_message(
            application=accepted_app_ai_builder,
            sender=founder,
            content="Merhaba Selin! Başvurun incelendi, harika geçmiş. Backend mimarisini bu hafta konuşalım mı?",
        )
        self._upsert_message(
            application=accepted_app_ai_builder,
            sender=builder,
            content="Tabii ki! Önce veritabanı şemasını ve API endpoint listesini hazırlamalıyız. Pazartesi müsait misin?",
        )
        self._upsert_message(
            application=accepted_app_ai_builder,
            sender=founder,
            content="Pazartesi 14:00'te Google Meet'te buluşalım. Figma tasarımlarını da paylaşacağım.",
        )
        self._upsert_message(
            application=accepted_app_ai_builder,
            sender=builder,
            content="Harika! İlk API planını ve veritabanı taslağını hazırlayacağım. Görüşürüz!",
        )

        # HackSprint mesaj akışı
        self._upsert_message(
            application=accepted_app_hackathon,
            sender=designer,
            content="Ayşe merhaba! Frontend'i üstlenmen harika. Figma tasarımlarını şimdi paylaşıyorum.",
        )
        self._upsert_message(
            application=accepted_app_hackathon,
            sender=regular_user,
            content="Harika, Next.js ile component'leri hazırlamaya başlıyorum. Design token'ları da at bana.",
        )
        self._upsert_message(
            application=accepted_app_hackathon,
            sender=designer,
            content="Gönderildi! Renk paleti ve tipografi sistemi de mevcut. Soru olursa sor.",
        )

        # ── 7. Yorumlar ─────────────────────────────────────────────────────
        self._upsert_review(
            reviewer=founder,
            reviewee=builder,
            application=accepted_app_ai_builder,
            rating=5,
            comment=(
                "Selin inanılmaz hızlı çalışıyor. Teslim süresi mükemmel, iletişimi güçlü "
                "ve ürün mantığını çok iyi anlıyor. Kesinlikle tekrar çalışmak isterim."
            ),
        )
        self._upsert_review(
            reviewer=builder,
            reviewee=founder,
            application=accepted_app_ai_builder,
            rating=5,
            comment=(
                "Mert kurucu olarak yönü net çiziyor ve ekip koordinasyonunu çok iyi taşıyor. "
                "Vizyon netliği ve hızlı karar alma yeteneği çok değerli."
            ),
        )
        self._upsert_review(
            reviewer=designer,
            reviewee=regular_user,
            application=accepted_app_hackathon,
            rating=5,
            comment=(
                "Ayşe çok hızlı adapte oldu ve tasarımları kusursuz implement etti. "
                "Hackathon baskısında bile son derece sakin ve üretken kaldı."
            ),
        )
        self._upsert_review(
            reviewer=regular_user,
            reviewee=designer,
            application=accepted_app_hackathon,
            rating=4,
            comment=(
                "Ece'nin tasarımları çok kaliteli ve iyi düşünülmüş. "
                "Özellikle mobil uyumluluk konusundaki dikkati takdire şayan."
            ),
        )
        self._upsert_review(
            reviewer=builder,
            reviewee=data_scientist,
            application=accepted_app_fintech,
            rating=5,
            comment=(
                "Emre'nin veri pipeline tasarımı son derece etkileyici. "
                "Makine öğrenmesi bilgisi derinlemesine ve pratik uygulamada çok güçlü."
            ),
        )

        # ── 8. Doğrulama talepleri ──────────────────────────────────────────
        VerificationRequest.objects.update_or_create(
            user=designer,
            requested_title="UI/UX Designer",
            defaults={
                "portfolio_url": "https://www.behance.net/ece-yildiz-design",
                "note": (
                    "3 yıllık UI/UX deneyimim ve 10+ startup projesinde çalışmam var. "
                    "Figma, Principle ve ProtoPie araçlarında uzmanlık rozetine başvuruyorum."
                ),
                "status": VerificationRequest.STATUS_PENDING,
                "reviewed_note": "",
                "reviewed_at": None,
            },
        )
        VerificationRequest.objects.update_or_create(
            user=data_scientist,
            requested_title="Machine Learning Engineer",
            defaults={
                "portfolio_url": "https://github.com/emrecelik-ml",
                "note": (
                    "Kaggle Master rozetim ve 5+ açık kaynak ML projem var. "
                    "TensorFlow ve PyTorch sertifikalarım mevcut."
                ),
                "status": VerificationRequest.STATUS_PENDING,
                "reviewed_note": "",
                "reviewed_at": None,
            },
        )

        # ── 9. Mentor talepleri ──────────────────────────────────────────────
        MentorRequest.objects.update_or_create(
            user=founder,
            mentor=mentor,
            message=(
                "Yatırımcı sunumu ve MVP konumlandırması için 30 dakikalık mentorluk talep ediyorum. "
                "Seed round öncesi pitch deck'imi gözden geçirebilir misiniz?"
            ),
            defaults={
                "status": "pending",
                "price_at_request": mentor.mentor_price,
                "offered_price": mentor.mentor_price,
                "commission_rate": Decimal("0.20"),
            },
        )
        MentorRequest.objects.update_or_create(
            user=regular_user,
            mentor=mentor,
            message=(
                "Frontend geliştirici olarak startup ekiplerine nasıl daha iyi katkı sağlayabileceğim "
                "konusunda tavsiye almak istiyorum. Kariyer yolculuğum için rehberlik."
            ),
            defaults={
                "status": "accepted",
                "price_at_request": mentor.mentor_price,
                "offered_price": mentor.mentor_price,
                "commission_rate": Decimal("0.20"),
            },
        )

        # ── 10. Arkadaş talepleri ────────────────────────────────────────────
        FriendRequest.objects.update_or_create(
            sender=builder,
            receiver=founder,
            defaults={"status": "accepted"},
        )
        FriendRequest.objects.update_or_create(
            sender=designer,
            receiver=regular_user,
            defaults={"status": "accepted"},
        )
        FriendRequest.objects.update_or_create(
            sender=regular_user,
            receiver=data_scientist,
            defaults={"status": "pending"},
        )

        # ── 11. Topluluk konuları ────────────────────────────────────────────
        self._upsert_thread(
            author=founder,
            topic="MVP aşamasında kurucu ortaklık payını nasıl yapılandırıyorsunuz?",
            stats_label="29 yanıt · 4 yatırımcı yorumu",
            signal_label="Öne çıkan başlık",
        )
        self._upsert_thread(
            author=designer,
            topic="İlk haftada ekip üyelerini gerçekten aktif hale getiren onboarding örnekleri arıyorum.",
            stats_label="16 yanıt · 7 kaydetme",
            signal_label="Topluluktan isteniyor",
        )
        self._upsert_thread(
            author=builder,
            topic="Takım arkadaşlarını yalnızca teknik yığına değil, çalışma temposuna göre eşleştirmek için en iyi yönteminiz ne?",
            stats_label="21 yanıt · 3 mentör görüşü",
            signal_label="YZ eşleşmesi",
        )
        self._upsert_thread(
            author=data_scientist,
            topic="AI startup'lar için MVP'yi nasıl tanımlarsınız? Minimum gerçekten ne kadar olmalı?",
            stats_label="34 yanıt · 6 kurucu deneyimi",
            signal_label="Sıcak tartışma",
        )
        self._upsert_thread(
            author=mentor,
            topic="Seed round öncesi yapılması gereken 5 kritik hazırlık — deneyimlerim.",
            stats_label="52 yanıt · 12 kaydetme",
            signal_label="Mentör önerisi",
        )
        self._upsert_thread(
            author=regular_user,
            topic="Hackathon ekibinde frontend geliştirici olarak ilk 6 saati nasıl değerlendiriyorsunuz?",
            stats_label="11 yanıt · 3 mentor görüşü",
            signal_label="Yeni başlık",
        )

        # ── 12. Girişim merkezi rehberleri ─────────────────────────────────
        self._upsert_guide(
            title="Sıfırdan MVP cikarmak icin 7 gunluk hizli plan",
            read="5 dk okuma",
            tone="Urun & MVP",
            summary=(
                "Fikri dogrulamak icin gereksiz ozellikleri ayiklayip bir hafta icinde "
                "ilk test edilebilir urunu cikarmaya odaklanan hizli plan."
            ),
            bullets=[
                "Temel problemi tek cumlede tanimla.",
                "Ilk surumde sadece cekirdek akisi koru.",
                "Bekleme listesi ve geri bildirim formu ile ilgiyi olc.",
            ],
            is_published=True,
        )
        self._upsert_guide(
            title="Dogru co-founder secimi icin 5 kritik sinyal",
            read="7 dk okuma",
            tone="Kurucu Ortak & Ekip",
            summary=(
                "Kurucu ortak seciminde teknik beceriden daha onemli olan uyum, "
                "calisma disiplini ve uzun vadeli vizyon sinyallerini ozetler."
            ),
            bullets=[
                "Beceri tamamlayiciligina bak.",
                "Zor anlarda iletisim tarzini test et.",
                "Hak edis ve hisse dagilimini en basta netlestir.",
            ],
            is_published=True,
        )
        self._upsert_guide(
            title="Pitch deck hazirlarken yatirimcinin ilk baktigi 10 sey",
            read="8 dk okuma",
            tone="Yatirim & Pitching",
            summary=(
                "Yatirimci sunumunda hikaye akisini guclendiren, pazari ve takimi net gosteren "
                "en kritik slayt ve mesajlari anlatir."
            ),
            bullets=[
                "Problem ve cozum eslesmesini net kur.",
                "Pazar buyuklugunu abartmadan anlat.",
                "Takimin bu isi neden yapabilecegini kanitla.",
            ],
            is_published=True,
        )
        self._upsert_guide(
            title="Ilk 100 kullaniciya reklamsiz ulasmak icin pratik taktikler",
            read="6 dk okuma",
            tone="Buyume & Pazarlama",
            summary=(
                "Topluluk, birebir iletisim ve icerik odakli dagitimla ilk sadik kullanicilari "
                "kazanmaya yardimci olacak yalnizca uygulanabilir taktikler."
            ),
            bullets=[
                "Nis topluluklarda birebir gorus.",
                "Erken kullanicilar icin referans dongusu kur.",
                "Her hafta tek buyume kanali test et.",
            ],
            is_published=True,
        )
        self._upsert_guide(
            title="Hisse paylasiminda adil model kurmak icin baslangic rehberi",
            read="9 dk okuma",
            tone="Kurucu Ortak & Ekip",
            summary=(
                "Emek, zaman ve nakit katkilarini daha adil yoneten dinamik hisse paylasim "
                "mantigini erken asama ekipler icin sade sekilde aciklar."
            ),
            bullets=[
                "Statik 50-50 dagilimi otomatik secme.",
                "Katki tiplerini olculebilir hale getir.",
                "Kurucular sozlesmesini geciktirme.",
            ],
            is_published=True,
        )

        # ── 13. Etkinlikler ──────────────────────────────────────────────────
        today = timezone.localdate()
        self._upsert_event(
            title="Foundrly Yapay Zeka Hackathonu 2026",
            description=(
                "Ürün, veri ve sunum akışlarını aynı hafta sonu birleştiren çevrim içi takım kurma sprinti. "
                "48 saat, 3 kategori, toplam 50.000 TL ödül havuzu."
            ),
            location="Çevrim içi",
            tag="Hackathon",
            event_date=today + timedelta(days=14),
            is_online=True,
        )
        self._upsert_event(
            title="Yatırımcı Sunum Gecesi — Istanbul Demo Day",
            description=(
                "Kurucuların erken aşama ürünlerini yatırımcı ve mentör grubuna anlattığı seçili demo gecesi. "
                "Seed round fırsatı arayanlar için ideal platform."
            ),
            location="İstanbul, TR",
            tag="Demo Day",
            event_date=today + timedelta(days=21),
            is_online=False,
        )
        self._upsert_event(
            title="Üretici Networking Oturumu — Ankara Buluşması",
            description=(
                "Builder, tasarımcı ve kurucuların aktif proje fırsatları etrafında tanıştığı topluluk buluşması. "
                "Foundrly topluluğunun aylık yüz yüze etkinliği."
            ),
            location="Ankara, TR",
            tag="Networking",
            event_date=today + timedelta(days=30),
            is_online=False,
        )
        self._upsert_event(
            title="AI ile Hızlı MVP — Online Workshop",
            description=(
                "ChatGPT, GitHub Copilot ve no-code araçlarla 48 saatte MVP çıkarma workshop'u. "
                "Teknik ve teknik olmayan kurucular için."
            ),
            location="Çevrim içi",
            tag="Workshop",
            event_date=today + timedelta(days=10),
            is_online=True,
        )
        self._upsert_event(
            title="Startup Hukuku ve KOSGEB Destekleri Semineri",
            description=(
                "Erken aşama startuplar için şirket kurma, hisse dağılımı ve KOSGEB destekleri hakkında "
                "uzman avukat ve danışman eşliğinde kapsamlı seminer."
            ),
            location="İzmir, TR",
            tag="Seminer",
            event_date=today + timedelta(days=45),
            is_online=False,
        )
        self._upsert_event(
            title="UX for Startups — Figma ile Hızlı Prototip",
            description=(
                "Startup ekipleri için tasarım süreçleri, kullanıcı araştırması ve "
                "Figma ile hızlı prototipleme workshop'u."
            ),
            location="Çevrim içi",
            tag="Workshop",
            event_date=today + timedelta(days=7),
            is_online=True,
        )

        # ── Özet ─────────────────────────────────────────────────────────────
        self.stdout.write(self.style.SUCCESS("\n✅ Demo verileri başarıyla oluşturuldu!\n"))
        self.stdout.write(self.style.SUCCESS("═" * 60))
        self.stdout.write(self.style.SUCCESS("  DEMO HESAPLARI"))
        self.stdout.write(self.style.SUCCESS("═" * 60))
        self.stdout.write(self.style.HTTP_INFO(
            "  👑 Admin    → admin@foundrly.com   / Admin123!"
        ))
        self.stdout.write(self.style.HTTP_INFO(
            "  🎓 Mentor   → mentor@foundrly.com  / Mentor123!"
        ))
        self.stdout.write(self.style.HTTP_INFO(
            "  👤 User     → user@foundrly.com    / User123!"
        ))
        self.stdout.write(self.style.SUCCESS("═" * 60))
        self.stdout.write(self.style.SUCCESS("  EK TEST HESAPLARI"))
        self.stdout.write(self.style.SUCCESS("═" * 60))
        self.stdout.write(
            "  founder@foundrly.com  / Founder123! (Premium, Verified)"
        )
        self.stdout.write(
            "  builder@foundrly.com  / Builder123! (Premium)"
        )
        self.stdout.write(
            "  designer@foundrly.com / Designer123! (Normal)"
        )
        self.stdout.write(
            "  data@foundrly.com     / Data123!    (Verified)"
        )
        self.stdout.write(self.style.SUCCESS("═" * 60 + "\n"))

    # ── Yardımcı metodlar ────────────────────────────────────────────────────

    def _upsert_user(self, email, password, **defaults):
        """Kullanıcıyı oluştur veya güncelle."""
        user, created = User.objects.get_or_create(email=email, defaults=defaults)
        if not created:
            for key, value in defaults.items():
                setattr(user, key, value)
        user.set_password(password)
        user.save()
        return user

    def _ensure_premium(self, user, plan, price_label):
        """Premium üyelik oluştur veya güncelle."""
        user.is_premium = True
        user.mentor_credits = max(user.mentor_credits, 1)
        user.save(update_fields=["is_premium", "mentor_credits"])
        PremiumSubscription.objects.update_or_create(
            user=user,
            defaults={
                "plan": plan,
                "price_label": price_label,
                "status": PremiumSubscription.STATUS_ACTIVE,
            },
        )

    def _upsert_project(self, **kwargs):
        """Projeyi oluştur veya güncelle."""
        project, _ = Project.objects.update_or_create(
            owner=kwargs["owner"],
            title=kwargs["title"],
            defaults=kwargs,
        )
        return project

    def _upsert_application(self, **kwargs):
        """Başvuruyu oluştur veya güncelle."""
        application, _ = TeamApplication.objects.update_or_create(
            project=kwargs["project"],
            applicant=kwargs["applicant"],
            defaults=kwargs,
        )
        return application

    def _upsert_message(self, application, sender, content):
        """Mesajı oluştur (varsa atla)."""
        ApplicationMessage.objects.get_or_create(
            application=application,
            sender=sender,
            content=content,
        )

    def _upsert_review(self, reviewer, reviewee, application, rating, comment):
        """Yorumu oluştur veya güncelle."""
        UserReview.objects.update_or_create(
            reviewer=reviewer,
            application=application,
            defaults={
                "reviewee": reviewee,
                "rating": rating,
                "comment": comment,
            },
        )

    def _upsert_thread(self, **kwargs):
        """Topluluk konusunu oluştur veya güncelle."""
        CommunityThread.objects.update_or_create(
            author=kwargs["author"],
            topic=kwargs["topic"],
            defaults=kwargs,
        )

    def _upsert_event(self, **kwargs):
        """Etkinliği oluştur veya güncelle."""
        CommunityEvent.objects.update_or_create(
            title=kwargs["title"],
            defaults=kwargs,
        )

    def _upsert_guide(self, **kwargs):
        """Girişim merkezi rehberini oluştur veya güncelle."""
        CommunityGuide.objects.update_or_create(
            title=kwargs["title"],
            defaults=kwargs,
        )
