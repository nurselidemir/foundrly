import { useState } from "react";

const ROLES = ["Tümü", "Frontend", "Backend", "Full-Stack", "UI/UX", "YZ Mühendisi", "Veri Bilimci", "Ürün Yöneticisi", "Mobile"];

const USERS = [
  {
    id: 1,
    name: "Nurseli Demir",
    username: "nurseli",
    role: "Frontend Geliştirici",
    skills: ["React", "TypeScript", "Tailwind", "Figma"],
    verified: true,
    score: 4.9,
    match: 96,
    initials: "ND",
    bio: "Modern UI/UX tutkunları ile çalışmayı seven, 3 yıllık deneyimli React geliştiricisi.",
    available: true,
  },
  {
    id: 2,
    name: "Arda Kaya",
    username: "ardakaya",
    role: "Backend Geliştirici",
    skills: ["Python", "Django", "PostgreSQL", "Docker"],
    verified: true,
    score: 4.7,
    match: 88,
    initials: "AK",
    bio: "Ölçeklenebilir API tasarımı konusunda uzmanlaşmış, mikroservis mimarisi deneyimi olan geliştirici.",
    available: true,
  },
  {
    id: 3,
    name: "Selin Yıldız",
    username: "seliny",
    role: "UI/UX Tasarımcı",
    skills: ["Figma", "Framer", "Adobe XD", "Prototyping"],
    verified: false,
    score: 4.5,
    match: 85,
    initials: "SY",
    bio: "B2B SaaS ürünlerinde kullanıcı deneyimi tasarlayan, ürün odaklı tasarımcı.",
    available: true,
  },
  {
    id: 4,
    name: "Bora Şahin",
    username: "boradev",
    role: "YZ Mühendisi",
    skills: ["Python", "TensorFlow", "PyTorch", "MLOps"],
    verified: true,
    score: 4.8,
    match: 92,
    initials: "BS",
    bio: "NLP ve bilgisayarlı görü alanlarında araştırma deneyimi olan makine öğrenmesi uzmanı.",
    available: false,
  },
  {
    id: 5,
    name: "Duru Aydın",
    username: "duru",
    role: "Full-Stack Geliştirici",
    skills: ["React", "Node.js", "MongoDB", "GraphQL"],
    verified: false,
    score: 4.3,
    match: 79,
    initials: "DA",
    bio: "Hem frontend hem backend deneyimiyle hızlı prototip üreten tam yığın geliştirici.",
    available: true,
  },
  {
    id: 6,
    name: "Mert Çelik",
    username: "mertc",
    role: "Veri Bilimci",
    skills: ["Python", "R", "SQL", "Tableau"],
    verified: false,
    score: 4.6,
    match: 83,
    initials: "MC",
    bio: "İş zekası ve veri görselleştirme konularında uzmanlaşmış, analitik düşünceli veri bilimci.",
    available: true,
  },
  {
    id: 7,
    name: "Zeynep Arslan",
    username: "zeynep",
    role: "Ürün Yöneticisi",
    skills: ["Jira", "Notion", "Figma", "Agile"],
    verified: false,
    score: 4.4,
    match: 81,
    initials: "ZA",
    bio: "Startup ekiplerinde ürün odaklı çalışan, kullanıcı araştırması konusunda deneyimli PM.",
    available: true,
  },
  {
    id: 8,
    name: "Can Doğan",
    username: "cand",
    role: "Mobile Geliştirici",
    skills: ["Flutter", "React Native", "Swift", "Kotlin"],
    verified: true,
    score: 4.7,
    match: 87,
    initials: "CD",
    bio: "Cross-platform ve native uygulama geliştirme konusunda uzmanlaşmış mobil geliştirici.",
    available: false,
  },
];

export default function TeammatesPage({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("Tümü");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filtered = USERS.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.role.toLowerCase().includes(q) || u.skills.some((s) => s.toLowerCase().includes(q));
    const matchRole = selectedRole === "Tümü" || u.role.includes(selectedRole);
    const matchVerified = !verifiedOnly || u.verified;
    return matchSearch && matchRole && matchVerified;
  });

  const previewUsers = isLoggedIn ? filtered : USERS.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_30%_0%,rgba(71,93,178,0.3),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(63,177,112,0.15),transparent_28%)]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/72 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(71,93,178,0.8)]" />
            {USERS.length} Builder Aktif
          </span>
          <h1 className="mt-5 text-5xl font-black tracking-tight lg:text-6xl">
            Takım Arkadaşı{" "}
            <span className="bg-[linear-gradient(135deg,#9ab0ff,#56d08c)] bg-clip-text text-transparent">
              Bul
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Frontend geliştiriciden YZ mühendisine, UI tasarımcısından ürün yöneticisine — doğru ekip arkadaşını bul.
          </p>

          {/* Search & Filters */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={!isLoggedIn}
              placeholder={isLoggedIn ? "İsim, beceri veya kullanıcı adı ara..." : "Arama yapmak için giriş yapmalısınız..."}
              className="flex-1 rounded-2xl border border-white/10 bg-white/6 px-5 py-3.5 text-sm text-white outline-none placeholder:text-white/32 focus:border-primary/40 backdrop-blur disabled:opacity-50"
            />
            {/* Verified toggle */}
            <button
              type="button"
              disabled={!isLoggedIn}
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`rounded-2xl border px-5 py-3.5 text-sm font-semibold transition whitespace-nowrap disabled:opacity-50 ${
                verifiedOnly
                  ? "border-success/40 bg-success/15 text-success"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/8"
              }`}
            >
              ✅ Yalnızca Doğrulanmış
            </button>
          </div>

          {/* Role Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {ROLES.map((role) => (
              <button
                key={role}
                type="button"
                disabled={!isLoggedIn}
                onClick={() => setSelectedRole(role)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                  selectedRole === role
                    ? "bg-primary text-white"
                    : "border border-white/10 bg-white/5 text-white/65 hover:border-white/20 hover:bg-white/8"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-white/55">
            {isLoggedIn ? (
              <>
                <span className="font-bold text-white">{filtered.length}</span> kullanıcı bulundu
              </>
            ) : (
              <>
                <span className="font-bold text-white">{USERS.length}+</span> kullanıcı aktif
              </>
            )}
          </p>
        </div>

        {previewUsers.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-16 text-center backdrop-blur">
            <div className="text-5xl">👥</div>
            <h3 className="mt-4 text-xl font-bold">Kullanıcı bulunamadı</h3>
            <p className="mt-2 text-sm text-white/55">Farklı filtreler deneyin.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {previewUsers.map((user) => (
                <article
                  key={user.id}
                  className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-white/22 hover:bg-white/8"
                >
                  {/* Avatar + Name */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="flex h-18 w-18 h-[72px] w-[72px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#475DB2,#3FB170)] text-xl font-black text-white">
                        {user.initials}
                      </div>
                      {user.verified && (
                        <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#050B18] bg-primary text-[10px]">
                          ✓
                        </div>
                      )}
                      {!user.available && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/50">
                          Dolu
                        </div>
                      )}
                    </div>

                    <h3 className="mt-3 font-bold text-white">{user.name}</h3>
                    <p className="text-xs text-white/45">@{user.username}</p>
                    <p className="mt-1 text-xs font-semibold text-[#9ab0ff]">{user.role}</p>

                    {/* Score */}
                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-xs text-[#D7B56D]">{"★".repeat(Math.floor(user.score))}</span>
                      <span className="text-xs font-bold text-white">{user.score}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="mt-4 text-xs leading-5 text-white/55 text-center line-clamp-2">{user.bio}</p>

                  {/* Skills */}
                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {user.skills.slice(0, 4).map((s) => (
                      <span key={s} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/65">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Match */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                      user.match >= 90 ? "bg-success/15 text-success" : "bg-primary/15 text-[#9ab0ff]"
                    }`}>
                      %{user.match} Uyum
                    </span>
                    {user.verified && (
                      <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-[#9ab0ff]">
                        Doğrulanmış
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4">
                    {isLoggedIn ? (
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href="#login"
                          className="rounded-xl bg-primary py-2 text-center text-xs font-bold text-white transition hover:bg-primary/90"
                        >
                          Takip Et
                        </a>
                        <a
                          href="#login"
                          className="rounded-xl border border-white/10 bg-white/5 py-2 text-center text-xs font-semibold text-white/80 transition hover:bg-white/8"
                        >
                          Mesaj
                        </a>
                      </div>
                    ) : (
                      <a
                        href="#login"
                        className="block w-full rounded-xl border border-white/15 bg-white/8 py-2.5 text-center text-xs font-semibold text-white/70 transition hover:bg-white/12"
                      >
                        Profili gör →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* Login Gate Overlay — sadece giriş yapılmamışsa */}
            {!isLoggedIn && (
              <div className="relative mt-8">
                {/* Blur fade over the last card area */}
                <div className="pointer-events-none absolute -top-40 inset-x-0 h-40 bg-gradient-to-b from-transparent to-[#050B18]" />

                {/* Gate card */}
                <div className="relative z-10 mx-auto max-w-xl rounded-[2rem] border border-white/15 bg-[linear-gradient(135deg,rgba(71,93,178,0.18),rgba(27,45,73,0.95))] p-10 text-center shadow-[0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fadeIn">
                  {/* Lock icon */}
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/8 text-3xl shadow-[0_0_32px_rgba(71,93,178,0.3)]">
                    👥
                  </div>

                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#9ab0ff]/80">
                    {USERS.length}+ yetenek seni bekliyor
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold text-white">
                    Tüm yetenekleri keşfetmek için
                    <br />
                    <span className="bg-[linear-gradient(135deg,#9ab0ff,#56d08c)] bg-clip-text text-transparent">
                      giriş yap veya üye ol
                    </span>
                  </h3>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/60">
                    Doğru kurucu ortaklar, akıllı filtreler ve doğrudan mesajlaşma sistemi için ücretsiz profilini oluştur.
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <a
                      href="#register"
                      className="rounded-2xl bg-[linear-gradient(135deg,#5b73db,#475DB2)] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_36px_rgba(71,93,178,0.45)] transition hover:scale-[1.02]"
                    >
                      Ücretsiz Üye Ol
                    </a>
                    <a
                      href="#login"
                      className="rounded-2xl border border-white/12 bg-white/6 px-7 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    >
                      Giriş Yap
                    </a>
                  </div>

                  <p className="mt-4 text-xs text-white/35">Kredi kartı gerekmez · Saniyeler içinde hazır</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
