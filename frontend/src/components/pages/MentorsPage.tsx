import { useState } from "react";

const MENTOR_CATEGORIES = ["Tümü", "Startup Mentörü", "Teknik Mentör", "Ürün Mentörü", "YZ Mentörü", "Kariyer Mentörü"];

const MENTORS = [
  {
    id: 1,
    name: "Dr. Ahmet Yılmaz",
    title: "CTO @ TechUnicorn",
    category: "Startup Mentörü",
    expertise: ["Startup Skalası", "Teknik Mimari", "Takım Yönetimi", "VC Hazırlığı"],
    years: 15,
    rating: 4.9,
    price: "₺800/saat",
    available: true,
    responseTime: "Ort. 2 saat içinde",
    initials: "AY",
    color: "#475DB2",
    sessions: 142,
  },
  {
    id: 2,
    name: "Fatma Çelik",
    title: "Product Lead @ Google",
    category: "Ürün Mentörü",
    expertise: ["Ürün Stratejisi", "Kullanıcı Araştırması", "Product-Market Fit", "GTM"],
    years: 10,
    rating: 4.8,
    price: "₺600/saat",
    available: true,
    responseTime: "Ort. 3 saat içinde",
    initials: "FÇ",
    color: "#3FB170",
    sessions: 98,
  },
  {
    id: 3,
    name: "Kemal Arslan",
    title: "AI Research @ Meta",
    category: "YZ Mentörü",
    expertise: ["Derin Öğrenme", "NLP", "MLOps", "YZ Ürünü"],
    years: 12,
    rating: 4.9,
    price: "₺1000/saat",
    available: false,
    responseTime: "Ort. 24 saat içinde",
    initials: "KA",
    color: "#D7B56D",
    sessions: 67,
  },
  {
    id: 4,
    name: "Ayşe Demir",
    title: "Founder, 2× Exit",
    category: "Startup Mentörü",
    expertise: ["Kurucu Koçluğu", "Fundraising", "Ekip Kurma", "Ölçekleme"],
    years: 8,
    rating: 4.7,
    price: "₺700/saat",
    available: true,
    responseTime: "Ort. 4 saat içinde",
    initials: "AD",
    color: "#475DB2",
    sessions: 203,
  },
  {
    id: 5,
    name: "Burak Şahin",
    title: "Senior Backend @ Netflix",
    category: "Teknik Mentör",
    expertise: ["Backend Mimari", "Sistem Tasarımı", "Dağıtık Sistemler", "API Tasarımı"],
    years: 9,
    rating: 4.6,
    price: "₺500/saat",
    available: true,
    responseTime: "Ort. 1 saat içinde",
    initials: "BŞ",
    color: "#3FB170",
    sessions: 178,
  },
  {
    id: 6,
    name: "Lale Koç",
    title: "Head of Design @ Airbnb",
    category: "Kariyer Mentörü",
    expertise: ["Kariyer Gelişimi", "UX Liderliği", "Portfolyo", "Mülakat Hazırlığı"],
    years: 11,
    rating: 4.8,
    price: "₺550/saat",
    available: false,
    responseTime: "Ort. 6 saat içinde",
    initials: "LK",
    color: "#D7B56D",
    sessions: 89,
  },
  {
    id: 7,
    name: "Serkan Öztürk",
    title: "VC Partner @ 500 Startups",
    category: "Startup Mentörü",
    expertise: ["Yatırım Stratejisi", "Pitch Deck", "Due Diligence", "Ekosistem"],
    years: 14,
    rating: 4.9,
    price: "₺1200/saat",
    available: true,
    responseTime: "Ort. 8 saat içinde",
    initials: "SÖ",
    color: "#475DB2",
    sessions: 54,
  },
  {
    id: 8,
    name: "Derya Aydın",
    title: "ML Engineer @ OpenAI",
    category: "YZ Mentörü",
    expertise: ["LLM Fine-tuning", "Prompt Engineering", "AI Safety", "Model Deployment"],
    years: 7,
    rating: 4.7,
    price: "₺900/saat",
    available: true,
    responseTime: "Ort. 3 saat içinde",
    initials: "DA",
    color: "#3FB170",
    sessions: 121,
  },
];

export default function MentorsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [requestedMentor, setRequestedMentor] = useState<number | null>(null);

  const filtered = selectedCategory === "Tümü" ? MENTORS : MENTORS.filter((m) => m.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(71,93,178,0.35),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(215,181,109,0.15),transparent_28%)]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D7B56D]/25 bg-[#D7B56D]/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#D7B56D]">
            <span className="h-2 w-2 rounded-full bg-[#D7B56D] shadow-[0_0_12px_rgba(215,181,109,0.8)]" />
            Uzman Ağı
          </span>
          <h1 className="mt-5 text-5xl font-black tracking-tight lg:text-6xl">
            Deneyimli Mentörlerle{" "}
            <span className="bg-[linear-gradient(135deg,#D7B56D,#9ab0ff)] bg-clip-text text-transparent">
              Tanış
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Startup kurucularından, YZ uzmanlarından ve kariyer danışmanlarından bire bir mentörlük al. Projenizi bir üst seviyeye taşıyın.
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-6">
            {[
              { value: `${MENTORS.length}`, label: "Aktif Mentör" },
              { value: "540+", label: "Tamamlanan Seans" },
              { value: "4.8/5", label: "Ortalama Puan" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
                <p className="text-xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-white/75">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap gap-2">
            {MENTOR_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-[0_4px_16px_rgba(71,93,178,0.4)]"
                    : "border border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/8"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((mentor) => (
            <article
              key={mentor.id}
              className="group relative rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-white/22 hover:bg-white/8"
            >
              {/* Available badge */}
              <div className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                mentor.available
                  ? "border border-success/25 bg-success/12 text-success"
                  : "border border-white/10 bg-white/5 text-white/65"
              }`}>
                {mentor.available ? "Müsait" : "Dolu"}
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center text-center">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full text-xl font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${mentor.color}cc, ${mentor.color}88)` }}
                >
                  {mentor.initials}
                </div>

                <h3 className="mt-3 text-lg font-bold text-white">{mentor.name}</h3>
                <p className="text-xs font-semibold text-[#9ab0ff]">{mentor.title}</p>

                {/* Category */}
                <span className="mt-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/80">
                  {mentor.category}
                </span>

                {/* Rating */}
                <div className="mt-3 flex items-center gap-1">
                  <span className="text-xs text-[#D7B56D]">{"★".repeat(Math.floor(mentor.rating))}</span>
                  <span className="text-xs font-bold text-white">{mentor.rating}/5</span>
                  <span className="text-xs text-white/70">({mentor.sessions} seans)</span>
                </div>
              </div>

              {/* Expertise */}
              <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                {mentor.expertise.slice(0, 3).map((exp) => (
                  <span key={exp} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/80">
                    {exp}
                  </span>
                ))}
              </div>

              {/* Details */}
              <div className="mt-5 space-y-2.5 border-t border-white/8 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/75">Deneyim</span>
                  <span className="text-sm font-bold text-white">{mentor.years} yıl</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/75">Seans Ücreti</span>
                  <span className="text-sm font-bold text-[#D7B56D]">{mentor.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/75">Yanıt Süresi</span>
                  <span className="text-xs font-semibold text-white/80">{mentor.responseTime}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 grid gap-2">
                {mentor.available ? (
                  <button
                    type="button"
                    onClick={() => setRequestedMentor(requestedMentor === mentor.id ? null : mentor.id)}
                    className="w-full rounded-2xl bg-[linear-gradient(135deg,#5b73db,#475DB2)] py-2.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(71,93,178,0.35)] transition hover:opacity-90"
                  >
                    {requestedMentor === mentor.id ? "✓ Talep Gönderildi" : "Seans Talep Et"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-not-allowed rounded-2xl border border-white/8 bg-white/3 py-2.5 text-sm font-bold text-white/65"
                  >
                    Şu An Dolu
                  </button>
                )}
                <a
                  href="#login"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 text-center text-sm font-semibold text-white/85 transition hover:bg-white/8"
                >
                  Mesaj Gönder
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-[2rem] border border-[#D7B56D]/20 bg-[linear-gradient(135deg,rgba(215,181,109,0.08),rgba(71,93,178,0.08))] p-10 text-center backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D7B56D]/70">Mentör Ağı</p>
          <h2 className="mt-3 text-3xl font-extrabold text-white">Siz de mentör olmak ister misiniz?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/75">
            Deneyimlerinizi paylaşın, startup ekiplerine rehberlik edin ve kazanç elde edin. Platforma mentör olarak katılın.
          </p>
          <a
            href="#register"
            className="mt-6 inline-flex rounded-2xl border border-[#D7B56D]/30 bg-[#D7B56D]/15 px-8 py-3 text-sm font-bold text-[#D7B56D] transition hover:bg-[#D7B56D]/25"
          >
            Mentör Başvurusu Yap
          </a>
        </div>
      </div>
    </div>
  );
}
