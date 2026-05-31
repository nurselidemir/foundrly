# Foundrly

> **Turn ideas into teams.**

Foundrly; kurucuların, geliştiricilerin, tasarımcıların, mentörlerin ve startup meraklılarının startup, hackathon, üniversite projesi ve yan proje ekipleri kurmasını kolaylaştıran AI destekli bir ekip oluşturma platformudur.

Platform; profil verileri, proje hedefi, ilgi alanları, iş birliği sinyalleri ve AI matching mantığını bir araya getirerek doğru insanları daha hızlı bulmayı hedefler.

Bu repository şu anda şunları içerir:
- Django + DRF backend
- React + TypeScript + Tailwind frontend
- Docker ile çalışan local geliştirme ortamı
- Premium, verified talent, mentörlük, mesajlaşma, proje başvurusu ve AI matching akışları
- Premium/futuristic bir landing page ve geliştirilmiş uygulama içi web deneyimi
- SwiftUI tabanlı, backend ile senkron çalışan iOS istemcisi

---

## Ürün Özeti

Foundrly’nin ana amacı şudur:

**ciddi üreticilerin doğru insanları daha hızlı bulmasını sağlamak.**

Platform eşleşmeleri şu sinyallere göre destekler:
- teknik yetenekler
- ilgi alanları
- proje hedefleri
- iş birliği geçmişi
- profil kalitesi ve güven sinyalleri

Şu anda mevcut ana ürün akışları:
- kayıt olma ve giriş yapma
- private ve public profil akışları
- proje oluşturma ve proje keşfi
- projelere başvuru
- eşleşen kullanıcılar arası mesajlaşma
- premium abonelik simülasyonu
- verified talent başvuru akışı
- mentör listeleme ve mentör talebi
- admin / moderasyon paneli
- AI destekli takım önerileri

---

## Güncel Durum

Proje artık sadece basit bir landing page demosu değil.

Web tarafında şu alanlar mevcut:
- premium/futuristic marketing landing
- public discovery sayfaları
- community ve teammate keşif sayfaları
- giriş yapılmış kullanıcı dashboard’u
- `Projelerim` ve başvurduğum projeler alanı
- proje yönetimi akışları
- AI Team Builder akışı
- profil ve public profil sayfaları
- mentörlük akışları
- admin / moderasyon akışları

Mobil tarafta şu an aktif kapsam:
- web ile aynı auth / profil alanları
- proje keşfi, başvuru, mesajlaşma
- AI Team Builder
- etkinlikler ve girişim merkezi

Mobilde özellikle devre dışı bırakılan alanlar:
- mentörlük kullanıcı akışları
- doğrulanmış yetenek başvurusu
- keşfette ayrı kullanıcı / ekip üyeleri sekmesi

Yakın zamanda geliştirilen başlıca alanlar:
- premium dark-mode landing deneyimi
- gelişmiş discovery ve community tasarımı
- dashboard içinde onboarding signal katmanı
- daha güçlü profil sunumu
- daha rafine AI eşleşme sonuç kartları

---

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Backend | Django 5 + Django REST Framework |
| Veritabanı | PostgreSQL 16 |
| Kimlik Doğrulama | `djangorestframework-simplejwt` ile JWT |
| AI Matching | TF-IDF + cosine similarity + kural tabanlı skor mantığı |
| Frontend | React 18 + TypeScript + Tailwind CSS + Vite |
| Motion | Framer Motion |
| Uygulama Sunucusu | Gunicorn |
| Konteyner | Docker + Docker Compose |

---

## Proje Yapısı

```text
foundrly-backend/
├── apps/
│   ├── users/
│   │   ├── management/commands/
│   │   ├── migrations/
│   │   └── ...
│   └── projects/
│       ├── migrations/
│       ├── services/
│       │   ├── matching.py
│       │   └── ai_matching.py
│       └── ...
├── config/
├── frontend/
│   ├── public/
│   └── src/
├── ios/
├── logo/
├── Dockerfile
├── docker-compose.yml
├── manage.py
└── requirements.txt
```

Önemli klasörler:
- `apps/users/` → user modeli, auth, premium, verified talent, review, mentörlük
- `apps/projects/` → projeler, başvurular, mesajlaşma, matching servisleri
- `frontend/src/` → React uygulaması, public sayfalar, dashboard akışları
- `frontend/src/components/marketing/` → marketing landing component’leri
- `ios/FoundrlyApp/` → SwiftUI tabanlı iOS konsept uygulama kaynakları

---

## Hızlı Başlangıç

### 1. Ortam dosyasını hazırla

```bash
cp .env.example .env
```

### 2. Veritabanını başlat

```bash
docker compose up -d db
```

### 3. Backend’i başlat

```bash
docker compose up -d web
```

`web` servisi açılırken otomatik olarak şunları çalıştırır:
- `python manage.py migrate`
- `python manage.py collectstatic --noinput`

### 4. Frontend’i başlat

```bash
docker compose up -d frontend
```

### 5. İstersen demo veriyi yükle

```bash
docker compose exec web python manage.py seed_demo_data
```

---

## Kartsız Deploy

Render Blueprint içinde veritabanı oluşturmak kart doğrulaması isteyebilir. Kartsız deploy için en pratik akış:

1. Neon veya Supabase üzerinde ücretsiz bir PostgreSQL veritabanı oluştur.
2. Connection string'i kopyala.
3. Render'da `New + -> Blueprint` ile bu repoyu bağla.
4. `DATABASE_URL` alanına dış veritabanı connection string'ini gir.
5. `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS` ve `FRONTEND_BASE_URL` alanlarını Vercel URL'inle doldur.
6. Frontend'i Vercel'de `frontend/` root directory ile deploy et ve `VITE_API_URL` değişkenini Render backend URL'i olarak ekle.

Bu repository'deki `render.yaml`, kartsız senaryo için Render'ın kendi Postgres'ini oluşturmadan sadece backend servisini ayağa kaldıracak şekilde hazırlanmıştır.

---

## Servis Adresleri

| Servis | Adres |
|---|---|
| Web Uygulaması | http://localhost:3000 |
| Giriş Yap | http://localhost:3000/#login |
| Kayıt Ol | http://localhost:3000/#register |
| Premium | http://localhost:3000/#premium |
| Django Admin | http://localhost:8000/admin/ |
| Health Check | http://localhost:8000/api/health/ |
| PostgreSQL | `localhost:5433` |

---

## Docker Kurulumu

Bu proje üç temel servis kullanır:
- `db` → PostgreSQL
- `web` → Django backend
- `frontend` → React frontend

### Docker Compose özeti

- Backend `8000` portunda çalışır
- Frontend `3000` portunda çalışır
- PostgreSQL `5433 -> 5432` olarak dışarı açılır

### Yararlı komutlar

```bash
docker compose ps
docker compose logs web
docker compose logs frontend
docker compose logs db
```

Sıfırdan tüm sistemi ayağa kaldırmak için:

```bash
docker compose up --build
```

---

## Veritabanına Dışarıdan Bağlanma

DBeaver veya başka bir DB istemcisi ile bağlanmak istersen:

### PostgreSQL bağlantı bilgileri

- Host: `localhost`
- Port: `5433`
- Database: `foundrly`
- Username: `foundrly`
- Password: `foundrly`

JDBC URL:

```text
jdbc:postgresql://localhost:5433/foundrly
```

Eğer `connection refused` hatası alırsan, genelde `db` container’ı henüz ayağa kalkmamış demektir.

---

## Demo Hesapları

Demo veri yüklendikten sonra:

```bash
docker compose exec web python manage.py seed_demo_data
```

Aşağıdaki hesapları kullanabilirsin:
- Admin: `admin@foundrly.com` / `Admin123!`
- Founder: `founder@foundrly.com` / `Founder123!`
- Builder: `builder@foundrly.com` / `Builder123!`
- Designer: `designer@foundrly.com` / `Designer123!`
- Mentor: `mentor@foundrly.com` / `Mentor123!`
- User: `user@foundrly.com` / `User123!`

---

## Önerilen Demo Akışı

Sunum için pratik bir akış:

1. Landing page’i aç ve premium marketing deneyimini göster.
2. Founder hesabıyla giriş yap.
3. Dashboard KPI’larını, onboarding signal alanını ve açık projeleri göster.
4. AI Team Builder’ı aç ve eşleşme analizi çalıştır.
5. Public profil ve collaboration review alanını göster.
6. Mesajlar ekranında accepted iş birliği akışını göster.
7. Admin hesabına geçip moderasyon / verified talent inceleme akışını göster.

---

## Frontend Deneyimi

### Public route’lar

- `/#` → premium landing page
- `/#discover` → premium proje keşif deneyimi
- `/#teammates` → teammate showcase
- `/#community` → community feed deneyimi
- `/#mentors` → public mentör listesi
- `/#login` → giriş ekranı
- `/#register` → kayıt ekranı
- `/#premium` → premium deneyim sayfası
- `/#about`
- `/#privacy`
- `/#careers`
- `/#faq`
- `/#contact`

### Uygulama içi route’lar

- `/#app-home`
- `/#app-create`
- `/#app-projects`
- `/#app-messages`
- `/#app-profile`
- `/#app-ai-builder`
- `/#app-networking`
- `/#app-mentors`
- `/#app-mentor-panel`
- `/#app-admin`
- `/#app-member-<id>`

### Yakın zamanda iyileştirilen UX alanları

- premium marketing landing
- gelişmiş discovery ve teammate sunumu
- founder dashboard hero / onboarding katmanı
- daha güçlü profil ve public profil görünümü
- daha açıklayıcı AI match sonuçları
- uygulama içinde daha güçlü startup-product görsel dili

---

## Backend Özellikleri

### Authentication
- register
- login with JWT
- refresh token
- current user endpoint

### Profiller
- current user profili
- public user profilleri
- profil fotoğrafı yükleme
- verified talent rozeti
- premium durumu
- mentör durumu
- collaboration review sistemi

### Projeler
- proje oluşturma
- proje listeleme
- kendi projesini güncelleme / silme
- public proje keşfi
- premium görünürlük sinyalleri

### Başvurular
- projeye başvurma
- duplicate başvuru engeli
- gelen başvuruları görüntüleme
- kabul / red akışı

### Mesajlaşma
- thread listesi
- thread detayı
- application thread içinden mesaj gönderme

### Mentörlük
- mentör listeleme
- mentör talep akışı
- mentör talep yönetimi
- mentör fiyatlandırması

### Premium
- premium abonelik simülasyonu
- premium-only özellikler ve filtreler

### Admin / Moderasyon
- kullanıcı arama
- rol güncelleme
- premium moderasyonu
- verified talent moderasyonu
- proje moderasyonu
- kullanıcı silme

---

## AI Team Builder

AI katmanı ücretli bir dış AI API zorunluluğu olmadan çalışır.

Şu anki matching mantığı şunları birleştirir:
- TF-IDF tabanlı anlamsal analiz
- cosine similarity
- rol ve skill mantığı
- öneri özetleri

### AI çıktıları
- `score`
- `match_label`
- `recommended_role`
- `ai_summary`
- `matched_skills`
- `missing_skills`

### Temel AI endpoint’leri
- `GET /api/dashboard/recommended-projects/`
- `GET /api/projects/<id>/matches/`

---

## API Referansı

### Auth
```text
POST  /api/auth/register/
POST  /api/auth/token/
POST  /api/auth/token/refresh/
```

### Users
```text
GET   /api/users/
GET   /api/users/me/
PATCH /api/users/me/
GET   /api/users/<id>/
GET   /api/users/<id>/reviews/
POST  /api/users/<id>/reviews/
POST  /api/users/me/profile-picture/
```

### Projects
```text
GET    /api/projects/
POST   /api/projects/
GET    /api/projects/<id>/
PATCH  /api/projects/<id>/
DELETE /api/projects/<id>/
GET    /api/projects/<id>/matches/
```

### Applications
```text
GET   /api/applications/
POST  /api/applications/
PATCH /api/applications/<id>/status/
```

### Messages
```text
GET  /api/messages/threads/
GET  /api/messages/threads/<id>/
POST /api/messages/threads/<id>/messages/
```

### Dashboard
```text
GET /api/dashboard/summary/
GET /api/dashboard/recommended-projects/
```

### Premium
```text
GET  /api/premium/subscription/
POST /api/premium/subscription/
```

### Verification Requests
```text
GET   /api/verification-requests/
POST  /api/verification-requests/
PATCH /api/verification-requests/<id>/review/
```

### Mentörlük
```text
GET   /api/mentors/
POST  /api/mentors/requests/
GET   /api/mentors/requests/
GET   /api/mentors/my-requests/
PATCH /api/mentors/requests/<id>/status/
PATCH /api/mentors/requests/<id>/confirm/
POST  /api/mentors/requests/<id>/messages/
```

### Admin
```text
GET    /api/admin/dashboard/
GET    /api/admin/users/
GET    /api/admin/users/<id>/
PATCH  /api/admin/users/<id>/role/
PATCH  /api/admin/users/<id>/moderation/
DELETE /api/admin/users/<id>/moderation/
GET    /api/admin/projects/
GET    /api/admin/projects/<id>/
DELETE /api/admin/projects/<id>/
```

### Health
```text
GET /api/health/
```

---

## Filtre Örnekleri

```text
/api/projects/?mine=true
/api/projects/?joined=true
/api/projects/?premium_only=true
/api/projects/?search=ai

/api/users/?skill=django
/api/users/?interest=startup
/api/users/?verified_only=true

/api/applications/?mine=true
/api/applications/?received=true
/api/applications/?status=pending
/api/applications/?project=<id>
```

---

## Yetki Kuralları

Önemli permission kuralları:
- yalnızca proje sahibi proje güncelleyebilir / silebilir
- yalnızca proje sahibi başvuru durumunu değiştirebilir
- kullanıcı kendi projesine başvuramaz
- aynı projeye ikinci kez başvurulamaz
- premium-only filtreler korumalıdır
- AI matching endpoint’leri premium-only’dir
- bazı proje detay alanları yalnızca proje sahibi ve accepted collaborator’lara açıktır
- admin moderasyon endpoint’leri yüksek yetki ister

---

## Frontend Geliştirme

### Frontend dependency kurulumu

```bash
npm --prefix frontend install
```

### Frontend local çalıştırma

```bash
npm --prefix frontend run dev
```

### Frontend build alma

```bash
npm --prefix frontend run build
```

Frontend tarafında şu teknolojiler kullanılır:
- React
- TypeScript
- Tailwind CSS
- Vite
- Framer Motion

---

## iOS Durumu

`ios/FoundrlyApp/` altında SwiftUI tabanlı iOS istemcisi ve hazır Xcode projesi bulunur.

Hazır ekranlar ve akışlar:
- auth
- home
- discover
- project detail
- create project
- my projects
- messages
- profile
- AI builder
- events
- hub / girişim merkezi

Önemli not:
- proje dosyası hazırdır: `ios/FoundrlyApp/FoundrlyApp/FoundrlyApp.xcodeproj`
- uygulama production backend URL’ine bağlanacak şekilde ayarlanmıştır
- kayıt formu backend ile ortak alanları kullanır: `full_name`, `email`, `password`, `title`, `bio`, `skills`, `interests`
- mobil arayüzde mentörlük ve doğrulanmış yetenek başvurusu akışları bilinçli olarak kapatılmıştır

Telefona yüklemek için:

```bash
open /Users/nurselidemir/Projects/foundrly-backend/ios/FoundrlyApp/FoundrlyApp/FoundrlyApp.xcodeproj
```

Sonra Xcode içinde:
1. Apple hesabını `Signing & Capabilities` altında seç
2. Gerekirse `Bundle Identifier` alanını benzersiz yap
3. Cihazını seçip `Run` bas

Ücretsiz Apple ID ile yüklenen build genelde yaklaşık 7 gün geçerli olur; sonra tekrar Xcode’dan yüklemek gerekir.

---

## Asset ve Teslim Notları

Repository içinde bulunan teslim materyalleri:
- `logo/` dosyaları
- `frontend/public/logo.png`
- `frontend/public/favicon.png`
- `mentörler/` story görselleri

Ek notlar:
- domain satın alımı gibi bazı dış teslim ekran görüntüleri gerekiyorsa manuel olarak ayrıca eklenmelidir

---

## Doğrulama Checklist’i

Stack’i hızlı doğrulamak için:

```bash
docker compose ps
docker compose exec web python manage.py check
docker compose exec web python manage.py seed_demo_data
npm --prefix frontend run build
```

Elle kontrol edilecek ana adresler:
- `http://localhost:3000`
- `http://localhost:8000/admin/`
- `http://localhost:8000/api/health/`

---

## Notlar

- Proje hem demo sunumuna hem ders teslimine uygun olacak şekilde kurgulanmıştır.
- Premium ve billing akışları canlı Stripe entegrasyonu değil, ürün akışı simülasyonudur.
- AI matching local ve demo için yeterince deterministik çalışır.
- Backend + frontend + database’i birlikte çalıştırmak için önerilen yol Docker’dır.

---

## Lisans / Kredi

© 2026 Foundrly  
Nurseli Demir (22253042)
