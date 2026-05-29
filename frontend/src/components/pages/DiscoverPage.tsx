import { useState } from "react";

const CATEGORIES = ["Tümü", "YZ", "Mobil", "Web", "SaaS", "Oyun", "Siber Güvenlik", "Veri Bilimi"];
const EXPERIENCE_LEVELS = ["Tümü", "Başlangıç", "Orta", "İleri"];
const WORK_TYPES = ["Tümü", "Uzaktan", "Hibrit", "Ofis"];

const PROJECTS = [
  {
    id: 1,
    name: "YZ Kampüs Asistanı",
    description: "Üniversite öğrencilerinin akademik sorularını YZ ile yanıtlayan, ders planlaması yapan ve mentor önerileri sunan akıllı asistan.",
    category: "YZ",
    tech: ["Python", "FastAPI", "React", "OpenAI"],
    roles: ["Backend Geliştirici", "ML Mühendisi", "Frontend Geliştirici"],
    teamSize: "2/5",
    match: 96,
    premium: true,
    workType: "Uzaktan",
    experience: "Orta",
    owner: "Ayşe Kaya",
  },
  {
    id: 2,
    name: "GreenTrack",
    description: "Şirketlerin karbon ayak izini takip etmelerini, raporlamalarını ve sürdürülebilirlik hedefleri belirlemelerini sağlayan SaaS platformu.",
    category: "SaaS",
    tech: ["React", "Node.js", "PostgreSQL", "Chart.js"],
    roles: ["Frontend Geliştirici", "UI/UX Tasarımcı"],
    teamSize: "2/4",
    match: 88,
    premium: false,
    workType: "Hibrit",
    experience: "Başlangıç",
    owner: "Mehmet Demir",
  },
  {
    id: 3,
    name: "MedConnect",
    description: "Hasta-doktor iletişimini güçlendiren, randevu yönetimi ve tıbbi geçmiş takibini kolaylaştıran sağlık tech uygulaması.",
    category: "Mobil",
    tech: ["Flutter", "Django", "Firebase", "PostgreSQL"],
    roles: ["Mobile Geliştirici", "Backend Geliştirici", "UI/UX Tasarımcı"],
    teamSize: "2/5",
    match: 91,
    premium: true,
    workType: "Uzaktan",
    experience: "Orta",
    owner: "Fatma Şahin",
  },
  {
    id: 4,
    name: "CryptoLearn",
    description: "Blockchain ve kripto para teknolojilerini öğretmek için oyunlaştırma ve simülasyon kullanan eğitim platformu.",
    category: "Web",
    tech: ["Next.js", "Solidity", "Ethers.js", "TypeScript"],
    roles: ["Smart Contract Geliştirici", "Frontend Geliştirici"],
    teamSize: "1/3",
    match: 83,
    premium: false,
    workType: "Uzaktan",
    experience: "İleri",
    owner: "Can Yıldız",
  },
  {
    id: 5,
    name: "FitMind",
    description: "Spor ve mental sağlığı birleştiren, kişiselleştirilmiş egzersiz ve meditasyon programları sunan wellness uygulaması.",
    category: "Mobil",
    tech: ["React Native", "FastAPI", "TensorFlow", "Redis"],
    roles: ["Mobile Geliştirici", "UX Tasarımcı", "ML Mühendisi"],
    teamSize: "3/6",
    match: 79,
    premium: false,
    workType: "Hibrit",
    experience: "Orta",
    owner: "Selin Arslan",
  },
  {
    id: 6,
    name: "LocalBite",
    description: "Yerel restoranları ve küçük yiyecek işletmelerini dijitalleştiren, sipariş ve müşteri yönetimi sunan food tech platformu.",
    category: "Web",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    roles: ["Full-Stack Geliştirici", "UX Tasarımcı"],
    teamSize: "2/4",
    match: 76,
    premium: false,
    workType: "Ofis",
    experience: "Başlangıç",
    owner: "Berk Çelik",
  },
  {
    id: 7,
    name: "EduAI",
    description: "Öğrencilerin öğrenme stillerini analiz ederek kişiselleştirilmiş ders planları ve içerik önerileri oluşturan YZ eğitim platformu.",
    category: "YZ",
    tech: ["Python", "TensorFlow", "React", "Django"],
    roles: ["ML Mühendisi", "Frontend Geliştirici", "Eğitim İçerik Uzmanı"],
    teamSize: "2/5",
    match: 94,
    premium: true,
    workType: "Uzaktan",
    experience: "İleri",
    owner: "Zeynep Aydın",
  },
  {
    id: 8,
    name: "GameForge",
    description: "Indie oyun geliştiricilerin projelerini sergilediği, ekip kurduğu ve prototip test edebildiği oyun stüdyo platformu.",
    category: "Oyun",
    tech: ["Unity", "C#", "Blender", "WebGL"],
    roles: ["Oyun Geliştirici", "3D Artist", "Ses Tasarımcısı"],
    teamSize: "1/4",
    match: 81,
    premium: false,
    workType: "Uzaktan",
    experience: "Orta",
    owner: "Mert Özkan",
  },
];

const TECH_STACK_OPTIONS = ["React", "Python", "Django", "Flutter", "Next.js", "TypeScript", "Node.js", "Unity"];

export default function DiscoverPage({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [selectedExperience, setSelectedExperience] = useState("Tümü");
  const [selectedWorkType, setSelectedWorkType] = useState("Tümü");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);

  const filtered = PROJECTS.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tech.some((t) => t.toLowerCase().includes(q)) || p.roles.some((r) => r.toLowerCase().includes(q));
    const matchCat = selectedCategory === "Tümü" || p.category === selectedCategory;
    const matchExp = selectedExperience === "Tümü" || p.experience === selectedExperience;
    const matchWork = selectedWorkType === "Tümü" || p.workType === selectedWorkType;
    const matchTech = selectedTech.length === 0 || selectedTech.some((t) => p.tech.includes(t));
    return matchSearch && matchCat && matchExp && matchWork && matchTech;
  });

  // Giriş yapmamış kullanıcılara hiçbir proje gösterilmez
  const previewProjects = isLoggedIn ? filtered : [];

  const toggleTech = (tech: string) => {
    setSelectedTech((prev) => prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]);
  };

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(71,93,178,0.3),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(63,177,112,0.15),transparent_28%)]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/72 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_12px_rgba(63,177,112,0.8)]" />
            {PROJECTS.length} Aktif Proje
          </span>
          <h1 className="mt-5 text-5xl font-black tracking-tight lg:text-6xl">
            Projeleri{" "}
            <span className="bg-[linear-gradient(135deg,#9ab0ff,#56d08c)] bg-clip-text text-transparent">
              Keşfet
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Hackathon'lardan startup'lara, üniversite projelerinden ticari girişimlere — doğru projeyi bul ve ekibe katıl.
          </p>

          {/* Search */}
          <div className="mt-8 flex gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Proje adı, teknoloji, rol ara..."
              className="flex-1 rounded-2xl border border-white/10 bg-white/6 px-5 py-3.5 text-sm text-white outline-none placeholder:text-white/55 focus:border-primary/40 focus:bg-white/8 backdrop-blur"
            />
            <button
              type="button"
              className="rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_32px_rgba(71,93,178,0.4)] transition hover:bg-primary/90"
            >
              Ara
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        {!isLoggedIn ? (
          <div className="relative z-10 my-10 mx-auto w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(71,93,178,0.15),rgba(27,45,73,0.92))] p-12 text-center shadow-[0_32px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fadeIn">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/8 text-4xl shadow-[0_0_40px_rgba(71,93,178,0.3)]">
              🔒
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#9ab0ff]">
              PROJE KEŞFİ VE EKİP BULMA
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-white">
              Tüm Projeleri Görmek İçin Üye Olun
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-white/60">
              Foundrly üzerindeki binlerce aktif projeyi incelemek, YZ eşleşme skorlarını görmek ve takımlara başvuruda bulunmak için ücretsiz hesap oluşturun veya giriş yapın.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="#register"
                className="rounded-2xl bg-[linear-gradient(135deg,#5b73db,#475DB2)] px-8 py-4 text-sm font-bold text-white shadow-[0_12px_36px_rgba(71,93,178,0.45)] transition hover:scale-[1.02]"
              >
                Hemen Ücretsiz Üye Ol
              </a>
              <a
                href="#login"
                className="rounded-2xl border border-white/12 bg-white/6 px-8 py-4 text-sm font-semibold text-white/80 transition hover:bg-white/10"
              >
                Giriş Yap
              </a>
            </div>
            <p className="mt-5 text-xs text-white/65">Kredi kartı gerekmez · 10 saniyede hazır</p>
          </div>
        ) : (
          <div className="flex gap-10 flex-col lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Category */}
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/75">Kategori</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        selectedCategory === cat
                          ? "bg-primary text-white"
                          : "border border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/8"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deneyim */}
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/75">Deneyim Seviyesi</p>
                <div className="mt-4 space-y-2">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSelectedExperience(level)}
                      className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
                        selectedExperience === level
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "border border-white/5 bg-white/3 text-white/75 hover:border-white/10 hover:bg-white/6"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Çalışma Tipi */}
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/75">Çalışma Tipi</p>
                <div className="mt-4 space-y-2">
                  {WORK_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedWorkType(type)}
                      className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
                        selectedWorkType === type
                          ? "bg-success/20 text-success border border-success/30"
                          : "border border-white/5 bg-white/3 text-white/75 hover:border-white/10 hover:bg-white/6"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Teknoloji */}
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/75">Teknoloji</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {TECH_STACK_OPTIONS.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleTech(tech)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        selectedTech.includes(tech)
                          ? "bg-[#D7B56D]/30 text-[#D7B56D] border border-[#D7B56D]/30"
                          : "border border-white/10 bg-white/5 text-white/80 hover:border-white/20"
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
                {selectedTech.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedTech([])}
                    className="mt-3 text-xs font-semibold text-white/70 hover:text-white/90"
                  >
                    Temizle
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Project Cards */}
          <main className="flex-1">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-white/80">
                {isLoggedIn ? (
                  <><span className="font-bold text-white">{filtered.length}</span> proje bulundu</>
                ) : (
                  <><span className="font-bold text-white">{PROJECTS.length}+</span> aktif proje — tümünü görmek için giriş yap</>
                )}
              </p>
            </div>

            {previewProjects.length === 0 && isLoggedIn ? (
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-16 text-center backdrop-blur">
                <div className="text-5xl">🔍</div>
                <h3 className="mt-4 text-xl font-bold text-white">Proje bulunamadı</h3>
                <p className="mt-2 text-sm text-white/75">Farklı filtreler veya arama terimleri deneyin.</p>
                <button
                  type="button"
                  onClick={() => { setSearch(""); setSelectedCategory("Tümü"); setSelectedExperience("Tümü"); setSelectedWorkType("Tümü"); setSelectedTech([]); }}
                  className="mt-6 rounded-2xl border border-white/10 bg-white/6 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="grid gap-5 sm:grid-cols-2">
                  {previewProjects.map((project) => (
                    <article
                      key={project.id}
                      className="group relative rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-white/20 hover:bg-white/8"
                    >
                      {/* Premium badge */}
                      {project.premium && (
                        <div className="absolute right-5 top-5">
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#D7B56D]/30 bg-[#D7B56D]/15 px-3 py-1 text-xs font-bold text-[#D7B56D]">
                            ⭐ Öne Çıkan
                          </span>
                        </div>
                      )}

                      {/* Header */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(71,93,178,0.5),rgba(63,177,112,0.3))] text-xl font-black text-white">
                          {project.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white truncate pr-20">{project.name}</h3>
                          <p className="mt-0.5 text-xs text-white/75">{project.owner} tarafından</p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mt-4 text-sm leading-6 text-white/80 line-clamp-2">{project.description}</p>

                      {/* Tech stack */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.tech.slice(0, 4).map((t) => (
                          <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/80">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Roles */}
                      <div className="mt-3">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Aranan Roller</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {project.roles.map((r) => (
                            <span key={r} className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-[#9ab0ff]">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-white/75">{project.teamSize} üye</span>
                          <span className="text-white/45">·</span>
                          <span className="text-xs text-white/75">{project.workType}</span>
                          <span className="text-white/45">·</span>
                          <span className="text-xs text-white/75">{project.experience}</span>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                          project.match >= 90
                            ? "bg-success/15 text-success"
                            : project.match >= 80
                            ? "bg-primary/15 text-[#9ab0ff]"
                            : "bg-white/8 text-white/75"
                        }`}>
                          %{project.match} Uyum
                        </span>
                      </div>

                      <div className="mt-4 flex gap-3">
                        {isLoggedIn ? (
                          <>
                            <button
                              type="button"
                              className="flex-1 rounded-2xl bg-primary py-2.5 text-center text-sm font-bold text-white transition hover:bg-primary/90"
                            >
                              Başvur
                            </button>
                            <button
                              type="button"
                              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/8"
                            >
                              Detay
                            </button>
                          </>
                        ) : (
                          <a
                            href="#login"
                            className="flex-1 rounded-2xl border border-white/15 bg-white/8 py-2.5 text-center text-sm font-semibold text-white/70 transition hover:bg-white/12"
                          >
                            Görmek için giriş yap →
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>

                {/* Login Gate Overlay — sadece giriş yapılmamışsa */}
                {!isLoggedIn && (
                  <div className="relative mt-0">
                    {/* Blur fade over the last card area */}
                    <div className="pointer-events-none absolute -top-32 inset-x-0 h-40 bg-gradient-to-b from-transparent to-[#050B18]" />

                    {/* Gate card */}
                    <div className="relative z-10 mx-auto max-w-xl rounded-[2rem] border border-white/15 bg-[linear-gradient(135deg,rgba(71,93,178,0.18),rgba(27,45,73,0.95))] p-10 text-center shadow-[0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                      {/* Lock icon */}
                      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/8 text-3xl shadow-[0_0_32px_rgba(71,93,178,0.3)]">
                        🔍
                      </div>

                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#9ab0ff]/80">
                        {PROJECTS.length}+ proje seni bekliyor
                      </p>
                      <h3 className="mt-2 text-2xl font-extrabold text-white">
                        Tüm projeleri görmek için
                        <br />
                        <span className="bg-[linear-gradient(135deg,#9ab0ff,#56d08c)] bg-clip-text text-transparent">
                          giriş yap veya üye ol
                        </span>
                      </h3>
                      <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/75">
                        Uyum skorları, başvuru sistemi ve akıllı filtreler için ücretsiz hesap oluştur.
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

                      <p className="mt-4 text-xs text-white/65">Kredi kartı gerekmez · Saniyeler içinde hazır</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
        )}
      </div>
    </div>
  );
}
