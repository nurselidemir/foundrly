# Foundrly Backend

Bu depo, `proje.md` dokumanindaki teknik kararlarla birebir uyumlu ilk backend iskeletini icerir:

- Backend: Django
- API: REST
- Veritabani: PostgreSQL
- Kimlik dogrulama: JWT
- Konteynerizasyon: Docker + Docker Compose

## Hemen Baslamak

1. `.env.example` dosyasini `.env` olarak kopyalayin.
2. Docker ile calistirin:

```bash
docker compose up --build
```

Bu komut container ayaga kalkarken migration ve `collectstatic` islemlerini otomatik olarak calistirir.

3. Servis ayaga kalktiktan sonra su endpointleri kullanabilirsiniz:

- `GET /api/health/`
- `POST /api/auth/register/`
- `POST /api/auth/token/`
- `POST /api/auth/token/refresh/`
- `GET /api/users/`
- `GET /api/users/me/`
- `PATCH /api/users/me/`
- `GET /api/premium/subscription/`
- `POST /api/premium/subscription/`
- `GET /api/verification-requests/`
- `POST /api/verification-requests/`
- `PATCH /api/verification-requests/<id>/review/`
- `GET /api/dashboard/summary/`
- `GET /api/projects/`
- `POST /api/projects/`
- `GET /api/projects/<id>/`
- `PATCH /api/projects/<id>/`
- `DELETE /api/projects/<id>/`
- `GET /api/applications/`
- `POST /api/applications/`
- `PATCH /api/applications/<id>/status/`

`POST /api/projects/` ve `POST /api/applications/` endpointleri JWT ile giris yapmis kullanici ister. Proje sahibi ve basvuru sahibi alanlari oturumdaki kullanicidan otomatik atanir.
`GET /api/dashboard/summary/` endpointi giris yapan kullanicinin ozet panel verilerini dondurur.
`GET /api/projects/<id>/` herkese aciktir. `PATCH` ve `DELETE` islemlerini ise sadece ilgili projenin sahibi yapabilir.
`PATCH /api/applications/<id>/status/` endpointinde basvuru durumunu sadece ilgili projenin sahibi degistirebilir.
Proje detayinda `problem_statement`, `tech_stack` ve `needed_roles` alanlari sadece proje sahibi ve basvurusu `accepted` olan kullanicilara gosterilir. `applications` listesi ise yalnizca proje sahibine gorunur.
`POST /api/premium/subscription/` ile kullanici `monthly` veya `yearly` premium uyeligi baslatabilir. Premium kullanicinin projesi otomatik olarak `is_premium_highlighted=true` olur.
`POST /api/verification-requests/` sadece premium kullanicilar tarafindan kullanilabilir. Verified Talent incelemesi admin tarafinda `PATCH /api/verification-requests/<id>/review/` ile sonuclandirilir.

## Filtreler

- `GET /api/projects/?mine=true`
- `GET /api/projects/?joined=true`
- `GET /api/projects/?premium_only=true`
- `GET /api/projects/?search=ai`
- `GET /api/users/?skill=django`
- `GET /api/users/?interest=startup`
- `GET /api/users/?verified_only=true`
- `GET /api/applications/?mine=true`
- `GET /api/applications/?received=true`
- `GET /api/applications/?status=pending`
- `GET /api/applications/?project=1`

`/api/applications/` listesi guvenlik nedeniyle anonim kullaniciya kapatilidir. Giris yapan kullanici varsayilan olarak sadece sahibi oldugu projelere gelen basvurulari gorur. `mine=true` verilirse kendi yaptigi basvurulari listeler.
`/api/users/` uzerindeki `skill`, `interest` ve `verified_only` filtreleri gelismis ekip filtreleme kapsamindadir ve sadece premium kullanicilar tarafindan kullanilabilir.

## Ilk Yol Haritasi

Bu ilk surumde dokumana sadik kalarak temel altyapi kurulmustur. Ozel kullanici modeli, kayit/giris akisi, proje paylasimi ve ekip basvurulari auth ile iliskilendirilmistir. Siradaki adimlar:

- Dashboard metriklerini frontend ile eslemek
- AI Team Builder onerileri icin servis katmani eklemek
