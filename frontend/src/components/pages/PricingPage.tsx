import { useState } from "react";

const FREE_FEATURES = [
  { text: "Kurucu profili oluşturma", included: true },
  { text: "Proje keşfi (sınırlı)", included: true },
  { text: "Temel başvurular", included: true },
  { text: "Topluluk erişimi", included: true },
  { text: "Temel mesajlaşma", included: true },
  { text: "YZ Takım Eşleşmesi", included: false },
  { text: "Doğrulanmış profil rozeti", included: false },
  { text: "Premium görünürlük", included: false },
  { text: "Mentör erişimi", included: false },
];

const PREMIUM_FEATURES = [
  { text: "Gelişmiş başvuru deneyimi", included: true },
  { text: "YZ Takım Eşleşmesi", included: true },
  { text: "Doğrulanmış profil rozeti", included: true },
  { text: "Featured profil & proje", included: true },
  { text: "Gelişmiş filtreler", included: true },
  { text: "Mentör erişimi", included: true },
  { text: "Öncelikli değerlendirme sinyalleri", included: true },
  { text: "Premium destek hattı", included: true },
  { text: "Özel etkinlikler & Discord", included: true },
];

const COMPARISON_ROWS = [
  { label: "Başvuru Deneyimi", free: "Temel", premium: "Gelişmiş" },
  { label: "YZ Eşleştirme", free: "❌", premium: "✅" },
  { label: "Verified Rozet", free: "❌", premium: "✅" },
  { label: "Proje Görünürlüğü", free: "Standart", premium: "Premium" },
  { label: "Mentör Erişimi", free: "❌", premium: "✅" },
  { label: "Mesajlaşma", free: "Temel", premium: "Aktif" },
  { label: "Destek", free: "Standart", premium: "Öncelikli" },
];

const FAQS = [
  { q: "Premium'u iptal edebilir miyim?", a: "Evet, istediğiniz zaman iptal edebilirsiniz. İptal sonrasında mevcut dönem sonuna kadar Premium özelliklerine erişmeye devam edersiniz." },
  { q: "YZ Eşleştirme nasıl çalışır?", a: "YZ eşleştirme; teknik beceriler, ilgi alanları, rol eşleşmesi ve TF-IDF tabanlı semantik benzerlik sinyallerini birleştirerek aday önerileri üretir." },
  { q: "Doğrulanmış Rozet nasıl alınır?", a: "Premium üyeliğinizle birlikte portfolyo ve proje kanıtlarınızla başvuru yapabilirsiniz. Ekibimiz değerlendirdikten sonra rozet eklenir." },
  { q: "Fiyat artışı olur mu?", a: "Mevcut üyelerimize erken erişim fiyatını garanti ediyoruz. Fiyat değişikliği durumunda önceden bildirim yapılır." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 overflow-hidden backdrop-blur">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-white/4"
      >
        <span className="text-base font-semibold text-white pr-4">{q}</span>
        <span className={`text-xl text-white/75 transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-sm leading-7 text-white/65">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const monthlyPrice = billing === "monthly" ? "₺199" : "₺165";
  const yearlyNote = billing === "monthly" ? "Aylık ödeme" : "Yıllık ₺1.990 · 2 ay bedava";

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      {/* Hero */}
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(71,93,178,0.3),transparent_35%)]">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center lg:px-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#9ab0ff]">
            Şeffaf Fiyatlandırma
          </span>
          <h1 className="mt-6 text-5xl font-black tracking-tight lg:text-6xl">
            Sana Uygun{" "}
            <span className="bg-[linear-gradient(135deg,#9ab0ff,#56d08c)] bg-clip-text text-transparent">
              Planı Seç
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Ücretsiz başla. Ekibini daha hızlı kur, daha güçlü görün, daha akıllı eşleş.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${billing === "monthly" ? "bg-primary text-white" : "text-white/75 hover:text-white"}`}
            >
              Aylık
            </button>
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${billing === "yearly" ? "bg-primary text-white" : "text-white/75 hover:text-white"}`}
            >
              Yıllık
              <span className="ml-1.5 rounded-full bg-success/20 px-2 py-0.5 text-[11px] font-bold text-success">
                -20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Free Card */}
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/75">Ücretsiz</p>
            <p className="mt-4 text-5xl font-black tracking-tight">$0</p>
            <p className="mt-2 text-sm text-white/75">Sonsuza kadar ücretsiz</p>

            <div className="mt-8 space-y-3">
              {FREE_FEATURES.map((f) => (
                <div
                  key={f.text}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm ${
                    f.included
                      ? "border-white/10 bg-white/5 text-white/80"
                      : "border-white/5 bg-white/3 text-white/65"
                  }`}
                >
                  <span className={f.included ? "text-success" : "text-white/65"}>
                    {f.included ? "✓" : "✗"}
                  </span>
                  <span className={f.included ? "" : "line-through"}>{f.text}</span>
                </div>
              ))}
            </div>

            <a
              href="#register"
              className="mt-8 flex w-full items-center justify-center rounded-2xl border border-white/12 bg-white/6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Ücretsiz Başla
            </a>
          </div>

          {/* Premium Card */}
          <div className="relative rounded-[2rem] border border-primary/40 bg-[linear-gradient(135deg,rgba(71,93,178,0.2),rgba(27,45,73,0.9))] p-8 shadow-[0_30px_80px_rgba(71,93,178,0.25)] backdrop-blur">
            <div className="absolute -top-3 right-6">
              <span className="rounded-full border border-success/30 bg-success/15 px-4 py-1.5 text-xs font-bold text-success">
                En Popüler
              </span>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/75">Premium</p>
            <p className="mt-4 text-5xl font-black tracking-tight">{monthlyPrice}</p>
            <p className="mt-2 text-sm text-white/75">{yearlyNote}</p>

            <div className="mt-8 space-y-3">
              {PREMIUM_FEATURES.map((f) => (
                <div
                  key={f.text}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white/80"
                >
                  <span className="text-success">✓</span>
                  {f.text}
                </div>
              ))}
            </div>

            <a
              href="#register"
              className="mt-8 flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#5b73db_0%,#475DB2_45%,#3FB170_100%)] py-4 text-sm font-bold text-white shadow-[0_16px_45px_rgba(71,93,178,0.42)] transition hover:scale-[1.02]"
            >
              Premium'a Geç
            </a>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-extrabold text-white">Özellik Karşılaştırması</h2>
          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 backdrop-blur">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.2em] text-white/75">Özellik</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-white/75">Ücretsiz</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-[#9ab0ff]">Premium</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={row.label} className={`border-b border-white/8 ${i % 2 === 0 ? "bg-white/3" : ""}`}>
                    <td className="px-6 py-4 text-sm font-semibold text-white/75">{row.label}</td>
                    <td className="px-6 py-4 text-center text-sm text-white/75">{row.free}</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-[#9ab0ff]">{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-extrabold text-white">Sıkça Sorulan Sorular</h2>
          <div className="mt-8 space-y-3">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_50%_50%,rgba(71,93,178,0.2),transparent_70%)] p-12 text-center backdrop-blur">
          <h2 className="text-3xl font-extrabold text-white">Hâlâ kararsız mısın?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/75">
            Ücretsiz başla, istediğin zaman yükselt. Kredi kartı gerekmez.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href="#register" className="rounded-2xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_36px_rgba(71,93,178,0.4)] transition hover:scale-[1.02]">
              Ücretsiz Başla
            </a>
            <a href="#discover" className="rounded-2xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white/90 transition hover:bg-white/8">
              Platformu Keşfet
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
