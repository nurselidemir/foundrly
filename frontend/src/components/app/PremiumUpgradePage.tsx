import { useState } from "react";

const BENEFITS = [
  {
    icon: "🤖",
    title: "YZ Takım Eşleşmesi",
    desc: "Beceri, ilgi alanı, rol uyumu ve semantik benzerlik sinyallerine göre sana en uygun ekip üyelerini daha hızlı bul.",
  },
  {
    icon: "✅",
    title: "Doğrulanmış Kurucu Sinyali",
    desc: "Verified rozeti ile diğer builder'lara güvenilir olduğunu kanıtla, başvurularda öne çık.",
  },
  {
    icon: "🚀",
    title: "Hız Katmanı",
    desc: "Sınırsız başvuru, öncelikli destek ve özel etkinliklerle projenizi hız kazandırın.",
  },
];

const STATS = [
  { value: "3×", label: "Daha hızlı aday bulma" },
  { value: "+68%", label: "Proje görünürlüğü artışı" },
  { value: "24/7", label: "Verified güven sinyali" },
];

export default function PremiumUpgradePage({
  isPremium,
  onActivate,
  feedback,
}: {
  isPremium?: boolean;
  onActivate?: (plan: "monthly" | "yearly") => Promise<void>;
  feedback?: string;
}) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    if (!onActivate) return;
    setLoading(true);
    try {
      await onActivate(selectedPlan);
    } finally {
      setLoading(false);
    }
  };

  if (isPremium) {
    return (
      <section className="relative overflow-hidden rounded-[2.25rem] border border-amber-200/20 bg-[linear-gradient(135deg,rgba(215,181,109,0.08),rgba(71,93,178,0.08))] p-10 text-center shadow-halo backdrop-blur text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(215,181,109,0.05),transparent_50%)]" />
        <div className="relative">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#D7B56D,#f0ca7a)] text-4xl shadow-[0_0_32px_rgba(215,181,109,0.25)]">
            ⭐
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D7B56D]">Premium Üye</p>
          <h2 className="mt-2 text-4xl font-extrabold text-white">Harika! Premium'dasın.</h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-white/70">
            YZ Takım Kurucu, Doğrulanmış Yetenek rozeti ve tüm Premium özellikleri aktif. Başarılar!
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-black text-[#D7B56D]">{s.value}</p>
                <p className="mt-1 text-xs font-semibold text-white/75">{s.label}</p>
              </div>
            ))}
          </div>
          {feedback && (
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
              {feedback}
            </div>
          )}
          
          {/* Üyelik Yönetimi */}
          <div className="mt-10 border-t border-white/10 pt-8 max-w-md mx-auto">
            <h4 className="text-sm font-bold text-white/75 uppercase tracking-widest">Abonelik Yönetimi</h4>
            <p className="mt-2 text-xs text-white/75 leading-relaxed">
              Mevcut aboneliğiniz yıllık planda aktiftir. Dilediğiniz zaman üyeliğinizi sonlandırabilirsiniz.
            </p>
            <button
              onClick={() => {
                if (window.confirm("Premium üyeliğinizi sonlandırmak istediğinize emin misiniz? Bu işlem sonucunda tüm premium ayrıcalıklarınızı kaybedeceksiniz.")) {
                  alert("Premium üyeliğiniz başarıyla sonlandırılmıştır. Bir sonraki fatura döneminde standart hesaba aktarılacaksınız.");
                }
              }}
              className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20 transition"
            >
              Üyeliğimi Sonlandır 🗑️
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[2.25rem] border border-white/60 bg-[linear-gradient(135deg,#050B18,#0d1c35)] p-10 text-white shadow-[0_32px_100px_rgba(0,0,0,0.35)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(71,93,178,0.3),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(63,177,112,0.15),transparent_35%)]" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D7B56D]/30 bg-[#D7B56D]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-[#D7B56D]">
            ⭐ Premium'a Geç
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight md:text-5xl">
            Daha hızlı ekip kur,
            <br />
            <span className="bg-[linear-gradient(135deg,#9ab0ff,#56d08c)] bg-clip-text text-transparent">
              daha güçlü görün.
            </span>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/80">
            YZ eşleştirme, verified rozet ve sınırsız başvuru ile platformdaki potansiyelini maksimuma çıkar.
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/6 px-5 py-3.5 backdrop-blur">
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-white/75">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid gap-4 sm:grid-cols-3">
        {BENEFITS.map((b) => (
          <div key={b.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur hover:bg-white/8 transition duration-200">
            <div className="text-3xl">{b.icon}</div>
            <h3 className="mt-4 text-lg font-bold text-white">{b.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/75">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Plan Selection */}
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Plan Seç</p>
        <h3 className="mt-2 text-2xl font-extrabold text-white">Premium'ı Aktif Et</h3>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Monthly */}
          <button
            type="button"
            onClick={() => setSelectedPlan("monthly")}
            className={`rounded-[1.5rem] border p-5 text-left transition duration-200 ${
              selectedPlan === "monthly"
                ? "border-primary/50 bg-primary/10 text-white"
                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8 text-white"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">Aylık</p>
            <p className="mt-2 text-3xl font-extrabold text-white">$5</p>
            <p className="mt-1 text-sm text-white/75">Aylık ödeme, istediğin zaman iptal</p>
            {selectedPlan === "monthly" && (
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
                ✓ Seçildi
              </div>
            )}
          </button>

          {/* Yearly */}
          <button
            type="button"
            onClick={() => setSelectedPlan("yearly")}
            className={`relative rounded-[1.5rem] border p-5 text-left transition duration-200 ${
              selectedPlan === "yearly"
                ? "border-success/50 bg-success/10 text-white"
                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8 text-white"
            }`}
          >
            <div className="absolute right-4 top-4">
              <span className="rounded-full border border-success/25 bg-success/10 px-2.5 py-1 text-[11px] font-bold text-success animate-pulse">
                2 Ay Bedava
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">Yıllık</p>
            <p className="mt-2 text-3xl font-extrabold text-white">$48</p>
            <p className="mt-1 text-sm text-white/75">$4/ay — Yıllık ödeme</p>
            {selectedPlan === "yearly" && (
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-success/20 px-3 py-1 text-xs font-bold text-success">
                ✓ Seçildi
              </div>
            )}
          </button>
        </div>

        {feedback && (
          <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            {feedback}
          </div>
        )}

        <button
          type="button"
          disabled={loading}
          onClick={handleActivate}
          className="mt-6 w-full rounded-2xl bg-primary py-4 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:opacity-70"
        >
          {loading ? "İşleniyor..." : "Premium'ı Aktif Et"}
        </button>
        <p className="mt-3 text-center text-xs text-white/75">Demo mod — gerçek ödeme sistemi bağlanmamıştır</p>
      </div>
    </section>
  );
}
