import { useState } from "react";

const EVENT_CATEGORIES = ["Tümü", "Hackathon", "Networking", "Online Meetup", "Startup Challenge", "Workshop"];

const EVENTS = [
  {
    id: 1,
    name: "HackIstanbul 2026",
    date: "15 Haziran 2026",
    location: "İstanbul",
    online: false,
    participants: 200,
    max: 250,
    category: "Hackathon",
    featured: true,
    description: "İstanbul'un en büyük hackathon etkinliği! 48 saat içinde fikirden prototippe dönüşen projeler ve ödüller.",
    emoji: "⚡",
    gradient: "from-primary/30 to-success/20",
  },
  {
    id: 2,
    name: "YZ Girişim Zirvesi",
    date: "22 Haziran 2026",
    location: "Online",
    online: true,
    participants: 500,
    max: 1000,
    category: "Networking",
    featured: false,
    description: "YZ alanındaki girişimciler ve yatırımcıları bir araya getiren kapsamlı networking etkinliği.",
    emoji: "🤖",
    gradient: "from-[#D7B56D]/20 to-primary/20",
  },
  {
    id: 3,
    name: "Frontend Workshop",
    date: "1 Temmuz 2026",
    location: "Ankara",
    online: false,
    participants: 50,
    max: 60,
    category: "Workshop",
    featured: false,
    description: "React, TypeScript ve modern frontend araçları üzerine yoğun pratik workshop.",
    emoji: "🎨",
    gradient: "from-success/20 to-primary/20",
  },
  {
    id: 4,
    name: "Startup Demo Day",
    date: "10 Temmuz 2026",
    location: "İstanbul",
    online: false,
    participants: 150,
    max: 200,
    category: "Startup Challenge",
    featured: false,
    description: "Erken aşama startupların yatırımcılara ve topluma projelerini sunduğu Demo Day etkinliği.",
    emoji: "🚀",
    gradient: "from-primary/25 to-[#D7B56D]/15",
  },
  {
    id: 5,
    name: "Product Hunt Launch Gecesi",
    date: "15 Temmuz 2026",
    location: "Online",
    online: true,
    participants: 1000,
    max: 2000,
    category: "Online Meetup",
    featured: false,
    description: "Foundrly topluluğu olarak birlikte Product Hunt'a lansman yapacağız! Canlı katılım ve destek.",
    emoji: "🌐",
    gradient: "from-success/20 to-[#D7B56D]/15",
  },
  {
    id: 6,
    name: "Siber Güvenlik Meetup",
    date: "20 Temmuz 2026",
    location: "İzmir",
    online: false,
    participants: 80,
    max: 100,
    category: "Online Meetup",
    featured: false,
    description: "Siber güvenlik alanındaki profesyoneller ve meraklıların buluşması. CTF yarışması eşliğinde.",
    emoji: "🛡️",
    gradient: "from-[#D7B56D]/20 to-success/15",
  },
];

const COMMUNITY_POSTS = [
  {
    author: "Can Suer",
    role: "Kurucu, B2B YZ",
    avatar: "CS",
    topic: "MVP aşamasında co-founder equity nasıl yapılandırılır? Deneyimlerinizi paylaşır mısınız?",
    stats: "29 yanıt · 4 yatırımcı görüşü",
    signal: "Sıcak Konu",
    time: "2 saat önce",
    signalColor: "bg-red-500/15 text-red-400",
  },
  {
    author: "İpek Sayan",
    role: "Tasarım Lideri, İklim Startup'ı",
    avatar: "İS",
    topic: "Builder'ları ilk haftada aktif iş birlikçiye dönüştüren onboarding örnekleri arıyorum.",
    stats: "16 yanıt · 7 kaydedildi",
    signal: "Builder İstiyor",
    time: "5 saat önce",
    signalColor: "bg-primary/15 text-[#9ab0ff]",
  },
  {
    author: "Mert Acar",
    role: "Operatör, Hackathon Topluluğu",
    avatar: "MA",
    topic: "Stack değil, tempo uyumuna göre takım kurmak için en iyi akış nedir?",
    stats: "21 yanıt · 3 mentör cevabı",
    signal: "YZ Eşleşmesi",
    time: "8 saat önce",
    signalColor: "bg-success/15 text-success",
  },
];

const SUCCESS_STORIES = [
  {
    name: "NeuroLens",
    founder: "Selin Kaya",
    story: "Foundrly üzerinden 48 saatte 3 kişilik teknik ekibini kurdu. 3 ay sonra ilk müşteriyi kazandı.",
    metric: "3 ay → İlk müşteri",
    emoji: "🧠",
  },
  {
    name: "BuildNight",
    founder: "Arda Demir",
    story: "Hackathon için aradığı backend geliştiricisini %92 uyum skoru ile 2 saatte buldu.",
    metric: "2 saat → Ekip kuruldu",
    emoji: "⚡",
  },
  {
    name: "GreenTech Studio",
    founder: "Lina Voss",
    story: "Doğrulanmış yetenek rozetli tasarımcı ile startup ajansı kurdu. Şimdi 12 kişilik ekip.",
    metric: "1 kişi → 12 kişilik ekip",
    emoji: "🌱",
  },
];

export default function CommunityEventsPage() {
  const [activeTab, setActiveTab] = useState<"events" | "community">("events");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [joinedEvents, setJoinedEvents] = useState<Set<number>>(new Set());

  const filteredEvents = selectedCategory === "Tümü" ? EVENTS : EVENTS.filter((e) => e.category === selectedCategory);
  const featuredEvent = EVENTS.find((e) => e.featured);

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(71,93,178,0.3),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(63,177,112,0.18),transparent_28%)]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <h1 className="text-5xl font-black tracking-tight lg:text-6xl">
            Topluluk &{" "}
            <span className="bg-[linear-gradient(135deg,#9ab0ff,#56d08c)] bg-clip-text text-transparent">
              Etkinlikler
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Hackathon'lardan networking'e, online meetup'lardan startup challenge'larına — aktif bir ekosistem seni bekliyor.
          </p>

          {/* Tabs */}
          <div className="mt-8 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("events")}
              className={`rounded-full px-6 py-2.5 text-sm font-bold transition ${
                activeTab === "events"
                  ? "bg-primary text-white shadow-[0_4px_16px_rgba(71,93,178,0.4)]"
                  : "border border-white/10 bg-white/5 text-white/65 hover:bg-white/8"
              }`}
            >
              📅 Etkinlikler
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("community")}
              className={`rounded-full px-6 py-2.5 text-sm font-bold transition ${
                activeTab === "community"
                  ? "bg-primary text-white shadow-[0_4px_16px_rgba(71,93,178,0.4)]"
                  : "border border-white/10 bg-white/5 text-white/65 hover:bg-white/8"
              }`}
            >
              🌐 Topluluk
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        {/* EVENTS TAB */}
        {activeTab === "events" && (
          <div className="space-y-8">
            {/* Featured Event */}
            {featuredEvent && (
              <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${featuredEvent.gradient} border border-white/15 p-8 backdrop-blur`}>
                <div className="absolute -right-10 -top-10 text-[120px] opacity-10">{featuredEvent.emoji}</div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D7B56D]/30 bg-[#D7B56D]/15 px-3 py-1 text-xs font-bold text-[#D7B56D]">
                  ⭐ Öne Çıkan Etkinlik
                </span>
                <h2 className="mt-4 text-4xl font-extrabold text-white">{featuredEvent.name}</h2>
                <p className="mt-2 max-w-xl text-base leading-7 text-white/70">{featuredEvent.description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-2 text-sm text-white/65">
                    📅 {featuredEvent.date}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-white/65">
                    📍 {featuredEvent.location}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-white/65">
                    👥 {featuredEvent.participants}/{featuredEvent.max} katılımcı
                  </span>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const s = new Set(joinedEvents);
                      if (s.has(featuredEvent.id)) { s.delete(featuredEvent.id); } else { s.add(featuredEvent.id); }
                      setJoinedEvents(s);
                    }}
                    className={`rounded-2xl px-6 py-3 text-sm font-bold transition ${
                      joinedEvents.has(featuredEvent.id)
                        ? "bg-success/20 border border-success/30 text-success"
                        : "bg-primary text-white shadow-[0_8px_24px_rgba(71,93,178,0.4)] hover:bg-primary/90"
                    }`}
                  >
                    {joinedEvents.has(featuredEvent.id) ? "✓ Kayıt Tamam" : "Etkinliğe Katıl"}
                  </button>
                  <button type="button" className="rounded-2xl border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10">
                    Detaylar
                  </button>
                </div>
              </div>
            )}

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {EVENT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-primary text-white"
                      : "border border-white/10 bg-white/5 text-white/65 hover:border-white/20 hover:bg-white/8"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Events Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.filter((e) => !e.featured).map((event) => (
                <article key={event.id} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-white/20 hover:bg-white/8">
                  <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${event.gradient} text-2xl`}>
                    {event.emoji}
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-white">{event.name}</h3>
                    <span className={`flex-shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/60 ${event.online ? "border-success/20 bg-success/8 text-success/80" : ""}`}>
                      {event.online ? "Online" : event.location}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-white/60 line-clamp-2">{event.description}</p>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/45">📅 {event.date}</span>
                      <span className="text-white/45">👥 {event.participants}/{event.max}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/8">
                      <div
                        className="h-1.5 rounded-full bg-primary transition-all"
                        style={{ width: `${(event.participants / event.max) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/60">
                      {event.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const s = new Set(joinedEvents);
                        if (s.has(event.id)) { s.delete(event.id); } else { s.add(event.id); }
                        setJoinedEvents(s);
                      }}
                      className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                        joinedEvents.has(event.id)
                          ? "bg-success/15 text-success border border-success/20"
                          : "bg-primary/15 text-[#9ab0ff] border border-primary/20 hover:bg-primary/25"
                      }`}
                    >
                      {joinedEvents.has(event.id) ? "✓ Katıldı" : "Katıl"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* COMMUNITY TAB */}
        {activeTab === "community" && (
          <div className="space-y-10">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { value: "12,430", label: "Toplam Üye", icon: "👥" },
                { value: "386", label: "Aktif Proje", icon: "🚀" },
                { value: "23", label: "Hackathon Kazananı", icon: "🏆" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
                  <div className="text-4xl">{stat.icon}</div>
                  <p className="mt-3 text-3xl font-black text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Success Stories */}
            <div>
              <h2 className="text-2xl font-extrabold text-white">Başarı Hikayeleri</h2>
              <p className="mt-1 text-sm text-white/55">Foundrly ile büyük şeyler başaran ekipler.</p>
              <div className="mt-5 grid gap-5 sm:grid-cols-3">
                {SUCCESS_STORIES.map((story) => (
                  <div key={story.name} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="text-4xl">{story.emoji}</div>
                    <h3 className="mt-3 text-xl font-bold text-white">{story.name}</h3>
                    <p className="text-xs text-[#9ab0ff]">by {story.founder}</p>
                    <p className="mt-3 text-sm leading-6 text-white/65">{story.story}</p>
                    <div className="mt-4 rounded-xl border border-success/20 bg-success/10 px-3 py-2 text-xs font-bold text-success">
                      {story.metric}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Posts */}
            <div>
              <h2 className="text-2xl font-extrabold text-white">Topluluk Tartışmaları</h2>
              <p className="mt-1 text-sm text-white/55">Kurucuların ve builder'ların konuştuğu güncel konular.</p>
              <div className="mt-5 space-y-4">
                {COMMUNITY_POSTS.map((post) => (
                  <article key={post.topic} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-white/20 hover:bg-white/8 cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#475DB2,#3FB170)] text-sm font-black text-white">
                        {post.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-white">{post.author}</span>
                            <span className="ml-2 text-xs text-white/45">{post.role}</span>
                          </div>
                          <span className="text-xs text-white/35 flex-shrink-0">{post.time}</span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-white/80">{post.topic}</p>
                        <div className="mt-3 flex items-center gap-3">
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${post.signalColor}`}>
                            {post.signal}
                          </span>
                          <span className="text-xs text-white/40">{post.stats}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6 text-center">
                <a
                  href="#register"
                  className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/8"
                >
                  Tüm Tartışmaları Gör →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
