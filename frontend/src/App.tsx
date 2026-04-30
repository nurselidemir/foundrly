import { useEffect, useState } from "react";

type HealthState = { status: "loading" | "ready" | "error"; message: string };
type RouteName = "home" | "login" | "register";

const NAV_LINKS = [
  { label: "Özellikler", href: "#features" },
  { label: "Nasıl Çalışır?", href: "#how-it-works" },
  { label: "Fiyatlandırma", href: "#pricing" },
];

const ENTRY_LINKS = [
  { label: "Giriş Yap", href: "#login", className: "border border-ink/12 bg-white/80 text-ink hover:border-primary/25 hover:text-primary" },
  { label: "Kayıt Ol", href: "#register", className: "bg-primary text-white hover:bg-primary/90 shadow-halo" },
];

function getRouteFromHash(): RouteName {
  if (typeof window === "undefined") return "home";
  if (window.location.hash === "#login") return "login";
  if (window.location.hash === "#register") return "register";
  return "home";
}

function AuthPage({
  mode,
  health,
}: {
  mode: "login" | "register";
  health: HealthState;
}) {
  const isRegister = mode === "register";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const parseTags = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const extractErrorMessage = async (response: Response) => {
    try {
      const data = await response.json();
      if (typeof data?.detail === "string") return data.detail;
      if (typeof data?.message === "string") return data.message;
      const firstError = Object.values(data ?? {}).flat().find(Boolean);
      if (typeof firstError === "string") return firstError;
    } catch {
      return "Bir hata oluştu. Lütfen tekrar dene.";
    }
    return "Bir hata oluştu. Lütfen tekrar dene.";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: "idle", message: "" });

    try {
      if (isRegister) {
        const registerResponse = await fetch("/api/auth/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
            title,
            bio,
            skills: parseTags(skills),
            interests: parseTags(interests),
          }),
        });

        if (!registerResponse.ok) {
          throw new Error(await extractErrorMessage(registerResponse));
        }

        setFeedback({
          type: "success",
          message:
            "Hesabın oluşturuldu. Şimdi giriş sayfasına geçebilirsin.",
        });
        setPassword("");
        window.location.hash = "#login";
      } else {
        const tokenResponse = await fetch("/api/auth/token/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!tokenResponse.ok) {
          throw new Error(await extractErrorMessage(tokenResponse));
        }

        const tokenData = await tokenResponse.json();
        localStorage.setItem("foundrly_access_token", tokenData.access);
        localStorage.setItem("foundrly_refresh_token", tokenData.refresh);

        const meResponse = await fetch("/api/users/me/", {
          headers: {
            Authorization: `Bearer ${tokenData.access}`,
          },
        });

        if (!meResponse.ok) {
          throw new Error("Giriş yapıldı ama profil bilgisi alınamadı.");
        }

        const me = await meResponse.json();
        localStorage.setItem("foundrly_current_user", JSON.stringify(me));

        setFeedback({
          type: "success",
          message: `Hoş geldin ${me.full_name || me.email}. Giriş başarılı.`,
        });
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Bir hata oluştu. Lütfen tekrar dene.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh font-sans text-ink antialiased">
      <header className="border-b border-white/40 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <a href="#" className="flex flex-col leading-none">
            <span className="text-2xl font-extrabold tracking-tight text-ink">Foundrly</span>
            <span className="text-[11px] font-medium tracking-widest text-primary/70">
              TURN IDEAS INTO TEAMS
            </span>
          </a>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex h-2 w-2 rounded-full ${
                health.status === "ready"
                  ? "bg-success"
                  : health.status === "error"
                  ? "bg-red-400"
                  : "bg-yellow-300"
              }`}
            />
            <a
              href="#"
              className="rounded-full border border-ink/12 bg-white/80 px-5 py-2 text-sm font-semibold text-ink transition hover:border-primary/25 hover:text-primary"
            >
              Ana Sayfa
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20">
        <section className="flex flex-col justify-between rounded-[2.5rem] bg-ink p-8 text-white shadow-halo lg:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/45">
              {isRegister ? "Yeni Ekip Arkadaşları Bul" : "Tekrar Hoş Geldin"}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight lg:text-5xl">
              {isRegister
                ? "Dakikalar içinde profilini kur ve doğru ekibe görün."
                : "Hesabına gir, projelerini ve başvurularını yönet."}
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/72">
              {isRegister
                ? "Foundrly ile fikrini paylaşabilir, ekip arkadaşları bulabilir ve AI Team Builder ile en uygun eşleşmeleri görebilirsin."
                : "Dashboard, proje yönetimi, premium özellikler ve AI Team Builder önerileri seni içeride bekliyor."}
            </p>
          </div>

          <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-white/8 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
              Platform Özeti
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                "AI Team Builder ile ekip önerileri",
                "Verified Talent ile daha güvenli profiller",
                "Premium ile daha yüksek görünürlük",
                "Docker içinde çalışan canlı backend",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/8 p-4 text-sm text-white/78">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[2.5rem] border border-white/60 bg-white/88 p-8 shadow-halo backdrop-blur lg:p-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/55">
                {isRegister ? "Kayıt Ol" : "Giriş Yap"}
              </p>
              <h2 className="mt-2 text-3xl font-extrabold">
                {isRegister ? "Foundrly hesabını oluştur" : "Foundrly hesabına giriş yap"}
              </h2>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {isRegister && (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-ink/72">Ad Soyad</span>
                  <input
                    type="text"
                    placeholder="Nurseli Demir"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-2xl border border-ink/10 bg-[#F7F8FC] px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:bg-white"
                    required
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink/72">E-posta</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-ink/10 bg-[#F7F8FC] px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:bg-white"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink/72">Şifre</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-ink/10 bg-[#F7F8FC] px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:bg-white"
                  minLength={8}
                  required
                />
              </label>

              {isRegister && (
                <>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink/72">Rolün</span>
                    <input
                      type="text"
                      placeholder="Frontend Developer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-2xl border border-ink/10 bg-[#F7F8FC] px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:bg-white"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink/72">Kısa Biyografi</span>
                    <textarea
                      placeholder="Kısaca ne yaptığını ve ne aradığını yaz."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="min-h-28 w-full rounded-2xl border border-ink/10 bg-[#F7F8FC] px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:bg-white"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink/72">Yetenekler</span>
                    <input
                      type="text"
                      placeholder="React, TypeScript, UI"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full rounded-2xl border border-ink/10 bg-[#F7F8FC] px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:bg-white"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink/72">İlgi Alanları</span>
                    <input
                      type="text"
                      placeholder="startup, frontend, product"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      className="w-full rounded-2xl border border-ink/10 bg-[#F7F8FC] px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:bg-white"
                      required
                    />
                  </label>
                </>
              )}

              {feedback.type !== "idle" && (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    feedback.type === "success"
                      ? "border border-success/20 bg-success/8 text-success"
                      : "border border-red-200 bg-red-50 text-red-500"
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? isRegister
                    ? "Hesap oluşturuluyor..."
                    : "Giriş yapılıyor..."
                  : isRegister
                  ? "Hesap Oluştur"
                  : "Giriş Yap"}
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-ink/58">
              <span>
                {isRegister ? "Zaten hesabın var mı?" : "Hesabın yok mu?"}
              </span>
              <a
                href={isRegister ? "#login" : "#register"}
                className="font-semibold text-primary transition hover:text-primary/80"
              >
                {isRegister ? "Giriş ekranına git" : "Kayıt sayfasını aç"}
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const FEATURES = [
  {
    icon: "👤",
    title: "Founder Profili",
    description:
      "Teknik becerilerini, ilgi alanlarını ve proje geçmişini tek bir güçlü profil üzerinden paylaş. Verified Talent rozeti ile güvenilirliğini kanıtla.",
    badge: "Ücretsiz",
    badgeColor: "bg-success/10 text-success",
  },
  {
    icon: "🤖",
    title: "AI Team Builder",
    description:
      "TF-IDF tabanlı semantic matching motoru, proje ihtiyaçlarını ve kullanıcı becerilerini analiz ederek en uygun ekip üyelerini önerir.",
    badge: "Premium",
    badgeColor: "bg-primary/10 text-primary",
  },
  {
    icon: "🔍",
    title: "Proje Keşfi",
    description:
      "Hackathon, startup, üniversite projelerini filtrele. Beceri, teknoloji ve deneyim seviyesine göre sana uygun projeleri bul.",
    badge: "Ücretsiz",
    badgeColor: "bg-success/10 text-success",
  },
  {
    icon: "✅",
    title: "Verified Talent",
    description:
      "Admin onaylı doğrulama sistemiyle profilini güçlendir. Ekip kuranlar önce doğrulanmış yeteneklere başvurur.",
    badge: "Premium",
    badgeColor: "bg-primary/10 text-primary",
  },
  {
    icon: "📊",
    title: "Dashboard",
    description:
      "Gönderdiğin ve aldığın başvuruları, projelerini ve eşleşme skorlarını tek ekrandan yönet.",
    badge: "Ücretsiz",
    badgeColor: "bg-success/10 text-success",
  },
  {
    icon: "⭐",
    title: "Görünürlük Artışı",
    description:
      "Premium projeler ana sayfada öne çıkar, daha fazla kaliteli başvuru alır. Rekabette bir adım öne geç.",
    badge: "Premium",
    badgeColor: "bg-primary/10 text-primary",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Profilini Oluştur",
    desc: "Becerilerini, ilgi alanlarını ve proje geçmişini ekle.",
  },
  {
    num: "02",
    title: "Projeyi Paylaş",
    desc: "Fikrinin detaylarını ve aradığın rolleri belirt.",
  },
  {
    num: "03",
    title: "Eşleşmeleri Gör",
    desc: "AI, en uygun ekip üyelerini sıralayarak önerir.",
  },
  {
    num: "04",
    title: "Ekibini Kur",
    desc: "Başvuru al, değerlendir ve projenle yola çık.",
  },
];

const PROBLEMS = [
  { icon: "😤", text: "Discord / Reddit'te saatlerce doğru kişiyi aramak" },
  { icon: "🎲", text: "Rastgele arkadaş çevresiyle dengesiz ekip kurmak" },
  { icon: "🔇", text: "Başvuru yaptıktan sonra hiç geri dönüş almamak" },
  { icon: "❓", text: "Karşındaki kişinin gerçekten yetkin olup olmadığını bilememek" },
];

const SOLUTIONS = [
  { icon: "🎯", text: "Beceri odaklı, proje bazlı akıllı eşleştirme" },
  { icon: "🤝", text: "Verified Talent rozetiyle güvenilir profiller" },
  { icon: "⚡", text: "AI ile dakikalar içinde en uygun adaylar" },
  { icon: "📈", text: "Şeffaf başvuru ve değerlendirme akışı" },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "sonsuza kadar",
    desc: "Platformu keşfetmek için başla.",
    cta: "Ücretsiz Başla",
    ctaClass: "bg-ink text-white hover:bg-ink/90",
    cardClass: "border-ink/10 bg-white/90 text-ink",
    items: [
      "Profil oluşturma",
      "Proje paylaşma ve keşfetme",
      "Ekip başvurusu",
      "Temel ekip eşleşmesi",
      "Dashboard özeti",
    ],
    locked: ["AI Team Builder", "Verified Talent rozeti", "Görünürlük artışı"],
  },
  {
    name: "Premium",
    price: "$5",
    period: "/ ay · $48/yıl",
    desc: "Doğru ekibi çok daha hızlı kur.",
    cta: "Premium'a Geç",
    ctaClass: "bg-white text-primary hover:bg-white/90",
    cardClass: "border-primary/20 bg-primary text-white shadow-halo",
    items: [
      "Free'deki her şey",
      "AI Team Builder (semantic matching)",
      "Verified Talent rozeti",
      "Proje görünürlük artışı",
      "Gelişmiş ekip filtreleme",
      "Reklamsız kullanım + öncelikli destek",
    ],
    locked: [],
  },
];

export default function App() {
  const [health, setHealth] = useState<HealthState>({
    status: "loading",
    message: "Backend bağlantısı kontrol ediliyor…",
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [route, setRoute] = useState<RouteName>(getRouteFromHash());

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health/")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        if (!cancelled)
          setHealth({ status: "ready", message: `${d.name ?? "Foundrly API"} aktif ve çalışıyor.` });
      })
      .catch(() => {
        if (!cancelled)
          setHealth({ status: "error", message: "Backend şu an ulaşılamıyor." });
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const dot =
    health.status === "ready"
      ? "bg-success shadow-[0_0_0_6px_rgba(63,177,112,0.2)]"
      : health.status === "error"
      ? "bg-red-400 shadow-[0_0_0_6px_rgba(248,113,113,0.18)]"
      : "bg-yellow-300 animate-pulse shadow-[0_0_0_6px_rgba(253,224,71,0.18)]";

  if (route === "login" || route === "register") {
    return <AuthPage mode={route} health={health} />;
  }

  return (
    <div className="min-h-screen bg-mesh font-sans text-ink antialiased">
      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <a href="#" className="flex flex-col leading-none">
            <span className="text-2xl font-extrabold tracking-tight text-ink">Foundrly</span>
            <span className="text-[11px] font-medium tracking-widest text-primary/70">
              TURN IDEAS INTO TEAMS
            </span>
          </a>

          <nav className="hidden gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-ink/70 transition hover:text-primary"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <span className={`inline-flex h-2 w-2 rounded-full ${dot}`} />
            {ENTRY_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${link.className}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-ink"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen
                ? <path d="M6 18L18 6M6 6l12 12" />
                : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/40 bg-white/90 px-6 py-4 md:hidden space-y-3">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-medium text-ink/80 hover:text-primary"
              >
                {l.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              {ENTRY_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${link.className}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>
        {/* ── HERO ── */}
        <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:pb-28 lg:pt-24">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-1.5 text-sm font-semibold text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Startup · Hackathon · Üniversite Projeleri
            </span>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.08] tracking-tight lg:text-6xl xl:text-7xl">
                Fikrin var,{" "}
                <span className="bg-gradient-to-r from-primary to-[#6B7FD4] bg-clip-text text-transparent">
                  ekibini
                </span>{" "}
                <br className="hidden lg:block" />
                biz buluyoruz.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-ink/70">
                Foundrly, proje fikri olan kişilerin beceri odaklı eşleştirme ve{" "}
                <strong className="text-primary font-semibold">AI Team Builder</strong> ile doğru
                ekip arkadaşlarını çok daha hızlı bulmasını sağlar.
              </p>
            </div>

            <div id="entry" className="flex flex-wrap gap-4">
              <a
                href="#entry"
                className="rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-halo transition hover:-translate-y-0.5 hover:shadow-[0_24px_64px_rgba(71,93,178,0.3)]"
              >
                Kayıt Ol
              </a>
              <a
                href="#entry"
                className="rounded-full border border-ink/15 bg-white/80 px-7 py-3.5 text-sm font-semibold text-ink shadow-sm backdrop-blur transition hover:border-primary/30 hover:text-primary"
              >
                Giriş Yap
              </a>
              <a
                href="#features"
                className="rounded-full border border-transparent px-2 py-3 text-sm font-semibold text-ink/60 transition hover:text-primary"
              >
                Önce özellikleri gör
              </a>
            </div>

            <div className="grid gap-4 pt-2 sm:grid-cols-3">
              {[
                { v: "Founder", l: "Fikrini ekip bulma stresine takılmadan yayına çıkar." },
                { v: "Builder", l: "Yeteneklerini doğru projelerle eşleştir, boşa başvurma." },
                { v: "Verified", l: "Daha güvenilir profillerle daha hızlı ekip kur." },
              ].map((s) => (
                <div
                  key={s.v}
                  className="rounded-2xl border border-white/60 bg-white/70 p-4 backdrop-blur"
                >
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary/60">
                    Sana Ne Sağlar?
                  </p>
                  <p className="mt-1.5 text-base font-bold text-ink">{s.v}</p>
                  <p className="mt-1.5 text-sm leading-6 text-ink/60">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Backend Status Card */}
          <div className="flex flex-col gap-4">
            <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-halo backdrop-blur">
              <div className="rounded-[1.5rem] bg-ink p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                      Live Status
                    </p>
                    <h2 className="mt-1 text-xl font-bold">Backend Monitor</h2>
                  </div>
                  <span className={`h-3 w-3 rounded-full ${dot}`} />
                </div>
                <p className="mt-4 text-sm text-white/75">{health.message}</p>

                <div className="mt-6 space-y-2 rounded-2xl bg-white/8 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                    AI Team Builder · Örnek Eşleşme
                  </p>
                  <div className="mt-3 rounded-xl bg-white px-4 py-3 text-ink">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
                      High Match · 92%
                    </p>
                    <h3 className="mt-1 text-base font-bold">Frontend Developer</h3>
                    <p className="mt-1 text-xs leading-5 text-ink/60">
                      React + TypeScript deneyimi proje ihtiyacını tam karşılıyor.
                      Eksik backend alanları ekip içi dağılımla kapanabilir.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {["React", "TypeScript", "Tailwind"].map((sk) => (
                        <span
                          key={sk}
                          className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <a
                    href="#entry"
                    className="rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-primary transition hover:bg-white/90"
                  >
                    Hesap Oluştur
                  </a>
                  <a
                    href="#pricing"
                    className="rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-semibold text-white/85 transition hover:bg-white/10"
                  >
                    Planları İncele
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROBLEM / SOLUTION ── */}
        <section className="border-y border-white/40 bg-white/50 backdrop-blur">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
            <div className="mb-10 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary/60">
                Problem & Çözüm
              </p>
              <h2 className="mt-3 text-4xl font-extrabold">Neden Foundrly?</h2>
              <p className="mx-auto mt-3 max-w-xl text-base text-ink/65">
                Doğru ekip arkadaşını bulmak hâlâ gereğinden zor. Foundrly bunu daha hızlı ve daha güvenilir hale getirir.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-red-100 bg-red-50/60 p-8">
                <p className="mb-5 text-sm font-bold uppercase tracking-widest text-red-400">
                  Mevcut Durum
                </p>
                <ul className="space-y-4">
                  {PROBLEMS.map((p) => (
                    <li key={p.text} className="flex items-start gap-3">
                      <span className="text-2xl leading-none">{p.icon}</span>
                      <span className="text-sm leading-6 text-ink/75">{p.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[2rem] border border-success/20 bg-success/8 p-8">
                <p className="mb-5 text-sm font-bold uppercase tracking-widest text-success">
                  Foundrly ile
                </p>
                <ul className="space-y-4">
                  {SOLUTIONS.map((s) => (
                    <li key={s.text} className="flex items-start gap-3">
                      <span className="text-2xl leading-none">{s.icon}</span>
                      <span className="text-sm leading-6 text-ink/75">{s.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary/60">
              Özellikler
            </p>
            <h2 className="mt-3 text-4xl font-extrabold">
              Foundrly tam olarak ne sunar?
            </h2>
            <p className="mt-3 text-base leading-7 text-ink/65">
              Sosyal medya grupları ve rastgele bağlantılar yerine beceri odaklı,
              AI destekli ve şeffaf bir ekip kurma deneyimi.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="group rounded-[1.75rem] border border-white/70 bg-white/85 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-halo"
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{f.icon}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${f.badgeColor}`}
                  >
                    {f.badge}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/65">{f.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section
          id="how-it-works"
          className="border-y border-white/40 bg-gradient-to-br from-primary/5 to-success/5"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
            <div className="mb-12 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary/60">
                Workflow
              </p>
              <h2 className="mt-3 text-4xl font-extrabold">
                İki dakikada fikirden ekibe
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-base text-ink/65">
                Adım adım rehberli süreç ile hiçbir karmaşıklık olmadan doğru ekibini kur.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <div
                  key={s.num}
                  className="relative rounded-[1.75rem] border border-white/60 bg-white/80 p-7 backdrop-blur"
                >
                  {i < STEPS.length - 1 && (
                    <div className="absolute right-0 top-1/2 hidden h-px w-5 -translate-y-1/2 translate-x-full border-t border-dashed border-primary/30 lg:block" />
                  )}
                  <span className="text-4xl font-black text-primary/15">{s.num}</span>
                  <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/60">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary/60">
              Fiyatlandırma
            </p>
            <h2 className="mt-3 text-4xl font-extrabold">
              Free ile başla, Premium ile hızlan
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-base text-ink/65">
              Her seviyeden kullanıcı için adil bir model. Yıllık planla %20 tasarruf et.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            {PLANS.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-[2rem] border p-8 ${plan.cardClass}`}
              >
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-extrabold">{plan.name}</h3>
                    <p
                      className={`mt-1 text-sm ${
                        plan.name === "Premium" ? "text-white/65" : "text-ink/55"
                      }`}
                    >
                      {plan.desc}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <p
                      className={`text-xs mt-1 ${
                        plan.name === "Premium" ? "text-white/55" : "text-ink/45"
                      }`}
                    >
                      {plan.period}
                    </p>
                  </div>
                </div>

                <ul className="mt-8 space-y-3 text-sm">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success text-xs font-bold">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                  {plan.locked.map((item) => (
                    <li
                      key={item}
                      className={`flex items-center gap-3 ${
                        plan.name === "Premium" ? "text-white/30" : "text-ink/30"
                      }`}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink/5 text-xs">
                        ✕
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

              <a
                href="#entry"
                className={`mt-8 block rounded-2xl py-3 text-center text-sm font-bold transition hover:opacity-90 ${plan.ctaClass}`}
              >
                {plan.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
          <div className="overflow-hidden rounded-[2.5rem] bg-primary p-12 text-center text-white shadow-halo lg:p-16">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/55">
              Başlamak için bir neden yeter
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-extrabold lg:text-5xl">
              Fikrin artık ekibini bekliyor.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/70">
              Ücretsiz profil oluştur, projenizi paylaş ve AI destekli eşleştirmeyle
              doğru insanları bul. Hiçbir kurulum, hiçbir ücretli API.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="#entry"
                className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-primary shadow-lg transition hover:-translate-y-0.5"
              >
                Hemen Başla — Ücretsiz
              </a>
              <a
                href="#features"
                className="rounded-full border border-white/25 px-8 py-3.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                Özellikleri İncele
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-ink/8 bg-ink text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-lg font-extrabold">Foundrly</p>
              <p className="mt-0.5 text-xs tracking-widest text-white/40">
                TURN IDEAS INTO TEAMS
              </p>
            </div>
            <div className="flex gap-6 text-sm text-white/50">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="transition hover:text-white"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <span className={`h-1.5 w-1.5 rounded-full ${health.status === "ready" ? "bg-success" : "bg-white/30"}`} />
              <span>
                {health.status === "ready" ? "API Online" : health.status === "error" ? "API Offline" : "Checking…"}
              </span>
            </div>
          </div>
          <p className="mt-8 text-xs text-white/25">
            © 2026 Foundrly · joinfoundrly.com · Nurseli Demir
          </p>
        </div>
      </footer>
    </div>
  );
}
