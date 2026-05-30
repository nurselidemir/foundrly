from decimal import Decimal

from django.db import migrations


def enrich_demo_profiles_and_projects(apps, schema_editor):
    User = apps.get_model("users", "User")
    Project = apps.get_model("projects", "Project")

    user_updates = {
        "admin@foundrly.com": {
            "bio": (
                "Foundrly'nin kurucu yöneticisi. Platform stratejisi, topluluk büyümesi, "
                "ürün operasyonları ve kullanıcı deneyimi akışlarının tamamından sorumludur. "
                "Erken aşama ekiplerin onboarding, mentörlük ve eşleşme deneyimlerini birlikte tasarlar."
            ),
            "skills": ["Django", "React", "Product Strategy", "PostgreSQL", "Growth Ops", "Community Design", "UX Writing"],
            "interests": ["startup", "community", "ai", "product", "marketplace design", "mentorship"],
        },
        "mentor@foundrly.com": {
            "bio": (
                "10+ yıl deneyimli SaaS girişimci ve angel investor. Erken aşama startuplara fundraising, "
                "GTM stratejisi, ürün-pazar uyumu, pricing ve ilk satış sistemi kurma konularında mentorluk verir."
            ),
            "skills": ["Fundraising", "SaaS", "Go To Market", "Product Management", "Angel Investing", "Pricing", "B2B Sales"],
            "interests": ["mentorship", "saas", "ai", "startup", "fintech", "growth", "product strategy"],
            "mentor_price": Decimal("25.00"),
        },
        "user@foundrly.com": {
            "bio": (
                "React ve TypeScript konusunda uzmanlaşmış frontend geliştirici. Hackathon ekiplerinde aktif rol almayı, "
                "ürün fikrini hızlı prototipe çevirmeyi ve startup projelerinde kullanıcı odaklı arayüzler kurmayı seviyor."
            ),
            "skills": ["React", "TypeScript", "Tailwind CSS", "Next.js", "Framer Motion", "Design Systems", "Responsive UI"],
            "interests": ["frontend", "startup", "hackathon", "mobile", "product design", "community apps"],
        },
        "founder@foundrly.com": {
            "bio": (
                "Üniversite projelerini ürüne dönüştürmeyi seven kurucu. Yapay zeka ve veri odaklı startup ekiplerinde aktif. "
                "Ürün stratejisi, problem doğrulama ve yatırımcı hikâyesi kurma konularında güçlüdür."
            ),
            "skills": ["Product Management", "Growth", "AI", "Python", "Customer Discovery", "Pitching", "Experiment Design"],
            "interests": ["hackathon", "startup", "product", "ai", "edtech", "community growth"],
        },
        "builder@foundrly.com": {
            "bio": (
                "Erken aşama girişimlerde hızlı MVP çıkarmayı seven backend geliştirici. Django, FastAPI ve PostgreSQL konusunda 4 yıl deneyim. "
                "API mimarisi, auth akışları, containerization ve ölçeklenebilir veri modelleme alanlarında üretken."
            ),
            "skills": ["Python", "Django", "PostgreSQL", "FastAPI", "Docker", "Redis", "REST API", "System Design"],
            "interests": ["backend", "fintech", "startup", "devops", "api security", "platform engineering"],
        },
        "designer@foundrly.com": {
            "bio": (
                "Hackathon ve startup takımları için hızlı kullanıcı deneyimleri tasarlar. Figma uzmanı, mobil-first yaklaşım benimser. "
                "UX research, information architecture ve onboarding akışları tasarlamada özellikle güçlüdür."
            ),
            "skills": ["Figma", "UI Design", "UX Research", "Prototyping", "Design Systems", "Wireframing", "Mobile UX"],
            "interests": ["design", "community", "mobile", "startup", "edtech", "product discovery"],
        },
        "data@foundrly.com": {
            "bio": (
                "Makine öğrenmesi ve veri analizi konusunda uzman. Kaggle master, açık kaynak projelere aktif katkı sağlıyor. "
                "Tahminleme, dashboard tasarımı ve veri ürünleri için model-operasyon kurulumlarında deneyimli."
            ),
            "skills": ["Python", "Machine Learning", "TensorFlow", "Data Analysis", "SQL", "Pandas", "Feature Engineering", "Data Visualization"],
            "interests": ["ai", "data", "research", "startup", "analytics", "forecasting"],
        },
    }

    for email, defaults in user_updates.items():
        User.objects.filter(email=email).update(**defaults)

    project_updates = {
        "CampusMind AI": {
            "summary": (
                "Üniversite öğrencileri için yapay zeka destekli çalışma planlayıcı ve proje buddy platformu. "
                "Kullanıcıların ders, proje ve hackathon hedeflerini AI ile optimize etmesini sağlar. "
                "Görev önceliklendirme, ekip önerisi ve bireysel çalışma ritmi takibi aynı deneyimde birleşir."
            ),
            "tech_stack": ["React", "Django", "PostgreSQL", "OpenAI API", "Celery", "Figma", "UX Research"],
            "needed_roles": ["Backend Developer", "UI/UX Designer", "Machine Learning Engineer", "Product Manager"],
        },
        "PocketLedger": {
            "summary": (
                "Gen Z kullanıcıları için mikro bütçe ve harcama analiz platformu. Banka entegrasyonu, kategori bazlı analiz "
                "ve kişiselleştirilmiş finansal tavsiyeler sunar. Kullanıcı davranışından tasarruf alışkanlığı üreten hafif bir ürün deneyimi hedefler."
            ),
            "tech_stack": ["Django", "PostgreSQL", "React", "Data Visualization", "Plaid API", "Product Analytics"],
            "needed_roles": ["Data Scientist", "Growth Builder", "Frontend Developer", "Product Analyst"],
        },
        "HackSprint Takım Koordinatörü": {
            "summary": (
                "48 saatlik üniversite hackathonları için takım koordinasyon ve sunum yönetim platformu. "
                "Gerçek zamanlı görev dağılımı, sunum materyali oluşturma ve sprint bazlı iş takibi sunar."
            ),
            "tech_stack": ["Next.js", "Figma", "Supabase", "WebSocket", "Vercel", "UI Design", "Product Strategy"],
            "needed_roles": ["Frontend Developer", "Product Manager", "Backend Developer", "UI/UX Designer"],
        },
        "TrendAI - Sosyal Medya Analitik Platformu": {
            "summary": (
                "Startup'lar için sosyal medya trendlerini gerçek zamanlı analiz eden AI destekli platform. "
                "Rakip analizi, sentiment analizi, içerik önerileri ve dashboard bazlı içgörü akışı sunar."
            ),
            "tech_stack": ["Python", "FastAPI", "React", "TensorFlow", "Redis", "PostgreSQL", "Dashboard UX"],
            "needed_roles": ["Frontend Developer", "DevOps Engineer", "UX Designer", "Data Engineer"],
        },
        "EduConnect - Öğrenci Mentörlük Platformu": {
            "summary": (
                "Üniversite öğrencilerini mezunlarla ve sektör profesyonelleriyle buluşturan mentörlük platformu. "
                "Kariyer rehberliği, proje desteği ve eşleşme bazlı birebir oturum planlaması odaklı."
            ),
            "tech_stack": ["React", "Node.js", "MongoDB", "Socket.io", "Tailwind CSS", "Mobile UX", "Notification System"],
            "needed_roles": ["Backend Developer", "UI/UX Designer", "Mobile Developer", "Community Manager"],
        },
    }

    for title, defaults in project_updates.items():
        Project.objects.filter(title=title).update(**defaults)


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("projects", "0003_enrich_demo_project_tech_stack"),
        ("users", "0017_mentorrequestmessage"),
    ]

    operations = [
        migrations.RunPython(enrich_demo_profiles_and_projects, noop_reverse),
    ]
