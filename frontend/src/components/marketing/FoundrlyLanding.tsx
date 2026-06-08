import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const featureCards = [
  {
    icon: "🤖",
    title: "YZ Takım Eşleşmesi",
    body: "Beceriler, hedefler, işbirliği örüntüleri ve kişilik sinyalleri tek bir eşleşme skorunda birleşiyor.",
    badge: "Premium",
  },
  {
    icon: "✅",
    title: "Doğrulanmış Yetenek Rozeti",
    body: "Güvenilir geliştiricileri öne çıkarın ve kuruculara ilk bakışta kalite sinyali verin.",
    badge: "Premium",
  },
  {
    icon: "🔍",
    title: "Proje Keşfi",
    body: "Startup kavramları, hackathon projeleri ve ivme kazanmaya hazır üniversite girişimlerini keşfedin.",
    badge: "Ücretsiz",
  },
  {
    icon: "⭐",
    title: "İşbirliği Geri Bildirimi",
    body: "Yapılandırılmış proje sonrası değerlendirmeler gelecekteki ekip kararları için itibar katmanı oluşturur.",
    badge: "Ücretsiz",
  },
  {
    icon: "🎓",
    title: "Mentör Bağlantıları",
    body: "Premium kurucular, operatörler, mentörler ve ürün uzmanlarına seçilmiş erişim kazanır.",
    badge: "Premium",
  },
  {
    icon: "🚀",
    title: "Premium Görünürlük",
    body: "Keşif, başvuru ve önerilen akışlarda öne çıkan yerleşim alın.",
    badge: "Premium",
  },
];

const steps = [
  {
    step: "01",
    title: "Kurucu profilini oluştur",
    body: "Becerilerini, startup hedeflerini, müsaitlik durumunu ve yanında istediğin üretici enerjisini ekle.",
  },
  {
    step: "02",
    title: "Proje sinyalini başlat",
    body: "Misyonu, açık rolleri ve ekibinin hızlı hareket etmesi için ihtiyaç duyduğu kimyayı paylaş.",
  },
  {
    step: "03",
    title: "Doğru insanlarla inşa et",
    body: "YZ sıralı eşleşmeler, geri bildirim sinyalleri ve doğrulanmış profiller ile ciddi bir ekibi hızla oluştur.",
  },
];

const testimonials = [
  {
    quote: "Foundrly, haftalarca süren dağınık kurucu networkingini tek bir keskin ekip oluşturma iş akışıyla değiştirmemize yardımcı oldu.",
    name: "Selin Kaya",
    title: "Kurucu, NeuroLens",
    rating: 5,
  },
  {
    quote: "Eşleşme alışılmadık derecede hassasdı. Sadece teknoloji uyumu değil, motivasyon ve tempo uyumuydu da.",
    name: "Arda Demir",
    title: "Hackathon Lideri, BuildNight",
    rating: 5,
  },
  {
    quote: "Bu, LinkedIn'in özgeçmişler yerine gerçek startup yürütmesi için tasarlanmış hali gibi hissettiriyor.",
    name: "Lina Voss",
    title: "Ürün Tasarımcısı, Stüdyo Kurucusu",
    rating: 5,
  },
];

const pricing = [
  {
    name: "Ücretsiz",
    price: "₺0",
    note: "Sonsuza kadar ücretsiz",
    cta: "Ücretsiz Başla",
    href: "#register",
    items: [
      "Kurucu profili",
      "Proje keşfi",
      "Temel başvurular",
    ],
    locked: ["YZ takım eşleşmesi", "Doğrulanmış profil", "Premium görünürlük"],
    isPremium: false,
  },
  {
    name: "Premium",
    price: "₺199",
    note: "aylık · ₺1.990/yıl",
    cta: "Premium'a Geç",
    href: "#premium",
    items: [
      "YZ takım eşleşmesi",
      "Doğrulanmış yetenek iş akışı",
      "Premium görünürlük artışı",
      "Mentör erişimi",
    ],
    locked: [],
    isPremium: true,
  },
];

const faqs = [
  {
    q: "Foundrly kimler için?",
    a: "Foundrly; startup kurucuları, geliştiriciler, tasarımcılar, ürün yöneticileri ve hackathon katılımcıları için tasarlandı. Doğru ekip arkadaşlarını bulmak isteyen herkes için ideal platform.",
  },
  {
    q: "YZ Ekip Kurucu nasıl çalışır?",
    a: "YZ Ekip Kurucu; teknik beceriler, ilgi alanları, rol eşleşmesi ve TF-IDF tabanlı semantik benzerlik sinyallerini birlikte değerlendirerek en uygun ekip üyelerini önerir.",
  },
  {
    q: "Doğrulanmış Yetenek rozeti nasıl alınır?",
    a: "GitHub linki, portföy ve proje kanıtları içeren bir başvuru gönderin. Ekibimiz inceledikten sonra rozet profilinize eklenir. Bu özellik Premium kullanıcılara açıktır.",
  },
  {
    q: "Ücretsiz plan ne kadar sürelidir?",
    a: "Ücretsiz plan sonsuza kadar ücretsizdir. Profil oluşturma, proje keşfi ve temel başvuruları hiçbir ücret olmadan kullanabilirsiniz.",
  },
  {
    q: "İptal edebilir miyim?",
    a: "Evet, Premium aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal sonrasında mevcut dönem sonuna kadar Premium özelliklerinize erişmeye devam edersiniz.",
  },
];

const communityHighlights = [
  { icon: "⚡", title: "Hackathon Takımları", desc: "Yarışmalara hazırlanan ekipleri ve açık rolleri incele." },
  { icon: "🌱", title: "Startup Girişimleri", desc: "Erken aşamada rol al ve ürünün merkezinde yer al." },
  { icon: "🎓", title: "Üniversite Projeleri", desc: "Öğrenci ekipleri ve bitirme projeleri burada." },
  { icon: "🌐", title: "Uzaktan Ekipler", desc: "Konum bağımsız ekiplerle üretim fırsatlarını yakala." },
];

function SectionHeading({
  eyebrow,
  title,
  body,
  light = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p className={`text-xs font-semibold uppercase tracking-[0.34em] ${light ? "text-primary/75" : "text-white/75"}`}>{eyebrow}</p>
      <h2 className={`mt-4 text-4xl font-extrabold tracking-tight md:text-5xl ${light ? "text-ink" : "text-white"}`}>{title}</h2>
      <p className={`mt-5 text-lg leading-8 ${light ? "text-ink/65" : "text-slate-300"}`}>{body}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/6 backdrop-blur overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-white/4"
      >
        <span className="text-base font-semibold text-white pr-4">{q}</span>
        <span className={`flex-shrink-0 text-white/80 transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="faq-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm leading-7 text-slate-300">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FoundrlyLanding({
  onSearchUser,
  reviews = [],
}: {
  onSearchUser?: (query: string) => void;
  reviews?: any[];
}) {
  const [query, setQuery] = useState("");
  const displayedReviews = reviews && reviews.length ? reviews : testimonials.map((t, idx) => ({
    id: String(idx),
    reviewer: { full_name: t.name, title: t.title },
    comment: t.quote,
    rating: t.rating,
  }));

  return (
    <div className="bg-[#050B18] text-white">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(71,93,178,0.38),transparent_26%),radial-gradient(circle_at_80%_18%,rgba(63,177,112,0.2),transparent_22%),radial-gradient(circle_at_50%_110%,rgba(71,93,178,0.22),transparent_38%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/6 to-transparent" />

        <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-16 md:pt-24 lg:px-10 lg:pb-32 flex flex-col items-center justify-center text-center">
          {/* Ana Başlık ve Arama */}
          <div className="space-y-8 flex flex-col items-center justify-center text-center w-full">
            <motion.div custom={0} initial="hidden" animate="show" variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/72 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_18px_rgba(63,177,112,0.8)]" />
                YZ destekli kurucu ağı
              </span>
            </motion.div>

            <motion.div className="space-y-6 flex flex-col items-center" custom={0.08} initial="hidden" animate="show" variants={fadeUp}>
              <h1 className="max-w-4xl text-6xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl lg:text-[5.5rem] text-center">
                Yapay zeka ile
                <span className="block bg-[linear-gradient(135deg,#ffffff_0%,#9ab0ff_55%,#56d08c_100%)] bg-clip-text text-transparent mt-2">
                  ekibini kur.
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 md:text-xl text-center">
                Foundrly; girişimcileri, yazılımcıları, tasarımcıları ve proje üreticilerini YZ destekli ekip eşleştirme sistemiyle bir araya getirir.
              </p>
            </motion.div>

            <motion.div
              className="flex w-full max-w-2xl flex-col gap-4 rounded-[28px] border border-white/10 bg-white/6 p-4 backdrop-blur-xl md:flex-row mx-auto"
              custom={0.16}
              initial="hidden"
              animate="show"
              variants={fadeUp}
            >
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    window.location.hash = "#register";
                  }
                }}
                placeholder="YZ mühendisi, ürün tasarımcısı, backend geliştirici ara..."
                className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none placeholder:text-white/55 focus:border-white/25"
              />
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    window.location.hash = "#register";
                  }}
                  className="rounded-2xl bg-[linear-gradient(135deg,#5b73db_0%,#475DB2_45%,#3FB170_100%)] px-6 py-4 text-sm font-bold text-white shadow-[0_16px_45px_rgba(71,93,178,0.42)] transition hover:scale-[1.02]"
                >
                  Ekibini Kur
                </button>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-3 text-sm text-white/68"
              custom={0.24}
              initial="hidden"
              animate="show"
              variants={fadeUp}
            >
              {["Hackathon Takımları", "Startup Kurucuları", "Üniversite Projeleri", "Doğrulanmış Yetenek"].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM / ÇÖZÜM ─────────────────────────────── */}
      <section className="border-b border-white/10 bg-[linear-gradient(180deg,#060D1B_0%,#081225_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Problem */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-400/80">Sorun</p>
              <h2 className="mt-4 text-3xl font-extrabold text-white">Ekip kurmak neden bu kadar zor?</h2>
              <div className="mt-8 space-y-4">
                {[
                  { icon: "😤", text: "Discord / Reddit'te saatlerce doğru kişiyi aramak" },
                  { icon: "🎲", text: "Rastgele arkadaş çevresiyle dengesiz ekip kurmak" },
                  { icon: "🔇", text: "Başvuru yaptıktan sonra hiç geri dönüş almamak" },
                  { icon: "❓", text: "Karşındaki kişinin gerçekten yetkin olup olmadığını bilememek" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-4 rounded-[1.5rem] border border-white/8 bg-white/4 px-5 py-4 backdrop-blur">
                    <span className="text-2xl">{item.icon}</span>
                    <p className="text-sm leading-6 text-slate-300">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Çözüm */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-success/80">Çözüm</p>
              <h2 className="mt-4 text-3xl font-extrabold text-white">Foundrly bunu nasıl çözüyor?</h2>
              <div className="mt-8 space-y-4">
                {[
                  { icon: "🎯", text: "Beceri odaklı, proje bazlı akıllı eşleştirme" },
                  { icon: "🤝", text: "Doğrulanmış yetenek rozetiyle güvenilir profiller" },
                  { icon: "⚡", text: "Yapay zeka ile dakikalar içinde en uygun adaylar" },
                  { icon: "📈", text: "Şeffaf başvuru ve değerlendirme akışı" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-4 rounded-[1.5rem] border border-success/15 bg-success/8 px-5 py-4 backdrop-blur">
                    <span className="text-2xl">{item.icon}</span>
                    <p className="text-sm leading-6 text-white/85">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── YZ TAKIM EŞLEŞMESİ ────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <SectionHeading
            eyebrow="YZ Takım Kurucu"
            title="Sadece teknoloji yığınından fazlasını gören eşleştirme."
            body="Foundrly; teknik becerileri, ilgi alanlarını, rol beklentilerini ve proje özetini birlikte analiz ederek daha isabetli ekip eşleşmeleri üretir."
          />

          <div className="grid gap-4">
            <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 backdrop-blur">
              <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-[24px] border border-white/10 bg-black/18 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/75">Girdi grafiği</p>
                  <div className="mt-5 space-y-4">
                    {["Teknik beceriler", "İlgi alanları", "Rol beklentileri", "Proje özeti", "Doğrulanmış sinyaller"].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-black/18 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/75">Karar motoru</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {[
                      ["Semantik uyum", "TF-IDF + ağırlıklı skorlama"],
                      ["Rol eşleşmesi", "Ünvan ve ihtiyaç duyulan rol örtüşmesi"],
                      ["Güven sinyali", "Doğrulanmış yetenek ve premium görünürlük katkısı"],
                      ["Eksik beceri analizi", "Tamamlayıcı yetkinlik boşluklarını gösterir"],
                    ].map(([title, body]) => (
                      <div key={title} className="rounded-2xl border border-white/10 bg-white/6 p-4">
                        <p className="font-semibold text-white">{title}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-300">{body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ÖZELLİKLER ───────────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow="Özellikler"
            title="Her startup ekip sinyali tek bir premium çalışma alanında."
            body="Foundrly; topluluğu, güveni, eşleştirmeyi ve görünürlüğü dünya standartlarında bir startup oluşturma ürününde birleştirir."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((card, index) => (
              <motion.article
                key={card.title}
                className="group rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur transition hover:border-white/20 hover:bg-white/8"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                custom={index * 0.04}
                variants={fadeUp}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(71,93,178,0.5),rgba(63,177,112,0.28))] text-2xl">
                    {card.icon}
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                    card.badge === "Premium"
                      ? "border border-primary/30 bg-primary/15 text-[#9ab0ff]"
                      : "border border-success/30 bg-success/12 text-success"
                  }`}>
                    {card.badge}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{card.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── NASIL ÇALIŞIR ─────────────────────────────── */}
      <section className="border-b border-white/10 bg-[linear-gradient(180deg,#050B18_0%,#091328_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow="Nasıl Çalışır"
            title="Üç güçlü adımda güzel bir startup deneyimi."
            body="İlk adımdan itibaren hızlı, yatırımcı hazırlığı kalitesinde ve alışılagelmişin dışında hissettirecek şekilde tasarlandı."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.article
                key={step.step}
                className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/6 p-6 backdrop-blur min-h-[220px]"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                custom={index * 0.06}
                variants={fadeUp}
              >
                {/* Kart İçeriği */}
                <div className="relative z-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9ab0ff]">Adım {step.step}</p>
                  <h3 className="mt-4 text-2xl font-bold leading-snug">{step.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-slate-300">{step.body}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── ETKİNLİKLER ───────────────────── */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow="Etkinlikler"
            title="Binlerce builder ile aynı çatı altında."
            body="Hackathonlar, sunum geceleri ve üretici buluşmalarıyla sürekli büyüyen bir ekosistem."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {communityHighlights.map((item, index) => (
              <motion.div
                key={item.title}
                className="rounded-[24px] border border-white/10 bg-white/6 p-6 backdrop-blur transition hover:border-white/20 hover:bg-white/8"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                custom={index * 0.05}
                variants={fadeUp}
              >
                <div className="text-3xl">{item.icon}</div>
                <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#events" className="rounded-full border border-white/10 bg-white/6 px-5 py-2.5 text-sm font-semibold text-white/82 backdrop-blur transition hover:border-white/20 hover:bg-white/10">
              Tüm Etkinlikleri Gör →
            </a>
          </div>
        </div>
      </section>

      {/* ── FİYATLANDIRMA ─────────────────────────────── */}
      <section id="pricing" className="border-b border-white/10 bg-[linear-gradient(180deg,#060D1B_0%,#050B18_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow="Premium Fiyatlandırma"
            title="Sade ve şeffaf fiyatlandırma."
            body="Ücretsiz başla. Doğrulanmış güven, YZ eşleştirmesi ve premium görünürlüğe hazır olduğunda yükselt."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {pricing.map((plan, index) => (
              <motion.article
                key={plan.name}
                className={`rounded-[34px] border p-8 backdrop-blur ${
                  plan.isPremium
                    ? "border-primary/40 bg-[linear-gradient(135deg,rgba(71,93,178,0.22),rgba(27,45,73,0.9))] shadow-[0_30px_80px_rgba(71,93,178,0.25)]"
                    : "border-white/10 bg-white/6"
                }`}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                custom={index * 0.08}
                variants={fadeUp}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/75">{plan.name}</p>
                    <p className="mt-4 text-5xl font-black tracking-tight">{plan.price}</p>
                    <p className="mt-3 text-sm text-slate-300">{plan.note}</p>
                  </div>
                  {plan.isPremium && (
                    <span className="rounded-full border border-success/24 bg-success/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-success">
                      En Popüler
                    </span>
                  )}
                </div>

                <div className="mt-8 space-y-3">
                  {plan.items.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/16 px-4 py-3.5 text-sm text-white/84">
                      <span className="text-success">✓</span>
                      {item}
                    </div>
                  ))}
                  {plan.locked.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-black/8 px-4 py-3.5 text-sm text-white/65 line-through">
                      <span>✗</span>
                      {item}
                    </div>
                  ))}
                </div>

                <a
                  href={plan.href}
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-2xl px-6 py-4 text-sm font-bold transition hover:scale-[1.02] ${
                    plan.isPremium
                      ? "bg-[linear-gradient(135deg,#5b73db_0%,#475DB2_45%,#3FB170_100%)] text-white shadow-[0_16px_45px_rgba(71,93,178,0.42)]"
                      : "border border-white/10 bg-white/8 text-white hover:bg-white/12"
                  }`}
                >
                  {plan.cta}
                </a>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── KULLANICI YORUMLARİ ───────────────────────── */}
      <section className="border-b border-white/10 bg-[linear-gradient(180deg,#07111f_0%,#050B18_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow="Kullanıcı Yorumları"
            title="Foundrly ile inşa ettikten sonra kurucular ne diyor."
            body="Daha iyi insan sinyalleriyle başlayan yatırımcıya hazır ekipler. Bu hikayeler o farkı yansıtıyor."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {displayedReviews.slice(0, 6).map((item: any, index: number) => (
              <motion.article
                key={item.id}
                className="rounded-[30px] border border-white/10 bg-white/6 p-6 backdrop-blur"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                custom={index * 0.05}
                variants={fadeUp}
              >
                <div className="flex gap-1 text-[#D7B56D]">
                  {"★".repeat(item.rating || 5)}
                </div>
                <p className="mt-4 text-base leading-8 text-white/84">"{item.comment}"</p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#475DB2,#3FB170)] font-bold">
                    {(item.reviewer?.full_name || "Kullanıcı").split(" ").map((part: string) => part[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.reviewer?.full_name}</p>
                    <p className="mt-1 text-sm text-white/75">
                      {item.reviewer?.title || "Foundrly Üyesi"}
                      {item.project && <span className="block text-xs text-white/45">Proje: {item.project.title}</span>}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SSS ───────────────────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow="Sıkça Sorulan Sorular"
            title="Merak ettiğin her şey burada."
            body="Hâlâ sorun mu var? hello@joinfoundrly.com adresine yaz."
          />
          <div className="mt-12 space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FİNAL CTA ─────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(71,93,178,0.25),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(63,177,112,0.16),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center lg:px-10">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/75">Hemen Başla</p>
            <h2 className="mx-auto mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] md:text-6xl">
              Hayalindeki ekibi bugün kur.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Ekip oluşturmayı şansa bırakmayı reddeden kurucu ve builder'ların bir sonraki nesiline katıl.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#register"
                className="rounded-2xl bg-[linear-gradient(135deg,#5b73db_0%,#475DB2_45%,#3FB170_100%)] px-8 py-4 text-sm font-bold text-white shadow-[0_16px_45px_rgba(71,93,178,0.42)] transition hover:scale-[1.03]"
              >
                Foundrly'ye Katıl
              </a>
              <a
                href="#premium"
                className="rounded-2xl border border-white/12 bg-white/6 px-8 py-4 text-sm font-semibold text-white/88 backdrop-blur transition hover:bg-white/9"
              >
                Premium'u Keşfet
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
