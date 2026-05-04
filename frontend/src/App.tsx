import { useEffect, useState } from "react";

type HealthState = { status: "loading" | "ready" | "error"; message: string };
type RouteName =
  | "home"
  | "login"
  | "register"
  | "app-home"
  | "app-create"
  | "app-messages"
  | "app-profile"
  | "app-ai-builder"
  | "app-networking"
  | "app-admin";

type CurrentUser = {
  id: number;
  email: string;
  full_name: string;
  title: string;
  bio: string;
  skills: string[];
  interests: string[];
  is_verified_talent: boolean;
  is_premium: boolean;
  is_staff: boolean;
  is_superuser: boolean;
};

type DashboardSummary = {
  profile: CurrentUser;
  metrics: {
    owned_projects_count: number;
    received_applications_count: number;
    pending_received_applications_count: number;
    accepted_received_applications_count: number;
    sent_applications_count: number;
    accepted_memberships_count: number;
  };
  recent_projects: Array<{
    id: number;
    title: string;
    summary: string;
    is_premium_highlighted: boolean;
  }>;
};

type MessageThread = {
  application_id: number;
  project: {
    id: number;
    title: string;
    summary: string;
  };
  counterpart: {
    full_name: string;
    title: string;
  };
  latest_message: {
    id: number;
    content: string;
  } | null;
};

type ThreadDetail = {
  application_id: number;
  project: {
    title: string;
    summary: string;
  };
  counterpart: {
    full_name: string;
    title: string;
  };
  messages: Array<{
    id: number;
    sender: {
      full_name: string;
      email: string;
    };
    content: string;
    created_at: string;
  }>;
};

type AdminUser = {
  id: number;
  email: string;
  full_name: string;
  title: string;
  is_staff: boolean;
  is_superuser: boolean;
};

type AdminDashboardStats = {
  totals: {
    users_count: number;
    daily_active_users: number;
    new_registrations: number;
    projects_count: number;
    matches_count: number;
    premium_users_count: number;
  };
  queues: {
    pending_verification_requests: number;
    pending_applications: number;
  };
};

type AdminUserDetail = CurrentUser & {
  is_active: boolean;
  metrics: {
    owned_projects_count: number;
    applications_count: number;
    accepted_memberships_count: number;
    sent_messages_count: number;
    verification_requests_count: number;
  };
  recent_projects: Array<{ id: number; title: string; created_at: string }>;
  recent_applications: Array<{
    id: number;
    project_id: number;
    project_title: string;
    status: string;
    created_at: string;
  }>;
  recent_messages: Array<{
    id: number;
    application_id: number;
    content: string;
    created_at: string;
  }>;
};

type AdminVerificationRequest = {
  id: number;
  user: {
    id: number;
    email: string;
    full_name: string;
    title: string;
    is_verified_talent: boolean;
  };
  requested_title: string;
  portfolio_url: string;
  note: string;
  status: string;
  reviewed_note: string;
  created_at: string;
  reviewed_at: string | null;
};

type AdminProject = {
  id: number;
  owner: {
    id: number;
    email: string;
    full_name: string;
    title: string;
    is_verified_talent: boolean;
  };
  title: string;
  summary: string;
  is_premium_highlighted: boolean;
  applications_count?: number;
  accepted_applications_count?: number;
  problem_statement?: string;
  tech_stack?: string[];
  needed_roles?: string[];
  applications?: Array<{
    id: number;
    applicant: {
      full_name: string;
      email: string;
      title: string;
    };
    message: string;
    status: string;
    created_at: string;
  }>;
};

const NAV_LINKS = [
  { label: "Özellikler", href: "#features" },
  { label: "Nasıl Çalışır?", href: "#how-it-works" },
  { label: "Fiyatlandırma", href: "#pricing" },
];

const ENTRY_LINKS = [
  {
    label: "Giriş Yap",
    href: "#login",
    className:
      "border border-ink/12 bg-white/80 text-ink hover:border-primary/25 hover:text-primary",
  },
  {
    label: "Kayıt Ol",
    href: "#register",
    className: "bg-primary text-white hover:bg-primary/90 shadow-halo",
  },
];

const APP_NAV_BASE = [
  { label: "Anasayfa", href: "#app-home" },
  { label: "Proje Oluştur", href: "#app-create" },
  { label: "Mesajlar", href: "#app-messages" },
  { label: "AI Takım Kurucu", href: "#app-ai-builder" },
  { label: "Networking", href: "#app-networking" },
  { label: "Profilim", href: "#app-profile" },
];

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

function getRouteFromHash(): RouteName {
  if (typeof window === "undefined") return "home";
  switch (window.location.hash) {
    case "#login":
      return "login";
    case "#register":
      return "register";
    case "#app-home":
    case "#dashboard":
      return "app-home";
    case "#app-create":
      return "app-create";
    case "#app-messages":
      return "app-messages";
    case "#app-profile":
      return "app-profile";
    case "#app-ai-builder":
      return "app-ai-builder";
    case "#app-networking":
      return "app-networking";
    case "#app-admin":
      return "app-admin";
    default:
      return "home";
  }
}

function getStoredAccessToken() {
  return localStorage.getItem("foundrly_access_token");
}

async function parseError(response: Response) {
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
            skills: skills.split(",").map((item) => item.trim()).filter(Boolean),
            interests: interests.split(",").map((item) => item.trim()).filter(Boolean),
          }),
        });

        if (!registerResponse.ok) {
          throw new Error(await parseError(registerResponse));
        }

        setFeedback({
          type: "success",
          message: "Hesabın oluşturuldu. Şimdi giriş sayfasına geçebilirsin.",
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
          throw new Error(await parseError(tokenResponse));
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
        window.location.hash = "#app-home";
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Bir hata oluştu. Lütfen tekrar dene.",
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
            <span className="text-2xl font-extrabold tracking-tight text-ink">
              Foundrly
            </span>
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
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/8 p-4 text-sm text-white/78"
                >
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
                {isRegister
                  ? "Foundrly hesabını oluştur"
                  : "Foundrly hesabına giriş yap"}
              </h2>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {isRegister && (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-ink/72">
                    Ad Soyad
                  </span>
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
                <span className="mb-2 block text-sm font-semibold text-ink/72">
                  E-posta
                </span>
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
                <span className="mb-2 block text-sm font-semibold text-ink/72">
                  Şifre
                </span>
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
                    <span className="mb-2 block text-sm font-semibold text-ink/72">
                      Rolün
                    </span>
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
                    <span className="mb-2 block text-sm font-semibold text-ink/72">
                      Kısa Biyografi
                    </span>
                    <textarea
                      placeholder="Kısaca ne yaptığını ve ne aradığını yaz."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="min-h-28 w-full rounded-2xl border border-ink/10 bg-[#F7F8FC] px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:bg-white"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-ink/72">
                      Yetenekler
                    </span>
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
                    <span className="mb-2 block text-sm font-semibold text-ink/72">
                      İlgi Alanları
                    </span>
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
              <span>{isRegister ? "Zaten hesabın var mı?" : "Hesabın yok mu?"}</span>
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

function DashboardPage({ route }: { route: Exclude<RouteName, "home" | "login" | "register"> }) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ThreadDetail | null>(null);
  const [messageDraft, setMessageDraft] = useState("");
  const [messageError, setMessageError] = useState("");
  const [projectForm, setProjectForm] = useState({
    title: "",
    summary: "",
    problem_statement: "",
    tech_stack: "",
    needed_roles: "",
  });
  const [projectFeedback, setProjectFeedback] = useState("");
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminDashboard, setAdminDashboard] = useState<AdminDashboardStats | null>(null);
  const [selectedAdminUser, setSelectedAdminUser] = useState<AdminUserDetail | null>(null);
  const [verificationRequests, setVerificationRequests] = useState<AdminVerificationRequest[]>([]);
  const [adminProjects, setAdminProjects] = useState<AdminProject[]>([]);
  const [selectedAdminProject, setSelectedAdminProject] = useState<AdminProject | null>(null);
  const [adminProjectSearch, setAdminProjectSearch] = useState("");
  const [adminFeedback, setAdminFeedback] = useState("");
  const [loadingLabel, setLoadingLabel] = useState("Panel yükleniyor…");
  const [billingFeedback, setBillingFeedback] = useState("");
  const [aiAnalysisState, setAiAnalysisState] = useState<"idle" | "analyzing" | "done">("idle");
  const [verifiedForm, setVerifiedForm] = useState({ requested_title: "", portfolio_url: "", note: "" });
  const [verifiedFeedback, setVerifiedFeedback] = useState("");

  const accessToken = getStoredAccessToken();
  const storedUser = localStorage.getItem("foundrly_current_user");
  const currentUser = storedUser ? (JSON.parse(storedUser) as CurrentUser) : null;
  const authHeaders = accessToken
    ? {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }
    : null;

  const isAdmin = Boolean(summary?.profile.is_staff || summary?.profile.is_superuser || currentUser?.is_staff || currentUser?.is_superuser);
  const appNav = isAdmin
    ? [...APP_NAV_BASE, { label: "Yönetim", href: "#app-admin" }]
    : APP_NAV_BASE;

  const loadDashboard = async () => {
    if (!authHeaders) return;
    const [summaryResponse, threadsResponse] = await Promise.all([
      fetch("/api/dashboard/summary/", { headers: authHeaders }),
      fetch("/api/messages/threads/", { headers: authHeaders }),
    ]);

    if (summaryResponse.ok) {
      const summaryData = await summaryResponse.json();
      setSummary(summaryData);
      localStorage.setItem("foundrly_current_user", JSON.stringify(summaryData.profile));
    }

    if (threadsResponse.ok) {
      const threadsData = await threadsResponse.json();
      setThreads(threadsData);
    }
  };

  const loadAdminUsers = async (search = "") => {
    if (!authHeaders || !isAdmin) return;
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const response = await fetch(`/api/admin/users/${query}`, { headers: authHeaders });
    if (response.ok) {
      setAdminUsers(await response.json());
    }
  };

  const loadAdminDashboard = async () => {
    if (!authHeaders || !isAdmin) return;
    const response = await fetch("/api/admin/dashboard/", { headers: authHeaders });
    if (response.ok) {
      setAdminDashboard(await response.json());
    }
  };

  const loadAdminUserDetail = async (id: number) => {
    if (!authHeaders || !isAdmin) return;
    const response = await fetch(`/api/admin/users/${id}/`, { headers: authHeaders });
    if (response.ok) {
      setSelectedAdminUser(await response.json());
    }
  };

  const loadVerificationRequests = async () => {
    if (!authHeaders || !isAdmin) return;
    const response = await fetch("/api/admin/verification-requests/?status=pending", {
      headers: authHeaders,
    });
    if (response.ok) {
      setVerificationRequests(await response.json());
    }
  };

  const loadAdminProjects = async (search = "") => {
    if (!authHeaders || !isAdmin) return;
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const response = await fetch(`/api/admin/projects/${query}`, { headers: authHeaders });
    if (response.ok) {
      setAdminProjects(await response.json());
    }
  };

  const loadAdminProjectDetail = async (id: number) => {
    if (!authHeaders || !isAdmin) return;
    const response = await fetch(`/api/admin/projects/${id}/`, { headers: authHeaders });
    if (response.ok) {
      setSelectedAdminProject(await response.json());
    }
  };

  const loadThreadDetail = async (id: number) => {
    if (!authHeaders) return;
    const response = await fetch(`/api/messages/threads/${id}/`, { headers: authHeaders });
    if (response.ok) {
      setSelectedThread(await response.json());
    }
  };

  useEffect(() => {
    if (!accessToken) {
      window.location.hash = "#login";
      return;
    }
    Promise.all([
      loadDashboard(),
      loadAdminDashboard(),
      loadAdminUsers(),
      loadVerificationRequests(),
      loadAdminProjects(),
    ]).finally(() => {
      setLoadingLabel("Panel hazır.");
    });
  }, []);

  useEffect(() => {
    if (route === "app-messages" && threads.length && !selectedThread) {
      loadThreadDetail(threads[0].application_id);
    }
  }, [route, threads]);

  const logout = () => {
    localStorage.removeItem("foundrly_access_token");
    localStorage.removeItem("foundrly_refresh_token");
    localStorage.removeItem("foundrly_current_user");
    window.location.hash = "#login";
  };

  const handleProjectCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authHeaders) return;
    setProjectFeedback("");

    const response = await fetch("/api/projects/", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        ...projectForm,
        tech_stack: projectForm.tech_stack.split(",").map((item) => item.trim()).filter(Boolean),
        needed_roles: projectForm.needed_roles.split(",").map((item) => item.trim()).filter(Boolean),
      }),
    });

    if (!response.ok) {
      setProjectFeedback(await parseError(response));
      return;
    }

    setProjectForm({
      title: "",
      summary: "",
      problem_statement: "",
      tech_stack: "",
      needed_roles: "",
    });
    setProjectFeedback("Proje başarıyla oluşturuldu.");
    loadDashboard();
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authHeaders || !selectedThread || !messageDraft.trim()) return;
    setMessageError("");
    const response = await fetch(
      `/api/messages/threads/${selectedThread.application_id}/messages/`,
      {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ content: messageDraft.trim() }),
      },
    );

    if (!response.ok) {
      setMessageError(await parseError(response));
      return;
    }

    setMessageDraft("");
    loadThreadDetail(selectedThread.application_id);
    loadDashboard();
  };

  const handleAdminRoleUpdate = async (
    userId: number,
    payload: { is_staff: boolean; is_superuser: boolean },
  ) => {
    if (!authHeaders) return;
    setAdminFeedback("");
    const response = await fetch(`/api/admin/users/${userId}/role/`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setAdminFeedback(await parseError(response));
      return;
    }

    setAdminFeedback("Kullanıcı rolü güncellendi.");
    loadAdminUsers(adminSearch);
    if (selectedAdminUser?.id === userId) {
      loadAdminUserDetail(userId);
    }
  };

  const handleUserModeration = async (
    userId: number,
    payload: { is_active?: boolean; is_verified_talent?: boolean; is_premium?: boolean },
  ) => {
    if (!authHeaders) return;
    setAdminFeedback("");
    const response = await fetch(`/api/admin/users/${userId}/moderation/`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setAdminFeedback(await parseError(response));
      return;
    }

    setAdminFeedback("Kullanıcı durumu güncellendi.");
    loadAdminUsers(adminSearch);
    loadAdminDashboard();
    if (selectedAdminUser?.id === userId) {
      loadAdminUserDetail(userId);
    }
  };

  const handleUserDelete = async (userId: number) => {
    if (!authHeaders) return;
    setAdminFeedback("");
    const response = await fetch(`/api/admin/users/${userId}/moderation/`, {
      method: "DELETE",
      headers: authHeaders,
    });

    if (!response.ok) {
      setAdminFeedback(await parseError(response));
      return;
    }

    setAdminFeedback("Kullanıcı silindi.");
    setSelectedAdminUser(null);
    loadAdminUsers(adminSearch);
    loadAdminDashboard();
  };

  const handleVerificationReview = async (
    requestId: number,
    status: "approved" | "rejected",
  ) => {
    if (!authHeaders) return;
    setAdminFeedback("");
    const response = await fetch(`/api/verification-requests/${requestId}/review/`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({
        status,
        reviewed_note:
          status === "approved"
            ? "Admin panelinden onaylandı."
            : "Admin panelinden reddedildi.",
      }),
    });

    if (!response.ok) {
      setAdminFeedback(await parseError(response));
      return;
    }

    setAdminFeedback("Verification isteği güncellendi.");
    loadVerificationRequests();
    loadAdminDashboard();
    if (selectedAdminUser) {
      loadAdminUserDetail(selectedAdminUser.id);
    }
  };

  const handleProjectDelete = async (projectId: number) => {
    if (!authHeaders) return;
    setAdminFeedback("");
    const response = await fetch(`/api/admin/projects/${projectId}/`, {
      method: "DELETE",
      headers: authHeaders,
    });

    if (!response.ok) {
      setAdminFeedback(await parseError(response));
      return;
    }

    setAdminFeedback("Proje kaldırıldı.");
    setSelectedAdminProject(null);
    loadAdminProjects(adminProjectSearch);
    loadAdminDashboard();
  };

  const startPremiumCheckout = async (plan: "monthly" | "yearly") => {
    if (!authHeaders) {
      window.location.hash = "#login";
      return;
    }

    setBillingFeedback("Ödeme sistemi şu anda güncelleniyor. Lütfen daha sonra tekrar deneyin.");
  };

  const handleVerifiedSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authHeaders) return;
    setVerifiedFeedback("");
    const response = await fetch("/api/verification-requests/", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(verifiedForm),
    });
    if (!response.ok) {
      setVerifiedFeedback(await parseError(response));
      return;
    }
    setVerifiedFeedback("Başvurunuz başarıyla alındı! Ekibimiz en kısa sürede inceleyecektir.");
    setVerifiedForm({ requested_title: "", portfolio_url: "", note: "" });
    loadDashboard();
  };

  return (
    <div className="min-h-screen bg-mesh font-sans text-ink antialiased">
      <header className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <a href="#" className="flex flex-col leading-none">
            <span className="text-2xl font-extrabold tracking-tight text-ink">
              Foundrly
            </span>
            <span className="text-[11px] font-medium tracking-widest text-primary/70">
              TURN IDEAS INTO TEAMS
            </span>
          </a>

          <nav className="hidden gap-3 md:flex md:flex-wrap md:justify-end">
            {appNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  window.location.hash === item.href ||
                  (item.href === "#app-home" && window.location.hash === "#dashboard")
                    ? "bg-primary text-white shadow-halo"
                    : "border border-ink/10 bg-white/80 text-ink hover:border-primary/25 hover:text-primary"
                }`}
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-ink/90"
            >
              Çıkış Yap
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        {route === "app-home" && (
          <section className="rounded-[2.25rem] bg-ink p-8 text-white shadow-halo lg:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/45">
              Anasayfa
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight lg:text-5xl">
              {summary?.profile.full_name || currentUser?.full_name || "Hoş geldin"}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">
              {summary?.profile.title || currentUser?.title || "Kullanıcı"} · {loadingLabel}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[
                ["Projelerim", summary?.metrics.owned_projects_count ?? 0],
                ["Gelen Başvurular", summary?.metrics.received_applications_count ?? 0],
                ["Bekleyenler", summary?.metrics.pending_received_applications_count ?? 0],
                ["Kabul Edilenler", summary?.metrics.accepted_received_applications_count ?? 0],
                ["Gönderdiğim", summary?.metrics.sent_applications_count ?? 0],
                ["Katıldığım Ekip", summary?.metrics.accepted_memberships_count ?? 0],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="rounded-2xl border border-white/10 bg-white/8 p-5"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-white/42">
                    {label}
                  </p>
                  <p className="mt-2 text-3xl font-extrabold">{value}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {route === "app-create" && (
          <section className="rounded-[2.25rem] border border-white/60 bg-white/88 p-8 shadow-halo backdrop-blur lg:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/55">
              Proje Oluştur
            </p>
            <h2 className="mt-2 text-3xl font-extrabold">Yeni proje başlat</h2>
            <form className="mt-8 space-y-5" onSubmit={handleProjectCreate}>
              {[
                ["Başlık", "title", "Foundrly Mobile App"],
                ["Kısa Özet", "summary", "Ürünün ne yaptığını tek paragrafta anlat."],
                ["Problem Tanımı", "problem_statement", "Bu proje hangi problemi çözüyor?"],
                ["Teknoloji Yığını", "tech_stack", "React, Django, PostgreSQL"],
                ["Aranan Roller", "needed_roles", "Frontend Developer, UI Designer"],
              ].map(([label, key, placeholder]) => (
                <label className="block" key={String(key)}>
                  <span className="mb-2 block text-sm font-semibold text-ink/72">
                    {label}
                  </span>
                  {key === "summary" || key === "problem_statement" ? (
                    <textarea
                      value={projectForm[key as keyof typeof projectForm]}
                      onChange={(e) =>
                        setProjectForm((current) => ({
                          ...current,
                          [key]: e.target.value,
                        }))
                      }
                      placeholder={String(placeholder)}
                      className="min-h-28 w-full rounded-2xl border border-ink/10 bg-[#F7F8FC] px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:bg-white"
                      required
                    />
                  ) : (
                    <input
                      value={projectForm[key as keyof typeof projectForm]}
                      onChange={(e) =>
                        setProjectForm((current) => ({
                          ...current,
                          [key]: e.target.value,
                        }))
                      }
                      placeholder={String(placeholder)}
                      className="w-full rounded-2xl border border-ink/10 bg-[#F7F8FC] px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:bg-white"
                      required
                    />
                  )}
                </label>
              ))}

              {projectFeedback && (
                <div className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-primary">
                  {projectFeedback}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90"
              >
                Projeyi Oluştur
              </button>
            </form>
          </section>
        )}

        {route === "app-messages" && (
          <section className="grid gap-6 lg:grid-cols-[0.4fr_0.6fr]">
            <div className="rounded-[2.25rem] border border-white/60 bg-white/88 p-6 shadow-halo backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/55">
                Mesajlar
              </p>
              <div className="mt-5 space-y-3">
                {threads.length ? (
                  threads.map((thread) => (
                    <button
                      key={thread.application_id}
                      type="button"
                      onClick={() => loadThreadDetail(thread.application_id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selectedThread?.application_id === thread.application_id
                          ? "border-primary/25 bg-primary/5"
                          : "border-ink/8 bg-[#F7F8FC]"
                      }`}
                    >
                      <p className="text-sm font-bold text-ink">
                        {thread.counterpart.full_name}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-widest text-ink/42">
                        {thread.project.title}
                      </p>
                      <p className="mt-2 text-sm text-ink/58">
                        {thread.latest_message?.content ||
                          "Henüz mesaj yok. İlk mesajı sen gönder."}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-ink/15 bg-[#F7F8FC] p-5 text-sm text-ink/55">
                    Accepted başvuru olmadığı için henüz konuşma başlamadı.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2.25rem] border border-white/60 bg-white/88 p-6 shadow-halo backdrop-blur">
              {selectedThread ? (
                <>
                  <div className="border-b border-ink/8 pb-4">
                    <p className="text-sm font-bold text-ink">
                      {selectedThread.counterpart.full_name}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-widest text-ink/42">
                      {selectedThread.project.title}
                    </p>
                  </div>

                  <div className="mt-5 space-y-3">
                    {selectedThread.messages.map((item) => {
                      const mine = item.sender.email === currentUser?.email;
                      return (
                        <div
                          key={item.id}
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                            mine
                              ? "ml-auto bg-primary text-white"
                              : "border border-ink/8 bg-[#F7F8FC] text-ink"
                          }`}
                        >
                          <p
                            className={`text-[11px] font-bold uppercase tracking-widest ${
                              mine ? "text-white/70" : "text-ink/42"
                            }`}
                          >
                            {item.sender.full_name}
                          </p>
                          <p className="mt-1">{item.content}</p>
                        </div>
                      );
                    })}
                  </div>

                  <form className="mt-6 space-y-3" onSubmit={handleSendMessage}>
                    <textarea
                      value={messageDraft}
                      onChange={(e) => setMessageDraft(e.target.value)}
                      placeholder="Mesajını yaz..."
                      className="min-h-28 w-full rounded-2xl border border-ink/10 bg-[#F7F8FC] px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:bg-white"
                    />
                    {messageError && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
                        {messageError}
                      </div>
                    )}
                    <button
                      type="submit"
                      className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90"
                    >
                      Mesaj Gönder
                    </button>
                  </form>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-ink/15 bg-[#F7F8FC] p-5 text-sm text-ink/55">
                  Soldan bir konuşma seçerek mesajlaşmaya başlayabilirsin.
                </div>
              )}
            </div>
          </section>
        )}

        {route === "app-profile" && (
          <section className="grid gap-4 lg:grid-cols-2">
            {[
              ["Ad Soyad", summary?.profile.full_name || currentUser?.full_name || "-"],
              ["E-posta", summary?.profile.email || currentUser?.email || "-"],
              ["Rol", summary?.profile.title || currentUser?.title || "-"],
              [
                "Durum",
                summary?.profile.is_verified_talent || currentUser?.is_verified_talent
                  ? "Verified Talent"
                  : "Standart Kullanıcı",
              ],
            ].map(([label, value]) => (
              <div
                key={String(label)}
                className="rounded-[2rem] border border-white/60 bg-white/88 p-6 shadow-halo backdrop-blur"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-ink/42">
                  {label}
                </p>
                <p className="mt-2 text-lg font-bold text-ink">{value}</p>
              </div>
            ))}

            {!summary?.profile.is_premium && !currentUser?.is_premium ? (
              <div className="rounded-[2rem] border border-primary/15 bg-primary/5 p-6 shadow-halo backdrop-blur lg:col-span-2">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/55">
                  Premium
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-ink">
                  AI Team Builder ve Verified Talent rozeti için Premium'a geç
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink/62">
                  Ödeme altyapımız güncelleniyor. Şimdilik ödeme işlemleri geçici olarak durdurulmuştur. Admin panelinden manuel premium yapabilirsiniz.
                </p>
              </div>
            ) : (
              <div className="rounded-[2rem] border border-amber-200/50 bg-amber-50/50 p-6 shadow-halo backdrop-blur lg:col-span-2">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600/70">
                  Verified Talent Başvurusu
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-ink">
                  Yeteneklerini doğrula ve öne çık
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink/62">
                  Premium üye olduğun için Verified Talent rozetine başvurabilirsin. Bu rozet seni eşleşmelerde en üste taşır.
                </p>
                <form className="mt-6 space-y-4" onSubmit={handleVerifiedSubmit}>
                  <input
                    type="text"
                    required
                    placeholder="Başvurduğun Ünvan (örn: Senior React Developer)"
                    value={verifiedForm.requested_title}
                    onChange={(e) => setVerifiedForm({ ...verifiedForm, requested_title: e.target.value })}
                    className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-400"
                  />
                  <input
                    type="url"
                    required
                    placeholder="Portfolyo URL (GitHub, LinkedIn vs.)"
                    value={verifiedForm.portfolio_url}
                    onChange={(e) => setVerifiedForm({ ...verifiedForm, portfolio_url: e.target.value })}
                    className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-400"
                  />
                  <textarea
                    placeholder="Eklemek istediğin notlar..."
                    value={verifiedForm.note}
                    onChange={(e) => setVerifiedForm({ ...verifiedForm, note: e.target.value })}
                    className="min-h-24 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-400"
                  />
                  {verifiedFeedback && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-100 px-4 py-3 text-sm text-amber-700">
                      {verifiedFeedback}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="rounded-2xl bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-halo transition hover:bg-amber-600"
                  >
                    Rozet Başvurusu Yap
                  </button>
                </form>
              </div>
            )}
          </section>
        )}

        {route === "app-ai-builder" && (
          <section className="rounded-[2.25rem] border border-white/60 bg-white/88 p-8 shadow-halo backdrop-blur lg:p-10 relative overflow-hidden">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/55">
              Yapay Zeka
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-ink">
              AI Takım Kurucu
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-7 text-ink/62">
              Projeniz için en uyumlu takım arkadaşlarını yapay zeka destekli analiz algoritmamızla saniyeler içinde bulun.
            </p>
            
            {(!summary?.profile.is_premium && !currentUser?.is_premium) ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[6px] p-6 text-center">
                <div className="rounded-full bg-white p-4 shadow-halo mb-4 text-4xl">
                  🔒
                </div>
                <h3 className="text-2xl font-extrabold text-ink">Premium Özellik</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-ink/72">
                  AI Team Builder ile yeteneklerinize tam uyan takım arkadaşlarını saniyeler içinde bulmak için Premium'a geçin.
                </p>
                <a href="#app-profile" className="mt-6 rounded-2xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90">
                  Premium Avantajlarını İncele
                </a>
              </div>
            ) : (
              <div className="mt-8">
                {aiAnalysisState === "idle" && (
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
                    <p className="text-lg font-bold text-primary">Sistem Hazır</p>
                    <p className="mt-2 text-sm text-ink/62">Mevcut projeleriniz analiz edilip size en uygun yetenekler önerilecek.</p>
                    <button 
                      onClick={() => {
                        setAiAnalysisState("analyzing");
                        setTimeout(() => setAiAnalysisState("done"), 2500);
                      }}
                      className="mt-6 rounded-2xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90"
                    >
                      Analizi Başlat
                    </button>
                  </div>
                )}
                {aiAnalysisState === "analyzing" && (
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center flex flex-col items-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary mb-4"></div>
                    <p className="text-lg font-bold text-primary animate-pulse">Profil ve Projeler Analiz Ediliyor...</p>
                  </div>
                )}
                {aiAnalysisState === "done" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-ink">Önerilen Takım Arkadaşları</h3>
                      <button onClick={() => setAiAnalysisState("idle")} className="text-sm font-semibold text-primary hover:underline">Tekrar Analiz Et</button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        { name: "Ahmet Y.", role: "Backend Developer", match: "98%", skills: "Django, PostgreSQL" },
                        { name: "Zeynep K.", role: "UI/UX Designer", match: "92%", skills: "Figma, User Research" }
                      ].map(user => (
                        <div key={user.name} className="rounded-2xl border border-ink/8 bg-white p-5 shadow-sm transition hover:border-primary/30">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-ink">{user.name}</p>
                              <p className="text-sm text-ink/60">{user.role}</p>
                            </div>
                            <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">
                              {user.match} Uyum
                            </span>
                          </div>
                          <p className="mt-3 text-xs text-ink/40 uppercase tracking-widest">{user.skills}</p>
                          <button className="mt-4 w-full rounded-xl bg-ink/5 py-2 text-sm font-bold text-ink transition hover:bg-ink hover:text-white">Profili İncele (Demo)</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {route === "app-networking" && (
          <section className="rounded-[2.25rem] border border-white/60 bg-white/88 p-8 shadow-halo backdrop-blur lg:p-10 relative overflow-hidden">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/55">
              Topluluk
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-ink">
              Networking & Etkinlikler
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-7 text-ink/62">
              Sadece Premium üyelere özel etkinlikler, yatırımcı buluşmaları ve kapalı Discord topluluğu.
            </p>
            
            {(!summary?.profile.is_premium && !currentUser?.is_premium) ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[6px] p-6 text-center">
                <div className="rounded-full bg-white p-4 shadow-halo mb-4 text-4xl">
                  🔒
                </div>
                <h3 className="text-2xl font-extrabold text-ink">Premium Özellik</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-ink/72">
                  Özel Founder buluşmalarına katılmak ve yatırımcı ağına erişmek için Premium'a geçmelisiniz.
                </p>
                <a href="#app-profile" className="mt-6 rounded-2xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90">
                  Premium'u Keşfet
                </a>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-[#5865F2]/10 p-6 border border-[#5865F2]/20">
                  <h3 className="text-xl font-extrabold text-[#5865F2]">VIP Discord Topluluğu</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/70">
                    Sadece onaylı founder'ların ve premium üyelerin yer aldığı özel kanallara katılın. Projenizi tanıtın, anında geri bildirim alın.
                  </p>
                  <button className="mt-5 rounded-2xl bg-[#5865F2] px-6 py-3 text-sm font-bold text-white shadow-halo transition hover:bg-[#5865F2]/90 w-full">
                    Discord'a Katıl (Demo)
                  </button>
                </div>
                
                <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Yaklaşan Etkinlik</p>
                  <h3 className="mt-1 text-xl font-extrabold text-ink">Yatırımcı Pitch Gecesi</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/70">
                    Önümüzdeki hafta gerçekleşecek kapalı sunum etkinliğinde sahne almak için projenizi hazırlayın.
                  </p>
                  <div className="mt-5 flex gap-3">
                    <button className="rounded-2xl bg-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-ink/80 flex-1">
                      Kayıt Ol (Demo)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {route === "app-admin" && isAdmin && (
          <section className="rounded-[2.25rem] border border-white/60 bg-white/88 p-8 shadow-halo backdrop-blur lg:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/55">
              Yönetim
            </p>
            <h2 className="mt-2 text-3xl font-extrabold">
              Ürün sağlığı, moderasyon ve denetim
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[
                ["Toplam Kullanıcı", adminDashboard?.totals.users_count ?? 0],
                ["Günlük Aktif Kullanıcı", adminDashboard?.totals.daily_active_users ?? 0],
                ["Yeni Kayıtlar", adminDashboard?.totals.new_registrations ?? 0],
                ["Oluşturulan Projeler", adminDashboard?.totals.projects_count ?? 0],
                ["Eşleşme Sayısı", adminDashboard?.totals.matches_count ?? 0],
                ["Premium Kullanıcı", adminDashboard?.totals.premium_users_count ?? 0],
              ].map(([label, value]) => (
                <article
                  key={String(label)}
                  className="rounded-2xl border border-ink/8 bg-[#F7F8FC] p-5"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-ink/42">
                    {label}
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-ink">{value}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-primary/60">
                  Bekleyen Verified Talent
                </p>
                <p className="mt-2 text-2xl font-extrabold text-primary">
                  {adminDashboard?.queues.pending_verification_requests ?? 0}
                </p>
              </div>
              <div className="rounded-2xl border border-ink/8 bg-[#F7F8FC] p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-ink/42">
                  Bekleyen Başvurular
                </p>
                <p className="mt-2 text-2xl font-extrabold text-ink">
                  {adminDashboard?.queues.pending_applications ?? 0}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <input
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Ad soyad ile kullanıcı ara"
                className="w-full rounded-2xl border border-ink/10 bg-[#F7F8FC] px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => loadAdminUsers(adminSearch)}
                className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90"
              >
                Ara
              </button>
            </div>

            {adminFeedback && (
              <div className="mt-5 rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-primary">
                {adminFeedback}
              </div>
            )}

            <div className="mt-10 grid gap-8 xl:grid-cols-[0.48fr_0.52fr]">
              <div>
                <h3 className="text-lg font-extrabold text-ink">Kullanıcı Yönetimi</h3>
                <div className="mt-4 space-y-4">
                  {adminUsers.map((user) => (
                    <article
                      key={user.id}
                      className="rounded-2xl border border-ink/8 bg-[#F7F8FC] p-5"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-lg font-bold text-ink">{user.full_name}</p>
                          <p className="mt-1 text-sm text-ink/58">{user.email}</p>
                          <p className="mt-1 text-sm text-ink/58">{user.title}</p>
                          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-primary/55">
                            {user.is_superuser
                              ? "Superuser"
                              : user.is_staff
                                ? "Admin"
                                : "Normal Kullanıcı"}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => loadAdminUserDetail(user.id)}
                            className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-primary/25 hover:text-primary"
                          >
                            Profili İncele
                          </button>
                          {!user.is_staff && (
                            <button
                              type="button"
                              onClick={() =>
                                handleAdminRoleUpdate(user.id, {
                                  is_staff: true,
                                  is_superuser: false,
                                })
                              }
                              className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
                            >
                              Admin Yap
                            </button>
                          )}
                          {user.is_staff && !user.is_superuser && (
                            <button
                              type="button"
                              onClick={() =>
                                handleAdminRoleUpdate(user.id, {
                                  is_staff: false,
                                  is_superuser: false,
                                })
                              }
                              className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-100"
                            >
                              Adminliği Kaldır
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="rounded-2xl border border-ink/8 bg-[#F7F8FC] p-5">
                  <h3 className="text-lg font-extrabold text-ink">Kullanıcı Detayı</h3>
                  {selectedAdminUser ? (
                    <div className="mt-4 space-y-5">
                      <div>
                        <p className="text-xl font-bold text-ink">{selectedAdminUser.full_name}</p>
                        <p className="mt-1 text-sm text-ink/58">{selectedAdminUser.email}</p>
                        <p className="mt-1 text-sm text-ink/58">{selectedAdminUser.title}</p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-white p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-ink/42">Durum</p>
                          <p className="mt-2 font-bold text-ink">
                            {selectedAdminUser.is_active ? "Aktif" : "Askıda"}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-white p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-ink/42">Verified</p>
                          <p className="mt-2 font-bold text-ink">
                            {selectedAdminUser.is_verified_talent ? "Onaylı" : "Standart"}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-white p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-ink/42">Abonelik</p>
                          <p className="mt-2 font-bold text-ink">
                            {selectedAdminUser.is_premium ? "Premium" : "Standart"}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-white p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-ink/42">Projeler</p>
                          <p className="mt-2 text-2xl font-extrabold text-ink">
                            {selectedAdminUser.metrics.owned_projects_count}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-white p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-ink/42">Başvurular</p>
                          <p className="mt-2 text-2xl font-extrabold text-ink">
                            {selectedAdminUser.metrics.applications_count}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleUserModeration(selectedAdminUser.id, {
                              is_active: !selectedAdminUser.is_active,
                            })
                          }
                          className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-primary/25 hover:text-primary"
                        >
                          {selectedAdminUser.is_active ? "Askıya Al" : "Tekrar Aktif Et"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleUserModeration(selectedAdminUser.id, {
                              is_verified_talent: !selectedAdminUser.is_verified_talent,
                            })
                          }
                          className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
                        >
                          {selectedAdminUser.is_verified_talent
                            ? "Verified Rozetini Kaldır"
                            : "Verified Rozeti Ver"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleUserModeration(selectedAdminUser.id, {
                              is_premium: !selectedAdminUser.is_premium,
                            })
                          }
                          className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-600 transition hover:bg-amber-100"
                        >
                          {selectedAdminUser.is_premium
                            ? "Premium Üyeliği İptal Et"
                            : "Premium Yap"}
                        </button>
                        {!selectedAdminUser.is_superuser && (
                          <button
                            type="button"
                            onClick={() => handleUserDelete(selectedAdminUser.id)}
                            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-100"
                          >
                            Kullanıcıyı Sil
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-ink/58">
                      Soldaki listeden bir kullanıcı seçtiğinde detay, aktivite ve moderasyon aksiyonları burada görünür.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-ink/8 bg-[#F7F8FC] p-5">
                  <h3 className="text-lg font-extrabold text-ink">Verified Talent Onayları</h3>
                  <div className="mt-4 space-y-3">
                    {verificationRequests.length ? (
                      verificationRequests.map((item) => (
                        <article key={item.id} className="rounded-2xl bg-white p-4">
                          <p className="font-bold text-ink">{item.user.full_name}</p>
                          <p className="mt-1 text-sm text-ink/58">{item.requested_title}</p>
                          <p className="mt-2 text-sm text-ink/58">{item.note || "Not eklenmemiş."}</p>
                          <div className="mt-4 flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => handleVerificationReview(item.id, "approved")}
                              className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
                            >
                              Onayla
                            </button>
                            <button
                              type="button"
                              onClick={() => handleVerificationReview(item.id, "rejected")}
                              className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-100"
                            >
                              Reddet
                            </button>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="rounded-2xl bg-white p-4 text-sm text-ink/58">
                        İncelenmeyi bekleyen verification isteği yok.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-ink/8 bg-[#F7F8FC] p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-extrabold text-ink">Proje & Ekip Yönetimi</h3>
                    <div className="flex w-full gap-3 sm:w-auto">
                      <input
                        value={adminProjectSearch}
                        onChange={(e) => setAdminProjectSearch(e.target.value)}
                        placeholder="Proje veya founder ara"
                        className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary/40"
                      />
                      <button
                        type="button"
                        onClick={() => loadAdminProjects(adminProjectSearch)}
                        className="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90"
                      >
                        Ara
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {adminProjects.map((project) => (
                      <article key={project.id} className="rounded-2xl bg-white p-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <p className="font-bold text-ink">{project.title}</p>
                            <p className="mt-1 text-sm text-ink/58">
                              {project.owner.full_name} · {project.summary}
                            </p>
                            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-ink/42">
                              Başvuru: {project.applications_count ?? 0} · Kabul: {project.accepted_applications_count ?? 0}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => loadAdminProjectDetail(project.id)}
                              className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-primary/25 hover:text-primary"
                            >
                              Detayı Aç
                            </button>
                            <button
                              type="button"
                              onClick={() => handleProjectDelete(project.id)}
                              className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-100"
                            >
                              Kaldır
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {selectedAdminProject && (
                    <div className="mt-5 rounded-2xl bg-white p-5">
                      <p className="text-lg font-bold text-ink">{selectedAdminProject.title}</p>
                      <p className="mt-2 text-sm text-ink/62">
                        {selectedAdminProject.problem_statement || selectedAdminProject.summary}
                      </p>
                      <p className="mt-3 text-xs font-bold uppercase tracking-widest text-ink/42">
                        Tech Stack: {(selectedAdminProject.tech_stack || []).join(", ") || "-"}
                      </p>
                      <div className="mt-4 space-y-3">
                        {(selectedAdminProject.applications || []).map((application) => (
                          <div key={application.id} className="rounded-2xl border border-ink/8 bg-[#F7F8FC] p-4">
                            <p className="font-semibold text-ink">
                              {application.applicant.full_name} · {application.status}
                            </p>
                            <p className="mt-1 text-sm text-ink/58">{application.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default function App() {
  const [health, setHealth] = useState<HealthState>({
    status: "loading",
    message: "Backend bağlantısı kontrol ediliyor…",
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [route, setRoute] = useState<RouteName>(getRouteFromHash());
  const [checkoutFeedback, setCheckoutFeedback] = useState("");

  const startLandingPremiumCheckout = async (plan: "monthly" | "yearly") => {
    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      window.location.hash = "#login";
      return;
    }

    setCheckoutFeedback("Ödeme sistemi şu anda güncelleniyor. Lütfen daha sonra tekrar deneyin.");
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health/")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        if (!cancelled)
          setHealth({
            status: "ready",
            message: `${d.name ?? "Foundrly API"} aktif ve çalışıyor.`,
          });
      })
      .catch(() => {
        if (!cancelled)
          setHealth({
            status: "error",
            message: "Backend şu an ulaşılamıyor.",
          });
      });
    return () => {
      cancelled = true;
    };
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

  if (route.startsWith("app-")) {
    return <DashboardPage route={route as Exclude<RouteName, "home" | "login" | "register">} />;
  }

  return (
    <div className="min-h-screen bg-mesh font-sans text-ink antialiased">
      <header className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <a href="#" className="flex flex-col leading-none">
            <span className="text-2xl font-extrabold tracking-tight text-ink">
              Foundrly
            </span>
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
            className="rounded-lg p-2 text-ink md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü"
          >
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="space-y-3 border-t border-white/40 bg-white/90 px-6 py-4 md:hidden">
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
                <strong className="text-primary font-semibold">
                  AI Team Builder
                </strong>{" "}
                ile doğru ekip arkadaşlarını çok daha hızlı bulmasını sağlar.
              </p>
            </div>

            <div id="entry" className="flex flex-wrap gap-4">
              <a
                href="#register"
                className="rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-halo transition hover:-translate-y-0.5 hover:shadow-[0_24px_64px_rgba(71,93,178,0.3)]"
              >
                Kayıt Ol
              </a>
              <a
                href="#login"
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
                {
                  v: "Founder",
                  l: "Fikrini ekip bulma stresine takılmadan yayına çıkar.",
                },
                {
                  v: "Builder",
                  l: "Yeteneklerini doğru projelerle eşleştir, boşa başvurma.",
                },
                {
                  v: "Verified",
                  l: "Daha güvenilir profillerle daha hızlı ekip kur.",
                },
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
                    <h3 className="mt-1 text-base font-bold">
                      Frontend Developer
                    </h3>
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
                    href="#register"
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

                {plan.name === "Premium" ? (
                  <button
                    type="button"
                    onClick={() => startLandingPremiumCheckout("monthly")}
                    className={`mt-8 block w-full rounded-2xl py-3 text-center text-sm font-bold transition hover:opacity-90 ${plan.ctaClass}`}
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <a
                    href="#register"
                    className={`mt-8 block rounded-2xl py-3 text-center text-sm font-bold transition hover:opacity-90 ${plan.ctaClass}`}
                  >
                    {plan.cta}
                  </a>
                )}
              </article>
            ))}
          </div>
          {checkoutFeedback && (
            <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-center text-sm text-primary">
              {checkoutFeedback}
            </div>
          )}
        </section>

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
                href="#register"
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
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  health.status === "ready" ? "bg-success" : "bg-white/30"
                }`}
              />
              <span>
                {health.status === "ready"
                  ? "API Online"
                  : health.status === "error"
                    ? "API Offline"
                    : "Checking…"}
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
