import { useEffect, useState, useRef } from "react";
import FoundrlyLanding from "./components/marketing/FoundrlyLanding";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

type HealthState = { status: "loading" | "ready" | "error"; message: string };
type PremiumSubscriptionSummary = {
  plan: "monthly" | "yearly";
  price_label: string;
  status: "active" | "canceled";
};

type PremiumSubscriptionState = {
  is_premium: boolean;
  subscription: PremiumSubscriptionSummary | null;
};

type RouteName =
  | "home"
  | "mentors"
  | "discover"
  | "teammates"
  | "hub"
  | "events"
  | "community"
  | "login"
  | "register"
  | "premium"
  | "about"
  | "privacy"
  | "careers"
  | "faq"
  | "contact"
  | "app-home"
  | "app-discover"
  | "app-create"
  | "app-messages"
  | "app-profile"
  | "app-ai-builder"
  | "app-networking"
  | "app-mentors"
  | "app-mentor-panel"
  | "app-admin"
  | "app-member";

type CurrentUser = {
  id: number;
  email: string;
  full_name: string;
  title: string;
  bio: string;
  skills: string[];
  interests: string[];
  profile_picture: string | null;
  is_verified_talent: boolean;
  is_premium: boolean;
  is_mentor: boolean;
  mentor_credits: number;
  mentor_price: number;
  mentor_balance: number;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
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
  friend_requests?: FriendRequest[];
};

type ProjectCard = {
  id: number;
  owner: {
    id: number;
    email: string;
    full_name: string;
    title: string;
    is_verified_talent: boolean;
    is_premium?: boolean;
    is_staff?: boolean;
    is_superuser?: boolean;
  };
  title: string;
  summary: string;
  problem_statement?: string;
  tech_stack?: string[];
  needed_roles?: string[];
  is_premium_highlighted: boolean;
  created_at: string;
  updated_at: string;
};

type TeamApplication = {
  id: number;
  project: number;
  project_details?: {
    id: number;
    title: string;
    summary: string;
    is_premium_highlighted: boolean;
    created_at: string;
    updated_at: string;
    owner: {
      id: number;
      email: string;
      full_name: string;
      title: string;
      profile_picture?: string | null;
      is_verified_talent: boolean;
      is_premium: boolean;
      is_mentor: boolean;
      is_staff: boolean;
      is_superuser: boolean;
    };
  };
  applicant: {
    id: number;
    email: string;
    full_name: string;
    title: string;
    is_verified_talent: boolean;
  };
  message: string;
  status: string;
  created_at: string;
};

type PublicReview = {
  id: number;
  reviewer: {
    id: number;
    full_name: string;
    title: string;
    is_verified_talent: boolean;
  };
  project: {
    id: number;
    title: string;
  };
  rating: number;
  comment: string;
  created_at: string;
};

type PublicProfile = {
  id: number;
  full_name: string;
  title: string;
  bio: string;
  skills: string[];
  interests: string[];
  is_verified_talent: boolean;
  is_premium: boolean;
  date_joined: string;
  average_rating: number | null;
  reviews_count: number;
  reviews: PublicReview[];
  recent_projects: Array<{
    id: number;
    title: string;
    summary: string;
    created_at: string;
  }>;
  eligible_review_applications: Array<{
    application_id: number;
    project_id: number;
    project_title: string;
    counterpart_role: string;
  }>;
};

type FriendRequest = {
  id: number;
  sender: number;
  sender_name: string;
  receiver: number;
  receiver_name: string;
  status: string;
  created_at: string;
};

type MessageThread = {
  application_id: number;
  project: {
    id: number;
    title: string;
    summary: string;
  };
  counterpart: {
    id: number;
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
    id: number;
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
  is_mentor: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_verified_talent?: boolean;
  is_premium?: boolean;
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

type ShowcaseProject = {
  id: number;
  title: string;
  summary: string;
  problem_statement: string;
  tech_stack: string[];
  needed_roles: string[];
  is_premium_highlighted: boolean;
  created_at: string;
  owner: {
    id: number;
    full_name: string;
    title: string;
    is_verified_talent: boolean;
    is_premium: boolean;
  };
};

type ShowcaseUser = {
  id: number;
  full_name: string;
  title: string;
  bio: string;
  skills: string[];
  interests: string[];
  profile_picture: string | null;
  is_verified_talent: boolean;
  is_premium: boolean;
  average_rating: number | null;
  recent_projects_count: number;
  date_joined: string;
};

type CommunityThreadItem = {
  id: number;
  topic: string;
  stats_label: string;
  signal_label: string;
  created_at: string;
  author: {
    id: number;
    full_name: string;
    title: string;
    is_verified_talent: boolean;
  };
};

type CommunityEventItem = {
  id: number;
  title: string;
  description: string;
  location: string;
  tag: string;
  event_date: string;
  is_online: boolean;
  is_registered?: boolean;
};

type ShowcaseData = {
  projects: ShowcaseProject[];
  users: ShowcaseUser[];
  threads: CommunityThreadItem[];
  events: CommunityEventItem[];
  guides: CommunityGuideItem[];
};

type CommunityGuideItem = {
  id: number;
  title: string;
  read: string;
  tone: string;
  summary: string;
  bullets: string[];
  is_published?: boolean;
};

const NAV_LINKS = [
  { label: "Ana Sayfa", href: "#home" },
  { label: "Girişim Merkezi", href: "#hub" },
  { label: "Etkinlikler", href: "#events" },
  { label: "Fiyatlandırma", href: "#pricing" },
];
const MEMBERS_ONLY_ROUTES = new Set<RouteName>(["mentors", "discover", "teammates"]);

const ENTRY_LINKS = [
  { label: "Giriş Yap", href: "#login", className: "border border-ink/12 bg-white/80 text-ink hover:border-primary/25 hover:text-primary" },
  { label: "Kayıt Ol", href: "#register", className: "bg-primary text-white hover:bg-primary/90 shadow-halo" },
];

const FOOTER_COMPANY_LINKS = [
  { label: "Hakkımızda", href: "#about" },
  { label: "Kariyer", href: "#careers" },
];

const FOOTER_SUPPORT_LINKS = [
  { label: "İletişim", href: "#contact" },
  { label: "Gizlilik Politikası", href: "#privacy" },
  { label: "SSS", href: "#faq" },
];

const APP_NAV_BASE = [
  { label: "Anasayfa", href: "#app-home" },
  { label: "Keşfet", href: "#app-discover" },
  { label: "Proje Oluştur", href: "#app-create" },
  { label: "Etkinlikler", href: "#app-events" },
  { label: "Mesajlar", href: "#app-messages" },
  { label: "Mentörler", href: "#app-mentors" },
  { label: "YZ Ekip Kurucu", href: "#app-ai-builder" },
  { label: "Premium", href: "#premium" },
  { label: "Profilim", href: "#app-profile" },
];

const FEATURES = [
  {
    icon: "👤",
    title: "Kurucu Profili",
    description:
      "Teknik becerilerini, ilgi alanlarını ve proje geçmişini tek bir güçlü profil üzerinden paylaş. Doğrulanmış yetenek rozeti ile güvenilirliğini kanıtla.",
    badge: "Ücretsiz",
    badgeColor: "bg-success/10 text-success",
  },
  {
    icon: "🤖",
    title: "YZ Ekip Kurucu",
    description:
      "TF-IDF tabanlı anlamsal eşleştirme motoru; proje ihtiyaçları, beceriler, ilgi alanları ve rol uyumunu birlikte değerlendirerek aday önerileri üretir.",
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
    title: "Doğrulanmış Yetenek",
    description:
      "Yönetim onaylı doğrulama sistemiyle profilini güçlendir. Ekip kuranlar önce doğrulanmış yeteneklere başvurur.",
    badge: "Premium",
    badgeColor: "bg-primary/10 text-primary",
  },
  {
    icon: "📊",
    title: "Kontrol Paneli",
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
  { icon: "🤝", text: "Doğrulanmış yetenek rozetiyle güvenilir profiller" },
  { icon: "⚡", text: "Yapay zeka ile dakikalar içinde en uygun adaylar" },
  { icon: "📈", text: "Şeffaf başvuru ve değerlendirme akışı" },
];

const DISCOVER_GROUPS = [
  {
    title: "Yükselen Projeler",
    meta: "Bu hafta",
    stat: "24 açık ekip",
    description: "İlgi gören ve ekip arayan projeleri hızlıca keşfet.",
  },
  {
    title: "Açık Girişim Ekipleri",
    meta: "Kurucu odaklı",
    stat: "12 yeni ilan",
    description: "Erken aşamada rol al ve ürünün merkezinde yer al.",
  },
  {
    title: "Hackathon Takımları",
    meta: "Hızlı ekipleşme",
    stat: "8 aktif takım",
    description: "Yarışmalara hazırlanan ekipleri ve açık rolleri incele.",
  },
  {
    title: "Yapay Zeka Girişimleri",
    meta: "Trend alan",
    stat: "19 proje",
    description: "YZ odaklı ürün, araç ve araştırma projelerine göz at.",
  },
  {
    title: "Üniversite Projeleri",
    meta: "Kampüs akışı",
    stat: "31 ekip",
    description: "Öğrenci ekipleri ve bitirme projeleri burada.",
  },
  {
    title: "Uzaktan Ekipler",
    meta: "Konum bağımsız",
    stat: "14 açık rol",
    description: "Uzaktan çalışan ekiplerle üretim fırsatlarını yakala.",
  },
];

const TEAMMATE_GROUPS = [
  { role: "Yapay Zeka Mühendisi", levels: "Başlangıç · Orta · İleri" },
  { role: "Backend Geliştirici", levels: "Başlangıç · Orta · İleri" },
  { role: "UI/UX Tasarımcı", levels: "Başlangıç · Orta · İleri" },
  { role: "Siber Güvenlik", levels: "Başlangıç · Orta · İleri" },
  { role: "Veri Bilimci", levels: "Başlangıç · Orta · İleri" },
  { role: "Ürün Yöneticisi", levels: "Başlangıç · Orta · İleri" },
  { role: "Oyun Geliştirici", levels: "Başlangıç · Orta · İleri" },
];

const HUB_CONTENT = [
  "Girişim rehberleri",
  "Yatırım sunumu örnekleri",
  "MVP yol haritası",
  "Yatırımın temelleri",
  "Hackathon ipuçları",
  "Kurucu sözleşmesi notları",
];

const EVENT_CONTENT = [
  "Yaklaşan hackathonlar",
  "Girişim yarışmaları",
  "Yapay zeka etkinlikleri",
  "Üniversite etkinlikleri",
  "Çevrim içi networking oturumları",
  "Topluluk buluşmaları",
];

const COMMUNITY_CONTENT = [
  "Başarı hikayeleri",
  "Öne çıkan builder'lar",
  "Öne çıkan kurucular",
  "Haftanın spotlight profili",
  "İş birliği hikayeleri",
  "Topluluk güncellemeleri",
];

const LIVE_ACTIVITY = [
  "3 yeni yapay zeka startup ekibi oluşturuldu",
  "Backend geliştirici fintech ekibine katıldı",
  "Bugün 12 yeni builder topluluğa dahil oldu",
  "Hackathon ekibi son rolünü tamamladı",
];

const FEATURE_SPOTLIGHTS = [
  {
    title: "Yapay Zeka Destekli Takım Eşleşmesi",
    lead: "Profil, rol ve proje ihtiyaçlarını birlikte okuyarak daha isabetli takım önerileri üretir.",
    tag: "Canlı eşleşme",
  },
  {
    title: "Doğrulanmış Üretici Profilleri",
    lead: "Kurucuların güvenle ekip kurabilmesi için profil kalitesini öne çıkarır.",
    tag: "Güven katmanı",
  },
  {
    title: "Uyumluluk Skoru",
    lead: "İnsanların gerçekten üretip üretemeyeceğine dair daha somut bir sinyal verir.",
    tag: "Karar desteği",
  },
  {
    title: "Startup İşbirliği Araçları",
    lead: "Başvuru, kabul, takım içi mesajlaşma ve proje akışını tek çatı altında toplar.",
    tag: "Üretim akışı",
  },
  {
    title: "Kurucu İtibar Sistemi",
    lead: "Kurucuların geri dönüş kalitesi ve takım yönetim disiplini görünür olur.",
    tag: "İtibar sinyali",
  },
  {
    title: "Takım Analitiği",
    lead: "Hangi projelerin ilgi çektiğini, hangi rollerin eksik kaldığını ve hareketliliği gösterir.",
    tag: "İçgörü paneli",
  },
];

const SOCIAL_PROOF = [
  "PAÜ",
  "HackathonTR",
  "Teknokent",
  "Yapay Zeka Topluluğu",
  "Üniversite Kulüpleri",
  "Üretici Ağları",
];

const BUILDER_STORIES = [
  "İki yabancı nasıl yapay zeka startup kurdu?",
  "Hackathon arkadaşlığından startup ortaklığına",
  "Foundrly sayesinde CTO’muzu bulduk",
];

const PLANS = [
  {
    name: "Ücretsiz",
    price: "₺0",
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
      "Proje görünürlüğü",
    ],
    locked: ["Öncelikli eşleşme", "Doğrulanmış profil", "Yüksek görünürlük"],
  },
  {
    name: "Premium",
    price: "₺199",
    period: "/ ay · ₺1.990/yıl",
    desc: "Daha hızlı eşleş, daha görünür ol, daha güçlü ekip kur.",
    cta: "Premium'a Geç",
    ctaClass: "bg-white text-primary hover:bg-white/90",
    cardClass: "border-primary/20 bg-primary text-white shadow-halo",
    items: [
      "Yapay zeka uyum skoru",
      "Doğrulanmış profil başvurusu",
      "Öncelikli eşleşme görünürlüğü",
      "Kurucu itibar puanı desteği",
      "Gelişmiş ekip filtreleme",
      "Yüksek görünürlük ve öncelikli destek",
    ],
    locked: [],
  },
];

function getRouteFromHash(): RouteName {
  if (typeof window === "undefined") return "home";
  const [hashPath] = window.location.hash.split("?");
  if (hashPath.startsWith("#app-member-")) {
    return "app-member";
  }
  switch (hashPath) {
    case "#mentors":
      return "mentors";
    case "#discover":
      return "discover";
    case "#pricing":
      return "home";
    case "#teammates":
      return "teammates";
    case "#hub":
      return "hub";
    case "#events":
      return "events";
    case "#community":
      return "community";
    case "#premium":
      return "premium";
    case "#about":
      return "about";
    case "#privacy":
      return "privacy";
    case "#careers":
      return "careers";
    case "#faq":
      return "faq";
    case "#contact":
      return "contact";
    case "#login":
      return "login";
    case "#register":
      return "register";
    case "#app-home":
    case "#dashboard":
      return "app-home";
    case "#app-discover":
      return "app-discover";
    case "#app-create":
      return "app-create";
    case "#app-messages":
      return "app-messages";
    case "#app-profile":
      return "app-profile";
    case "#app-ai-builder":
      return "app-ai-builder";
    case "#app-mentors":
      return "app-mentors";
    case "#app-mentor-panel":
      return "app-mentor-panel";
    case "#app-events":
      return "app-networking";
    case "#app-admin":
      return "app-admin";
    default:
      return "home";
  }
}

function formatTRY(value: number | string | null | undefined) {
  const amount = typeof value === "string" ? Number(value) : value ?? 0;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function getPublicProfileIdFromHash() {
  if (typeof window === "undefined") return null;
  const match = window.location.hash.match(/^#app-member-(\d+)$/);
  return match ? Number(match[1]) : null;
}

function getHashSearchParam(key: string) {
  if (typeof window === "undefined") return "";
  const [, queryString = ""] = window.location.hash.split("?");
  const params = new URLSearchParams(queryString);
  return params.get(key)?.trim() ?? "";
}

function getPostAuthHash() {
  const next = getHashSearchParam("next");
  switch (next) {
    case "events":
      return "#app-networking";
    case "community":
      return "#app-networking";
    case "premium":
      return "#premium";
    default:
      return "#app-home";
  }
}

function getAuthenticatedPublicCtaHref(target: "events" | "community") {
  if (typeof window === "undefined") return `#register?next=${target}`;
  const hasSession = Boolean(localStorage.getItem("foundrly_access_token") || localStorage.getItem("foundrly_current_user"));
  return hasSession ? "#app-networking" : `#register?next=${target}`;
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

function formatJoinedDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function renderStars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function PremiumSimulationPage({
  authenticated,
  currentUser,
  subscriptionState,
  onStartSimulation,
  onCancelSubscription,
  feedback,
}: {
  authenticated: boolean;
  currentUser: CurrentUser | null;
  subscriptionState: PremiumSubscriptionState | null;
  onStartSimulation?: (plan: "monthly" | "yearly") => Promise<void> | void;
  onCancelSubscription?: () => Promise<void> | void;
  feedback?: string;
}) {
  const alreadyPremium = Boolean(currentUser?.is_premium);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [mentorSessionFeedback, setMentorSessionFeedback] = useState("");
  const benefitCards = [
    {
      title: "YZ Ekip Kurucu",
      body: "Yapay zeka analizleri ile en uyumlu takım arkadaşlarını tespit ederek ekip kurma sürecini kolaylaştırır.",
    },
    {
      title: "Mentörlük Seansları",
      body: "Doğrudan platform üzerinden uzman mentörlerden seans talep edebilir ve birebir görüşmeler yapabilirsiniz.",
    },
    {
      title: "Yetenek Doğrulama",
      body: "Platform onaylı rozet ile kurucu sinyalinizi güçlendirir ve adaylar arasındaki güvenilirliliğinizi artırır.",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
      <section className="premium-stroke overflow-hidden rounded-[2.5rem] bg-aurora px-6 py-8 lg:px-10 lg:py-10">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-primary">
                <span className="h-2 w-2 rounded-full bg-aurum shadow-[0_0_0_4px_rgba(215,181,109,0.18)]" />
                Premium üyelik
              </span>
            </div>

            <div className="space-y-5">
              <p className="max-w-xl text-sm font-semibold uppercase tracking-[0.3em] text-white/58">
                Hızlı hareket eden kurucular daha güçlü ekipler kurar
              </p>
              <h1 className="max-w-4xl font-display text-5xl leading-[0.96] tracking-tight text-white lg:text-7xl">
                Ekip kurmayı
                <span className="block text-[#9ab0ff]">premium bir avantaja</span>
                dönüştür.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/76 lg:text-xl">
                Foundrly Premium; daha yüksek görünürlük, daha güçlü güven sinyali ve yapay zeka destekli eşleşme katmanı ile iyi fikirleri daha hızlı doğru insanlarla buluşturur.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {benefitCards.map((card) => (
                <article key={card.title} className="rounded-[1.75rem] border border-white/12 bg-[#0b1630]/72 p-5 shadow-[0_16px_45px_rgba(4,8,18,0.24)] backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9ab0ff]/82">
                    {card.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/72">{card.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="premium-dark-panel relative overflow-hidden rounded-[2.35rem] p-7 text-white lg:p-8">
            <div className="absolute inset-x-10 top-0 h-px bg-white/25" />
            <div className="absolute -right-16 top-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-12 bottom-8 h-28 w-28 rounded-full bg-aurum/20 blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/55">
                    Premium erişim
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight">
                    {alreadyPremium ? "Üyeliğin aktif" : "Premium planı aç"}
                  </h2>
                </div>
                <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                  ₺199 / ay
                </div>
              </div>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/72">
                Premium ile YZ Ekip Kurucu, verified başvurusu, gelişmiş filtreleme, görünürlük artışı ve daha hızlı takım kurma akışları tek planda birleşir.
              </p>

              <div className="mt-6 space-y-3 rounded-[1.6rem] border border-white/12 bg-white/7 p-5">
                {[
                  "YZ Ekip Kurucu ile aday kalitesini yükselt",
                  "Premium kurucu görünürlüğü ile daha iyi başvuru al",
                  "Doğrulanmış yetenek başvurusu ile güven sinyalini güçlendir",
                  "Alanında uzman mentör havuzuna doğrudan erişim sağla",
                  "Görüşme seanslarını güvenli ödeme sistemi ile rezerve et",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-white/78">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-aurum" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {feedback && (
                <div className="mt-5 rounded-2xl border border-success/20 bg-success/12 px-4 py-3 text-sm text-white">
                  {feedback}
                </div>
              )}

              {!authenticated ? (
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <a
                    href="#register"
                    className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-bold text-ink transition hover:bg-white/90"
                  >
                    Hesap Oluştur
                  </a>
                  <a
                    href="#login"
                    className="rounded-2xl border border-white/16 bg-white/8 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/12"
                  >
                    Giriş Yap
                  </a>
                </div>
              ) : alreadyPremium ? (
                <div className="mt-7 space-y-4">
                  <div className="rounded-[1.4rem] border border-success/20 bg-success/10 px-4 py-4 text-sm leading-7 text-white/82">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-success">Premium aktif</p>
                    <p className="mt-2">
                      Hesabın şu anda premium özelliklere erişebiliyor. Uzman mentörlerden dilediğin zaman doğrudan güvenli ödeme seanslarıyla görüşme talebi gönderebilirsin.
                    </p>
                    {subscriptionState?.subscription && (
                      <p className="mt-3 text-sm text-white/70">
                        Aktif plan: {subscriptionState.subscription.plan === "monthly" ? "Aylık Premium" : "Yıllık Premium"} · {subscriptionState.subscription.plan === "monthly" ? "₺199 / ay" : "₺1.990 / yıl"}
                      </p>
                    )}
                  </div>
                  <div className="rounded-[1.4rem] border border-white/12 bg-white/8 px-4 py-4">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/48">Üyeliğimi Yönet</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <a
                        href="#app-profile"
                        className="rounded-2xl border border-white/16 bg-[#101b38] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#162447]"
                      >
                        Profilime Dön
                      </a>
                      <button
                        type="button"
                        onClick={() => onCancelSubscription?.()}
                        className="rounded-2xl border border-red-300/30 bg-red-400/10 px-5 py-3 text-center text-sm font-bold text-red-100 transition hover:bg-red-400/16"
                      >
                        Premium'u İptal Et
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <a
                      href="#app-ai-builder"
                      className="rounded-2xl border border-white/16 bg-[#101b38] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#162447]"
                    >
                      YZ Ekip Kurucu
                    </a>
                    <a
                      href="#app-networking"
                      className="rounded-2xl border border-white/16 bg-white/8 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/12"
                    >
                      Topluluğa Git
                    </a>
                  </div>
                  {/* Ek mentor seansı ödeme kısmı Mentörler panelinde seçilen mentörün altındadır */}
                </div>
              ) : (
                <div className="mt-7 space-y-4">
                  <div className="rounded-[1.6rem] border border-white/12 bg-white/8 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">Güvenli Ödeme</p>
                    <p className="mt-3 text-sm leading-6 text-white/70">
                      Kart bilgilerini girip onay verdiğinde premium erişim anında aktive edilir.
                    </p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPlan("monthly")}
                        className={`rounded-2xl border px-4 py-4 text-left transition ${selectedPlan === "monthly" ? "border-white/24 bg-white text-[#08101f] shadow-[0_10px_30px_rgba(255,255,255,0.12)]" : "border-white/12 bg-[#101b38] text-white"}`}
                      >
                        <span className="block text-xs font-bold uppercase tracking-[0.2em]">Aylık Plan</span>
                        <span className="mt-2 block text-2xl font-black">₺199</span>
                        <span className="mt-2 block text-sm opacity-75">Birebir mentörlük seansı talep edebilme</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPlan("yearly")}
                        className={`rounded-2xl border px-4 py-4 text-left transition ${selectedPlan === "yearly" ? "border-white/24 bg-white text-[#08101f] shadow-[0_10px_30px_rgba(255,255,255,0.12)]" : "border-white/12 bg-[#101b38] text-white"}`}
                      >
                        <span className="block text-xs font-bold uppercase tracking-[0.2em]">Yıllık Plan</span>
                        <span className="mt-2 block text-2xl font-black">₺1.990</span>
                        <span className="mt-2 block text-sm opacity-75">12 ay kesintisiz premium akış</span>
                      </button>
                    </div>
                    <div className="mt-5 grid gap-3">
                      <input value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} placeholder="Kart üzerindeki isim" className="app-input" />
                      <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Kart numarası" className="app-input" />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="SKT (AA/YY)" className="app-input" />
                        <input value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} placeholder="CVC" className="app-input" />
                      </div>
                    </div>
                    {paymentError && (
                      <div className="mt-4 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
                        {paymentError}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (!cardHolder.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim()) {
                          setPaymentError("Kart bilgilerini doldurup ödemeyi onaylamalısın.");
                          return;
                        }
                        setPaymentError("");
                        onStartSimulation?.(selectedPlan);
                      }}
                      className="mt-5 w-full rounded-2xl bg-white px-5 py-3 text-center text-sm font-bold text-ink transition hover:bg-white/90"
                    >
                      Ödemeyi Onayla ve Premium'u Aç
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPlan("monthly")}
                      className="rounded-[1.6rem] border border-white/20 bg-white px-5 py-5 text-left text-[#08101f] transition hover:-translate-y-0.5 hover:bg-white/92"
                    >
                      <span className="block text-xs font-bold uppercase tracking-[0.22em] text-primary/60">
                        Aylık erişim
                      </span>
                      <span className="mt-2 block text-3xl font-black">₺199</span>
                      <span className="mt-2 block text-sm leading-6 text-ink/65">
                        Premium katmanı anında aç, görünürlüğünü artır ve mentörlerden seans talep edebilme yetkisine sahip ol.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPlan("yearly")}
                      className="rounded-[1.6rem] border border-white/16 bg-[#101b38] px-5 py-5 text-left text-white transition hover:-translate-y-0.5 hover:bg-[#162447]"
                    >
                      <span className="block text-xs font-bold uppercase tracking-[0.22em] text-white/55">
                        Yıllık erişim
                      </span>
                      <span className="mt-2 block text-3xl font-black">₺1.990</span>
                      <span className="mt-2 block text-sm leading-6 text-white/68">
                        En iyi fiyatla tüm premium akışlara ve mentörlerden seans talep edebilme hakkına eriş.
                      </span>
                    </button>
                  </div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">
                    Kart onayı sonrası premium aktivasyonu anında hesabına işlenir.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoPage({
  eyebrow,
  title,
  lead,
  sections,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  sections: Array<{ title: string; body: string }>;
}) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-20 relative z-10 text-white">
      <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-halo backdrop-blur lg:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#9ab0ff]/80">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white lg:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">{lead}</p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <article key={section.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="text-xl font-extrabold text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#040916] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(71,93,178,0.22),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(63,177,112,0.12),transparent_26%)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_1fr]">
          <div className="max-w-md">
            <div className="flex items-center gap-4 mb-4">
              <img src="/f.jpg" alt="Foundrly" className="h-14 w-14 rounded-xl object-cover" />
              <p className="text-3xl font-extrabold tracking-tight text-white">Foundrly</p>
            </div>
            <p className="mt-6 text-base leading-8 text-slate-300">
              Daha keskin eşleşme, daha güçlü güven ve daha hızlı yürütme isteyen kurucular ve geliştiriciler için premium ağ.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Ürün</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <a href="#premium" className="block transition hover:text-white">Premium</a>
              <a href="#pricing" className="block transition hover:text-white">Fiyatlandırma</a>
              <a href="#register" className="block transition hover:text-white">Kayıt Ol</a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Kurumsal</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <a href="#about" className="block transition hover:text-white">Hakkımızda</a>
              <a href="#careers" className="block transition hover:text-white">Kariyer</a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Destek</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <a href="#privacy" className="block transition hover:text-white">Gizlilik Politikası</a>
              <a href="#faq" className="block transition hover:text-white">SSS</a>
              <a href="#contact" className="block transition hover:text-white">İletişim</a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Adres</h3>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
              <p>PAÜ Mühendislik Fakültesi, Pamukkale / Denizli</p>
              <a href="mailto:hello@joinfoundrly.com" className="block transition hover:text-white">
                hello@joinfoundrly.com
              </a>
              <p>joinfoundrly.com</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/42 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Foundrly. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
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
  const nextParam = getHashSearchParam("next");
  const nextSuffix = nextParam ? `?next=${encodeURIComponent(nextParam)}` : "";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: "idle", message: "" });

    try {
      if (isRegister) {
        const registerResponse = await fetch(API_BASE_URL + "/api/auth/register/", {
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
        window.location.hash = `#login${nextSuffix}`;
      } else {
        const tokenResponse = await fetch(API_BASE_URL + "/api/auth/token/", {
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

        const meResponse = await fetch(API_BASE_URL + "/api/users/me/", {
          headers: {
            Authorization: `Bearer ${tokenData.access}`,
          },
        });

        if (!meResponse.ok) {
          throw new Error("Giriş yapıldı ama profil bilgisi alınamadı.");
        }

        const me = await meResponse.json();
        localStorage.setItem("foundrly_current_user", JSON.stringify(me));
        window.location.hash = getPostAuthHash();
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
    <div className="min-h-screen bg-[#050B18] font-sans text-white antialiased relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(71,93,178,0.28),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(63,177,112,0.15),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(71,93,178,0.2),transparent_42%)]" />
      <header className="relative z-10 border-b border-white/10 bg-[#050B18]/72 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <a href="#home" className="flex flex-col leading-none">
            <span className="text-2xl font-extrabold tracking-tight text-white">
              Foundrly
            </span>
            <span className="text-[11px] font-medium tracking-widest text-[#9ab0ff]/80">
              FİKİRLERİ EKİPLERE DÖNÜŞTÜR
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
              href="#home"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/22 hover:bg-white/10"
            >
              Ana Sayfa
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20">
        <section className="flex flex-col justify-between rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(71,93,178,0.24),transparent_34%),linear-gradient(180deg,rgba(10,16,31,0.94),rgba(6,11,21,0.98))] p-8 text-white shadow-[0_30px_90px_rgba(0,0,0,0.34)] backdrop-blur lg:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/45">
              {isRegister ? "Kurucu Ağını Aç" : "Tekrar Hoş Geldin"}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight lg:text-5xl">
              {isRegister
                ? "Dakikalar içinde profilini kur ve doğru ekibe görün."
                : "Hesabına gir, projelerini ve başvurularını yönet."}
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
              {isRegister
                ? "Kayıt sırasında girdiğin rol, beceri, ilgi alanı ve hedef bilgileri eşleşme motorunun temelini oluşturur."
                : "Kontrol paneli, proje yönetimi, premium akışlar ve sana özel ekip eşleşmeleri içeride seni bekliyor."}
            </p>
          </div>

          <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/42">
              Platform Özeti
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                "Kayıt verilerine göre akıllı ekip eşleşmesi",
                "Doğrulanmış yetenek ile daha güvenilir profiller",
                "Premium ile daha yüksek görünürlük",
                "Alanında uzman mentör erişimi",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/8 bg-black/20 p-4 text-sm text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[2.5rem] border border-white/10 bg-white/6 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.32)] backdrop-blur lg:p-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9ab0ff]/80">
                {isRegister ? "Kayıt Ol" : "Giriş Yap"}
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-white">
                {isRegister
                  ? "Foundrly hesabını oluştur"
                  : "Foundrly hesabına giriş yap"}
              </h2>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {isRegister && (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white/72">
                    Ad Soyad
                  </span>
                  <input
                    type="text"
                    placeholder="Nurseli Demir"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-primary/50 focus:bg-black/30"
                    required
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white/72">
                  E-posta
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-primary/50 focus:bg-black/30"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white/72">
                  Şifre
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-primary/50 focus:bg-black/30"
                  minLength={8}
                  required
                />
              </label>

              {isRegister && (
                <>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-white/72">
                      Rolün
                    </span>
                    <input
                      type="text"
                      placeholder="Frontend Geliştirici"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-primary/50 focus:bg-black/30"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-white/72">
                      Kısa Biyografi
                    </span>
                    <textarea
                      placeholder="Kısaca ne yaptığını ve ne aradığını yaz."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="min-h-28 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-primary/50 focus:bg-black/30"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-white/72">
                      Yetenekler
                    </span>
                    <input
                      type="text"
                      placeholder="React, TypeScript, UI"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-primary/50 focus:bg-black/30"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-white/72">
                      İlgi Alanları
                    </span>
                    <input
                      type="text"
                      placeholder="startup, frontend, product"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-primary/50 focus:bg-black/30"
                      required
                    />
                  </label>
                </>
              )}

              {feedback.type !== "idle" && (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    feedback.type === "success"
                      ? "border border-success/20 bg-success/10 text-success"
                      : "border border-red-500/20 bg-red-500/10 text-red-300"
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

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-white/60">
              <span>{isRegister ? "Zaten hesabın var mı?" : "Hesabın yok mu?"}</span>
              <a
                href={isRegister ? `#login${nextSuffix}` : `#register${nextSuffix}`}
                className="font-semibold text-[#9ab0ff] transition hover:text-white"
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

function DashboardPage({ 
  route,
  publicProjects,
  publicMentors,
  setPublicProjects,
  setPublicMentors,
  showcaseData,
  publicLoading,
  marketingAccessToken,
  refreshPublicData,
}: { 
  route: Exclude<RouteName, "home" | "login" | "register" | "mentors">,
  publicProjects: ProjectCard[],
  publicMentors: any[],
  setPublicProjects: (data: any[]) => void,
  setPublicMentors: (data: any[]) => void,
  showcaseData: ShowcaseData,
  publicLoading: boolean,
  marketingAccessToken?: string | null,
  refreshPublicData: () => Promise<void>,
}) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [receivedApplications, setReceivedApplications] = useState<TeamApplication[]>([]);
  const [sentApplications, setSentApplications] = useState<TeamApplication[]>([]);
  const [selectedThread, setSelectedThread] = useState<ThreadDetail | null>(null);
  const [messageDraft, setMessageDraft] = useState("");
  const [messageError, setMessageError] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedDiscoverProjectId, setSelectedDiscoverProjectId] = useState<number | null>(null);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applicationFeedback, setApplicationFeedback] = useState("");
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
  const [adminTab, setAdminTab] = useState<"users" | "projects" | "events" | "mentors" | "guides">("users");
  const [adminEvents, setAdminEvents] = useState<any[]>([]);
  const [adminEventForm, setAdminEventForm] = useState({
    title: "",
    description: "",
    location: "",
    event_date: "",
    tag: "Workshop",
    is_online: false
  });
  const [adminEventFeedback, setAdminEventFeedback] = useState("");
  const [adminMentors, setAdminMentors] = useState<any[]>([]);
  const [adminGuides, setAdminGuides] = useState<CommunityGuideItem[]>([]);
  const [adminGuideForm, setAdminGuideForm] = useState({
    title: "",
    read: "5 dk okuma",
    tone: "Yürütme",
    summary: "",
    bullets: "",
    is_published: true,
  });
  const [adminGuideFeedback, setAdminGuideFeedback] = useState("");
  const [manualMentorForm, setManualMentorForm] = useState({
    full_name: "",
    email: "",
    password: "",
    title: "",
    mentor_price: 25
  });
  const [manualMentorFeedback, setManualMentorFeedback] = useState("");
  const [loadingLabel, setLoadingLabel] = useState("Panel yükleniyor…");
  const [billingFeedback, setBillingFeedback] = useState("");
  const [aiAnalysisState, setAiAnalysisState] = useState<"idle" | "analyzing" | "done">("idle");
  const [aiSelectedProjectId, setAiSelectedProjectId] = useState<number | null>(null);
  const [aiMatches, setAiMatches] = useState<any[]>([]);
  const [recommendedProjects, setRecommendedProjects] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [mentorRequests, setMentorRequests] = useState<any[]>([]);
  const [userRequests, setUserRequests] = useState<any[]>([]);
  const [mentorFeedback, setMentorFeedback] = useState("");
  const [verifiedForm, setVerifiedForm] = useState({ requested_title: "", portfolio_url: "", note: "" });
  const [verifiedFeedback, setVerifiedFeedback] = useState("");
  const [publicProfile, setPublicProfile] = useState<PublicProfile | null>(null);
  const [publicProfileFeedback, setPublicProfileFeedback] = useState("");
  const [publicProfileLoading, setPublicProfileLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    application_id: "",
    communication: 5,
    teamwork: 5,
    reliability: 5,
    technical: 5,
    comment: "",
  });
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingRole, setOnboardingRole] = useState("Founder");
  const [onboardingSkills, setOnboardingSkills] = useState<string[]>(["React", "AI"]);
  const [manualSkill, setManualSkill] = useState("");
  const [onboardingGoal, setOnboardingGoal] = useState("Build a startup team");
  const nonMentorAdminUsers = adminUsers.filter((user) => !user.is_mentor);

  const accessToken = getStoredAccessToken();
  const storedUser = localStorage.getItem("foundrly_current_user");
  const currentUser = storedUser ? (JSON.parse(storedUser) as CurrentUser) : null;
  const myProjects = publicProjects.filter((project) => project.owner.id === currentUser?.id);
  const myProjectsWithApplications = myProjects.map((project) => ({
    ...project,
    applications: receivedApplications.filter((application) => application.project === project.id),
  }));
  const effectiveProfile = summary?.profile || currentUser;
  const profileStrength = [
    effectiveProfile?.title,
    effectiveProfile?.bio,
    effectiveProfile?.skills?.length,
    effectiveProfile?.interests?.length,
  ].filter(Boolean).length;
  const onboardingNeeded = false;
  const authHeaders = accessToken
    ? {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }
    : null;

  const isAdmin = Boolean(summary?.profile.is_staff || summary?.profile.is_superuser || currentUser?.is_staff || currentUser?.is_superuser);
  const isPremium = Boolean(summary?.profile.is_premium || currentUser?.is_premium);
  const isMentor = Boolean(summary?.profile.is_mentor || currentUser?.is_mentor);

  let appNav: { label: string; href: string }[] = [];
  if (isAdmin) {
    appNav = [
      { label: "Yönetim Paneli", href: "#app-admin" }
    ];
  } else if (isMentor) {
    appNav = [
      { label: "Mentör Paneli", href: "#app-mentor-panel" }
    ];
  } else {
    appNav = APP_NAV_BASE;
  }
  const publicProfileId = route === "app-member" ? getPublicProfileIdFromHash() : null;

  const loadDashboard = async () => {
    if (!authHeaders) return;
    const [summaryResponse, threadsResponse, projectsResponse, receivedResponse, sentResponse] = await Promise.all([
      fetch(API_BASE_URL + "/api/dashboard/summary/", { headers: authHeaders }),
      fetch(API_BASE_URL + "/api/messages/threads/", { headers: authHeaders }),
      fetch(API_BASE_URL + "/api/projects/", { headers: authHeaders }),
      fetch(API_BASE_URL + "/api/applications/?received=true", { headers: authHeaders }),
      fetch(API_BASE_URL + "/api/applications/?mine=true", { headers: authHeaders }),
    ]);

    let premiumStatus = false;
    let mentorStatus = false;
    if (summaryResponse.ok) {
      const summaryData = await summaryResponse.json();
      setSummary(summaryData);
      localStorage.setItem("foundrly_current_user", JSON.stringify(summaryData.profile));
      premiumStatus = summaryData.profile.is_premium;
      mentorStatus = summaryData.profile.is_mentor;
    }

    if (premiumStatus) {
      try {
        const [recRes, mentorsRes, userReqRes] = await Promise.all([
          fetch(API_BASE_URL + "/api/dashboard/recommended-projects/", { headers: authHeaders }),
          fetch(API_BASE_URL + "/api/mentors/", { headers: authHeaders }),
          fetch(API_BASE_URL + "/api/mentors/requests/", { headers: authHeaders }),
        ]);
        if (recRes.ok) setRecommendedProjects(await recRes.json());
        if (mentorsRes.ok) setMentors(await mentorsRes.json());
        if (userReqRes.ok) setUserRequests(await userReqRes.json());
      } catch (e) {}
    }

    if (mentorStatus) {
      try {
        const reqRes = await fetch(API_BASE_URL + "/api/mentors/my-requests/", { headers: authHeaders });
        if (reqRes.ok) setMentorRequests(await reqRes.json());
      } catch (e) {}
    } else {
      setMentorRequests([]);
    }

    if (threadsResponse.ok) {
      const threadsData = await threadsResponse.json();
      setThreads(threadsData);
    }

    if (projectsResponse.ok) {
      setPublicProjects(await projectsResponse.json());
    }

    if (receivedResponse.ok) {
      setReceivedApplications(await receivedResponse.json());
    }

    if (sentResponse.ok) {
      setSentApplications(await sentResponse.json());
    }
  };

  const openPublicProfile = (userId: number) => {
    window.location.hash = `#app-member-${userId}`;
  };

  const loadPublicProfile = async (userId: number) => {
    setPublicProfileLoading(true);
    setPublicProfileFeedback("");
    try {
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined;
      const response = await fetch(`/api/users/${userId}/`, { headers });
      if (!response.ok) {
        throw new Error(await parseError(response));
      }
      const data = (await response.json()) as PublicProfile;
      setPublicProfile(data);
      setReviewForm({
        application_id: data.eligible_review_applications[0]?.application_id
          ? String(data.eligible_review_applications[0].application_id)
          : "",
        communication: 5,
        teamwork: 5,
        reliability: 5,
        technical: 5,
        comment: "",
      });
    } catch (error) {
      setPublicProfileFeedback(
        error instanceof Error ? error.message : "Profil bilgisi alınamadı.",
      );
      setPublicProfile(null);
    } finally {
      setPublicProfileLoading(false);
    }
  };

  const handleCreateReview = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!accessToken || !publicProfileId) {
      setPublicProfileFeedback("Yorum bırakmak için giriş yapmalısın.");
      return;
    }
    const ratingAverage = Math.round(
      (reviewForm.communication +
        reviewForm.teamwork +
        reviewForm.reliability +
        reviewForm.technical) /
        4
    );
    const response = await fetch(`/api/users/${publicProfileId}/reviews/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        application_id: Number(reviewForm.application_id),
        rating: ratingAverage,
        comment: reviewForm.comment,
      }),
    });

    if (!response.ok) {
      setPublicProfileFeedback(await parseError(response));
      return;
    }

    await loadPublicProfile(publicProfileId);
    setPublicProfileFeedback("Yorum başarıyla eklendi.");
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
    const response = await fetch(API_BASE_URL + "/api/admin/dashboard/", { headers: authHeaders });
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
    const response = await fetch(API_BASE_URL + "/api/admin/verification-requests/?status=pending", {
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

  const loadAdminEvents = async () => {
    if (!authHeaders || !isAdmin) return;
    const response = await fetch(API_BASE_URL + "/api/admin/events/", { headers: authHeaders });
    if (response.ok) {
      setAdminEvents(await response.json());
    }
  };

  const loadAdminMentors = async () => {
    if (!authHeaders || !isAdmin) return;
    const response = await fetch(API_BASE_URL + "/api/admin/mentors/", { headers: authHeaders });
    if (response.ok) {
      setAdminMentors(await response.json());
    }
  };

  const loadAdminGuides = async () => {
    if (!authHeaders || !isAdmin) return;
    const response = await fetch(API_BASE_URL + "/api/admin/guides/", { headers: authHeaders });
    if (response.ok) {
      setAdminGuides(await response.json());
    }
  };

  const handleCreateAdminEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeaders || !isAdmin) return;
    setAdminEventFeedback("");
    try {
      const response = await fetch(API_BASE_URL + "/api/admin/events/", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(adminEventForm),
      });
      if (response.ok) {
        setAdminEventFeedback("Etkinlik başarıyla oluşturuldu.");
        setAdminEventForm({
          title: "",
          description: "",
          location: "",
          event_date: "",
          tag: "Workshop",
          is_online: false,
        });
        loadAdminEvents();
      } else {
        const errorData = await response.json();
        setAdminEventFeedback(`Hata: ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      setAdminEventFeedback("Etkinlik oluşturulurken bir hata oluştu.");
    }
  };

  const handleDeleteAdminEvent = async (eventId: number) => {
    if (!authHeaders || !isAdmin) return;
    if (!confirm("Bu etkinliği silmek istediğinize emin misiniz?")) return;
    setAdminEventFeedback("");
    try {
      const response = await fetch(`/api/admin/events/${eventId}/`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (response.ok) {
        setAdminEventFeedback("Etkinlik başarıyla silindi.");
        loadAdminEvents();
      } else {
        setAdminEventFeedback("Etkinlik silinirken bir hata oluştu.");
      }
    } catch (err) {
      setAdminEventFeedback("Etkinlik silinirken bir hata oluştu.");
    }
  };

  const handleCreateAdminGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeaders || !isAdmin) return;
    setAdminGuideFeedback("");
    try {
      const response = await fetch(API_BASE_URL + "/api/admin/guides/", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          ...adminGuideForm,
          bullets: adminGuideForm.bullets
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });
      if (response.ok) {
        setAdminGuideFeedback("Makale başarıyla oluşturuldu.");
        setAdminGuideForm({
          title: "",
          read: "5 dk okuma",
          tone: "Yürütme",
          summary: "",
          bullets: "",
          is_published: true,
        });
        loadAdminGuides();
        refreshPublicData();
      } else {
        setAdminGuideFeedback(await parseError(response));
      }
    } catch {
      setAdminGuideFeedback("Makale oluşturulurken teknik bir sorun oluştu.");
    }
  };

  const handleDeleteAdminGuide = async (guideId: number) => {
    if (!authHeaders || !isAdmin) return;
    setAdminGuideFeedback("");
    try {
      const response = await fetch(`/api/admin/guides/${guideId}/`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (response.ok) {
        setAdminGuideFeedback("Makale silindi.");
        loadAdminGuides();
        refreshPublicData();
      } else {
        setAdminGuideFeedback(await parseError(response));
      }
    } catch {
      setAdminGuideFeedback("Makale silinirken teknik bir sorun oluştu.");
    }
  };

  const handleToggleGuidePublish = async (guide: CommunityGuideItem) => {
    if (!authHeaders || !isAdmin) return;
    setAdminGuideFeedback("");
    try {
      const response = await fetch(`/api/admin/guides/${guide.id}/`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ is_published: !guide.is_published }),
      });
      if (response.ok) {
        loadAdminGuides();
        refreshPublicData();
      } else {
        setAdminGuideFeedback(await parseError(response));
      }
    } catch {
      setAdminGuideFeedback("Makale durumu güncellenemedi.");
    }
  };

  const handleCreateManualMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authHeaders || !isAdmin) return;
    setManualMentorFeedback("");
    try {
      const payload = {
        ...manualMentorForm,
        is_mentor: true,
      };
      const response = await fetch(API_BASE_URL + "/api/admin/users/create/", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setManualMentorFeedback("Mentör başarıyla oluşturuldu.");
        setManualMentorForm({
          full_name: "",
          email: "",
          password: "",
          title: "",
          mentor_price: 25,
        });
        await loadAdminMentors();
        await loadAdminUsers();
        await loadAdminDashboard();
      } else {
        const errData = await response.json();
        setManualMentorFeedback(`Hata: ${Object.values(errData).flat().join(" ")}`);
      }
    } catch (err) {
      setManualMentorFeedback("Manuel mentör eklenirken teknik bir sorun oluştu.");
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
      loadAdminEvents(),
      loadAdminMentors(),
      loadAdminGuides(),
    ]).finally(() => {
      setLoadingLabel("Panel hazır.");
    });
  }, []);

  useEffect(() => {
    if (route === "app-messages" && threads.length && !selectedThread) {
      loadThreadDetail(threads[0].application_id);
    }
  }, [route, threads]);

  useEffect(() => {
    if (route === "app-member" && publicProfileId) {
      loadPublicProfile(publicProfileId);
    }
  }, [route, publicProfileId]);

  useEffect(() => {
    if (isAdmin) {
      if (route !== "app-admin") {
        window.location.hash = "#app-admin";
      }
    } else if (isMentor) {
      if (route !== "app-mentor-panel") {
        window.location.hash = "#app-mentor-panel";
      }
    }
  }, [route, isAdmin, isMentor]);

  useEffect(() => {
    if (route === "app-home" && onboardingNeeded) {
      setOnboardingOpen(true);
    }
  }, [route, onboardingNeeded]);

  const handleMentorRequest = async (mentorId: number, message: string) => {
    if (!authHeaders) return;
    setMentorFeedback("");
    try {
      const response = await fetch(API_BASE_URL + "/api/mentors/requests/", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ mentor: mentorId, message }),
      });
      if (response.ok) {
        setMentorFeedback("Mentörlük talebiniz başarıyla iletildi.");
        loadDashboard();
      } else {
        const errorData = await response.json();
        setMentorFeedback(errorData.detail || "Bir hata oluştu.");
      }
    } catch (e) {
      setMentorFeedback("Bağlantı hatası.");
    }
  };

  const handleMentorRequestStatus = async (requestId: number, action: string, offeredPrice?: number, meetingTime?: string) => {
    if (!authHeaders) return;
    try {
      setMentorFeedback("");
      const response = await fetch(`/api/mentors/requests/${requestId}/status/`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ 
          action,
          offered_price: offeredPrice,
          meeting_time: meetingTime
        }),
      });
      if (response.ok) {
        loadDashboard();
      } else {
        setMentorFeedback(await parseError(response));
      }
    } catch (e) {
      setMentorFeedback("Mentör talebi güncellenirken bağlantı hatası oluştu.");
    }
  };

  const handleConfirmMentorRequest = async (requestId: number, action = "accept_offer", disputeReason?: string) => {
    if (!authHeaders) return;
    try {
      setMentorFeedback("");
      const response = await fetch(`/api/mentors/requests/${requestId}/confirm/`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({
          action,
          dispute_reason: disputeReason,
        }),
      });
      if (response.ok) {
        if (action === "accept_offer") {
          setMentorFeedback("Odeme rezerve edildi. Simdi sira mentorde: gorusme tamamlandiginda size onay ekrani acilacak.");
        } else if (action === "confirm_completion") {
          setMentorFeedback("Gorusme onaylandi. Odeme mentore aktarildi.");
        } else if (action === "open_dispute") {
          setMentorFeedback("Itiraz kaydedildi. Odeme inceleme bitene kadar bekletilecek.");
        }
        loadDashboard();
      } else {
        setMentorFeedback(await parseError(response));
      }
    } catch (e) {
      setMentorFeedback("Talep guncellenirken baglanti hatasi olustu.");
    }
  };

  const handleUploadProfilePicture = async (file: File) => {
    if (!accessToken) return;
    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const response = await fetch(API_BASE_URL + "/api/users/me/profile-picture/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setSummary(prev => prev ? { ...prev, profile: updatedUser } : null);
        localStorage.setItem("foundrly_current_user", JSON.stringify(updatedUser));
        loadDashboard();
      }
    } catch (e) {}
  };

  const handleSendFriendRequest = async (receiverId: number) => {
    if (!authHeaders) return;
    try {
      const response = await fetch(API_BASE_URL + "/api/friend-requests/", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ receiver: receiverId }),
      });
      if (response.ok) {
        alert("Arkadaşlık isteği gönderildi.");
        loadDashboard();
      }
    } catch (e) {}
  };

  const handleUpdateFriendRequest = async (requestId: number, status: string) => {
    if (!authHeaders) return;
    try {
      const response = await fetch(`/api/friend-requests/${requestId}/`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        loadDashboard();
      }
    } catch (e) {}
  };

  const completeOnboarding = async () => {
    const baseProfile = summary?.profile || currentUser;
    if (!baseProfile) return;
    const title =
      baseProfile.title && baseProfile.title.trim().length
        ? baseProfile.title
        : onboardingRole === "Explorer"
          ? "Girişim Gezgini"
          : onboardingRole === "Founder"
            ? "Kurucu"
            : onboardingRole === "Developer"
              ? "Geliştirici"
              : onboardingRole === "Designer"
                ? "Tasarımcı"
                : onboardingRole;
    const bio =
      baseProfile.bio && baseProfile.bio.trim().length
        ? baseProfile.bio
        : `${onboardingSkills.join(", ")} odaklı ${onboardingGoal.toLowerCase()}.`;
    const nextProfile = {
      ...baseProfile,
      title,
      bio,
      skills: onboardingSkills,
      interests: [onboardingGoal],
    };

    if (authHeaders) {
      try {
        await fetch(API_BASE_URL + "/api/users/me/", {
          method: "PATCH",
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: nextProfile.title,
            bio: nextProfile.bio,
            skills: nextProfile.skills,
            interests: nextProfile.interests,
          }),
        });
      } catch (e) {
        console.error("Backend onboarding sync failed", e);
      }
    }

    if (summary) {
      setSummary({ ...summary, profile: nextProfile });
    }
    localStorage.setItem("foundrly_current_user", JSON.stringify(nextProfile));
    setOnboardingOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("foundrly_access_token");
    localStorage.removeItem("foundrly_refresh_token");
    localStorage.removeItem("foundrly_current_user");
    setSummary(null);
    window.location.hash = "#home";
  };

  const discoverProjects = publicProjects.filter((project) => project.owner.id !== currentUser?.id);
  const filteredDiscoverProjects = discoverProjects.filter((project) =>
    !projectSearch ||
    project.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
    project.summary.toLowerCase().includes(projectSearch.toLowerCase()) ||
    project.owner.full_name.toLowerCase().includes(projectSearch.toLowerCase()) ||
    project.owner.title.toLowerCase().includes(projectSearch.toLowerCase())
  );
  const selectedDiscoverProject =
    filteredDiscoverProjects.find((project) => project.id === selectedDiscoverProjectId) ||
    discoverProjects.find((project) => project.id === selectedDiscoverProjectId) ||
    null;

  const runAiAnalysis = async () => {
    if (!authHeaders || !aiSelectedProjectId) return;
    setAiAnalysisState("analyzing");
    
    try {
      const response = await fetch(`/api/projects/${aiSelectedProjectId}/matches/`, {
        headers: authHeaders,
      });
      if (response.ok) {
        const data = await response.json();
        setAiMatches(data);
      } else {
        setAiMatches([]);
      }
    } catch (e) {
      setAiMatches([]);
    } finally {
      setTimeout(() => setAiAnalysisState("done"), 600);
    }
  };

  const handleProjectCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authHeaders) return;
    setProjectFeedback("");

    const response = await fetch(API_BASE_URL + "/api/projects/", {
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
    payload: { 
      is_active?: boolean; 
      is_verified_talent?: boolean; 
      is_premium?: boolean;
      is_mentor?: boolean;
      mentor_price?: number;
    },
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
    loadAdminMentors();
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
    loadAdminMentors();
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

    setAdminFeedback("");
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

  const startPremiumSimulation = async (plan: "monthly" | "yearly") => {
    if (!authHeaders) {
      window.location.hash = "#login";
      return;
    }

    setBillingFeedback("");
    const response = await fetch(API_BASE_URL + "/api/premium/subscription/", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ plan }),
    });

    if (!response.ok) {
      setBillingFeedback(await parseError(response));
      return;
    }

    setBillingFeedback("Premium erişimin aktif edildi.");
    loadDashboard();
  };

  const handleApplicationSubmit = async (projectId: number) => {
    if (!authHeaders || !applicationMessage.trim()) return;
    setApplicationFeedback("");
    const response = await fetch(API_BASE_URL + "/api/applications/", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        project: projectId,
        message: applicationMessage.trim(),
      }),
    });

    if (!response.ok) {
      setApplicationFeedback(await parseError(response));
      return;
    }

    setApplicationFeedback("Başvurun gönderildi.");
    setApplicationMessage("");
    setSelectedProjectId(null);
    loadDashboard();
  };

  const handleApplicationStatus = async (
    applicationId: number,
    status: "accepted" | "rejected",
  ) => {
    if (!authHeaders) return;
    setApplicationFeedback("");
    const response = await fetch(`/api/applications/${applicationId}/status/`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      setApplicationFeedback(await parseError(response));
      return;
    }

    setApplicationFeedback(
      status === "accepted" ? "Başvuru kabul edildi." : "Başvuru reddedildi.",
    );
    loadDashboard();
  };

  const handleVerifiedSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authHeaders) return;
    setVerifiedFeedback("");
    const response = await fetch(API_BASE_URL + "/api/verification-requests/", {
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
    <div className="min-h-screen bg-[#050B18] font-sans text-white antialiased relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(71,93,178,0.25),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(63,177,112,0.15),transparent_25%),radial-gradient(circle_at_50%_110%,rgba(71,93,178,0.18),transparent_40%)]" />
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050B18]/72 backdrop-blur-xl relative z-10">
        <div className="flex w-full items-center justify-between px-4 py-4 lg:px-6">
          <a href={isAdmin ? "#app-admin" : isMentor ? "#app-mentor-panel" : "#app-home"} className="flex items-center gap-4 leading-none mr-6">
            <img src="/f.jpg" alt="Foundrly" className="h-12 w-12 lg:h-16 lg:w-16 rounded-xl object-cover shadow-sm" />
            <span className="text-xl lg:text-2xl font-extrabold tracking-tight text-white">
              Foundrly
            </span>
          </a>

          <nav className="hidden md:flex md:flex-wrap md:items-center md:justify-end gap-x-3 lg:gap-x-5 gap-y-3">
            {appNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 lg:px-4 py-2 text-[12px] lg:text-sm font-bold transition whitespace-nowrap ${
                  window.location.hash === item.href ||
                  (item.href === "#app-home" && window.location.hash === "#dashboard")
                    ? "bg-primary text-white shadow-halo"
                    : "border border-white/10 bg-white/5 text-white/90 hover:border-white/22 hover:bg-white/10"
                }`}
              >
                {item.label}
              </a>
            ))}
            {!isPremium && !isAdmin && !isMentor && (
              <a
                href="#premium"
                className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white shadow-halo transition hover:bg-accent/90"
              >
                Premium'a Yükselt
              </a>
            )}
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-red-500/20 bg-red-500/10 text-red-400 px-5 py-2 text-sm font-semibold transition hover:bg-red-500/20 hover:text-red-300"
            >
              Çıkış Yap
            </button>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-10">
        {onboardingOpen && (
          <section className="mb-10 relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-[radial-gradient(circle_at_top_left,rgba(71,93,178,0.28),transparent_30%),linear-gradient(180deg,#0A1223,#0B1529)] p-8 text-white shadow-[0_30px_120px_rgba(0,0,0,0.35)] lg:p-10">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent" />
            <div className="relative flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
               <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/52">Profil Ayarları</p>
                <h2 className="mt-4 text-4xl font-extrabold tracking-tight">Kurucu sinyalinizi güncelleyin.</h2>
                <p className="mt-4 text-base leading-8 text-slate-300">
                  Bunu proje keşfini keskinleştirmek, YZ eşleşme kalitesini artırmak ve doğru ekip arkadaşlarının sizi daha hızlı bulmasını sağlamak için kullanıyoruz.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOnboardingOpen(false)}
                className="rounded-full border border-white/12 px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10"
              >
                Kapat
              </button>
            </div>
            <div className="relative mt-8 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
              <div className="grid gap-4 md:grid-cols-2">
                {ONBOARDING_TRACKS.map((track) => (
                  <button
                    key={track.key}
                    type="button"
                    onClick={() => setOnboardingRole(track.key)}
                    className={`rounded-[1.75rem] border p-5 text-left transition ${
                      onboardingRole === track.key
                        ? "border-white/24 bg-white/12"
                        : "border-white/10 bg-white/6 hover:border-white/18 hover:bg-white/8"
                    }`}
                  >
                    <p className="text-lg font-bold text-white">{track.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{track.body}</p>
                  </button>
                ))}
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">Sinyal Girişleri</p>
                <div className="mt-5">
                  <p className="text-sm font-semibold text-white">Öne Çıkan Beceriler</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ONBOARDING_SKILLS.slice(0, 12).map((skill) => {
                      const active = onboardingSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() =>
                            setOnboardingSkills((current) =>
                              current.includes(skill)
                                ? current.filter((item) => item !== skill)
                                : [...current, skill]
                            )
                          }
                          className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                            active ? "bg-white text-[#091222]" : "border border-white/10 bg-black/20 text-white/72"
                          }`}
                        >
                           {skill}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      placeholder="Farklı bir beceri yazın... (Örn: Three.js)"
                      value={manualSkill}
                      onChange={(e) => setManualSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && manualSkill.trim()) {
                          e.preventDefault();
                          const s = manualSkill.trim();
                          if (!onboardingSkills.includes(s)) {
                            setOnboardingSkills([...onboardingSkills, s]);
                          }
                          setManualSkill("");
                        }
                      }}
                      className="app-input flex-1 !py-2 !text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (manualSkill.trim()) {
                          const s = manualSkill.trim();
                          if (!onboardingSkills.includes(s)) {
                            setOnboardingSkills([...onboardingSkills, s]);
                          }
                          setManualSkill("");
                        }
                      }}
                      className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
                    >
                      Ekle
                    </button>
                  </div>
                  {onboardingSkills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-4">
                      {onboardingSkills.map((s) => (
                        <span key={s} className="flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-[11px] font-bold text-primary">
                          {s}
                          <button
                            type="button"
                            onClick={() => setOnboardingSkills(onboardingSkills.filter((item) => item !== s))}
                            className="ml-1 hover:text-white"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <p className="text-sm font-semibold text-white">Birincil Hedef</p>
                  <div className="mt-3 grid gap-2">
                    {ONBOARDING_GOALS.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setOnboardingGoal(goal)}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                          onboardingGoal === goal
                            ? "border-success/30 bg-success/12 text-white"
                            : "border-white/10 bg-black/20 text-white/72 hover:border-white/20"
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={completeOnboarding}
                  className="mt-6 w-full rounded-2xl bg-[linear-gradient(135deg,#5b73db_0%,#475DB2_45%,#3FB170_100%)] px-6 py-3 text-sm font-bold text-white shadow-[0_16px_45px_rgba(71,93,178,0.36)] transition hover:scale-[1.01]"
                >
                  Sinyalleri Kaydet ve Başla
                </button>
              </div>
            </div>
          </section>
        )}

        {route === "app-home" && (
          <div className="space-y-6">

            <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 text-white p-8 shadow-halo backdrop-blur lg:p-10">
              <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(71,93,178,0.18),transparent_46%),radial-gradient(circle_at_80%_0%,rgba(63,177,112,0.1),transparent_28%)]" />
              <div className="relative grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <p className="app-section-eyebrow text-sm font-bold uppercase tracking-[0.24em]">Girişimci Kokpiti</p>
                  <h1 className="mt-4 text-4xl font-extrabold leading-tight lg:text-5xl">
                    {summary?.profile.full_name || currentUser?.full_name || "Hoş geldin"}
                  </h1>
                  <p className="app-section-copy mt-4 max-w-2xl text-base text-slate-300">
                    {summary?.profile.title || currentUser?.title || "Kullanıcı"} · {loadingLabel}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="rounded-full border border-primary/15 bg-primary/6 px-4 py-2 text-sm font-semibold text-[#9ab0ff]">
                      Profil gücü: {Math.min(100, profileStrength * 25)}%
                    </span>
                    <span className="rounded-full border border-success/15 bg-success/8 px-4 py-2 text-sm font-semibold text-success">
                      {(summary?.metrics.accepted_memberships_count ?? 0) + (summary?.metrics.accepted_received_applications_count ?? 0)} aktif iş birliği
                    </span>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {[
                    ["Projelerim", summary?.metrics.owned_projects_count ?? 0],
                    ["Gelen Başvurular", summary?.metrics.received_applications_count ?? 0],
                    ["Bekleyenler", summary?.metrics.pending_received_applications_count ?? 0],
                    ["Kabul Edilenler", summary?.metrics.accepted_received_applications_count ?? 0],
                    ["Gönderdiğim", summary?.metrics.sent_applications_count ?? 0],
                    ["Katıldığım Ekip", summary?.metrics.accepted_memberships_count ?? 0],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="app-kpi-card rounded-2xl p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">{label}</p>
                      <p className="mt-2 text-3xl font-extrabold text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>



            {applicationFeedback && (
              <div className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-primary">
                {applicationFeedback}
              </div>
            )}

            {!isPremium && (
              <section className="rounded-[2rem] border border-primary/20 bg-gradient-to-r from-primary to-[#5D73CD] p-6 text-white shadow-halo">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/72">Premium Açık Değil</p>
                    <h2 className="mt-2 text-2xl font-extrabold">YZ Ekip Kurucu ve doğrulanmış yetenek akışları için premium'u aktive et</h2>
                    <p className="mt-2 text-sm leading-7 text-white/78">
                      Bu hesap şu anda standart planda. Premium sayfasına geçerek gelişmiş ekip filtrelerini, görünürlük artışını ve premium kurucu deneyimini anında açabilirsin.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a href="#premium" className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-primary transition hover:bg-white/90">Premium Sayfasını Aç</a>
                    <a href="#app-profile" className="rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Profilimi Gör</a>
                  </div>
                </div>
              </section>
            )}

            {isPremium && recommendedProjects.length > 0 && (
              <section className="app-panel rounded-[2.25rem] border-primary/20 bg-primary/5 p-6 xl:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/80">AI Takım Kurucu</p>
                    <h2 className="mt-1 text-2xl font-extrabold text-white">Size Özel AI Önerileri</h2>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  {recommendedProjects.map((match) => (
                    <article key={match.project.id} className="app-solid-card rounded-2xl border-primary/20 p-5 transition hover:border-primary/40">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-lg font-bold text-white">{match.project.title}</p>
                          <button type="button" onClick={() => openPublicProfile(match.project.owner.id)} className="mt-1 text-left text-sm text-white/62 transition hover:text-[#9ab0ff]">
                            {match.project.owner.full_name} · {match.project.owner.title}
                          </button>
                        </div>
                        <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success whitespace-nowrap">%{Math.round(match.score)} Uyum</span>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-white/68">{match.ai_summary}</p>
                      <p className="mt-3 text-xs uppercase tracking-widest text-white/42 truncate" title={match.matched_skills.join(", ")}>
                        Eşleşenler: {match.matched_skills.join(", ") || "-"}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="app-panel rounded-[2rem] p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/55">Aktif Projeler</p>
                    <h2 className="mt-1 text-2xl font-extrabold text-white">Başvurabileceğin projeler</h2>
                  </div>
                  <input value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} placeholder="Proje ara" className="app-input sm:max-w-xs" />
                </div>

                <div className="mt-5 space-y-4">
                  {filteredDiscoverProjects
                    .slice(0, 6)
                    .map((project) => {
                      const alreadyApplied = sentApplications.some((application) => application.project === project.id);
                      return (
                        <article key={project.id} className="app-solid-card rounded-2xl p-5">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <p className="text-lg font-bold text-white">{project.title}</p>
                              <button type="button" onClick={() => openPublicProfile(project.owner.id)} className="mt-1 text-left text-sm text-white/60 transition hover:text-[#9ab0ff]">
                                {project.owner.full_name} · {project.owner.title}
                              </button>
                              <p className="mt-3 text-sm leading-6 text-white/68">{project.summary}</p>
                            </div>
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{project.is_premium_highlighted ? "Premium" : "Açık"}</span>
                          </div>

                          {alreadyApplied ? (
                            <div className="mt-4 rounded-2xl border border-success/20 bg-success/8 px-4 py-3 text-sm text-success">Bu projeye zaten başvurdun.</div>
                          ) : (
                            <div className="mt-4 space-y-3">
                              {selectedProjectId === project.id && (
                                <textarea value={applicationMessage} onChange={(e) => setApplicationMessage(e.target.value)} placeholder="Projeye neden uygun olduğunu kısa yaz." className="app-input min-h-24" />
                              )}
                              <div className="flex flex-wrap gap-3">
                                {selectedProjectId === project.id ? (
                                  <>
                                    <button type="button" onClick={() => handleApplicationSubmit(project.id)} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90">Başvuruyu Gönder</button>
                                    <button type="button" onClick={() => { setSelectedProjectId(null); setApplicationMessage(""); }} className="rounded-full border border-white/12 bg-white/6 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10">Vazgeç</button>
                                  </>
                                ) : (
                                  <button type="button" onClick={() => setSelectedProjectId(project.id)} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90">Başvur</button>
                                )}
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })}
                </div>
              </div>

              <div className="space-y-6">
                <section className="app-panel rounded-[2rem] p-6">
                  <p className="app-section-eyebrow text-sm font-bold uppercase tracking-[0.2em]">Projelerim</p>
                  <div className="mt-4 space-y-4">
                    {myProjectsWithApplications.length ? (
                      myProjectsWithApplications.map((project) => (
                        <article key={project.id} className="app-solid-card rounded-2xl p-5">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <p className="font-bold text-white">{project.title}</p>
                              <p className="mt-2 text-sm leading-6 text-white/60">{project.summary}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-bold text-white/75">
                                {project.applications.length} başvuru
                              </span>
                              <span className="rounded-full border border-[#9ab0ff]/20 bg-[#9ab0ff]/10 px-3 py-1 text-xs font-bold text-[#c7d3ff]">
                                Proje sahibi görünümü
                              </span>
                            </div>
                          </div>

                          <div className="mt-5 space-y-3">
                            {project.applications.length ? (
                              project.applications.map((application) => (
                                <div key={application.id} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                      <p className="text-xs font-bold uppercase tracking-widest text-[#9ab0ff]">
                                        Bu başvuru şu projeye geldi: {project.title}
                                      </p>
                                      <button
                                        type="button"
                                        onClick={() => openPublicProfile(application.applicant.id)}
                                        className="mt-2 font-bold text-white transition hover:text-[#9ab0ff]"
                                      >
                                        {application.applicant.full_name}
                                      </button>
                                      <p className="mt-1 text-xs uppercase tracking-widest text-white/40">{application.status}</p>
                                    </div>
                                    {application.status === "pending" && (
                                      <div className="flex flex-wrap gap-2">
                                        <button type="button" onClick={() => handleApplicationStatus(application.id, "accepted")} className="rounded-full bg-success px-4 py-2 text-xs font-semibold text-white transition hover:bg-success/90">Kabul Et</button>
                                        <button type="button" onClick={() => handleApplicationStatus(application.id, "rejected")} className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/16">Reddet</button>
                                      </div>
                                    )}
                                  </div>
                                  <p className="mt-3 text-sm leading-6 text-white/68">{application.message}</p>
                                </div>
                              ))
                            ) : (
                              <div className="rounded-2xl border border-dashed border-white/12 bg-black/20 p-4 text-sm text-white/55">
                                Bu projeye henüz başvuru gelmedi.
                              </div>
                            )}
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-white/12 bg-black/20 p-4 text-sm text-white/55">
                        Henüz bir proje oluşturmadınız.
                      </div>
                    )}
                  </div>
                </section>

                <section className="app-panel rounded-[2rem] p-6">
                  <p className="app-section-eyebrow text-sm font-bold uppercase tracking-[0.2em]">Gelen Başvurular</p>
                  <div className="mt-4 space-y-3">
                    {receivedApplications.length ? (
                      receivedApplications.slice(0, 5).map((application) => (
                        <article key={application.id} className="app-solid-card rounded-2xl p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-[#9ab0ff]">
                            Proje: {application.project_details?.title || `#${application.project}`}
                          </p>
                          <button type="button" onClick={() => openPublicProfile(application.applicant.id)} className="font-bold text-white transition hover:text-[#9ab0ff]">{application.applicant.full_name}</button>
                          <p className="mt-1 text-sm text-white/60">{application.message}</p>
                          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/42">{application.status}</p>
                          {application.status === "pending" && (
                            <div className="mt-4 flex gap-3">
                              <button type="button" onClick={() => handleApplicationStatus(application.id, "accepted")} className="rounded-full bg-success px-4 py-2 text-sm font-semibold text-white transition hover:bg-success/90">Kabul Et</button>
                              <button type="button" onClick={() => handleApplicationStatus(application.id, "rejected")} className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/16">Reddet</button>
                            </div>
                          )}
                        </article>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-white/12 bg-black/20 p-4 text-sm text-white/55">Henüz gelen başvuru yok.</div>
                    )}
                  </div>
                </section>

                <section className="app-panel rounded-[2rem] p-6">
                  <p className="app-section-eyebrow text-sm font-bold uppercase tracking-[0.2em]">Aktivite Paneli</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      ["Açık Sohbetler", threads.length],
                      ["Üyelik Tipi", isPremium ? "Premium" : "Standart"],
                      ["Gönderilen Başvurular", sentApplications.length],
                      ["Premium Görünürlük", isPremium ? "Aktif" : "Pasif"],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="rounded-2xl border border-white/5 bg-white/3 p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/40">{label}</p>
                        <p className="mt-2 text-xl font-extrabold text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </section>
          </div>
        )}

        {route === "app-create" && (
          <section className="app-panel rounded-[2.25rem] p-8 lg:p-10">
            <p className="app-section-eyebrow text-sm font-bold uppercase tracking-[0.2em]">
              Proje Oluştur
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-white">Yeni proje başlat</h2>
            <form className="mt-8 space-y-5" onSubmit={handleProjectCreate}>
              {[
                ["Başlık", "title", "Foundrly Mobile App"],
                ["Kısa Özet", "summary", "Ürünün ne yaptığını tek paragrafta anlat."],
                ["Problem Tanımı", "problem_statement", "Bu proje hangi problemi çözüyor?"],
                ["Teknoloji Yığını", "tech_stack", "React, Django, PostgreSQL"],
                ["Aranan Roller", "needed_roles", "Frontend Developer, UI Designer"],
              ].map(([label, key, placeholder]) => (
                <label className="block" key={String(key)}>
                  <span className="mb-2 block text-sm font-semibold text-white/72">
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
                      className="app-input min-h-28"
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
                      className="app-input"
                      required
                    />
                  )}
                </label>
              ))}

              {projectFeedback && (
                <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-[#c7d3ff]">
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

        {route === "app-discover" && (
          <section className="space-y-6">
            <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-halo backdrop-blur lg:p-10">
              <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(71,93,178,0.18),transparent_44%),radial-gradient(circle_at_80%_0%,rgba(63,177,112,0.1),transparent_28%)]" />
              <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <p className="app-section-eyebrow text-sm font-bold uppercase tracking-[0.24em]">Keşfet</p>
                  <h1 className="mt-3 text-4xl font-extrabold leading-tight">Projeleri kart kart incele, detayını aç, sana uygun olanlara başvur.</h1>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                    Açık ekip ilanlarını tek bir ekran içinde keşfet. Karttan hızlı sinyali gör, detay panelinden proje ihtiyacını ve ekip yapısını daha net incele.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3 xl:min-w-[360px]">
                  {[
                    ["Açık proje", filteredDiscoverProjects.length],
                    ["Premium proje", filteredDiscoverProjects.filter((project) => project.is_premium_highlighted).length],
                    ["Hızlı başvuru", "Aktif"],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 backdrop-blur">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">{label}</p>
                      <p className="mt-2 text-2xl font-black text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="app-section-eyebrow text-sm font-bold uppercase tracking-[0.2em]">Proje akışı</p>
                    <h2 className="mt-1 text-2xl font-extrabold text-white">Keşfedebileceğin projeler</h2>
                  </div>
                  <input
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Proje, rol veya kurucu ara"
                    className="app-input sm:max-w-xs"
                  />
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  {filteredDiscoverProjects.map((project) => {
                    const alreadyApplied = sentApplications.some((application) => application.project === project.id);
                    const isActive = selectedDiscoverProjectId === project.id;
                    return (
                      <article
                        key={project.id}
                        className={`rounded-[1.75rem] border p-5 transition ${
                          isActive
                            ? "border-primary/30 bg-primary/10 shadow-halo"
                            : "border-white/8 bg-black/20 hover:border-white/14 hover:bg-white/6"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-lg font-bold text-white">{project.title}</p>
                            <button
                              type="button"
                              onClick={() => openPublicProfile(project.owner.id)}
                              className="mt-1 text-left text-sm text-white/60 transition hover:text-[#9ab0ff]"
                            >
                              {project.owner.full_name} · {project.owner.title}
                            </button>
                          </div>
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                            {project.is_premium_highlighted ? "Premium" : "Açık"}
                          </span>
                        </div>
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">{project.summary}</p>
                        <div className="mt-5 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedDiscoverProjectId((current) =>
                                current === project.id ? null : project.id
                              )
                            }
                            className="rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/12"
                          >
                            {isActive ? "Detayı Kapat" : "Detayı Gör"}
                          </button>
                          {!alreadyApplied && !isMentor && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProjectId(project.id);
                                setSelectedDiscoverProjectId(project.id);
                              }}
                              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
                            >
                              Başvur
                            </button>
                          )}
                        </div>
                        {alreadyApplied && (
                          <div className="mt-4 rounded-2xl border border-success/20 bg-success/8 px-4 py-3 text-sm text-success">
                            Bu projeye zaten başvurdun.
                          </div>
                        )}

                        {isActive && (
                          <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/6 p-4 backdrop-blur">
                            <div className="grid gap-4">
                              <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-white/42">Problem alanı</p>
                                <p className="mt-2 text-sm leading-6 text-slate-300">
                                  {project.problem_statement || "Henüz detay paylaşılmadı."}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-white/42">Aranan roller</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {project.needed_roles?.length ? project.needed_roles.map((role) => (
                                    <span key={role} className="rounded-full border border-primary/20 bg-primary/12 px-3 py-1 text-xs font-semibold text-[#AFC0FF]">
                                      {role}
                                    </span>
                                  )) : <span className="text-sm text-white/55">Rol bilgisi eklenmemiş.</span>}
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-white/42">Teknoloji yığını</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {project.tech_stack?.length ? project.tech_stack.map((item) => (
                                    <span key={item} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/72">
                                      {item}
                                    </span>
                                  )) : <span className="text-sm text-white/55">Teknoloji bilgisi eklenmemiş.</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>

                {filteredDiscoverProjects.length === 0 && (
                  <div className="mt-5 rounded-[1.75rem] border border-dashed border-white/12 bg-black/20 p-6 text-sm text-white/55">
                    Aramana uygun proje bulunamadı.
                  </div>
                )}
              </div>

              <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur xl:sticky xl:top-28">
                {selectedDiscoverProject ? (
                  <>
                    <p className="app-section-eyebrow text-sm font-bold uppercase tracking-[0.2em]">Proje detayı</p>
                    <h3 className="mt-2 text-2xl font-extrabold text-white">{selectedDiscoverProject.title}</h3>
                    <button
                      type="button"
                      onClick={() => openPublicProfile(selectedDiscoverProject.owner.id)}
                      className="mt-2 text-left text-sm font-semibold text-primary transition hover:text-primary/80"
                    >
                      {selectedDiscoverProject.owner.full_name} · {selectedDiscoverProject.owner.title}
                    </button>
                    <p className="mt-5 text-sm leading-7 text-slate-300">{selectedDiscoverProject.summary}</p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/42">Problem alanı</p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-white">
                          {selectedDiscoverProject.problem_statement || "Henüz detay paylaşılmadı."}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/42">Aranan roller</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedDiscoverProject.needed_roles?.length ? selectedDiscoverProject.needed_roles.map((role) => (
                            <span key={role} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                              {role}
                            </span>
                          )) : <span className="text-sm text-white/55">Rol bilgisi eklenmemiş.</span>}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-white/42">Teknoloji yığını</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedDiscoverProject.tech_stack?.length ? selectedDiscoverProject.tech_stack.map((item) => (
                          <span key={item} className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-semibold text-white/72">
                            {item}
                          </span>
                        )) : <span className="text-sm text-white/55">Teknoloji bilgisi eklenmemiş.</span>}
                      </div>
                    </div>

                    {!isMentor && (
                      <div className="mt-6 space-y-3">
                        {selectedProjectId === selectedDiscoverProject.id && (
                          <textarea
                            value={applicationMessage}
                            onChange={(e) => setApplicationMessage(e.target.value)}
                            placeholder="Projeye neden uygun olduğunu kısa ve net şekilde yaz."
                            className="app-input min-h-28 bg-white"
                          />
                        )}
                        <div className="flex flex-wrap gap-3">
                          {selectedProjectId === selectedDiscoverProject.id ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApplicationSubmit(selectedDiscoverProject.id)}
                                className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90"
                              >
                                Başvuruyu Gönder
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedProjectId(null);
                                  setApplicationMessage("");
                                }}
                                className="rounded-2xl border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/22 hover:bg-white/10"
                              >
                                Vazgeç
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedProjectId(selectedDiscoverProject.id)}
                              className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90"
                            >
                              Bu Projeye Başvur
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-full min-h-[420px] items-center justify-center rounded-[1.75rem] border border-dashed border-white/12 bg-black/20 p-6 text-center text-sm text-white/55">
                    Soldaki proje kartlarından birine tıklayarak detay görünümünü açabilirsin.
                  </div>
                )}
              </aside>
            </section>
          </section>
        )}

        {route === "app-messages" && (
          <section className="grid gap-6 lg:grid-cols-[0.4fr_0.6fr]">
            <div className="app-panel rounded-[2.25rem] p-6">
              <p className="app-section-eyebrow text-sm font-bold uppercase tracking-[0.2em]">
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
                          ? "border-primary/25 bg-primary/12"
                          : "border-white/8 bg-white/6"
                      }`}
                    >
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(event) => {
                          event.stopPropagation();
                          openPublicProfile(thread.counterpart.id);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            event.stopPropagation();
                            openPublicProfile(thread.counterpart.id);
                          }
                        }}
                        className="text-sm font-bold text-white transition hover:text-[#9ab0ff]"
                      >
                        {thread.counterpart.full_name}
                      </span>
                      <p className="mt-1 text-xs uppercase tracking-widest text-white/42">
                        {thread.project.title}
                      </p>
                      <p className="mt-2 text-sm text-white/62">
                        {thread.latest_message?.content ||
                          "Henüz mesaj yok. İlk mesajı sen gönder."}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/12 bg-black/20 p-5 text-sm text-white/55">
                    Accepted başvuru olmadığı için henüz konuşma başlamadı.
                  </div>
                )}
              </div>
            </div>

            <div className="app-panel rounded-[2.25rem] p-6">
              {selectedThread ? (
                <>
                  <div className="border-b border-ink/8 pb-4">
                    <button
                      type="button"
                      onClick={() => {
                        const counterpart = selectedThread.counterpart as { id?: number };
                        if (counterpart.id) openPublicProfile(counterpart.id);
                      }}
                      className="text-sm font-bold text-white transition hover:text-[#9ab0ff]"
                    >
                      {selectedThread.counterpart.full_name}
                    </button>
                    <p className="mt-1 text-xs uppercase tracking-widest text-white/42">
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
                              : "border border-white/10 bg-white/7 text-white"
                          }`}
                        >
                          <p
                            className={`text-[11px] font-bold uppercase tracking-widest ${
                              mine ? "text-white/70" : "text-white/45"
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
                      className="app-input min-h-28"
                    />
                    {messageError && (
                      <div className="rounded-2xl border border-red-400/20 bg-red-500/12 px-4 py-3 text-sm text-red-200">
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
                <div className="rounded-2xl border border-dashed border-white/12 bg-black/20 p-5 text-sm text-white/55">
                  Soldan bir konuşma seçerek mesajlaşmaya başlayabilirsin.
                </div>
              )}
            </div>
          </section>
        )}

        {route === "app-profile" && (
          <section className="grid gap-6">
            <div className="app-panel rounded-[2.5rem] p-8 lg:p-10">
              <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center">
                    <div className="relative group">
                      <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-white/6 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
                        {(summary?.profile.profile_picture || currentUser?.profile_picture) ? (
                          <img src={summary?.profile.profile_picture || currentUser?.profile_picture || ""} alt="Profil" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-4xl font-bold text-white/72">{(summary?.profile.full_name || currentUser?.full_name || "?").charAt(0)}</span>
                        )}
                      </div>
                      <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/45 opacity-0 transition group-hover:opacity-100">
                        <span className="text-xs font-bold text-white">Fotoğrafı Güncelle</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUploadProfilePicture(e.target.files[0])} />
                      </label>
                    </div>

                    <div className="flex-1">
                      <p className="app-section-eyebrow text-xs font-bold uppercase tracking-[0.26em]">Profil komuta merkezi</p>
                      <h2 className="mt-3 text-4xl font-extrabold text-white lg:text-5xl">{summary?.profile.full_name || currentUser?.full_name || "-"}</h2>
                      <p className="mt-2 text-xl font-semibold text-[#9ab0ff]">{summary?.profile.title || currentUser?.title || "Startup üreticisi"}</p>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
                        {summary?.profile.bio || currentUser?.bio || "Herkese açık profilin; güven sinyallerini, premium görünürlüğünü ve ekip kurma potansiyelini tek vitrine toplar."}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${(summary?.profile.is_verified_talent || currentUser?.is_verified_talent) ? "bg-success/10 text-success" : "border border-white/10 bg-white/6 text-white/62"}`}>
                          {(summary?.profile.is_verified_talent || currentUser?.is_verified_talent) ? "Doğrulanmış Yetenek" : "Standart Hesap"}
                        </span>
                        {(summary?.profile.is_premium || currentUser?.is_premium) && <span className="rounded-full bg-primary/14 px-3 py-1 text-xs font-bold text-[#9ab0ff]">Premium Üye</span>}
                        {(summary?.profile.is_mentor || currentUser?.is_mentor) && <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">Resmi Mentör</span>}
                      </div>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setOnboardingOpen(true)} className="rounded-xl border border-white/12 bg-white/6 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10">
                          Profilimi Düzenle
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ["Profil gücü", `${Math.min(100, profileStrength * 25)}%`, "Beceriler, biyografi ve görünürlük sinyalleriyle artar."],
                      ["Görünürlük seviyesi", (summary?.profile.is_premium || currentUser?.is_premium) ? "Premium" : "Standart", "Premium üyelik daha görünür vitrin açar."],
                      ["Ana beceriler", `${summary?.profile.skills?.length || currentUser?.skills?.length || 0}`, "Eşleşmelerde kullandığımız temel teknik sinyaller."],
                      ["İlgi alanları", `${summary?.profile.interests?.length || currentUser?.interests?.length || 0}`, "Hedef ve proje uyumunu güçlendiren alanlar."],
                    ].map(([label, value, note]) => (
                      <div key={String(label)} className="app-solid-card rounded-[1.75rem] p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/42">{label}</p>
                        <p className="mt-3 text-3xl font-extrabold text-white">{value}</p>
                        <p className="mt-2 text-sm leading-6 text-white/58">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    ["E-posta", summary?.profile.email || currentUser?.email || "-"],
                    ["Katılım Tarihi", formatJoinedDate(summary?.profile.date_joined || currentUser?.date_joined || "")],
                    ["Beceri haritası", (summary?.profile.skills || currentUser?.skills || []).join(", ") || "Henüz eklenmedi"],
                    ["İlgi haritası", (summary?.profile.interests || currentUser?.interests || []).join(", ") || "Henüz eklenmedi"],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="app-soft-card rounded-[1.6rem] p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/42">{label}</p>
                      <p className="mt-3 text-sm font-semibold leading-7 text-white">{value}</p>
                    </div>
                  ))}

                  <div className="app-solid-card rounded-[1.9rem] p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/42">Herkese Açık Profil</p>
                    <p className="mt-3 text-sm leading-7 text-white/68">
                      Diğer kullanıcıların seni nasıl gördüğünü, güven rozetlerini ve dışa açık vitrinin nasıl durduğunu buradan kontrol et.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button type="button" onClick={() => currentUser && openPublicProfile(currentUser.id)} className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary/90">
                        Açık Profilimi Gör
                      </button>
                      {onboardingNeeded && (
                        <button type="button" onClick={() => setOnboardingOpen(true)} className="rounded-2xl border border-white/12 bg-white/6 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                          Profil Sinyalini Güçlendir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!summary?.profile.is_premium && !currentUser?.is_premium ? (
              <div className="app-panel rounded-[2rem] border-primary/18 p-6 shadow-halo backdrop-blur">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9ab0ff]">Premium</p>
                <h3 className="mt-2 text-2xl font-extrabold text-white">YZ Ekip Kurucu ve verified başvurusu için premium'a geç</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-white/68">Premium hesabı aktive edildiğinde yapay zeka destekli aday sıralaması açılır, profil görünürlüğün yükselir ve mentörlerden birebir seans talep edebilirsin. Seanslar doğrudan güvenli ödeme sistemi ile rezerve edilir.</p>
                {billingFeedback && <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-[#c7d3ff]">{billingFeedback}</div>}
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href="#premium" className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90">Premium Sayfasına Git</a>
                  <button type="button" onClick={() => startPremiumSimulation("monthly")} className="rounded-2xl border border-white/12 bg-white/6 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                    Hızlı Aylık Aktivasyon
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="app-panel rounded-[2rem] border-primary/18 p-6 shadow-halo backdrop-blur">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9ab0ff]">Premium</p>
                  <h3 className="mt-2 text-2xl font-extrabold text-white">Premium aktif</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-white/68">
                    YZ Ekip Kurucu, Doğrulanmış Yetenek başvurusu ve mentörlere güvenli ödeme seansları ile erişim gibi tüm premium ayrıcalıklara sahipsiniz.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a href="#premium" className="rounded-2xl border border-white/12 bg-white/6 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                      Üyeliğimi Yönet
                    </a>
                  </div>
                </div>
                <div className="app-panel rounded-[2rem] border-amber-300/25 p-6 shadow-halo backdrop-blur">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-300/75">Doğrulanmış Yetenek Başvurusu</p>
                  <h3 className="mt-2 text-2xl font-extrabold text-white">Yeteneklerini doğrula ve vitrinde öne çık</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-white/68">Premium üye olduğun için doğrulanmış yetenek rozetine başvurabilirsin. Onaylandığında profilindeki güven sinyali daha güçlü görünür ve eşleşme kaliten yükselir.</p>
                  <form className="mt-6 space-y-4" onSubmit={handleVerifiedSubmit}>
                    <input type="text" required placeholder="Başvurduğun unvan" value={verifiedForm.requested_title} onChange={(e) => setVerifiedForm({ ...verifiedForm, requested_title: e.target.value })} className="app-input" />
                    <input type="url" required placeholder="Portfolyo URL" value={verifiedForm.portfolio_url} onChange={(e) => setVerifiedForm({ ...verifiedForm, portfolio_url: e.target.value })} className="app-input" />
                    <textarea placeholder="Eklemek istediğin notlar..." value={verifiedForm.note} onChange={(e) => setVerifiedForm({ ...verifiedForm, note: e.target.value })} className="app-input min-h-24" />
                    {verifiedFeedback && <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">{verifiedFeedback}</div>}
                    <button type="submit" className="rounded-2xl bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-halo transition hover:bg-amber-600">Rozet Başvurusu Yap</button>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}

        {route === "app-member" && (
          <section className="space-y-6">
            {publicProfileLoading ? (
              <div className="app-panel rounded-[2rem] p-8 shadow-halo backdrop-blur">
                <p className="text-sm text-white/60">Profil yükleniyor…</p>
              </div>
            ) : publicProfile ? (
              <>
                <div className="app-panel relative overflow-hidden rounded-[2rem] p-8 shadow-halo backdrop-blur">
                  <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(71,93,178,0.18),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(63,177,112,0.12),transparent_26%)]" />
                  <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9ab0ff]">Üye Profili</p>
                      <h2 className="mt-2 text-4xl font-extrabold text-white">{publicProfile.full_name}</h2>
                      <p className="mt-2 text-base text-white/62">
                        {publicProfile.title}
                        {publicProfile.is_verified_talent ? " · Doğrulanmış Yetenek" : ""}
                        {publicProfile.is_premium ? " · Premium" : ""}
                      </p>
                      <p className="mt-4 text-sm leading-7 text-white/68">{publicProfile.bio || "Bu kullanıcı henüz biyografi eklememiş."}</p>
                      
                      {currentUser && currentUser.id !== publicProfile.id && publicProfile.active_application_id && (
                        <button
                          type="button"
                          onClick={() => {
                            loadThreadDetail(publicProfile.active_application_id!);
                            setRoute("app-messages");
                          }}
                          className="mt-5 flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90"
                        >
                          <span className="text-base">💬</span> Sohbet Başlat / Mesaj Gönder
                        </button>
                      )}
                    </div>
                    <div className="grid min-w-[280px] gap-3 sm:grid-cols-2">
                      <div className="app-soft-card rounded-2xl p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/42">Ortalama Puan</p>
                        <p className="mt-2 text-2xl font-extrabold text-white">{publicProfile.average_rating ? `${publicProfile.average_rating}/5` : "-"}</p>
                      </div>
                      <div className="app-soft-card rounded-2xl p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/42">Yorum Sayısı</p>
                        <p className="mt-2 text-2xl font-extrabold text-white">{publicProfile.reviews_count}</p>
                      </div>
                      <div className="app-soft-card rounded-2xl p-4 sm:col-span-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/42">Katılım Tarihi</p>
                        <p className="mt-2 text-base font-bold text-white">{formatJoinedDate(publicProfile.date_joined)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <div className="app-soft-card rounded-2xl p-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-white/42">Yetenekler</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {publicProfile.skills.length ? publicProfile.skills.map((skill) => (
                          <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{skill}</span>
                        )) : <span className="text-sm text-white/58">Yetenek bilgisi yok.</span>}
                      </div>
                    </div>
                    <div className="app-soft-card rounded-2xl p-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-white/42">İlgi Alanları</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {publicProfile.interests.length ? publicProfile.interests.map((interest) => (
                          <span key={interest} className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">{interest}</span>
                        )) : <span className="text-sm text-white/58">İlgi alanı bilgisi yok.</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                  <section className="app-panel rounded-[2rem] p-6 shadow-halo backdrop-blur">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9ab0ff]">Son Projeler</p>
                    <div className="mt-4 space-y-3">
                      {publicProfile.recent_projects.length ? publicProfile.recent_projects.map((project) => (
                        <article key={project.id} className="app-solid-card rounded-2xl p-4">
                          <p className="font-bold text-white">{project.title}</p>
                          <p className="mt-2 text-sm leading-6 text-white/62">{project.summary}</p>
                        </article>
                      )) : (
                        <div className="rounded-2xl border border-dashed border-white/12 bg-black/20 p-4 text-sm text-white/55">Görüntülenecek proje yok.</div>
                      )}
                    </div>
                  </section>

                  <section className="app-panel rounded-[2rem] p-6 shadow-halo backdrop-blur">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9ab0ff]">Yorumlar ve Puanlar</p>
                    {publicProfileFeedback && <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-[#c7d3ff]">{publicProfileFeedback}</div>}
                    <div className="mt-4 space-y-3">
                      {publicProfile.reviews.length ? publicProfile.reviews.map((review) => (
                        <article key={review.id} className="app-solid-card rounded-2xl p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <button type="button" onClick={() => openPublicProfile(review.reviewer.id)} className="font-bold text-white transition hover:text-[#9ab0ff]">{review.reviewer.full_name}</button>
                              <p className="mt-1 text-xs uppercase tracking-widest text-white/42">{review.project.title}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-amber-500">{renderStars(review.rating)}</p>
                              <p className="mt-1 text-xs text-white/42">{formatJoinedDate(review.created_at)}</p>
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-white/68">{review.comment}</p>
                        </article>
                      )) : (
                        <div className="rounded-2xl border border-dashed border-white/12 bg-black/20 p-4 text-sm text-white/55">Bu kullanıcı için henüz yorum yok.</div>
                      )}
                    </div>

                    {currentUser && publicProfile.eligible_review_applications.length > 0 && (
                      <form className="mt-6 space-y-4 rounded-2xl border border-primary/20 bg-primary/10 p-5" onSubmit={handleCreateReview}>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/60">Birlikte Çalışma Yorumu</p>
                        
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/50">Proje Seçimi</label>
                          <select value={reviewForm.application_id} onChange={(e) => setReviewForm((current) => ({ ...current, application_id: e.target.value }))} className="app-input" required>
                            {publicProfile.eligible_review_applications.map((item) => (
                              <option key={item.application_id} value={item.application_id}>{item.project_title}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-white/50">İletişim</label>
                            <select value={reviewForm.communication} onChange={(e) => setReviewForm((current) => ({ ...current, communication: Number(e.target.value) }))} className="app-input">
                              {[5, 4, 3, 2, 1].map((rating) => (
                                <option key={rating} value={rating}>{rating} Puan</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-white/50">Takım Çalışması</label>
                            <select value={reviewForm.teamwork} onChange={(e) => setReviewForm((current) => ({ ...current, teamwork: Number(e.target.value) }))} className="app-input">
                              {[5, 4, 3, 2, 1].map((rating) => (
                                <option key={rating} value={rating}>{rating} Puan</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-white/50">Güvenilirlik</label>
                            <select value={reviewForm.reliability} onChange={(e) => setReviewForm((current) => ({ ...current, reliability: Number(e.target.value) }))} className="app-input">
                              {[5, 4, 3, 2, 1].map((rating) => (
                                <option key={rating} value={rating}>{rating} Puan</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-white/50">Teknik Yetkinlik</label>
                            <select value={reviewForm.technical} onChange={(e) => setReviewForm((current) => ({ ...current, technical: Number(e.target.value) }))} className="app-input">
                              {[5, 4, 3, 2, 1].map((rating) => (
                                <option key={rating} value={rating}>{rating} Puan</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/50">Yorumunuz</label>
                          <textarea value={reviewForm.comment} onChange={(e) => setReviewForm((current) => ({ ...current, comment: e.target.value }))} placeholder="Birlikte çalışma deneyimini kısaca yaz." className="app-input min-h-28" required />
                        </div>
                        
                        <p className="text-xs text-white/42 italic">* Değerlendirme kriterlerinin ortalaması genel puanı belirleyecektir.</p>
                        
                        <button type="submit" className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90">Yorumu Kaydet</button>
                      </form>
                    )}
                  </section>
                </div>
              </>
            ) : (
              <div className="app-panel rounded-[2rem] p-8 shadow-halo backdrop-blur">
                <p className="text-sm text-white/60">{publicProfileFeedback || "Profil bulunamadı."}</p>
              </div>
            )}
          </section>
        )}

        {route === "app-ai-builder" && (
          <section className="app-panel relative overflow-hidden rounded-[2.25rem] p-8 shadow-halo backdrop-blur lg:p-10">
            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9ab0ff]">Yapay Zeka</p>
              <h2 className="mt-2 text-3xl font-extrabold text-white">AI Takım Kurucu</h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-white/68">Projen için en uyumlu takım arkadaşlarını, kayıt olurken verdiğin profil sinyalleri ve proje ihtiyaçları üzerinden saniyeler içinde bul.</p>
            </div>

            {(!summary?.profile.is_premium && !currentUser?.is_premium) ? (
              <div className="relative mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(71,93,178,0.2),transparent_34%),linear-gradient(180deg,rgba(8,14,25,0.96),rgba(6,11,20,0.98))] p-7 text-white shadow-[0_24px_80px_rgba(0,0,0,0.26)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-xl font-black">
                      AI
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">Premium erişim gerekli</p>
                      <h3 className="mt-1 text-2xl font-extrabold">YZ Ekip Kurucu'yu aktive et</h3>
                    </div>
                  </div>
                  <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
                    Standart planda temel proje ve profil akışlarını kullanırsın. Premium ile YZ destekli aday sıralaması, eşleşme gerekçeleri ve daha nitelikli öneri akışı açılır.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {["Beceri uyumu analizi", "Hedef hizalaması", "Neden eşleşti açıklamaları"].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/8 bg-white/6 px-4 py-4 text-sm font-semibold text-white/82 backdrop-blur">
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a href="#premium" className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#071121] transition hover:bg-[#DDE5FF]">
                      Premium'u Aç
                    </a>
                    <a href="#app-profile" className="rounded-2xl border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                      Profilimi Düzenle
                    </a>
                  </div>
                </section>

                <section className="rounded-[2rem] border border-white/10 bg-white/5 p-7 text-white backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/42">Eşleşme nasıl çalışır?</p>
                  <div className="mt-5 space-y-4">
                    {[
                      ["Kayıt bilgileri temel alınır", "Rol, beceri, ilgi alanı ve biyografi bilgilerin eşleşme motoruna sinyal verir."],
                      ["Projeyle çapraz analiz yapılır", "Açık roller ve ihtiyaçlar aday havuzuyla birlikte değerlendirilir."],
                      ["En uygun adaylar sıralanır", "Teknik uyum kadar tempo ve hedef uyumu da dikkate alınır."],
                    ].map(([title, body]) => (
                      <article key={String(title)} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                        <p className="font-bold text-white">{title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <div className="mt-8 space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    ["Eşleşme boyutları", "Beceri, rol, ilgi"],
                    ["Karar hızı", "10 saniyenin altında"],
                    ["Çıktı kalitesi", "Neden eşleşti açıklamaları"],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="app-solid-card rounded-2xl p-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-white/42">{label}</p>
                      <p className="mt-3 text-lg font-extrabold text-white">{value}</p>
                    </div>
                  ))}
                </div>

                {aiAnalysisState === "idle" && (
                    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                      <div className="app-solid-card rounded-[2rem] border-primary/20 p-8">
                        <p className="text-lg font-bold text-[#9ab0ff]">Analiz için Proje Seçin</p>
                      <p className="mt-2 max-w-md text-sm text-white/68">Kendi oluşturduğun projelerden birini seçerek sana en uygun adayları gerekçeleriyle listele.</p>
                      <div className="mt-6 w-full text-left">
                        <select value={aiSelectedProjectId || ""} onChange={(e) => setAiSelectedProjectId(Number(e.target.value))} className="app-input">
                          <option value="" disabled>Proje seçiniz...</option>
                          {publicProjects.filter((p) => p.owner.id === currentUser?.id).map((p) => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                          ))}
                        </select>
                      </div>
                      <button onClick={runAiAnalysis} disabled={!aiSelectedProjectId} className="mt-6 rounded-2xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
                        Analizi Başlat
                      </button>
                      {publicProjects.filter((p) => p.owner.id === currentUser?.id).length === 0 && <p className="mt-4 text-sm font-semibold text-red-300">Önce bir proje oluşturmalısın.</p>}
                    </div>
                    <div className="app-solid-card rounded-[2rem] p-8 text-white">
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">Skorlama nasıl çalışır?</p>
                      <div className="mt-5 space-y-4">
                        {[
                          ["Teknik örtüşme", "Adayın beceri setinin proje ihtiyaçlarınla ne kadar uyuştuğu."],
                          ["Hedef hizalaması", "İlgi alanları ve proje niyetinin senin misyonunla ne kadar örtüştüğü."],
                          ["Doğrulanmış sinyal", "Doğrulanmış yetenek rozeti ve profil gücü gibi güven arttıran sinyaller."],
                        ].map(([label, body]) => (
                          <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/6 p-4">
                            <p className="font-bold text-white">{label}</p>
                            <p className="mt-2 text-sm leading-7 text-slate-300">{body}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {aiAnalysisState === "analyzing" && (
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center flex flex-col items-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
                    <p className="text-lg font-bold text-primary animate-pulse">Aday Havuzu Taranıyor...</p>
                  </div>
                )}
                {aiAnalysisState === "done" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-ink">Önerilen Takım Arkadaşları</h3>
                      <button onClick={() => setAiAnalysisState("idle")} className="text-sm font-semibold text-primary hover:underline">Farklı Proje Analiz Et</button>
                    </div>
                    {aiMatches.length === 0 ? (
                      <div className="app-solid-card rounded-2xl p-5 text-center text-sm text-white/62">Eşleşen aday bulunamadı. Proje özetini ve aradığın rolleri biraz daha netleştir.</div>
                    ) : (
                      <div className="grid gap-4 xl:grid-cols-2">
                        {aiMatches.map((match) => (
                          <div key={match.user.id} className="app-solid-card rounded-[2rem] p-6 transition hover:border-primary/30">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="flex items-center gap-1 font-bold text-white">
                                  {match.user.full_name}
                                  {match.user.is_verified_talent && <span className="text-xs text-primary" title="Doğrulanmış Yetenek">Doğrulanmış</span>}
                                </p>
                                <p className="text-sm text-white/60">{match.recommended_role || match.user.title}</p>
                              </div>
                              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">%{Math.round(match.score)} Uyum</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-white/68">{match.ai_summary}</p>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <div className="app-soft-card rounded-2xl p-4">
                                <p className="text-xs font-bold uppercase tracking-widest text-white/40">Eşleşen beceriler</p>
                                <p className="mt-2 text-sm font-semibold text-white">{match.matched_skills.join(", ") || "-"}</p>
                              </div>
                              <div className="app-soft-card rounded-2xl p-4">
                                <p className="text-xs font-bold uppercase tracking-widest text-white/40">Neden bu aday?</p>
                                <p className="mt-2 text-[13px] font-semibold text-white">
                                  {match.score >= 90
                                    ? "Proje vizyonunuzla ve teknik gereksinimlerinizle mükemmel seviyede eşleşiyor."
                                    : match.score >= 80
                                    ? "İhtiyaç duyduğunuz teknik altyapıya sahip, güçlü bir aday profili çiziyor."
                                    : match.score >= 70
                                    ? "Temel becerilerde uyum sağlıyor, proje detayları üzerine görüşülebilir."
                                    : "İlgili alanlarda deneyimi olan, potansiyel olarak değerlendirilebilecek bir aday."}
                                </p>
                              </div>
                            </div>
                            <button onClick={() => openPublicProfile(match.user.id)} className="mt-5 w-full rounded-xl border border-white/12 bg-white/6 py-3 text-sm font-bold text-white transition hover:bg-primary hover:border-primary">Profili İncele</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {route === "app-networking" && (
          <EventsView events={showcaseData.events} loading={publicLoading} showRegister={true} accessToken={marketingAccessToken} />
        )}

        {route === "app-mentors" && (
          <MentorsView
            mentors={mentors}
            onSendRequest={handleMentorRequest}
            onConfirmRequest={handleConfirmMentorRequest}
            userRequests={userRequests}
            feedback={mentorFeedback}
            credits={summary?.profile.mentor_credits || 0}
            isPremium={isPremium}
          />
        )}

        {route === "app-mentor-panel" && isMentor && (
          <MentorPanelView 
            requests={mentorRequests} 
            onStatusUpdate={handleMentorRequestStatus}
            mentor={summary?.profile || currentUser}
            feedback={mentorFeedback}
          />
        )}

        {route === "app-admin" && isAdmin && (
          <section className="app-panel rounded-[2.25rem] p-8 lg:p-10 border border-white/10 bg-white/5 backdrop-blur-md">
            <p className="app-section-eyebrow text-sm font-bold uppercase tracking-[0.2em] text-[#9ab0ff]">
              Yönetim Paneli
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-white">
              Sistem Yönetimi, Moderasyon ve Denetim
            </h2>
            <p className="app-section-copy mt-3 max-w-3xl text-sm text-slate-300">
              Tüm kullanıcı, proje, mentor ve etkinlik yönetimi tek bir noktadan, güvenli bir şekilde gerçekleştirilir.
            </p>

            {/* KPI Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[
                ["Toplam Kullanıcı", adminDashboard?.totals.users_count ?? 0],
                ["Oluşturulan Projeler", adminDashboard?.totals.projects_count ?? 0],
                ["Premium Üyeler", adminDashboard?.totals.premium_users_count ?? 0],
              ].map(([label, value]) => (
                <article
                  key={String(label)}
                  className="app-kpi-card rounded-2xl p-5 bg-white/6 border border-white/10"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50">
                    {label}
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-white">{value}</p>
                </article>
              ))}
            </div>

            {/* Tabs Selector */}
            <div className="mt-8 border-b border-white/10 flex gap-6 overflow-x-auto">
              {[
                { id: "users", label: "Kullanıcı Yönetimi" },
                { id: "projects", label: "Proje Yönetimi" },
                { id: "events", label: "Etkinlik Yönetimi" },
                { id: "guides", label: "Makale Yönetimi" },
                { id: "mentors", label: "Mentör Yönetimi" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id as any)}
                  className={`pb-4 text-sm font-bold border-b-2 transition whitespace-nowrap ${
                    adminTab === tab.id
                      ? "border-primary text-primary animate-pulse-subtle"
                      : "border-transparent text-white/60 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {adminFeedback && (
              <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-[#c7d3ff]">
                {adminFeedback}
              </div>
            )}

            {/* Tab: Users */}
            {adminTab === "users" && (
              <div className="mt-8 grid gap-8 xl:grid-cols-[0.48fr_0.52fr]">
                <div>
                  <div className="flex gap-4 mb-6">
                    <input
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      placeholder="Ad soyad veya e-posta ile kullanıcı ara"
                      className="app-input w-full bg-black/20 border border-white/10 text-white rounded-xl placeholder-white/30"
                    />
                    <button
                      type="button"
                      onClick={() => loadAdminUsers(adminSearch)}
                      className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90 border-none outline-none"
                    >
                      Ara
                    </button>
                  </div>
                  <div className="space-y-4">
                    {nonMentorAdminUsers.map((user) => (
                      <article key={user.id} className={`app-subpanel rounded-2xl p-5 border transition ${selectedAdminUser?.id === user.id ? 'border-primary bg-white/10' : 'border-white/10 bg-white/6 hover:bg-white/8'}`}>
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <p className="text-lg font-bold text-white">{user.full_name}</p>
                            <p className="mt-1 text-sm text-slate-300">{user.email}</p>
                            <p className="mt-1 text-sm text-slate-300">{user.title}</p>
                            <div className="mt-2 flex gap-2 flex-wrap">
                              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">
                                {user.is_superuser
                                  ? "Superuser"
                                  : user.is_staff
                                    ? "Admin"
                                    : user.is_mentor
                                      ? "Mentör"
                                      : "Kullanıcı"}
                              </span>
                              {user.is_verified_talent && (
                                <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
                                  Onaylı
                                </span>
                              )}
                              {user.is_premium && (
                                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-500">
                                  Premium
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => loadAdminUserDetail(user.id)}
                              className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                            >
                              İncele & Düzenle
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                    {!nonMentorAdminUsers.length && (
                      <div className="text-center p-8 text-slate-400 border border-dashed border-white/10 rounded-2xl">
                        Kullanıcı yönetiminde listelenecek standart kullanıcı bulunamadı.
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  {/* User Details */}
                  <div className="app-subpanel rounded-2xl p-5 border border-white/10 bg-white/6">
                    <h3 className="text-lg font-extrabold text-white">Kullanıcı Moderasyonu</h3>
                    {selectedAdminUser ? (
                      <div className="mt-4 space-y-5">
                        <div>
                          <p className="text-xl font-bold text-white">{selectedAdminUser.full_name}</p>
                          <p className="mt-1 text-sm text-slate-300">{selectedAdminUser.email}</p>
                          <p className="mt-1 text-sm text-slate-300">{selectedAdminUser.title || "Unvan belirtilmemiş"}</p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl bg-white/6 border border-white/10 p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-white/50">Hesap Durumu</p>
                            <p className="mt-2 font-bold text-white">
                              {selectedAdminUser.is_active ? "Aktif" : "Askıya Alınmış"}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-white/6 border border-white/10 p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-white/50">Yetenek Doğrulama</p>
                            <p className="mt-2 font-bold text-white">
                              {selectedAdminUser.is_verified_talent ? "Onaylı Yetenek" : "Standart Hesap"}
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
                            className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                          >
                            {selectedAdminUser.is_active ? "Askıya Al" : "Aktif Et"}
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
                              ? "Doğrulanmış Rozeti Kaldır"
                              : "Doğrulanmış Rozeti Ver"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleUserModeration(selectedAdminUser.id, {
                                is_premium: !selectedAdminUser.is_premium,
                              })
                            }
                            className="rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-500 transition hover:bg-amber-500/15"
                          >
                            {selectedAdminUser.is_premium ? "Premium İptal Et" : "Premium Yap"}
                          </button>
                          {!selectedAdminUser.is_superuser && (
                            <button
                              type="button"
                              onClick={() => handleUserDelete(selectedAdminUser.id)}
                              className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500/15"
                            >
                              Kullanıcıyı Sil
                            </button>
                          )}
                        </div>


                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-slate-400">
                        Detaylı moderasyon aksiyonları için listeden bir kullanıcı seçin.
                      </p>
                    )}
                  </div>

                  {/* Verification requests approval */}
                  <div className="app-subpanel rounded-2xl p-5 border border-white/10 bg-white/6">
                    <h3 className="text-lg font-extrabold text-white">Yetenek Doğrulama Talepleri</h3>
                    <div className="mt-4 space-y-3">
                      {verificationRequests.length ? (
                        verificationRequests.map((item) => (
                          <article key={item.id} className="rounded-2xl bg-white/6 p-4 shadow-sm border border-white/10">
                            <p className="font-bold text-white">{item.user.full_name}</p>
                            <p className="mt-1 text-sm text-slate-300">Unvan Talebi: {item.requested_title}</p>
                            <p className="mt-2 text-sm text-slate-300 bg-black/20 p-3 rounded-xl italic">"{item.note || "Açıklama belirtilmemiş."}"</p>
                            {item.portfolio_url && (
                              <p className="mt-2 text-sm text-primary font-semibold">
                                Portfolyo: <a href={item.portfolio_url} target="_blank" rel="noopener noreferrer" className="hover:underline">{item.portfolio_url}</a>
                              </p>
                            )}
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
                                className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500/15"
                              >
                                Reddet
                              </button>
                            </div>
                          </article>
                        ))
                      ) : (
                        <div className="rounded-2xl bg-white/4 p-4 text-sm text-slate-400 text-center border border-dashed border-white/10">
                          Bekleyen yetenek doğrulama talebi bulunmamaktadır.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Projects */}
            {adminTab === "projects" && (
              <div className="mt-8 grid gap-8 xl:grid-cols-[0.55fr_0.45fr]">
                <div>
                  <div className="flex gap-4 mb-6">
                    <input
                      value={adminProjectSearch}
                      onChange={(e) => setAdminProjectSearch(e.target.value)}
                      placeholder="Proje adı veya kurucu adı ile ara"
                      className="app-input w-full bg-black/20 border border-white/10 text-white rounded-xl placeholder-white/30"
                    />
                    <button
                      type="button"
                      onClick={() => loadAdminProjects(adminProjectSearch)}
                      className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90 border-none outline-none"
                    >
                      Ara
                    </button>
                  </div>

                  <div className="space-y-4">
                    {adminProjects.length ? (
                      adminProjects.map((project) => (
                        <article key={project.id} className={`app-subpanel rounded-2xl p-5 border transition ${selectedAdminProject?.id === project.id ? 'border-primary bg-white/10' : 'border-white/10 bg-white/6 hover:bg-white/8'}`}>
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                              <p className="text-lg font-bold text-white">{project.title}</p>
                              <p className="mt-1 text-sm text-slate-300">Kurucu: {project.owner.full_name}</p>
                              <p className="mt-1 text-sm text-slate-300">{project.summary}</p>
                              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/50">
                                Başvuru: {project.applications_count} · Ekip: {project.accepted_applications_count}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => loadAdminProjectDetail(project.id)}
                                className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                              >
                                Detaylar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleProjectDelete(project.id)}
                                className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500/15"
                              >
                                Sil
                              </button>
                            </div>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="text-center p-8 text-slate-400">Kayıtlı proje bulunamadı.</div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="app-subpanel rounded-2xl p-5 border border-white/10 bg-white/6">
                    <h3 className="text-lg font-extrabold text-white">Proje Detayları</h3>
                    {selectedAdminProject ? (
                      <div className="mt-4 space-y-4">
                        <div>
                          <h4 className="text-xl font-bold text-white">{selectedAdminProject.title}</h4>
                          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                            {selectedAdminProject.problem_statement || "Açıklama belirtilmemiş."}
                          </p>
                        </div>
                        <div className="border-t border-white/10 pt-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-white/55 mb-1">Kullanılan Teknolojiler</p>
                          <p className="text-sm font-semibold text-white">
                            {(selectedAdminProject.tech_stack || []).join(", ") || "-"}
                          </p>
                        </div>
                        <div className="border-t border-white/10 pt-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-white/55 mb-3">Ekip Başvuruları ({selectedAdminProject.applications?.length ?? 0})</p>
                          <div className="space-y-3">
                            {(selectedAdminProject.applications || []).map((application) => (
                              <div key={application.id} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-xs">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-bold text-white">{application.applicant.full_name}</span>
                                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${
                                    application.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                                  }`}>{application.status}</span>
                                </div>
                                <p className="text-slate-300 mt-1">"{application.message}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-slate-400">
                        Detayları ve başvuruları görüntülemek için soldan bir proje seçin.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Events */}
            {adminTab === "events" && (
              <div className="mt-8 grid gap-8 xl:grid-cols-[0.55fr_0.45fr]">
                {/* Events list */}
                <div>
                  <h3 className="text-lg font-extrabold text-white mb-4">Sistemdeki Etkinlikler</h3>
                  {adminEventFeedback && (
                    <div className="mb-4 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2.5 text-xs text-[#c7d3ff]">
                      {adminEventFeedback}
                    </div>
                  )}
                  <div className="space-y-4">
                    {adminEvents.length ? (
                      adminEvents.map((event) => (
                        <article key={event.id} className="app-subpanel rounded-2xl p-5 border border-white/10 bg-white/6 hover:bg-white/8 transition">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                              <div className="flex gap-2 items-center">
                                <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
                                  {event.tag}
                                </span>
                                {event.is_online && (
                                  <span className="rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-bold text-green-400">
                                    Online
                                  </span>
                                )}
                              </div>
                              <p className="mt-2 text-lg font-bold text-white">{event.title}</p>
                              <p className="mt-1 text-sm text-slate-300">{event.description}</p>
                              <p className="mt-2 text-xs font-semibold text-slate-400">
                                Tarih: {new Date(event.event_date).toLocaleString('tr-TR')} · Konum: {event.location}
                              </p>
                            </div>
                            <div>
                              <button
                                type="button"
                                onClick={() => handleDeleteAdminEvent(event.id)}
                                className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500/15"
                              >
                                Etkinliği Sil
                              </button>
                            </div>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="text-center p-8 text-slate-400 border border-dashed border-white/10 rounded-2xl">
                        Sistemde kayıtlı etkinlik bulunamadı. Sağdaki formdan ilk etkinliği ekleyin!
                      </div>
                    )}
                  </div>
                </div>

                {/* Create Event Form */}
                <div>
                  <div className="app-subpanel rounded-2xl p-5 border border-white/10 bg-white/6">
                    <h3 className="text-lg font-extrabold text-white">Yeni Etkinlik Ekle</h3>
                    <form onSubmit={handleCreateAdminEvent} className="mt-4 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-white/60 uppercase mb-1">Etkinlik Başlığı</label>
                        <input
                          required
                          value={adminEventForm.title}
                          onChange={(e) => setAdminEventForm({ ...adminEventForm, title: e.target.value })}
                          placeholder="Örn: Founders Meetup #1"
                          className="app-input bg-black/20 w-full border border-white/10 text-white rounded-xl placeholder-white/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/60 uppercase mb-1">Açıklama</label>
                        <textarea
                          required
                          rows={3}
                          value={adminEventForm.description}
                          onChange={(e) => setAdminEventForm({ ...adminEventForm, description: e.target.value })}
                          placeholder="Etkinlik detayları ve gündemi..."
                          className="app-input bg-black/20 w-full border border-white/10 text-white rounded-xl placeholder-white/30"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold text-white/60 uppercase mb-1">Kategori / Tag</label>
                          <select
                            value={adminEventForm.tag}
                            onChange={(e) => setAdminEventForm({ ...adminEventForm, tag: e.target.value })}
                            className="app-input bg-black/20 w-full text-white border border-white/10 rounded-xl"
                          >
                            <option value="Workshop" className="bg-slate-900">Workshop</option>
                            <option value="Meetup" className="bg-slate-900">Meetup</option>
                            <option value="Panel" className="bg-slate-900">Panel</option>
                            <option value="Networking" className="bg-slate-900">Networking</option>
                            <option value="Hackathon" className="bg-slate-900">Hackathon</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-white/60 uppercase mb-1">Tarih</label>
                          <input
                            required
                            type="datetime-local"
                            value={adminEventForm.event_date}
                            onChange={(e) => setAdminEventForm({ ...adminEventForm, event_date: e.target.value })}
                            className="app-input bg-black/20 w-full text-sm text-white border border-white/10 rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold text-white/60 uppercase mb-1">Konum / Link</label>
                          <input
                            required
                            value={adminEventForm.location}
                            onChange={(e) => setAdminEventForm({ ...adminEventForm, location: e.target.value })}
                            placeholder="Zoom Link veya Fiziksel Adres"
                            className="app-input bg-black/20 w-full border border-white/10 text-white rounded-xl placeholder-white/30"
                          />
                        </div>
                        <div className="flex items-center h-full pt-6">
                          <label className="flex items-center gap-2 cursor-pointer text-white">
                            <input
                              type="checkbox"
                              checked={adminEventForm.is_online}
                              onChange={(e) => setAdminEventForm({ ...adminEventForm, is_online: e.target.checked })}
                              className="w-4 h-4 text-primary rounded border-white/20 focus:ring-primary bg-black/20"
                            />
                            <span className="text-sm font-semibold text-white">Online Etkinlik</span>
                          </label>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded-2xl bg-primary py-3 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90 border-none outline-none"
                      >
                        Etkinlik Oluştur
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {adminTab === "guides" && (
              <div className="mt-8 grid gap-8 xl:grid-cols-[0.55fr_0.45fr]">
                <div>
                  <h3 className="text-lg font-extrabold text-white mb-4">Girişim Merkezi Makaleleri</h3>
                  {adminGuideFeedback && (
                    <div className="mb-4 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2.5 text-xs text-[#c7d3ff]">
                      {adminGuideFeedback}
                    </div>
                  )}
                  <div className="space-y-4">
                    {adminGuides.length ? (
                      adminGuides.map((guide) => (
                        <article key={guide.id} className="app-subpanel rounded-2xl p-5 border border-white/10 bg-white/6 hover:bg-white/8 transition">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <div className="flex flex-wrap gap-2 items-center">
                                <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">{guide.tone}</span>
                                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-white/75">{guide.read}</span>
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${guide.is_published ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-300"}`}>
                                  {guide.is_published ? "Yayında" : "Taslak"}
                                </span>
                              </div>
                              <p className="mt-3 text-lg font-bold text-white">{guide.title}</p>
                              <p className="mt-2 text-sm text-slate-300">{guide.summary}</p>
                              <p className="mt-2 text-xs text-white/45">{guide.bullets.length} madde</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleGuidePublish(guide)}
                                className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                              >
                                {guide.is_published ? "Taslağa Al" : "Yayınla"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAdminGuide(guide.id)}
                                className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500/15"
                              >
                                Sil
                              </button>
                            </div>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="text-center p-8 text-slate-400 border border-dashed border-white/10 rounded-2xl">
                        Henüz makale yok. Sağdaki formdan ilk makaleyi ekleyin.
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="app-subpanel rounded-2xl p-5 border border-white/10 bg-white/6">
                    <h3 className="text-lg font-extrabold text-white">Yeni Makale Ekle</h3>
                    <form onSubmit={handleCreateAdminGuide} className="mt-4 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-white/60 uppercase mb-1">Başlık</label>
                        <input
                          required
                          value={adminGuideForm.title}
                          onChange={(e) => setAdminGuideForm({ ...adminGuideForm, title: e.target.value })}
                          className="app-input bg-black/20 w-full border border-white/10 text-white rounded-xl"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold text-white/60 uppercase mb-1">Okuma Süresi</label>
                          <input
                            required
                            value={adminGuideForm.read}
                            onChange={(e) => setAdminGuideForm({ ...adminGuideForm, read: e.target.value })}
                            className="app-input bg-black/20 w-full border border-white/10 text-white rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-white/60 uppercase mb-1">Kategori</label>
                          <input
                            required
                            value={adminGuideForm.tone}
                            onChange={(e) => setAdminGuideForm({ ...adminGuideForm, tone: e.target.value })}
                            className="app-input bg-black/20 w-full border border-white/10 text-white rounded-xl"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/60 uppercase mb-1">Özet</label>
                        <textarea
                          required
                          rows={3}
                          value={adminGuideForm.summary}
                          onChange={(e) => setAdminGuideForm({ ...adminGuideForm, summary: e.target.value })}
                          className="app-input bg-black/20 w-full border border-white/10 text-white rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/60 uppercase mb-1">Madde İçeriği</label>
                        <textarea
                          required
                          rows={8}
                          value={adminGuideForm.bullets}
                          onChange={(e) => setAdminGuideForm({ ...adminGuideForm, bullets: e.target.value })}
                          placeholder="Her satıra bir madde yazın"
                          className="app-input bg-black/20 w-full border border-white/10 text-white rounded-xl"
                        />
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer text-white">
                        <input
                          type="checkbox"
                          checked={adminGuideForm.is_published}
                          onChange={(e) => setAdminGuideForm({ ...adminGuideForm, is_published: e.target.checked })}
                          className="w-4 h-4 text-primary rounded border-white/20 focus:ring-primary bg-black/20"
                        />
                        <span className="text-sm font-semibold text-white">Yayında Başlat</span>
                      </label>
                      <button type="submit" className="w-full rounded-2xl bg-primary py-3 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90">
                        Makaleyi Kaydet
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Mentors */}
            {adminTab === "mentors" && (
              <div className="mt-8 grid gap-8 xl:grid-cols-[0.55fr_0.45fr]">
                {/* Active Mentors list */}
                <div>
                  <h3 className="text-lg font-extrabold text-white mb-4">Sistemdeki Aktif Mentörler</h3>
                  <div className="space-y-4">
                    {adminMentors.length ? (
                      adminMentors.map((mentor) => (
                        <article key={mentor.id} className="app-subpanel rounded-2xl p-5 border border-white/10 bg-white/6 hover:bg-white/8 transition">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                              <div className="flex gap-2 items-center">
                                <p className="text-lg font-bold text-white">{mentor.full_name}</p>
                                <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
                                  {formatTRY(mentor.mentor_price)}/Saat
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-slate-300">{mentor.email}</p>
                              <p className="mt-1 text-sm text-slate-300">{mentor.title || "Unvan belirtilmemiş"}</p>
                              <div className="mt-2 flex gap-2 flex-wrap">
                                {mentor.is_verified_talent && (
                                  <span className="rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-bold text-green-400">
                                    Doğrulanmış
                                  </span>
                                )}
                                {mentor.is_premium && (
                                  <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-500">
                                    Premium
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 items-end">
                              <div className="w-24">
                                <label className="block text-[8px] font-bold text-white/55 uppercase mb-0.5">Ücret (TL)</label>
                                <input
                                  type="number"
                                  value={mentor.mentor_price}
                                  onChange={(e) => handleUserModeration(mentor.id, { is_mentor: true, mentor_price: Number(e.target.value) })}
                                  className="w-full rounded-xl border border-white/10 bg-black/20 px-2 py-1 text-xs text-white outline-none focus:border-primary"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleUserModeration(mentor.id, { is_mentor: false })}
                                className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500/15"
                              >
                                Kaldır
                              </button>
                            </div>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="text-center p-8 text-slate-400 border border-dashed border-white/10 rounded-2xl">
                        Sistemde kayıtlı mentör bulunamadı. Sağdaki formdan manuel mentör ekleyebilirsiniz.
                      </div>
                    )}
                  </div>
                </div>

                {/* Manual Mentor Add Form */}
                <div>
                  <div className="app-subpanel rounded-2xl p-5 border border-white/10 bg-white/6 shadow-halo">
                    <h3 className="text-lg font-extrabold text-white">Manuel Mentör Ekle</h3>
                    <p className="mt-2 text-sm text-slate-300">
                      Sisteme sıfırdan yeni bir resmi mentör profili ekleyebilirsiniz.
                    </p>
                    {manualMentorFeedback && (
                      <div className="mt-4 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2 text-xs text-[#c7d3ff]">
                        {manualMentorFeedback}
                      </div>
                    )}
                    <form onSubmit={handleCreateManualMentor} className="mt-4 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-white/60 uppercase mb-1">Ad Soyad</label>
                        <input
                          required
                          type="text"
                          value={manualMentorForm.full_name}
                          onChange={(e) => setManualMentorForm({ ...manualMentorForm, full_name: e.target.value })}
                          placeholder="Örn: Kerem Tunç"
                          className="app-input w-full bg-black/20 border border-white/10 text-white rounded-xl placeholder-white/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/60 uppercase mb-1">E-posta</label>
                        <input
                          required
                          type="email"
                          value={manualMentorForm.email}
                          onChange={(e) => setManualMentorForm({ ...manualMentorForm, email: e.target.value })}
                          placeholder="Örn: mentor@foundrly.com"
                          className="app-input w-full bg-black/20 border border-white/10 text-white rounded-xl placeholder-white/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/60 uppercase mb-1">Şifre</label>
                        <input
                          required
                          type="password"
                          value={manualMentorForm.password}
                          onChange={(e) => setManualMentorForm({ ...manualMentorForm, password: e.target.value })}
                          placeholder="••••••••"
                          className="app-input w-full bg-black/20 border border-white/10 text-white rounded-xl placeholder-white/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/60 uppercase mb-1">Unvan</label>
                        <input
                          required
                          type="text"
                          value={manualMentorForm.title}
                          onChange={(e) => setManualMentorForm({ ...manualMentorForm, title: e.target.value })}
                          placeholder="Örn: Startup Mentörü & SaaS Uzmanı"
                          className="app-input w-full bg-black/20 border border-white/10 text-white rounded-xl placeholder-white/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/60 uppercase mb-1">Mentörlük Saat Ücreti ($)</label>
                        <input
                          required
                          type="number"
                          value={manualMentorForm.mentor_price}
                          onChange={(e) => setManualMentorForm({ ...manualMentorForm, mentor_price: Number(e.target.value) })}
                          placeholder="25"
                          className="app-input w-full bg-black/20 border border-white/10 text-white rounded-xl placeholder-white/30"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded-2xl bg-primary py-3 text-sm font-bold text-white shadow-halo transition hover:bg-primary/90 border-none outline-none"
                      >
                        Mentör Hesabı Oluştur
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
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
  const [publicProjects, setPublicProjects] = useState<ProjectCard[]>([]);
  const [publicMentors, setPublicMentors] = useState<any[]>([]);
  const [showcaseData, setShowcaseData] = useState<ShowcaseData>({
    projects: [],
    users: [],
    threads: [],
    events: [],
    guides: [],
  });
  const [publicLoading, setPublicLoading] = useState(false);
  const [premiumFeedback, setPremiumFeedback] = useState("");
  const [premiumLoading, setPremiumLoading] = useState(false);
  const [premiumSubscriptionState, setPremiumSubscriptionState] = useState<PremiumSubscriptionState | null>(null);
  const [marketingUser, setMarketingUser] = useState<CurrentUser | null>(() => {
    const stored = localStorage.getItem("foundrly_current_user");
    return stored ? (JSON.parse(stored) as CurrentUser) : null;
  });

  useEffect(() => {
    const stored = localStorage.getItem("foundrly_current_user");
    setMarketingUser(stored ? (JSON.parse(stored) as CurrentUser) : null);
  }, [route]);

  const loadPublicData = async () => {
    setPublicLoading(true);
    try {
      const showcaseHeaders = marketingAccessToken
        ? {
            Authorization: `Bearer ${marketingAccessToken}`,
          }
        : undefined;
      const requests: Promise<Response>[] = [
        fetch(API_BASE_URL + "/api/showcase/", showcaseHeaders ? { headers: showcaseHeaders } : undefined),
      ];
      if (marketingAccessToken) {
        requests.push(
          fetch(API_BASE_URL + "/api/mentors/", {
            headers: {
              Authorization: `Bearer ${marketingAccessToken}`,
            },
          }),
        );
      }

      const [showcaseResponse, mentorsResponse] = await Promise.all(requests);
      if (showcaseResponse.ok) {
        setShowcaseData((await showcaseResponse.json()) as ShowcaseData);
      }
      if (mentorsResponse?.ok) {
        setPublicMentors(await mentorsResponse.json());
      }
    } catch (e) {
    } finally {
      setPublicLoading(false);
    }
  };

  useEffect(() => {
    if (["discover", "teammates", "events", "community", "mentors", "app-networking"].includes(route)) {
      loadPublicData();
    }
  }, [route]);

  const loadPremiumSubscription = async () => {
    if (!marketingAccessToken) {
      setPremiumSubscriptionState(null);
      return;
    }
    try {
      const response = await fetch(API_BASE_URL + "/api/premium/subscription/", {
        headers: {
          Authorization: `Bearer ${marketingAccessToken}`,
        },
      });
      if (!response.ok) return;
      setPremiumSubscriptionState(await response.json());
    } catch {
    }
  };

  const handleScrollForHash = () => {
    const hash = window.location.hash;
    if (hash === "#pricing") {
      setTimeout(() => {
        const el = document.getElementById("pricing");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const prevRouteRef = useRef<RouteName | null>(null);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(getRouteFromHash());
      setTimeout(handleScrollForHash, 50);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (prevRouteRef.current !== route) {
      handleScrollForHash();
      prevRouteRef.current = route;
    }
  }, [route]);

  const marketingAccessToken = getStoredAccessToken();
  const isMember = Boolean(marketingAccessToken || marketingUser);
  const visibleNavLinks = NAV_LINKS;

  useEffect(() => {
    if (route === "premium" && !isMember) {
      window.location.hash = "#login?next=premium";
      return;
    }
    if (!isMember && MEMBERS_ONLY_ROUTES.has(route)) {
      window.location.hash = "#login";
    }
  }, [isMember, route]);

  useEffect(() => {
    if (route === "premium" && marketingAccessToken) {
      loadPremiumSubscription();
    }
  }, [route, marketingAccessToken]);

  const runPremiumSimulation = async (plan: "monthly" | "yearly") => {
    if (!marketingAccessToken) {
      window.location.hash = "#login?next=premium";
      return;
    }

    setPremiumLoading(true);
    setPremiumFeedback("");
    try {
      const response = await fetch(API_BASE_URL + "/api/premium/subscription/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${marketingAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      const meResponse = await fetch(API_BASE_URL + "/api/users/me/", {
        headers: {
          Authorization: `Bearer ${marketingAccessToken}`,
        },
      });

      if (meResponse.ok) {
        const me = await meResponse.json();
        setMarketingUser(me);
        localStorage.setItem("foundrly_current_user", JSON.stringify(me));
      }

      await loadPremiumSubscription();
      setPremiumFeedback("Ödeme alındı. Premium erişimin başarıyla aktif edildi.");
    } catch (error) {
      setPremiumFeedback(
        error instanceof Error ? error.message : "Premium aktivasyonu başlatılamadı.",
      );
    } finally {
      setPremiumLoading(false);
    }
  };

  const cancelPremiumSubscription = async () => {
    if (!marketingAccessToken) return;
    setPremiumLoading(true);
    setPremiumFeedback("");
    try {
      const response = await fetch(API_BASE_URL + "/api/premium/subscription/", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${marketingAccessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      const meResponse = await fetch(API_BASE_URL + "/api/users/me/", {
        headers: {
          Authorization: `Bearer ${marketingAccessToken}`,
        },
      });

      if (meResponse.ok) {
        const me = await meResponse.json();
        setMarketingUser(me);
        localStorage.setItem("foundrly_current_user", JSON.stringify(me));
      }

      await loadPremiumSubscription();
      setPremiumFeedback("Premium üyeliğin iptal edildi. Hesabın standart plana döndü.");
    } catch (error) {
      setPremiumFeedback(
        error instanceof Error ? error.message : "Premium üyeliği iptal edilemedi.",
      );
    } finally {
      setPremiumLoading(false);
    }
  };

  const dot =
    health.status === "ready"
      ? "bg-success shadow-[0_0_0_6px_rgba(63,177,112,0.2)]"
      : health.status === "error"
        ? "bg-red-400 shadow-[0_0_0_6px_rgba(248,113,113,0.18)]"
        : "bg-yellow-300 animate-pulse shadow-[0_0_0_6px_rgba(253,224,71,0.18)]";

  if (route === "login" || route === "register") {
    return <AuthPage mode={route} health={health} />;
  }

  if (route.startsWith("app-") || route === "premium") {
    if (route === "premium") {
      return (
        <div className="min-h-screen bg-[#050B18] font-sans text-white antialiased relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(71,93,178,0.25),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(63,177,112,0.15),transparent_25%)]" />
          <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050B18]/72 backdrop-blur-xl relative z-10">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
              <a href={marketingUser ? "#app-home" : "#home"} className="flex items-center gap-4 leading-none">
                <img src="/f.jpg" alt="Foundrly" className="h-16 w-16 rounded-xl object-cover shadow-sm" />
                <span className="text-2xl font-extrabold tracking-tight text-white">Foundrly</span>
              </a>
              <div className="hidden items-center gap-3 md:flex">
                <a
                  href={marketingUser ? "#app-home" : "#login"}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/22 hover:bg-white/10"
                >
                  {marketingUser ? "Uygulamaya Dön" : "Giriş Yap"}
                </a>
                {!marketingUser && (
                  <a
                    href="#register"
                    className="rounded-full bg-[linear-gradient(135deg,#5b73db_0%,#475DB2_45%,#3FB170_100%)] px-5 py-2 text-sm font-semibold text-white shadow-[0_16px_45px_rgba(71,93,178,0.42)] transition hover:brightness-105"
                  >
                    Kayıt Ol
                  </a>
                )}
              </div>
            </div>
          </header>
          <div className="relative z-10">
            <PremiumSimulationPage
              authenticated={Boolean(marketingAccessToken)}
              currentUser={marketingUser}
              subscriptionState={premiumSubscriptionState}
              onStartSimulation={runPremiumSimulation}
              onCancelSubscription={cancelPremiumSubscription}
              feedback={premiumLoading ? "İşlem yapılıyor, lütfen bekleyin…" : premiumFeedback}
            />
          </div>
          <SiteFooter />
        </div>
      );
    }
    return (
      <DashboardPage 
        route={route as Exclude<RouteName, "home" | "login" | "register" | "mentors">} 
        publicProjects={publicProjects}
        publicMentors={publicMentors}
        setPublicProjects={setPublicProjects}
        setPublicMentors={setPublicMentors}
        showcaseData={showcaseData}
        publicLoading={publicLoading}
        marketingAccessToken={marketingAccessToken}
        refreshPublicData={loadPublicData}
      />
    );
  }

  if ((route as RouteName) === "about") {
    return (
      <div className="min-h-screen bg-[#050B18] font-sans text-white antialiased relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(71,93,178,0.25),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(63,177,112,0.15),transparent_25%)]" />
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050B18]/72 backdrop-blur-xl relative z-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
            <a href="#home" className="flex items-center gap-4 leading-none">
              <img src="/f.jpg" alt="Foundrly" className="h-10 w-10 rounded-lg object-cover" />
              <span className="text-2xl font-extrabold tracking-tight text-white">Foundrly</span>
            </a>
            <a href="#home" className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-white/22 hover:bg-white/10">Ana Sayfa</a>
          </div>
        </header>
        <InfoPage
          eyebrow="Şirket"
          title="Foundrly hakkında"
          lead="Foundrly, proje fikri olan kişileri doğru ekip arkadaşlarıyla bir araya getiren, ürün odaklı ve güven temelli bir ekip kurma platformudur. Üniversite projelerinden kurumsal ekiplere kadar farklı üretim senaryolarında daha iyi eşleşmeler kurmayı hedefler."
          sections={[
            {
              title: "Misyonumuz",
              body: "Foundrly'nin misyonu, fikir sahibi kurucuların ve üretici ekip arkadaşlarının birbirini daha hızlı, daha doğru ve daha güvenilir şekilde bulmasını sağlamaktır. Ekip kurma sürecini rastlantısal değil, veriye ve uyuma dayalı bir ürün deneyimine dönüştürür.",
            },
            {
              title: "Yaklaşımımız",
              body: "Karmaşık süreçler, cevapsız mesajlar ve belirsiz beceri profilleri yerine; proje bazlı keşif, doğrulanabilir profiller, premium görünürlük ve yapay zeka destekli eşleşme ile daha kontrollü bir ekip kurma deneyimi sunuyoruz.",
            },
          ]}
        />
        <SiteFooter />
      </div>
    );
  }

  if ((route as RouteName) === "privacy") {
    return (
      <div className="min-h-screen bg-[#050B18] font-sans text-white antialiased relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(71,93,178,0.25),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(63,177,112,0.15),transparent_25%)]" />
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050B18]/72 backdrop-blur-xl relative z-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
            <a href="#home" className="flex items-center gap-4 leading-none">
              <img src="/f.jpg" alt="Foundrly" className="h-10 w-10 rounded-lg object-cover" />
              <span className="text-2xl font-extrabold tracking-tight text-white">Foundrly</span>
            </a>
            <a href="#home" className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-white/22 hover:bg-white/10">Ana Sayfa</a>
          </div>
        </header>
        <InfoPage
          eyebrow="Gizlilik"
          title="Gizlilik politikamız"
          lead="Foundrly üzerinde paylaşılan profil verileri ve proje içerikleri, platform deneyimini güvenli ve işlevsel şekilde sürdürebilmek için işlenir. Kullanıcı gizliliği ve erişim kontrolü ürün mimarisinin temel parçalarıdır."
          sections={[
            {
              title: "Toplanan bilgiler",
              body: "Platform üzerinde oluşturulan hesap bilgileri, profil verileri, yetenek alanları, ilgi alanları, proje içerikleri ve başvuru mesajları; ekip eşleşmesi, proje yönetimi ve denetim süreçlerini desteklemek amacıyla kullanılır.",
            },
            {
              title: "Koruma ve erişim",
              body: "Yetkilendirme, rol ayrımı ve moderasyon mekanizmaları ile kullanıcı verilerine kontrollü erişim sağlanır. Kullanıcıya ait özel alanlar yalnızca ürün akışının gerektirdiği yetki seviyelerinde görünür hale gelir.",
            },
          ]}
        />
        <SiteFooter />
      </div>
    );
  }

  if ((route as RouteName) === "careers") {
    return (
      <div className="min-h-screen bg-[#050B18] font-sans text-white antialiased relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(71,93,178,0.25),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(63,177,112,0.15),transparent_25%)]" />
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050B18]/72 backdrop-blur-xl relative z-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
            <a href="#home" className="flex items-center gap-4 leading-none">
              <img src="/f.jpg" alt="Foundrly" className="h-10 w-10 rounded-lg object-cover" />
              <span className="text-2xl font-extrabold tracking-tight text-white">Foundrly</span>
            </a>
            <a href="#home" className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-white/22 hover:bg-white/10">Ana Sayfa</a>
          </div>
        </header>
        <InfoPage
          eyebrow="Bize Katıl"
          title="Foundrly ile birlikte büyümek ister misin?"
          lead="Foundrly, ürün düşüncesi güçlü, ekipleri bir araya getirmeyi önemseyen ve ekip kurma deneyimini daha iyi hale getirmek isteyen insanlarla birlikte büyümeyi hedefler."
          sections={[
            {
              title: "Birlikte çalışmak istediğimiz profiller",
              body: "Ürün tasarımı, frontend, backend, mobil geliştirme, içerik, growth ve iş geliştirme alanlarında katkı sunabilecek; ürün kalitesine ve kullanıcı deneyimine önem veren üretken ekip arkadaşlarıyla çalışmak istiyoruz.",
            },
            {
              title: "Nasıl ulaşılır?",
              body: "Kendini, deneyimini ve Foundrly ile neden ilgilendiğini anlatan kısa bir tanıtım metnini hello@joinfoundrly.com adresine göndererek ekitle iletişime geçebilirsin.",
            },
          ]}
        />
        <SiteFooter />
      </div>
    );
  }

  if ((route as RouteName) === "faq") {
    return (
      <div className="min-h-screen bg-[#050B18] font-sans text-white antialiased relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(71,93,178,0.25),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(63,177,112,0.15),transparent_25%)]" />
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050B18]/72 backdrop-blur-xl relative z-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
            <a href="#home" className="flex flex-col leading-none">
              <span className="text-2xl font-extrabold tracking-tight text-white">Foundrly</span>
              <span className="text-[11px] font-medium tracking-widest text-[#9ab0ff]/80">FİKİRLERİ EKİPLERE DÖNÜŞTÜR</span>
            </a>
            <a href="#home" className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-white/22 hover:bg-white/10">Ana Sayfa</a>
          </div>
        </header>
        <InfoPage
          eyebrow="Destek"
          title="Sık sorulan sorular"
          lead="Foundrly üzerindeki temel kullanıcı akışları, premium özellikler ve verified süreçleri hakkında hızlı cevapları burada bulabilirsin."
          sections={[
            {
              title: "Premium ne sağlar?",
              body: "Premium üyelik; YZ Ekip Kurucu, gelişmiş ekip filtreleri, doğrulanmış yetenek başvuru akışı ve daha yüksek görünürlük gibi platformun ileri düzey özelliklerine erişim sağlar.",
            },
            {
              title: "Doğrulanmış yetenek nasıl çalışıyor?",
              body: "Premium kullanıcılar doğrulanmış yetenek başvurusu yapabilir. Başvurular yönetim ekibi tarafından incelenir; onaylanan kullanıcıların profiline doğrulanmış yetenek rozeti eklenir.",
            },
            {
              title: "Kimler proje oluşturabilir?",
              body: "Platforma kayıt olan tüm kullanıcılar proje oluşturabilir, ekip ihtiyacını tanımlayabilir ve gelen başvuruları yönetebilir. Premium kurucu hesapları ise daha yüksek görünürlük avantajı elde eder.",
            },
          ]}
        />
        <SiteFooter />
      </div>
    );
  }

  if ((route as RouteName) === "contact") {
    return (
      <div className="min-h-screen bg-[#050B18] font-sans text-white antialiased relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(71,93,178,0.25),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(63,177,112,0.15),transparent_25%)]" />
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050B18]/72 backdrop-blur-xl relative z-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
            <a href="#home" className="flex flex-col leading-none">
              <span className="text-2xl font-extrabold tracking-tight text-white">Foundrly</span>
              <span className="text-[11px] font-medium tracking-widest text-[#9ab0ff]/80">FİKİRLERİ EKİPLERE DÖNÜŞTÜR</span>
            </a>
            <a href="#home" className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-white/22 hover:bg-white/10">Ana Sayfa</a>
          </div>
        </header>
        <InfoPage
          eyebrow="İletişim"
          title="Foundrly ekibine ulaşın"
          lead="Ürünle ilgili soru sormak, iş birliği görüşmek ya da platform hakkında geri bildirim paylaşmak istersen Foundrly ekibiyle doğrudan iletişime geçebilirsin."
          sections={[
            {
              title: "Konum",
              body: "PAÜ Mühendislik Fakültesi, Kınıklı Kampüsü, Pamukkale / Denizli",
            },
            {
              title: "E-posta",
              body: "Genel iletişim ve iş birliği talepleri için hello@joinfoundrly.com adresinden bize ulaşabilirsiniz.",
            },
            {
              title: "Yanıt süresi",
              body: "Ürün geri bildirimleri, iş birlikleri ve destek talepleri mümkün olan en kısa sürede değerlendirilir. Özellikle marka ve ürün geliştirme odaklı mesajlar öncelikli olarak ele alınır.",
            },
          ]}
        />
        <SiteFooter />
      </div>
    );
  }

  const isPublicRoute = !route.startsWith("app-");
  const isDarkMarketingSurface = isPublicRoute;

  return (
    <div className="min-h-screen bg-[#050B18] font-sans text-white antialiased">
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
          isDarkMarketingSurface
            ? "border-white/10 bg-[#050B18]/72"
            : "border-white/40 bg-white/70 text-ink"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center px-6 py-4 lg:px-10">
          <a href="#home" className="flex items-center gap-4 leading-none mr-auto">
            <img src="/f.jpg" alt="Foundrly" className="h-16 w-16 rounded-xl object-cover shadow-sm" />
            <span className={`text-2xl font-extrabold tracking-tight ${isDarkMarketingSurface ? "text-white" : "text-ink"}`}>
              Foundrly
            </span>
          </a>

          <div className="hidden items-center gap-10 md:flex">
            <nav className="flex gap-8">
              {visibleNavLinks.filter(l => l.label !== "Topluluk").map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className={`text-sm font-medium transition ${isDarkMarketingSurface ? "text-white/68 hover:text-white" : "text-ink/70 hover:text-primary"}`}
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <span className={`inline-flex h-2 w-2 rounded-full ${dot}`} />
              {ENTRY_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition hover:-translate-y-0.5 ${
                  isDarkMarketingSurface && link.label === "Giriş Yap"
                    ? "border border-white/12 bg-white/6 text-white hover:border-white/22 hover:bg-white/10"
                    : isDarkMarketingSurface && link.label === "Kayıt Ol"
                      ? "bg-[linear-gradient(135deg,#5b73db_0%,#475DB2_45%,#3FB170_100%)] text-white shadow-[0_16px_45px_rgba(71,93,178,0.42)]"
                      : link.className
                }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <button
            className="rounded-lg p-2 text-white md:hidden"
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
          <div className="space-y-3 border-t border-white/10 bg-[#0F162B]/96 px-6 py-4 md:hidden">
            {visibleNavLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-medium text-white/72 hover:text-accent-light"
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
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    link.label === "Giriş Yap"
                      ? "border border-white/12 bg-white/6 text-white hover:border-white/22 hover:bg-white/10"
                      : "bg-[linear-gradient(135deg,#5b73db_0%,#475DB2_45%,#3FB170_100%)] text-white shadow-[0_16px_45px_rgba(71,93,178,0.42)]"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="bg-[#050B18] text-white">
        {route === "home" && <LandingHomeView />}
        {route === "mentors" && <PublicMentorsView mentors={publicMentors} />}
        {route === "discover" && <DiscoverView projects={showcaseData.projects} loading={publicLoading} />}
        {route === "teammates" && <TeammatesView teammates={showcaseData.users} loading={publicLoading} />}
        {route === "hub" && <HubView guides={showcaseData.guides} />}
        {route === "events" && <EventsView events={showcaseData.events} loading={publicLoading} showRegister={false} accessToken={marketingAccessToken} />}
      </main>
      <SiteFooter />
    </div>
  );
}

function LandingHomeView({ onSearchUser }: { onSearchUser?: (query: string) => void }) {
  return <FoundrlyLanding onSearchUser={onSearchUser} />;
}

const ONBOARDING_TRACKS = [
  {
    key: "Founder",
    title: "Kurucu",
    body: "Girişimi başlatmak, kurucu ortaklar aramak ve erken aşama takımlar kurmak.",
  },
  {
    key: "Developer",
    title: "Yazılımcı",
    body: "Ürün kodlamak, teknik altyapıyı inşa etmek ve yüksek hedefleri olan takımlara katılmak.",
  },
  {
    key: "Designer",
    title: "Tasarımcı",
    body: "Ürün tasarımını, kullanıcı deneyimini ve ürün zevkini sıfırdan bire şekillendirmek.",
  },
  {
    key: "Explorer",
    title: "Keşifçi",
    body: "Ciddi takımları ve projeleri keşfetmek, hızlı öğrenmek ve doğru ekibe dahil olmak.",
  },
];
const ONBOARDING_SKILLS = [
  "React",
  "Vue",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Python",
  "Django",
  "FastAPI",
  "Go",
  "Rust",
  "Java",
  "Kotlin",
  "Swift",
  "Flutter",
  "React Native",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "AWS",
  "Docker",
  "Kubernetes",
  "Yapay Zeka (LLM)",
  "Makine Öğrenmesi",
  "Veri Bilimi",
  "Ürün Tasarımı (UX/UI)",
  "Figma",
  "Ürün Yönetimi",
  "Büyüme & Pazarlama",
  "SEO",
  "Proje Yönetimi",
  "İş Geliştirme",
  "Finans & Yatırım",
  "Satış",
];

const ONBOARDING_GOALS = [
  "Startup ekibi kurmak",
  "Hackathon takımına katılmak",
  "Kurucu ortak bulmak",
  "Nitelikli üreticilerle tanışmak",
];

function DiscoverView({
  projects,
  loading,
}: {
  projects: ShowcaseProject[];
  loading: boolean;
}) {
  const searchTerm = getHashSearchParam("search").toLocaleLowerCase("tr-TR");
  const filteredProjects = searchTerm
    ? projects.filter((project) =>
        [
          project.title,
          project.summary,
          project.problem_statement,
          project.tech_stack.join(" "),
          project.needed_roles.join(" "),
          project.owner.full_name,
          project.owner.title,
        ]
          .join(" ")
          .toLocaleLowerCase("tr-TR")
          .includes(searchTerm)
      )
    : projects;

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.is_premium_highlighted && !b.is_premium_highlighted) return -1;
    if (!a.is_premium_highlighted && b.is_premium_highlighted) return 1;
    return 0;
  });

  const premiumProjects = filteredProjects.filter((project) => project.is_premium_highlighted).length;
  const activeFounders = new Set(filteredProjects.map((project) => project.owner.id)).size;

  return (
    <section className="bg-[#050B18] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(71,93,178,0.34),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(63,177,112,0.18),transparent_24%),linear-gradient(180deg,rgba(10,16,31,0.96),rgba(8,13,24,0.98))] p-8 shadow-[0_32px_120px_rgba(0,0,0,0.42)] lg:p-10">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/8 to-transparent" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/48">Keşif motoru</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white lg:text-5xl">
                Ciddi projeler. Daha keskin eşleşme. Daha hızlı ekip ivmesi.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                Startup, hackathon ve üniversite projelerini üretici kalitesi, aciliyet ve ekip uyumu sinyallerine göre keşfet.
              </p>
              {searchTerm && (
                <div className="mt-6 inline-flex rounded-full border border-primary/30 bg-primary/12 px-4 py-2 text-sm font-semibold text-[#AFC0FF]">
                  Arama sinyali: {searchTerm}
                </div>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Açık ilan", filteredProjects.length],
                ["Premium öne çıkan", premiumProjects],
                ["Aktif kurucu", activeFounders],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">{label}</p>
                  <p className="mt-3 text-3xl font-black text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_300px]">
          <div className="grid gap-6 md:grid-cols-2">
            {sortedProjects.map((project) => (
              <article
                key={project.id}
                className="group rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur transition hover:-translate-y-1 hover:border-white/18 hover:bg-white/8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/38">
                      {new Date(project.created_at).toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "long",
                      })}
                    </p>
                    <h3 className="mt-3 text-2xl font-bold text-white">{project.title}</h3>
                    <p className="mt-2 text-sm text-slate-300">
                      {project.owner.full_name} · {project.owner.title}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${project.is_premium_highlighted ? "border border-primary/20 bg-primary/12 text-[#AFC0FF]" : "border border-success/20 bg-success/12 text-success"}`}>
                    {project.is_premium_highlighted ? "Premium öne çıkan" : "Açık ekip"}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{project.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.needed_roles.slice(0, 2).map((role) => (
                    <span key={role} className="rounded-full border border-primary/20 bg-primary/12 px-3 py-1 text-xs font-semibold text-[#AFC0FF]">
                      Açık rol: {role}
                    </span>
                  ))}
                  {project.tech_stack.slice(0, 3).map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/72">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <p className="text-sm text-white/54">
                    {project.problem_statement || "Kurucu bu projeyi aktif olarak ekiplendirmek istiyor."}
                  </p>
                  <a href="#app-discover" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#08101F] transition group-hover:bg-[#DDE5FF]">
                    Uygulamada İncele
                  </a>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">Neden daha yukarıda görünüyorlar?</p>
              <div className="mt-4 space-y-4">
                {[
                  "Rol tanımı ve ekip ihtiyacı net",
                  "Kurucunun sağlıklı yanıt hızı var",
                  "Doğrulanmış sinyal veya premium ivme taşıyor",
                  "Aranan becerilerle yüksek örtüşme gösteriyor",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-primary/20 bg-[linear-gradient(180deg,rgba(71,93,178,0.24),rgba(9,16,31,0.82))] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#B8C6FF]">Premium filtre katmanı</p>
              <h3 className="mt-3 text-2xl font-bold text-white">Mentör destekli keşfi aç</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Premium hesaplar; doğrulanmış kurucuların projelerini, uyum gerekçelerini ve daha hızlı değerlendirme sinyallerini öne çıkarır.
              </p>
              <a
                href="#premium"
                className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-white/90"
              >
                Premium'u İncele
              </a>
            </div>
          </aside>
        </div>

        {!loading && filteredProjects.length === 0 && (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/6 p-8 text-center text-slate-300 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur">
            Bu aramayla eşleşen proje bulunamadı. Rol, teknoloji, kurucu ünvanı veya ürün kategorisi deneyebilirsin.
          </div>
        )}
      </div>
    </section>
  );
}

function TeammatesView({
  teammates,
  loading,
}: {
  teammates: ShowcaseUser[];
  loading: boolean;
}) {
  const sortedTeammates = [...teammates].sort((a, b) => {
    if (a.is_premium && !b.is_premium) return -1;
    if (!a.is_premium && b.is_premium) return 1;
    return 0;
  });

  const verifiedCount = teammates.filter((teammate) => teammate.is_verified_talent).length;
  return (
    <section className="bg-[#06101F] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/45">Yetenek ağı</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight">Birlikte üretmeye değecek ekip arkadaşları.</h1>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-300">
              Foundrly; yazılım, tasarım ve büyüme yeteneklerini gösterişe göre değil, gerçek iş birliği hazırlığına göre sıralar.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/6 px-5 py-4 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">Ağ sinyali</p>
            <p className="mt-2 text-3xl font-black">{verifiedCount}</p>
            <p className="text-sm text-white/56">doğrulanmış yetenek profili</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {sortedTeammates.map((teammate) => (
            <article
              key={teammate.id}
              className="rounded-[2rem] border border-white/10 bg-white/6 p-6 text-left shadow-[0_22px_70px_rgba(0,0,0,0.2)] backdrop-blur transition hover:-translate-y-1 hover:border-white/18"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(71,93,178,0.9),rgba(63,177,112,0.7))] text-lg font-black text-white">
                  {teammate.full_name.charAt(0)}
                </div>
                <span className="rounded-full border border-success/20 bg-success/12 px-3 py-1 text-xs font-bold text-success">
                  {teammate.recent_projects_count} proje
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-white">
                {teammate.full_name}
                {teammate.is_verified_talent && <span className="ml-2 text-sm text-[#AFC0FF]">Doğrulanmış</span>}
              </h3>
              <p className="mt-1 text-sm text-white/72">{teammate.title}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{teammate.bio}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                {teammate.average_rating ? `${teammate.average_rating}/5 ekip puanı` : "Yeni profil"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {teammate.skills.slice(0, 3).map((skill) => (
                  <span key={skill} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/74">
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
        {!loading && teammates.length === 0 && (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/6 p-8 text-center text-slate-300 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur">
            Henüz listelenecek ekip arkadaşı yok.
          </div>
        )}
      </div>
    </section>
  );
}

function HubView({ guides }: { guides: CommunityGuideItem[] }) {
  const [selectedGuide, setSelectedGuide] = useState<CommunityGuideItem | null>(null);

  return (
    <section className="bg-[#06101F] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(71,93,178,0.32),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(63,177,112,0.14),transparent_24%),linear-gradient(180deg,rgba(9,15,29,0.96),rgba(5,10,20,0.98))] p-8 shadow-[0_32px_120px_rgba(0,0,0,0.4)] lg:p-10">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/8 to-transparent" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/45">Kurucu kütüphanesi</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight lg:text-5xl">Girişim inşa ederken gerçekten işine yarayan içerikler.</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                MVP çıkarmaktan kurucu ortak seçimine, yatırımcı hazırlığından portföy oluşturmaya kadar girişim yolculuğunun kritik aşamaları için net rehberler.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Yayınlanan rehber", String(guides.length)],
                ["Okuma aralığı", "5-12 dk"],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">{label}</p>
                  <p className="mt-3 text-3xl font-black text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {guides.map((h) => (
            <article
              key={h.title}
              className="group rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)] backdrop-blur transition hover:-translate-y-1 hover:border-white/18 hover:bg-white/8"
            >
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9ab0ff]">{h.read}</p>
              <p className="mt-4 inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                {h.tone}
              </p>
              <h3 className="mt-4 text-2xl font-extrabold text-white">{h.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{h.summary}</p>
              <button
                type="button"
                onClick={() => setSelectedGuide(h)}
                className="mt-6 inline-flex rounded-full border border-white/10 bg-white px-5 py-2.5 text-sm font-bold text-[#071121] transition hover:bg-[#DDE5FF]"
              >
                Makaleyi Oku
              </button>
            </article>
          ))}
        </div>

        {selectedGuide && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#020611]/82 px-6 backdrop-blur-sm">
            <div className="max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,24,42,0.98),rgba(8,13,24,0.98))] p-7 shadow-[0_32px_120px_rgba(0,0,0,0.45)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9ab0ff]">{selectedGuide.tone} · {selectedGuide.read}</p>
                  <h2 className="mt-3 text-3xl font-extrabold text-white">{selectedGuide.title}</h2>
                  <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">{selectedGuide.summary}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedGuide(null)}
                  className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Kapat
                </button>
              </div>
              <div className="mt-6 grid gap-3">
                {selectedGuide.bullets.map((bullet) => (
                  <div key={bullet} className="rounded-[1.5rem] border border-white/10 bg-black/20 px-5 py-4 text-sm leading-7 text-white/82">
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function EventsView({
  events,
  loading,
  showRegister = false,
  accessToken,
}: {
  events: CommunityEventItem[];
  loading: boolean;
  showRegister?: boolean;
  accessToken?: string | null;
}) {
  const [registeredEvents, setRegisteredEvents] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem("foundrly_registered_events");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [registrationFeedback, setRegistrationFeedback] = useState("");

  useEffect(() => {
    const persistedIds = events.filter((event) => event.is_registered).map((event) => event.id);
    if (persistedIds.length === 0) return;
    setRegisteredEvents((current) => Array.from(new Set([...current, ...persistedIds])));
  }, [events]);

  const handleRegister = async (eventId: number) => {
    if (accessToken) {
      try {
        const response = await fetch(API_BASE_URL + "/api/events/register/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ event: eventId }),
        });

        if (response.status === 401 || response.status === 403) {
          setRegistrationFeedback("Etkinliğe kayıt olmak için tekrar giriş yapmalısın.");
          return;
        }
      } catch {
        setRegistrationFeedback("Kayıt sunucuya iletilemedi. Geçici olarak bu cihazda kayıtlı görünecek.");
      }
    }

    const nextList = Array.from(new Set([...registeredEvents, eventId]));
    setRegisteredEvents(nextList);
    localStorage.setItem("foundrly_registered_events", JSON.stringify(nextList));
    setRegistrationFeedback("");
  };

  const nextThirtyDayEvents = events.filter((event) => {
    const today = new Date();
    const target = new Date(event.event_date);
    const diffDays = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 30;
  });
  return (
    <section className="bg-[#06101F] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/45">Canlı ivme</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight">Ekosistemin nabzını tutan etkinlikler.</h1>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-300">
              Hackathon, sunum gecesi ve üretici buluşmalarını aynı premium yüzey içinde takip et. Her etkinlik, doğru insanlarla tanışma ihtimalini yükseltsin.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/6 px-5 py-4 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">Önümüzdeki 30 gün</p>
            <p className="mt-2 text-3xl font-black">{nextThirtyDayEvents.length}</p>
            <p className="text-sm text-white/56">yüksek sinyalli buluşma akışı</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {events.map((event) => (
            <article
              key={event.id}
              className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_22px_70px_rgba(0,0,0,0.2)] backdrop-blur transition hover:-translate-y-1 hover:border-white/18 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="flex w-20 flex-shrink-0 flex-col items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/20 px-3 py-4 text-center">
                  <span className="block text-2xl font-black text-[#9ab0ff]">
                    {new Date(event.event_date).toLocaleDateString("tr-TR", { day: "2-digit" })}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
                    {new Date(event.event_date).toLocaleDateString("tr-TR", { month: "long" })}
                  </span>
                </div>
                <div>
                  <span className="rounded-full border border-primary/20 bg-primary/12 px-3 py-1 text-xs font-bold text-[#AFC0FF]">
                    {event.tag}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-white">{event.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">
                    📍 {event.location} {event.is_online ? "· Çevrim içi katılım" : ""}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">{event.description}</p>
                </div>
              </div>

              {showRegister && (
                registeredEvents.includes(event.id) || event.is_registered ? (
                  <div className="rounded-2xl border border-success/20 bg-success/10 px-6 py-3 text-sm font-bold text-success animate-fadeIn">
                    ✓ Kayıt alındı. Detaylar mail adresine iletilmiştir.
                  </div>
                ) : (
                  <button
                    onClick={() => void handleRegister(event.id)}
                    className="rounded-full border border-white/10 bg-white px-8 py-3 text-sm font-bold text-[#071121] transition hover:bg-[#DDE5FF]"
                  >
                    Kayıt Ol
                  </button>
                )
              )}
            </article>
          ))}
        </div>
        {registrationFeedback && showRegister && (
          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-5 py-3 text-sm font-medium text-amber-300">
            {registrationFeedback}
          </div>
        )}
        {!loading && events.length === 0 && (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/6 p-8 text-center text-slate-300 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur">
            Yayında etkinlik verisi bulunamadı.
          </div>
        )}
      </div>
    </section>
  );
}

function MentorsView({
  mentors,
  onSendRequest,
  onConfirmRequest,
  userRequests,
  feedback,
  credits,
  isPremium
}: {
  mentors: any[],
  onSendRequest: (id: number, msg: string) => void,
  onConfirmRequest: (id: number, action?: string, disputeReason?: string) => void,
  userRequests: any[],
  feedback: string,
  credits: number,
  isPremium: boolean
}) {
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
  const [message, setMessage] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [sessionPaymentFeedback, setSessionPaymentFeedback] = useState("");

  const pendingConfirmation = userRequests.filter((r) => r.status === "offered");
  const reservedSessions = userRequests.filter((r) => r.status === "paid_reserved");
  const mentorCompletedSessions = userRequests.filter((r) => r.status === "mentor_completed");

  return (
    <section className="app-panel rounded-[2.25rem] p-8 lg:p-10 relative overflow-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9ab0ff]">
            Uzman Desteği
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-white">
            Mentörlük Programı
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-7 text-white/68">
            Projeni bir üst seviyeye taşımak için alanında uzman mentörlerden birebir yönlendirme al. Mentör görüşmeleri doğrudan ödeme sistemi üzerinden rezerve edilir.
          </p>
        </div>
      </div>

      {pendingConfirmation.length > 0 && (
        <div className="mt-10 space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary">Onay Bekleyen Görüşmeler</p>
          {pendingConfirmation.map(req => (
            <article key={req.id} className="rounded-2xl border border-secondary/20 bg-secondary/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center font-bold">
                  {req.mentor_details?.full_name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white">{req.mentor_details?.full_name}</p>
                  <p className="text-xs text-white/60">
                    Zaman: <span className="text-secondary">{req.meeting_time ? new Date(req.meeting_time).toLocaleString('tr-TR') : 'Belirtilmedi'}</span>
                  </p>
                  <p className="text-xs text-white/60">
                    Teklif: <span className="text-secondary">{formatTRY(req.offered_price || 25)}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onConfirmRequest(req.id, "accept_offer")}
                className="rounded-xl bg-secondary px-6 py-2 text-sm font-bold text-white shadow-halo transition hover:bg-secondary/90"
              >
                Teklifi Kabul Et ve Ödemeyi Rezerve Et
              </button>
            </article>
          ))}
        </div>
      )}

      {reservedSessions.length > 0 && (
        <div className="mt-8 space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Ödemesi Rezerve Edilen Görüşmeler</p>
          {reservedSessions.map((req) => (
            <article key={req.id} className="rounded-2xl border border-primary/20 bg-primary/10 p-5 text-sm text-white">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-bold">{req.mentor_details?.full_name}</p>
                  <p className="mt-2 text-white/70">
                    Ödeme rezerve edildi. Talep mentör paneline düştü; görüşme sonrası mentör tamamlandı işaretlediğinde burada onay adımı açılacak.
                  </p>
                  <p className="mt-2 text-xs text-white/60">
                    Zaman: {req.meeting_time ? new Date(req.meeting_time).toLocaleString("tr-TR") : "Belirtilmedi"} · Tutar: {formatTRY(req.reserved_amount || req.offered_price || 0)}
                  </p>
                </div>
                <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-cyan-200">
                  Siradaki adim: Mentor gorusmeyi tamamlayacak
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {mentorCompletedSessions.length > 0 && (
        <div className="mt-8 space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-300">Kullanıcı Onayı Bekleyen Tamamlanmış Görüşmeler</p>
          {mentorCompletedSessions.map((req) => (
            <article key={req.id} className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6 flex flex-col gap-4">
              <div>
                <p className="font-bold text-white">{req.mentor_details?.full_name}</p>
                <p className="mt-2 text-sm text-white/70">
                  Mentör görüşmenin tamamlandığını bildirdi. Onay verirsen ödeme serbest bırakılacak; sorun varsa itiraz açabilirsin.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onConfirmRequest(req.id, "confirm_completion")}
                  className="rounded-xl bg-success px-6 py-2 text-sm font-bold text-white shadow-halo transition hover:bg-success/90"
                >
                  Görüşme Yapıldı, Ödemeyi Serbest Bırak
                </button>
                <button
                  onClick={() => {
                    const reason = prompt("İtiraz nedeninizi kısaca yazın:");
                    if (reason?.trim()) {
                      onConfirmRequest(req.id, "open_dispute", reason.trim());
                    }
                  }}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-2 text-sm font-bold text-red-300 transition hover:bg-red-500/15"
                >
                  İtiraz Aç
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {!isPremium ? (
        <div className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(71,93,178,0.2),transparent_34%),linear-gradient(180deg,rgba(8,14,25,0.96),rgba(6,11,20,0.98))] p-7 text-white shadow-[0_24px_80px_rgba(0,0,0,0.26)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-2xl">
                🔒
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">Premium erişim gerekli</p>
                <h3 className="mt-1 text-2xl font-extrabold">Mentör görüşmelerini aç</h3>
              </div>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
              Standart planda mentör havuzunu görebilir, ancak birebir görüşme talebi oluşturamazsın. Premium ile mentör havuzundan birebir seans talepleri oluşturabilirsin. Seanslar doğrudan ödeme sistemi üzerinden rezerve edilir.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {["Birebir Görüşme Yetkisi", "Doğrudan Seans Talebi", "Güvenli Ödeme Sistemi"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/8 bg-white/6 px-4 py-4 text-sm font-semibold text-white/82 backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#premium" className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#071121] transition hover:bg-[#DDE5FF]">
                Premium'u Aç
              </a>
              <a href="#app-profile" className="rounded-2xl border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Profilimi Güçlendir
              </a>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-7 text-white backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/42">Neler açılacak?</p>
            <div className="mt-5 space-y-4">
              {[
                ["Birebir mentör görüşmeleri", "Projene göre doğru uzmanla daha hızlı eşleş."],
                ["Daha net yönlendirme", "Teknik, ürün ve büyüme tarafında somut geri bildirim al."],
                ["Görüşme modeli", "Görüşmeler mentörün belirlediği seans ücreti ile doğrudan ödeme adımıyla rezerve edilir."],
              ].map(([title, body]) => (
                <article key={String(title)} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p className="font-bold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="mt-10">
          {feedback && (
            <div className={`mb-6 rounded-2xl px-4 py-3 text-sm ${feedback.includes("başarıyla") ? "bg-success/10 text-success border border-success/20" : "bg-red-50 text-red-500 border border-red-200"}`}>
              {feedback}
            </div>
          )}

          {selectedMentor ? (
            <div className="app-solid-card rounded-2xl border-primary/20 p-6 lg:p-8">
              <button onClick={() => setSelectedMentor(null)} className="mb-4 text-sm font-bold text-[#9ab0ff] hover:underline">← Mentör Listesine Dön</button>
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary/20 text-2xl font-bold text-primary">
                  {selectedMentor.profile_picture ? (
                    <img src={selectedMentor.profile_picture} className="h-full w-full object-cover" />
                  ) : (
                    selectedMentor.full_name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedMentor.full_name}</h3>
                  <p className="text-sm text-white/60">{selectedMentor.title}</p>
                  <p className="mt-2 text-sm text-white/68">
                    Bu mentörden görüşme talep etmek için seans ücreti olan {formatTRY(selectedMentor.mentor_price || 25)} ödemesini yapmalısınız.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <label className="mb-2 block text-sm font-bold text-white/72">Mesajınız (Projenizi ve ne konuda destek aradığınızı belirtin)</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Merhaba, projemin ölçeklenebilirliği konusunda tavsiyeye ihtiyacım var..."
                  className="app-input min-h-32"
                />

                <div className="mt-6 border-t border-white/10 pt-6 space-y-4">
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <p className="text-sm font-bold text-amber-400">Mentör Seansı Ödemesi</p>
                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      Bu seans mentörün kendi belirlediği saatlik ücret tarifesine tabidir. Toplam ödenecek tutar: <span className="font-extrabold text-white">{formatTRY(selectedMentor.mentor_price || 25)}</span>.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <input 
                      value={cardHolder} 
                      onChange={(e) => setCardHolder(e.target.value)} 
                      placeholder="Kart üzerindeki isim" 
                      className="app-input text-sm bg-black/20" 
                    />
                    <input 
                      value={cardNumber} 
                      onChange={(e) => setCardNumber(e.target.value)} 
                      placeholder="Kart numarası" 
                      className="app-input text-sm bg-black/20" 
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input 
                        value={cardExpiry} 
                        onChange={(e) => setCardExpiry(e.target.value)} 
                        placeholder="SKT (AA/YY)" 
                        className="app-input text-sm bg-black/20" 
                      />
                      <input 
                        value={cardCvc} 
                        onChange={(e) => setCardCvc(e.target.value)} 
                        placeholder="CVC" 
                        className="app-input text-sm bg-black/20" 
                      />
                    </div>
                  </div>

                  {sessionPaymentFeedback && (
                    <div className="rounded-2xl border border-success/20 bg-success/12 px-4 py-3 text-xs text-white">
                      {sessionPaymentFeedback}
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      if (!message.trim()) {
                        setSessionPaymentFeedback("Lütfen mentöre iletilecek mesajınızı doldurun.");
                        return;
                      }
                      if (!cardHolder.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim()) {
                        setSessionPaymentFeedback("Seans ödemesi için kart bilgilerini doldurmalısınız.");
                        return;
                      }
                      setSessionPaymentFeedback("Ödeme başarıyla alındı! Talebiniz mentöre iletiliyor...");
                      setTimeout(() => {
                        onSendRequest(selectedMentor.id, message);
                        setMessage("");
                        setSelectedMentor(null);
                        setCardHolder("");
                        setCardNumber("");
                        setCardExpiry("");
                        setCardCvc("");
                        setSessionPaymentFeedback("");
                      }, 2000);
                    }}
                    className="w-full rounded-2xl bg-secondary px-8 py-3.5 text-sm font-bold text-white shadow-halo transition hover:bg-secondary/90"
                  >
                    Ödemeyi Yap ve Seansı Talep Et ({formatTRY(selectedMentor.mentor_price || 25)})
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mentors.map((m) => (
                <article key={m.id} className="app-solid-card rounded-2xl p-6 transition hover:border-primary/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white/8 text-lg font-bold text-white/70">
                      {m.profile_picture ? (
                        <img src={m.profile_picture} className="h-full w-full object-cover" />
                      ) : (
                        m.full_name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{m.full_name}</h3>
                      <p className="text-xs text-white/50">{m.title}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="flex-1 text-xs leading-relaxed text-white/64 line-clamp-2">{m.bio}</p>
                    <span className="ml-3 whitespace-nowrap text-lg font-black text-secondary">
                      {formatTRY(m.mentor_price || 25)}
                    </span>
                  </div>
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/38">
                    Görüşmeler seans ücreti ile doğrudan ödeme adımıyla rezerve edilir.
                  </p>
                  <div className="flex flex-wrap gap-1 mb-6">
                    {m.skills.slice(0, 3).map((s: string) => (
                      <span key={s} className="rounded bg-white/8 px-2 py-0.5 text-[10px] font-bold text-white/58">{s}</span>
                    ))}
                  </div>
                  <button 
                    onClick={() => setSelectedMentor(m)}
                    className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary/90"
                  >
                    Görüşme Talep Et
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function MentorPanelView({
  requests,
  onStatusUpdate,
  mentor,
  feedback,
}: {
  requests: any[],
  onStatusUpdate: (id: number, action: string, price?: number, time?: string) => void,
  mentor: CurrentUser | null,
  feedback: string,
}) {
  const [newPrice, setNewPrice] = useState(mentor?.mentor_price || 0);
  const sortedRequests = [...requests].sort((a, b) => {
    const statusPriority: Record<string, number> = {
      paid_reserved: 0,
      pending: 1,
      mentor_completed: 2,
      offered: 3,
      disputed: 4,
      released: 5,
      declined: 6,
    };
    const left = statusPriority[a.status] ?? 99;
    const right = statusPriority[b.status] ?? 99;
    if (left !== right) return left - right;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleUpdatePrice = async () => {
    const accessToken = localStorage.getItem("foundrly_access_token");
    if (!accessToken) return;
    try {
      await fetch(API_BASE_URL + "/api/users/me/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ mentor_price: newPrice }),
      });
      alert("Ücretiniz güncellendi.");
    } catch (e) {}
  };

  return (
    <section className="space-y-6 text-white">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="app-kpi-card rounded-2xl p-6 border border-white/10 bg-white/6 shadow-halo">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50">Toplam Kazanç</p>
          <p className="mt-2 text-3xl font-extrabold text-[#9ab0ff]">{formatTRY(mentor?.mentor_balance || 0)}</p>
          <p className="mt-1 text-[10px] text-white/40 font-bold uppercase">Komisyon Sonrası Net</p>
        </div>
        <div className="app-kpi-card rounded-2xl p-6 border border-white/10 bg-white/6 shadow-halo">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50">Görüşme Ücretim</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-3xl font-extrabold text-white">₺</span>
            <input 
              type="number" 
              value={newPrice} 
              onChange={(e) => setNewPrice(Number(e.target.value))}
              className="w-20 text-3xl font-extrabold text-white bg-transparent outline-none focus:text-primary"
            />
          </div>
          <button onClick={handleUpdatePrice} className="mt-2 text-[10px] font-bold text-primary uppercase hover:underline">Kaydet</button>
        </div>
        <div className="app-kpi-card rounded-2xl p-6 border border-white/10 bg-white/6 shadow-halo">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50">Aktif Talepler</p>
          <p className="mt-2 text-3xl font-extrabold text-white">{requests.filter(r => r.status === 'pending' || r.status === 'offered').length}</p>
          <p className="mt-1 text-[10px] text-white/40 font-bold uppercase">Bekleyen Yanıtlar</p>
        </div>
      </div>

      <div className="app-panel rounded-[2.25rem] border border-white/10 bg-white/5 backdrop-blur-md p-8 lg:p-10">
        <p className="app-section-eyebrow text-sm font-bold uppercase tracking-[0.2em] text-[#9ab0ff]">
          Mentör Paneli
        </p>
        <h2 className="mt-2 text-3xl font-extrabold text-white">
          Mentörlük Talepleri
        </h2>
        <p className="app-section-copy mt-2 text-sm text-slate-300">Kullanıcılardan gelen birebir görüşme taleplerini buradan görebilirsiniz.</p>
        {feedback && (
          <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-[#c7d3ff]">
            {feedback}
          </div>
        )}
        <div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/8 px-4 py-3 text-xs text-cyan-100">
          Kullanici odemeyi rezerve ettiginde talep listenin en ustune tasinir. O asamada "Gorusmeyi Tamamlandi Olarak Isaretle" butonu aktif olur.
        </div>

        <div className="mt-10 space-y-4">
          {sortedRequests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-slate-400 bg-white/4">
              Henüz bekleyen talep bulunmuyor.
            </div>
          ) : (
            sortedRequests.map((req) => (
              <article key={req.id} className="app-subpanel rounded-2xl border border-white/10 bg-white/6 p-6 hover:bg-white/8 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">{req.user_details?.full_name || "Kullanıcı"}</p>
                      {req.price_at_request > 0 ? (
                        <span className="text-[10px] font-bold bg-secondary/20 text-[#9ab0ff] px-2 py-0.5 rounded-full border border-secondary/30">Ödeme: {formatTRY(req.price_at_request)}</span>
                      ) : (
                        <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30">Credit</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{formatJoinedDate(req.created_at)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                    req.status === 'pending'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : req.status === 'offered'
                        ? 'bg-primary/20 text-primary border-primary/30'
                        : req.status === 'paid_reserved'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          : req.status === 'mentor_completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : req.status === 'released'
                              ? 'bg-success/20 text-success border-success/30'
                              : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}>
                    {req.status_label || req.status}
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-200 leading-relaxed italic">"{req.message}"</p>
                {req.meeting_time && (
                  <p className="mt-3 text-xs font-bold text-[#9ab0ff] uppercase">Önerilen Zaman: {new Date(req.meeting_time).toLocaleString('tr-TR')}</p>
                )}
                <div className="mt-6 flex gap-3">
                  {req.status === 'pending' && (
                    <div className="flex flex-col w-full gap-3 mt-4 border-t border-white/10 pt-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-white/50 uppercase">Ücret Teklifi (TL):</span>
                          <input 
                            type="number" 
                            placeholder="Ücret" 
                            className="w-32 app-input text-sm bg-black/20"
                            id={`offer-${req.id}`}
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-white/50 uppercase">Görüşme Zamanı:</span>
                          <input 
                            type="datetime-local" 
                            className="w-64 app-input text-sm bg-black/20"
                            id={`time-${req.id}`}
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <button 
                          onClick={() => {
                            const val = (document.getElementById(`offer-${req.id}`) as HTMLInputElement)?.value;
                            const timeVal = (document.getElementById(`time-${req.id}`) as HTMLInputElement)?.value;
                            if (!timeVal) {
                              alert("Lütfen görüşme zamanını seçin.");
                              return;
                            }
                            if (req.price_at_request !== 0 && !val) {
                              alert("Lütfen ücret teklifini girin.");
                              return;
                            }
                            onStatusUpdate(req.id, 'offer', Number(val) || 0, timeVal);
                          }} 
                          className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-halo hover:bg-primary/90 transition"
                        >
                          Zaman ve Ücret Öner
                        </button>
                        <button 
                          onClick={() => onStatusUpdate(req.id, 'decline')} 
                          className="rounded-xl border border-white/10 bg-white/10 px-6 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
                        >
                          Reddet
                        </button>
                      </div>
                    </div>
                  )}
                  {req.status === 'offered' && (
                    <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-xs text-[#c7d3ff]">
                      Kullanıcı teklifinizi kabul edip ödemeyi rezerve ettiğinde burada devam aksiyonu açılacak.
                    </div>
                  )}
                  {req.status === 'paid_reserved' && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <button onClick={() => onStatusUpdate(req.id, 'mark_completed')} className="rounded-xl bg-success px-6 py-2.5 text-xs font-bold text-white shadow-halo hover:bg-success/90 transition">Görüşmeyi Tamamlandı Olarak İşaretle</button>
                      <span className="text-xs text-cyan-100/80">
                        Odeme rezerve edildi. Gorusme yapildiysa bu adimdan sonra kullaniciya final onayi acilir.
                      </span>
                    </div>
                  )}
                  {req.status === 'mentor_completed' && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
                      Kullanıcı onayı bekleniyor. Onay gelince ödeme serbest bırakılacak.
                    </div>
                  )}
                  {req.status === 'disputed' && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                      İtiraz açıldı. Admin incelemesi tamamlanana kadar ödeme bekletilir.
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function PublicMentorsView({ mentors }: { mentors: any[] }) {
  return (
    <section className="bg-[#06101F] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(71,93,178,0.34),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(63,177,112,0.16),transparent_24%),linear-gradient(180deg,rgba(10,16,31,0.96),rgba(8,13,24,0.98))] p-8 shadow-[0_32px_120px_rgba(0,0,0,0.42)] lg:p-10">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/8 to-transparent" />
          <div className="relative text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#9ab0ff]">Uzman Ağı</p>
            <h1 className="mt-4 text-4xl font-extrabold text-white lg:text-5xl">Deneyimli mentörlerle daha hızlı ilerle.</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Ürününüzü, takım stratejinizi ve büyüme kararlarınızı güçlendirecek uzmanları Foundrly’nin premium görünümünde keşfedin.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mentors.map((m) => (
            <article key={m.id} className="group rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur transition hover:-translate-y-1 hover:border-white/18 hover:bg-white/8">
              <div className="relative mx-auto mb-6 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white/10 bg-black/20">
              {m.profile_picture ? (
                <img src={m.profile_picture} className="h-full w-full object-cover transition group-hover:scale-110" alt={m.full_name} />
              ) : (
                <span className="text-4xl font-black text-white/22">{m.full_name.charAt(0)}</span>
              )}
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">{m.full_name}</h3>
                <p className="mt-1 text-sm font-semibold text-[#9ab0ff]">{m.title}</p>
                <p className="mt-4 min-h-[3rem] text-xs leading-relaxed text-slate-300 line-clamp-3">{m.bio}</p>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {m.skills.slice(0, 3).map((s: string) => (
                    <span key={s} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/56">
                      {s}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => (window.location.hash = "#login")}
                  className="mt-8 w-full rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#071121] transition hover:bg-[#DDE5FF]"
                >
                  Üye Olup Görüşme Talep Et
                </button>
              </div>
            </article>
          ))}
        </div>

        {mentors.length === 0 && (
          <div className="py-20 text-center font-bold text-white/42">
            Şu an listelenecek mentör bulunamadı.
          </div>
        )}
      </div>
    </section>
  );
}
