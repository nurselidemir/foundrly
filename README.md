# Foundrly

> **Turn ideas into teams.**

Foundrly, proje fikri olan kişilerin doğru ekip arkadaşlarını bulmasını sağlayan AI destekli ekip kurma platformudur. Startup, hackathon ve üniversite projelerini hedefler.

---

## Hızlı Başlangıç

```bash
# .env dosyasını oluştur (ilk kez)
cp .env.example .env

# Tüm servisleri ayağa kaldır
docker compose up --build
```

| Servis | Adres |
|---|---|
| 🌐 Web Landing | http://localhost:3000 |
| 🔐 Giriş Yap | http://localhost:3000/#login |
| 📝 Kayıt Ol | http://localhost:3000/#register |
| ⭐ Premium | http://localhost:3000/#premium |
| 🔧 Django Admin | http://localhost:8000/admin/ |
| 🚀 API Health | http://localhost:8000/api/health/ |
| 📖 DRF Browser | http://localhost:8000/api/ |

---

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Backend | Django + Django REST Framework |
| Veritabanı | PostgreSQL 16 |
| Auth | JWT (djangorestframework-simplejwt) |
| AI Matching | TF-IDF + Cosine Similarity (scikit-learn) |
| Frontend | React + TypeScript + Tailwind CSS + Vite |
| Konteyner | Docker + Docker Compose |

---

## Web Deneyimi

Frontend tarafında şu akışlar hazırdır:

- Landing page (`/`)
- Giriş yap sayfası (`/#login`)
- Kayıt ol sayfası (`/#register`)
- Premium simülasyon sayfası (`/#premium`)
- Kurumsal içerik sayfaları (`/#about`, `/#privacy`, `/#careers`, `/#faq`, `/#contact`)
- Herkese açık üye profili (`/#app-member-<id>`)
- Backend health durumunu landing üzerinden izleme

Kayıt ol ekranı doğrudan `POST /api/auth/register/` endpointine bağlıdır.  
Giriş yap ekranı `POST /api/auth/token/` ile JWT alır ve ardından `GET /api/users/me/` çağrısı yapar.

---

## iOS Durumu

`ios/FoundrlyApp/` altında SwiftUI kaynak dosyalari hazirdir. Giris, kayit, kesfet, mesajlar, premium, mentor, topluluk ve profil akislari bulunur.

Bu repo icinde hazir bir `.xcodeproj` dosyasi yoktur. Teslim veya demo asamasinda Xcode'da yeni bir iOS App projesi olusturup bu Swift dosyalarini projeye ekleyerek calistirabilirsin.

---

## Demo Verisi

Hocaya sunum yapmadan once asagidaki komutla ornek hesaplari, projeleri, basvurulari, mesajlasma senaryosunu ve verified kuyrugunu hazirlayabilirsin:

```bash
docker compose exec web python manage.py seed_demo_data
```

Hazir gelen hesaplar:

- Admin: `nurselidemiir@gmail.com` / `Nurseli1`
- Founder: `founder@joinfoundrly.com` / `Founder123!`
- Builder: `builder@joinfoundrly.com` / `Builder123!`
- Designer: `designer@joinfoundrly.com` / `Designer123!`
- Mentor: `mentor@joinfoundrly.com` / `Mentor123!`

Kisa demo akisi:

1. Founder hesabi ile giris yapip aktif proje ve gelen basvurulari goster.
2. Builder hesabi ile public profil, premium ve AI onerilerini goster.
3. Mesajlar ekraninda accepted ekip mesajlasmasini goster.
4. Public profilde yorum ve puan alanlarini goster.
5. Admin hesabi ile `Yonetim` ekranindan pending verified basvurusunu onayla veya reddet.

---

## API Referansı

### Auth
```
POST  /api/auth/register/
POST  /api/auth/token/
POST  /api/auth/token/refresh/
```

### Kullanıcılar
```
GET   /api/users/
GET   /api/users/me/
PATCH /api/users/me/
GET   /api/users/<id>/
GET   /api/users/<id>/reviews/
POST  /api/users/<id>/reviews/
```

### Projeler
```
GET    /api/projects/
POST   /api/projects/
GET    /api/projects/<id>/
PATCH  /api/projects/<id>/
DELETE /api/projects/<id>/
GET    /api/projects/<id>/matches/   ← Premium · AI Team Builder
```

### Başvurular
```
GET   /api/applications/
POST  /api/applications/
PATCH /api/applications/<id>/status/
```

### Dashboard & AI
```
GET /api/dashboard/summary/
GET /api/dashboard/recommended-projects/   ← Premium
```

### Premium & Doğrulama
```
GET  /api/premium/subscription/
POST /api/premium/subscription/
GET  /api/verification-requests/
POST /api/verification-requests/
PATCH /api/verification-requests/<id>/review/
```

### Health
```
GET /api/health/
```

---

## Filtreler

```
/api/projects/?mine=true
/api/projects/?joined=true
/api/projects/?premium_only=true
/api/projects/?search=ai

/api/users/?skill=django
/api/users/?interest=startup
/api/users/?verified_only=true          ← Premium

/api/applications/?mine=true
/api/applications/?received=true
/api/applications/?status=pending
/api/applications/?project=<id>
```

---

## Yetki Kuralları

- Proje güncelleme/silme → yalnızca proje sahibi
- Başvuru durumu değiştirme → yalnızca proje sahibi
- Kendi projesine başvurulamaz
- Aynı projeye ikinci kez başvurulamaz
- `problem_statement`, `tech_stack`, `needed_roles` → yalnızca proje sahibi + `accepted` başvurusu olan kullanıcı
- AI endpointleri → yalnızca Premium kullanıcılar
- `skill`/`interest`/`verified_only` filtreleri → yalnızca Premium

---

## AI Team Builder

Ücretli dış API kullanmaz, kullanıcı tarafında kurulum gerektirmez.  
Backend içinde **TF-IDF + cosine similarity** tabanlı semantic matching çalışır.

**Çıktı:**
- `score` — eşleşme yüzdesi
- `match_label` — High / Medium / Low Match
- `recommended_role` — önerilen rol
- `ai_summary` — doğal dil özeti
- `matched_skills` / `missing_skills`

Kullanım endpointleri:
- `GET /api/dashboard/recommended-projects/`
- `GET /api/projects/<id>/matches/`

---

## Proje Yapısı

```
foundrly-backend/
├── apps/
│   ├── users/          # Custom user modeli, auth, premium, verified talent
│   └── projects/
│       ├── services/
│       │   ├── matching.py      # Rule-based skor motoru
│       │   └── ai_matching.py   # TF-IDF semantic matching
│       └── ...                  # Proje + başvuru API'leri
├── config/             # Django settings, urls, wsgi
├── frontend/           # React + TypeScript + Tailwind + Vite
├── Dockerfile          # Backend image
├── docker-compose.yml  # Backend + Frontend + PostgreSQL
└── requirements.txt
```

---

## Katkı & Geliştirme

Her büyük aşama `docker compose up --build` ile test edilmelidir.  
Git commit/push için açık onay gereklidir.

© 2026 Foundrly · Nurseli Demir (22253042)
