# Foundrly Mobil Uygulama Handoff Dokumani

Bu dokuman, mevcut web urununde bulunan tum ana ekranlari, kullanici akislari, rol bazli yetkileri, tasarim dilini ve veri ihtiyaclarini mobil uygulamaya tasimak icin hazirlanmistir. Amac, bu dokumani bir yapay zeka tasarim/gelistirme aracina verip web ile tutarli, eksiksiz bir mobil uygulama ciktisi almaktir.

## 1. Urun Ozeti

Foundrly, girisimcilerin proje olusturup ekip arkadasi buldugu, basvuru yonettigi, mentorluk aldigi, topluluk makaleleri ve etkinlikleri takip ettigi bir startup topluluk platformudur.

Sistemde 4 ana kullanici durumu vardir:

- Ziyaretci
- Standart uye
- Premium uye
- Mentor
- Admin

Not:

- Mentor olan kullanicilar ayni zamanda premium kabul edilir.
- Admin ayri bir yonetim paneline sahiptir.
- Normal uye ve premium uye ayni mobil uygulamayi kullanir; premium kullanicida ek ozellikler acilir.

## 2. Temel Urun Alanlari

Mobil uygulamada asagidaki alanlar bulunmalidir:

1. Pazarlama / acik alan
2. Kimlik dogrulama
3. Uye uygulamasi
4. Mentor paneli
5. Admin paneli

## 3. Route ve Bilgi Mimarisi

Webde bulunan ana route’lar:

### Acik alan

- `home`
- `mentors`
- `discover`
- `teammates`
- `hub`
- `events`
- `community`
- `premium`
- `about`
- `privacy`
- `careers`
- `faq`
- `contact`
- `login`
- `register`

### Uygulama ici

- `app-home`
- `app-discover`
- `app-create`
- `app-messages`
- `app-profile`
- `app-ai-builder`
- `app-networking`
- `app-mentors`
- `app-mentor-panel`
- `app-admin`
- `app-member`

Mobilde alt tab + stack mantigi onerilir:

### Standart/Premium kullanici alt tab

- Anasayfa
- Kesfet
- Proje Olustur
- Mesajlar
- Profil

### Uye icin ek stack ekranlari

- Mentorluk
- Etkinlikler
- YZ Ekip Kurucu
- Diger kullanici profili
- Proje detayi
- Premium

### Mentor icin

- Mentor Paneli
- Profil
- Mesajlar

### Admin icin

- Admin Dashboard
- Kullanici Yonetimi
- Proje Yonetimi
- Etkinlik Yonetimi
- Makale Yonetimi
- Mentor Yonetimi

## 4. Rol Bazli Yetki Matrisi

### Ziyaretci

- Acik proje listesini gorebilir
- Acik mentor listesini gorebilir
- Topluluk makalelerini gorebilir
- Etkinlikleri gorebilir
- Kayit / giris yapabilir
- Basvuru yapamaz
- Mentorluk talebi gonderemez
- Mesajlasamaz

### Standart uye

- Profilini duzenleyebilir
- Proje olusturabilir
- Projelere basvurabilir
- Kendi projelerine gelen basvurulari gorebilir
- Mesajlasabilir
- Etkinlige kayit olabilir
- Mentor havuzunu gorebilir
- Mentorluk talebi gonderemez

### Premium uye

- Standart uye tum yetkileri
- Mentorluk talebi gonderebilir
- Aylik mentorluk kredisi kullanabilir
- Ek seanslar icin odeme rezerv akisina girebilir
- YZ ekip kurucu ekranini kullanabilir
- Premium gorunurluk alanlarini gorur

### Mentor

- Premium tum yetkiler
- Mentor paneline erisir
- Gelen mentorluk taleplerini yonetir
- Ucretini belirler
- Gorusmeyi tamamlandi olarak isaretler
- Mentor bakiyesini gorur

### Admin

- Tum sistem verilerini yonetir
- Kullanici rol ve moderasyon islemleri yapar
- Manuel mentor olusturur
- Projeleri denetler
- Etkinlik ekler/siler/yayina alir
- Makale ekler/siler/yayina alir
- Mentorleri listeler

## 5. Tasarim Dili

Mobil uygulama, web ile ayni marka hissini korumalidir.

### Genel his

- Koyu, premium, teknoloji odakli arayuz
- Cam efekti hissi veren panel yapilari
- Mavi-yesil isik vurgu dili
- Kalin tipografi, net KPI kartlari
- Keskin degil yumusatilmış buyuk radius’lu kartlar

### Ana renkler

- Arka plan ana lacivert: `#06101F`
- Primary mavi: `#475DB2` civari
- Vurgu mavi: `#9AB0FF`
- Secondary yesil: `#3FB170`
- Beyaz metin
- Durum renkleri:
  - Basari: yesil
  - Uyari: amber
  - Hata: kirmizi
  - Bilgi: acik mavi

### Arka plan stili

- Duz renk degil
- Radial gradient ve yumusak isik lekeleri kullan
- Ust bolumlerde hafif cam panel ve blur etkisi olabilir

### Kart dili

- Border: `white/10` hissinde ince sinir
- Arka plan: yarı saydam koyu panel
- Radius: 24px-40px hissi
- Gölge: yumusak ama derin

### Tipografi

- Basliklar kalin ve guclu
- KPI sayilari cok okunur olmali
- Ust etiketler uppercase + tracking genis
- Ikincil metinler yari seffaf beyaz

### Mobil davranis

- Tum aksiyonlar tek elle kullanima uygun olmali
- Uzun kartlar accordion veya bottom sheet ile sadeleştirilebilir
- Tablar maksimum 5 ana maddede tutulmali
- Formlar uzun ise stepper kullanilabilir

## 6. Acik Alan Ekranlari

### 6.1 Landing / Home

Amac:

- Urun deger onerisi
- Ozellik ozetleri
- Premium ve mentorluk tanitimi
- Kayit CTA

Icerik:

- Hero alan
- Urun ozellik kartlari
- Sosyal kanit / topluluk dili
- Premium CTA
- Mentor CTA
- Footer sayfalari

### 6.2 Public Discover

Amac:

- Ziyaretcilerin acik projeleri gormesi

Icerik:

- Proje kartlari
- Proje sahibi ozeti
- Baslik
- Kisa ozet
- Premium etiketi varsa badge

### 6.3 Public Teammates

Amac:

- Topluluktaki kullanicilari listelemek

Icerik:

- Kullanici kartlari
- Ad soyad
- Unvan
- Beceriler
- Dogrulanmis yetenek rozeti varsa goster

### 6.4 Public Mentors

Amac:

- Mentor havuzunu acik tanitmak

Icerik:

- Mentor kartlari
- Ad
- Unvan
- Bio
- Yetenekler
- Saatlik/oturum ucreti TL cinsinden

### 6.5 Hub / Girisim Merkezi

Amac:

- Topluluk makaleleri ve rehberler

Icerik:

- Makale kartlari
- Baslik
- Okuma suresi
- Ton kategorisi
- Ozet
- Bullet listeler
- Kart tiklaninca detay modal veya detay sayfasi

### 6.6 Events

Amac:

- Topluluk etkinliklerini listelemek

Icerik:

- Etkinlik basligi
- Tarih
- Lokasyon
- Online/Offline bilgisi
- Aciklama
- Kayit butonu

Ziyaretci:

- Sadece gorur

Uye:

- Kayit olabilir
- Kayit olunca durum kalici gorunmeli

## 7. Kimlik Dogrulama

### 7.1 Login

- Email
- Sifre
- Giris butonu
- Kayit ol linki

### 7.2 Register

- Ad soyad
- Email
- Sifre
- Temel onboarding hissi

## 8. Uygulama Ici Uye Deneyimi

## 8.1 App Home / Dashboard

Bu ekran, kullanicinin ana kontrol panelidir.

Olmasi gereken ana bloklar:

### KPI kartlari

- Projelerim sayisi
- Gelen basvuru sayisi
- Bekleyenler
- Kabul edilenler
- Gonderdigim basvuru sayisi
- Katildigim ekip sayisi

### Ag istekleri

- Gelen friend request listesi
- Kabul et / reddet

### Onerilen projeler

- Kullaniciya uygun projeler

### Projelerim

Bu bolum kesinlikle mobilde de bulunmali.

Her proje icin:

- Proje basligi
- Kisa ozet
- Toplam basvuru sayisi
- Bu projeye gelen tum basvurular

Her basvuru kartinda:

- Basvuran kullanicinin adi
- Basvuranin profiline git
- Basvuru durumu
- Basvuru mesaji
- Bu basvurunun hangi projeye geldigini net goster
- Durum pending ise:
  - Kabul Et
  - Reddet

Not:

- Bu alan webde sonradan guclendirildi; mobilde “hangi projesine kim basvurdu” sorusunu tek bakista cevaplamali.

### Gelen Basvurular

- Kisa ozet liste
- Her satirda proje adi + basvuran + durum
- Bu alan “Projelerim”in yerine gecmez, ona ek olarak calisir

### Aktivite paneli

- Acik sohbetler
- Mentor kredileri
- Gonderilen basvuru sayisi
- Premium durumu

## 8.2 App Discover

Giristen sonra proje kesif ekranidir.

Ozellikler:

- Proje kart listesi
- Kendi projesi disindaki projeleri goster
- Basvur butonu
- Basvururken mesaj alani
- Ayni projeye tekrar basvurmussa bunu belirt

Kart icerigi:

- Proje adi
- Proje sahibi
- Ozet
- Gerekli roller
- Teknoloji
- Premium highlight badge varsa goster

## 8.3 Proje Olustur

Form alanlari:

- Proje basligi
- Ozet
- Problem tanimi
- Teknoloji stack
- Aranan roller

Sonuc:

- Basarili olusunca dashboard ve discover yenilenmeli

## 8.4 Mesajlar

Ozellikler:

- Thread listesi
- Thread detay
- Mesaj gonderme

Thread kaynagi:

- Basvuru iliskili mesajlasma
- Kullanici-kullanici iletisim

Mobil onerisi:

- Sol liste / sag detay yerine
- Liste ekranindan detay ekrana gecis

## 8.5 Profilim

Alanlar:

- Profil fotografi
- Ad soyad
- Unvan
- Bio
- Skills
- Interests
- Premium durumu
- Mentor durumu
- Verified talent rozeti
- Katilim tarihi

Eylemler:

- Profil duzenle
- Profil fotografi yukle
- Verification talebi gonder
- Premium sayfasina gec

## 8.6 Diger Kullanici Profili

Bu ekran bir baska kullanicinin public profilidir.

Icerik:

- Fotograf
- Isim
- Unvan
- Bio
- Skills
- Interests
- Dogrulanmis yetenek durumu
- Uygun review/application baglantilari
- Gecmis yorumlar/review’ler

## 8.7 YZ Ekip Kurucu

Sadece premium.

Amac:

- Kullanici kendi projesini secip AI destekli aday onerileri alir

Akis:

1. Kullanici kendi projelerinden birini secer
2. Sistem o projeye gore adaylar listeler
3. Her aday icin uyum skoru ve aciklama gosterilir

Kart icerigi:

- Aday ismi
- Unvan
- Uyum skoru
- Onerilen rol
- Eslestigi beceriler
- AI ozeti
- Profili incele

## 8.8 Premium

Amac:

- Standart kullaniciyi premium’a cevirmek

Gosterilecekler:

- Premium avantajlari
- Aylik ve yillik plan
- TL fiyat
- Satin al CTA

Sistem notu:

- Webde fiyat etiketi TL’ye cevrildi
- Mobilde kesinlikle dolar kullanilmayacak

## 8.9 Etkinlikler / Networking

Uygulama ici etkinlik ekranidir.

Ozellikler:

- Etkinlik listeleme
- Kayit olma
- Kayit olduysa buton yerine “kayit alindi” durumu
- Sayfa yenilense bile kayit durumu korunmali

## 8.10 Mentorluk

Sadece premium kullanici ve mentor degil, mentorluk almak isteyen normal uye tarafidir.

Alanlar:

- Mentor listesi
- Mentor detay karti
- Mesaj ile talep olusturma
- Kredi durumu
- Gerekirse kart bilgileri ile odeme simule formu

Mentorluk talep akisi:

1. Kullanici mentoru secer
2. Mesaj yazar
3. Eger aylik kredi varsa ilk hak kullanimi ucretsiz olabilir
4. Kredi yoksa odeme bilgisi girer
5. Talep olusturulur

Sonraki durumlar:

- `pending`: Talep mentore gitti
- `offered`: Mentor zaman ve ucret onerdi
- `paid_reserved`: Kullanici teklifi kabul etti, odeme rezerve edildi
- `mentor_completed`: Mentor gorusmeyi tamamlandi isaretledi
- `released`: Kullanici onay verdi, odeme mentore akti
- `disputed`: Itiraz acildi
- `declined`: Mentor reddetti
- `refunded`: Iade

Mobilde mentorluk kullanici ekraninda 3 net alan olmali:

### Onay bekleyen gorusmeler

- Mentor
- Onerilen zaman
- Onerilen ucret
- “Teklifi kabul et ve odemeyi rezerve et”

### Odemesi rezerve edilen gorusmeler

- Mentor
- Tarih / saat
- Tutar
- Durum aciklamasi:
  - “Talep mentor paneline dustu”
  - “Siradaki adim: mentor gorusmeyi tamamlayacak”

### Tamamlandi onayi bekleyen gorusmeler

- Mentor
- “Gorusme yapildi, odemeyi serbest birak”
- “Itiraz ac”

## 9. Mentor Paneli

Bu ekran sadece mentor rolundeki kullaniciya acilir.

### KPI alanlari

- Toplam kazanc
- Goruşme ucreti
- Aktif talepler

### Ucret guncelleme

- Mentor kendi saatlik/oturum ucretini TL cinsinden degistirebilir

### Gelen mentorluk talepleri

Her kartta:

- Talep gonderen kullanici
- Talep mesaji
- Talep tarihi
- Baslangicta odemeli mi / kredi mi
- Durum badge’i

#### `pending` ise

- Ucret gir
- Gorusme zamani sec
- “Zaman ve Ucret Oner”
- “Reddet”

#### `offered` ise

- Kullanici onayi bekleniyor bilgisi

#### `paid_reserved` ise

- Bu kart listenin ustlerinde gorunmeli
- “Gorusmeyi Tamamlandi Olarak Isaretle”
- Aciklama:
  - “Odeme rezerve edildi. Gorusme yapildiysa bu adimdan sonra kullaniciya final onayi acilir.”

#### `mentor_completed` ise

- Kullanici onayi bekleniyor

#### `disputed` ise

- Itiraz incelemede bilgisi

Mentor paneli kritik not:

- Mentorlar sistemde otomatik premium sayilir
- Mentorlugu kullanabilmek icin mentorun ayrica premium satin almasi gerekmemeli

## 10. Admin Paneli

Mobilde admin paneli tam masaustu kadar detayli olmak zorunda degil, ancak tum ana yonetim akislarini icermelidir.

Admin tablari:

- Kullanicilar
- Projeler
- Etkinlikler
- Makaleler
- Mentorler

### 10.1 Kullanicilar

- Kullanici listesi
- Arama
- Kullanici detay
- Rol/rozet/moderasyon islemleri
- Mentor olanlar bu sekmede normal kullanici gibi listelenmemeli

### 10.2 Manuel mentor ekleme

Admin bir kullaniciyi dogrudan mentor olarak ekleyebilir.

Alanlar:

- Ad soyad
- Email
- Sifre
- Unvan
- Mentor ucreti

Kurallar:

- Manuel eklenen mentor, mentor yonetiminde gorunmeli
- Kullanici yonetimine dusmemeli
- Otomatik premium olmali

### 10.3 Proje Yonetimi

- Tum projeleri listele
- Proje detayini gor
- Gerekiyorsa moderasyon uygula

### 10.4 Etkinlik Yonetimi

- Etkinlik listele
- Yeni etkinlik ekle
- Etkinlik sil
- Yayin/taslak kontrolu varsa goster

### 10.5 Makale Yonetimi

Bu alan kesinlikle mobil AI ciktisinda unutulmamali.

Ozellikler:

- Makale listele
- Yeni makale ekle
- Makale sil
- Yayinla / taslaga al

Makale form alanlari:

- Baslik
- Okuma suresi
- Ton
- Ozet
- Bullet icerik
- Yayinda mi

### 10.6 Mentor Yonetimi

- Mentor listesi
- Ucret bilgisi
- Mentor profili

## 11. Veri Modelleri ve Mobilde Gerekli Alanlar

### Kullanici

- `id`
- `email`
- `full_name`
- `title`
- `bio`
- `skills[]`
- `interests[]`
- `profile_picture`
- `is_verified_talent`
- `is_premium`
- `is_mentor`
- `mentor_credits`
- `mentor_price`
- `mentor_balance`
- `is_staff`
- `is_superuser`
- `date_joined`

### Proje

- `id`
- `owner`
- `title`
- `summary`
- `problem_statement`
- `tech_stack`
- `needed_roles`
- `is_premium_highlighted`
- `created_at`

### Takim basvurusu

- `id`
- `project`
- `project_details`
- `applicant`
- `message`
- `status`
- `created_at`

### Etkinlik

- `id`
- `title`
- `description`
- `location`
- `event_date`
- `tag`
- `is_online`
- `is_registered`

### Makale / rehber

- `id`
- `title`
- `read`
- `tone`
- `summary`
- `bullets[]`
- `is_published`

### Mentor talebi

- `id`
- `mentor`
- `mentor_details`
- `user`
- `user_details`
- `message`
- `status`
- `meeting_time`
- `user_confirmed`
- `price_at_request`
- `offered_price`
- `reserved_amount`
- `commission_rate`
- `mentor_completed_at`
- `user_confirmed_at`
- `released_at`
- `disputed_at`
- `dispute_reason`
- `status_label`
- `created_at`

## 12. API Kapsami

Mobil uygulama su endpoint mantigini baz alabilir.

### Kullanici ve auth

- `POST /api/auth/register/`
- `POST /api/auth/token/`
- `POST /api/auth/token/refresh/`
- `GET/PATCH /api/users/me/`
- `POST /api/users/me/profile-picture/`
- `GET /api/users/<id>/`
- `GET/POST /api/users/<id>/reviews/`

### Showcase / public

- `GET /api/showcase/`
- `GET /api/mentors/`
- `POST /api/events/register/`

### Dashboard / proje / basvuru

- `GET /api/dashboard/summary/`
- `GET /api/dashboard/recommended-projects/`
- `GET/POST /api/projects/`
- `GET /api/projects/<id>/`
- `GET /api/projects/<id>/matches/`
- `GET/POST /api/applications/`
- `PATCH /api/applications/<id>/status/`

### Mesajlar

- `GET /api/messages/threads/`
- `GET /api/messages/threads/<id>/`
- `POST /api/messages/threads/<id>/messages/`

### Mentorluk

- `GET /api/mentors/`
- `GET/POST /api/mentors/requests/`
- `GET /api/mentors/my-requests/`
- `PATCH /api/mentors/requests/<id>/status/`
- `PATCH /api/mentors/requests/<id>/confirm/`

### Premium

- `POST /api/premium/subscription/`

### Verification

- `GET/POST /api/verification-requests/`
- `PATCH /api/verification-requests/<id>/review/`

### Friend requests

- `GET/POST /api/friend-requests/`
- `PATCH /api/friend-requests/<id>/`

### Admin

- `GET /api/admin/dashboard/`
- `GET /api/admin/users/`
- `POST /api/admin/users/create/`
- `GET/PATCH /api/admin/users/<id>/`
- `PATCH /api/admin/users/<id>/role/`
- `PATCH /api/admin/users/<id>/moderation/`
- `GET /api/admin/verification-requests/`
- `GET /api/admin/projects/`
- `GET /api/admin/projects/<id>/`
- `GET/POST /api/admin/events/`
- `DELETE/PATCH /api/admin/events/<id>/`
- `GET/POST /api/admin/guides/`
- `DELETE/PATCH /api/admin/guides/<id>/`
- `GET /api/admin/mentors/`

## 13. Mobil UX Kurallari

### Genel

- Her ekranda “simdi ne yapmaliyim?” sorusuna cevap ver
- Karanlik arka plan uzerinde kontrastli beyaz metin kullan
- KPI sayilari asla dusuk kontrast olmasin
- Basvuru ve mentorluk gibi durum bazli alanlarda durum + sonraki adim birlikte gosterilsin

### Mentorluk

- Kullanici odemeyi rezerve ettikten sonra ekran “bitmis” gibi gorunmemeli
- Mutlaka siradaki adim acik yazmali
- Mentor panelinde `paid_reserved` talepler one cikarilmali

### Projelerim

- Kullanicinin sahip oldugu proje ve o projeye gelen basvurular birlikte gosterilmeli
- Kullanici “hangi projem?” diye dusunmemeli

### Etkinlikler

- Kayit durumu kalici olmali
- Buton yerine kayitli rozet/mesaj gosterilmeli

### Fiyatlar

- Tum fiyatlar TL
- Dolar gosterilmemeli

## 14. Yapay Zekaya Verilecek Net Uretim Talimati

Asagidaki metin, mobil UI ureten bir yapay zekaya dogrudan verilebilir:

“Foundrly adli startup topluluk platformu icin iOS/Android uyumlu modern bir mobil uygulama tasarla. Web uygulamasindaki tum ana ozellikler mobilde de bulunmali. Tasarim koyu tema tabanli, premium teknoloji hissi veren, lacivert arka planli, mavi ve yesil vurgu renkli, cam panel estetikli olmali. Buyuk radius’lu kartlar, guclu tipografi, cok okunur KPI alanlari kullan. Standart uye, premium uye, mentor ve admin rollerini destekle. Uygulamada su ekranlar olmali: landing, login, register, dashboard, kesfet, proje olustur, mesajlar, profil, diger kullanici profili, mentorluk akisi, mentor paneli, etkinlikler, girisim merkezi makaleleri, premium ekranı, AI ekip kurucu, admin paneli. Ozellikle dashboard icinde kullanicinin ‘Projelerim’ bolumu olmali ve her proje kartinda o projeye kimlerin basvurdugu ve durumlari net gorulmeli. Mentorluk akisinda `pending`, `offered`, `paid_reserved`, `mentor_completed`, `released`, `disputed`, `declined`, `refunded` durumlarini destekle. Tum fiyatlar TL cinsinden gosterilsin. Mobil bilgi mimarisi, durum bazli butonlar ve sonraki adim mesajlari ile eksiksiz ve gercek urun seviyesinde olsun.” 

## 15. Son Notlar

- Mobil ciktida webdeki tum ana ozellikler yer almali
- “Projelerim” ve “Mentorluk sonraki adim” kisimlari ozellikle atlanmamali
- Admin panelinde makale yonetimi unutulmamali
- Mentorlar otomatik premium kabul edilmeli
- Fiyat dili tamamen TL olmali

