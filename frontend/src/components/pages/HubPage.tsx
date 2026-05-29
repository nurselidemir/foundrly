import { useState } from "react";

interface Article {
  id: number;
  title: string;
  category: "Ürün & MVP" | "Kurucu Ortak & Ekip" | "Yatırım & Pitching" | "Büyüme & Pazarlama";
  readTime: string;
  excerpt: string;
  content: string;
  author: string;
  authorTitle: string;
  date: string;
  icon: string;
}

const ARTICLES: Article[] = [
  {
    id: 1,
    title: "Sıfırdan Bire: 1 Haftada MVP (Minimum Uygulanabilir Ürün) Üretme Rehberi",
    category: "Ürün & MVP",
    readTime: "5 dk okuma",
    excerpt: "Büyük bütçeler ve aylar harcamadan, fikrinizi en hızlı ve en kararlı şekilde no-code / low-code araçlar kullanarak nasıl test edebileceğinizi adım adım açıklıyoruz.",
    content: `MVP (Minimum Viable Product), fikrinizin temel değer önerisini doğrulamak için tasarlanmış en yalın sürümüdür. İşte 1 haftalık MVP planı:

Adım 1: Temel Değeri Belirleyin
Fikrinizin çözdüğü en kritik problemi seçin. Diğer tüm yan özellikleri (şifre sıfırlama, gelişmiş profil düzenleme vb.) ikinci faza erteleyin.

Adım 2: No-Code/Low-Code Araçları Seçin
• Web siteleri/Arayüzler: Framer, Bubble, Softr
• Veri yönetimi: Airtable, Supabase
• Otomasyon: Make (Integromat), Zapier

Adım 3: Lansman ve Geri Bildirim
Ürünü Product Hunt, Twitter ve startup topluluklarında yayınlayın. Kullanıcıların ürünü nasıl kullandığını izleyin ve hemen iterasyona başlayın.`,
    author: "Ahmet Yılmaz",
    authorTitle: "CTO @ TechUnicorn",
    date: "12 Mayıs 2026",
    icon: "🚀"
  },
  {
    id: 2,
    title: "Doğru Co-founder Seçiminde Dikkat Edilmesi Gereken 5 Altın Kural",
    category: "Kurucu Ortak & Ekip",
    readTime: "8 dk okuma",
    excerpt: "Kurucu ortaklar arasındaki uyumsuzluk, girişimlerin başarısız olmasındaki en büyük 3 nedenden biridir. Kendinize en uygun ortağı seçerken bu kurallara dikkat edin.",
    content: `Ortak bulmak, evlenmek gibidir. Uzun vadeli bir yolculukta uyum çok önemlidir:

1. Beceri Tamamlayıcılığı: Sizinle tamamen aynı şeyleri bilen birini değil, eksik kaldığınız yönleri tamamlayan birini seçin (örneğin Teknik Kurucu + İş Geliştirici).
2. Değer ve Vizyon Uyumu: Çalışma etiği, büyüme hedefleri ve startup'ın geleceğine dair vizyonunuzun eşleştiğinden emin olun.
3. İletişim ve Problem Çözme: Zor zamanlarda nasıl tepki verdiklerini gözlemleyin. Açık ve şeffaf iletişim kurabilen biri hayati önem taşır.
4. Bağlılık Seviyesi: Haftada kaç saat ayıracak, finansal olarak ne kadar süre idare edebilir? Bunları baştan netleştirin.
5. Hukuki Güvence: Vesting (hak ediş süresi) içeren bir kurucular sözleşmesini en baştan imzalayın.`,
    author: "Ayşe Demir",
    authorTitle: "Founder, Exit 2x",
    date: "18 Mayıs 2026",
    icon: "👥"
  },
  {
    id: 3,
    title: "Yatırımcı Sunumu (Pitch Deck) Hazırlama ve Etkili Anlatım Rehberi",
    category: "Yatırım & Pitching",
    readTime: "12 dk okuma",
    excerpt: "Yatırımcıların ilgisini ilk 30 saniyede çekebilmek için 10 slaytlık mükemmel sunum şablonunu ve storytelling (hikayeleştirme) taktiklerini keşfedin.",
    content: `Başarılı bir Pitch Deck, teknik detaylarda boğulmayan, yatırımcıda merak uyandıran bir sunumdur. Temel 10 Slayt:

1. Giriş: Şirket adı ve tek cümlelik slogan.
2. Problem: Çözdüğünüz acı verici sorun ne?
3. Çözüm: Bu sorunu nasıl benzersiz şekilde çözüyorsunuz?
4. Pazar Büyüklüğü (TAM, SAM, SOM): Hitap ettiğiniz pazarın finansal büyüklüğü.
5. Ürün/Teknoloji: Ürününüzün ekran görüntüleri ve çalışma şekli.
6. İş Modeli: Parayı nasıl kazanacaksınız?
7. Rekabet Analizi: Rakiplerinizden neden 10 kat daha iyisiniz?
8. Çekiş (Traction): Bugüne kadar ne elde ettiniz? (Kullanıcı sayısı, gelir vb.)
9. Yol Haritası ve Talep: Ne kadar yatırım arıyorsunuz ve bu yatırımı nerelerde harcayacaksınız?
10. Ekip: Kurucuların geçmiş başarıları ve bu işi neden yapabilecekleri.`,
    author: "Serkan Öztürk",
    authorTitle: "VC Partner @ 500 Startups",
    date: "25 Mayıs 2026",
    icon: "📈"
  },
  {
    id: 4,
    title: "Sıfır Bütçe ile İlk 100 Aktif Kullanıcıya Ulaşma Yolları",
    category: "Büyüme & Pazarlama",
    readTime: "7 dk okuma",
    excerpt: "Reklam bütçeniz olmadan, tamamen organik büyüme taktikleri, topluluk pazarlaması ve viral döngülerle ilk sadık kullanıcı kitlenizi nasıl oluşturursunuz?",
    content: `İlk 100 kullanıcıyı bulmak ölçeklenebilir olmayan işler yapmayı gerektirir:

• Birebir İletişim: Hedef kitlenizin olduğu mecralarda (Reddit, Discord, LinkedIn) doğrudan insanlarla konuşun ve onlara özel davetiyeler gönderin.
• Topluluk Pazarlaması: Değer yaratan içerikler paylaşın. Doğrudan ürün satmak yerine, insanların sorunlarına çözümler sunun.
• Kanaat Önderleri: Sektörünüzdeki mikro-etkileyicilere ücretsiz erişim teklif edin ve geri bildirimlerini isteyin.
• Viral Kancalar: Ürününüzü paylaşmayı kolaylaştıracak referans (referral) sistemleri veya paylaşılabilir sonuç ekranları tasarlayın.`,
    author: "Fatma Çelik",
    authorTitle: "Product Lead @ Google",
    date: "20 Mayıs 2026",
    icon: "🔥"
  },
  {
    id: 5,
    title: "Hisse Paylaşımı (Equity Split) Nasıl Olmalı? Slicing Pie Modeli",
    category: "Kurucu Ortak & Ekip",
    readTime: "10 dk okuma",
    excerpt: "Girişimin ilk günlerinde hisseleri %50-%50 bölüşmek yerine, herkesin koyduğu emeğe ve kaynağa göre adil bir dinamik hisse paylaşım modelinin nasıl kurulacağını öğrenin.",
    content: `Klasik statik hisse dağıtımı genellikle adaletsizlikle sonuçlanır. Slicing Pie modeli, risk ve katkı oranında dinamik dağılım sunar:

• Nakdi Katkılar: Nakit para koyan kişilere harcamaları oranında katsayılı puan verilir.
• Nakdi Olmayan Katkılar: Zaman (saat başı emek değeri), ekipman, ofis alanı veya patent gibi katkılar piyasa değerine göre puanlanır.
• Dinamik Takip: Şirket gelir elde etmeye veya yatırım alana kadar katkı havuzu birikmeye devam eder. Yatırım alındığı an, o güne kadar biriken toplam puan içindeki payınız hisse oranınızı belirler.`,
    author: "Ayşe Demir",
    authorTitle: "Founder, Exit 2x",
    date: "10 Mayıs 2026",
    icon: "🍰"
  },
  {
    id: 6,
    title: "Girişimler için Popüler No-Code Araç Seti ve Hızlı Kurulum Taktikleri",
    category: "Ürün & MVP",
    readTime: "6 dk okuma",
    excerpt: "Yapay zeka çağında teknik bilgiye ihtiyaç duymadan, fikirlerinizi günler içinde çalışan birer SaaS uygulamasına dönüştüren modern araçlar ve ipuçları.",
    content: `No-code ekosistemi hiç olmadığı kadar güçlü. İşte önerilen entegrasyon seti:

1. Web Frontend: Relume + Webflow (Tasarım ve içerik odaklı web siteleri)
2. Uygulama Mantığı & Veritabanı: Bubble (Tüm mantık akışlarını çözebilir)
3. Hızlı Portallar: Softr + Airtable (Saatler içinde müşteri portalları oluşturun)
4. AI Özellikleri: Make.com üzerinden OpenAI/Anthropic API bağlantıları.
Bu araçlarla başlayarak hem bütçeden hem de zamandan ciddi tasarruf sağlayabilirsiniz.`,
    author: "Ahmet Yılmaz",
    authorTitle: "CTO @ TechUnicorn",
    date: "05 Mayıs 2026",
    icon: "🛠️"
  }
];

const TEMPLATES = [
  {
    title: "Pitch Deck Figma Şablonu",
    desc: "Yatırımcılardan tam not almış modern, minimalist ve yüksek dönüşüm oranlı 12 slaytlık Figma tasarım şablonu.",
    size: "4.8 MB",
    type: "Figma",
    icon: "🎨"
  },
  {
    title: "Kurucular Sözleşmesi Taslağı",
    desc: "Vesting (hak ediş süresi) ve hisse paylaşım maddeleri içeren, yasal olarak uyumlu Türkçe standart kurucu ortaklar sözleşmesi.",
    size: "420 KB",
    type: "PDF / Word",
    icon: "⚖️"
  },
  {
    title: "Startup Finansal Projeksiyon Şablonu",
    desc: "3 yıllık nakit akışı, gelir-gider dengesi ve CAC/LTV oranlarını otomatik hesaplayan hazır Google Sheets / Excel tablosu.",
    size: "1.2 MB",
    type: "Sheets",
    icon: "📊"
  },
  {
    title: "Ürün Yol Haritası (Roadmap) Şablonu",
    desc: "Sprint planlama, backlog yönetimi ve özellik önceliklendirme matrisi içeren kapsamlı Notion çalışma alanı şablonu.",
    size: "Notion",
    type: "Notion",
    icon: "📓"
  }
];

export default function HubPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  // MVP Simulator States
  const [ideaText, setIdeaText] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<{
    score: number;
    feedback: string;
    actionItems: string[];
    techStack: string[];
  } | null>(null);

  const categories = ["Tümü", "Ürün & MVP", "Kurucu Ortak & Ekip", "Yatırım & Pitching", "Büyüme & Pazarlama"];

  const filteredArticles = ARTICLES.filter((art) => {
    const matchesCategory = selectedCategory === "Tümü" || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSimulateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim()) return;

    setIsSimulating(true);
    setSimResult(null);

    // Simulate AI response delay
    setTimeout(() => {
      // Logic to parse or create a realistic result based on keywords
      const score = Math.floor(Math.random() * 25) + 70; // 70-95
      let feedback = "Fikriniz pazar talebi ve teknik uygulanabilirlik açısından oldukça güçlü bir temele sahip.";
      let actionItems = [
        "En geç 3 gün içinde bir bekleme listesi (Waitlist) sayfası açıp kullanıcı ilgisini ölçün.",
        "Potansiyel kullanıcılarla en az 10 derinlemesine görüşme yapın.",
        "Foundrly üzerinden bir UI/UX Tasarımcı ve Full-stack geliştirici ile eşleşin."
      ];
      let techStack = ["React", "TypeScript", "TailwindCSS", "Supabase"];

      if (ideaText.toLowerCase().includes("yapay zeka") || ideaText.toLowerCase().includes("ai") || ideaText.toLowerCase().includes("gpt")) {
        feedback = "Yapay zeka entegrasyonu pazarın ilgisini çekmek için harika bir kaldıraç. Ancak rakiplerin hızlı kopyalayabilme riskine karşı özelleşmiş veriye odaklanmalısınız.";
        actionItems = [
          "OpenAI API maliyetlerini optimize etmek için ön-bellekleme (caching) mekanizması tasarlayın.",
          "Veri gizliliği ve güvenlik politikalarınızı netleştirin.",
          "Foundrly YZ Takım Kurucusu'nu kullanarak bir ML Mühendisi bulun."
        ];
        techStack = ["Python", "FastAPI", "OpenAI API", "React", "Vector DB"];
      } else if (ideaText.toLowerCase().includes("mobil") || ideaText.toLowerCase().includes("app") || ideaText.toLowerCase().includes("oyun")) {
        feedback = "Mobil odaklı çözümlerde kullanıcı tutundurma (retention) en büyük zorluktur. Pazar lansmanından önce onboarding akışını çok pürüzsüz yapmalısınız.";
        actionItems = [
          "İlk olarak bir mobil web uygulaması (PWA) ile başlayıp kullanıcı alışkanlıklarını ölçün.",
          "Push notification stratejisi oluşturun.",
          "Foundrly'de bir Flutter veya React Native geliştirici ile bağlantı kurun."
        ];
        techStack = ["React Native", "Expo", "Node.js", "Firebase"];
      }

      setSimResult({
        score,
        feedback,
        actionItems,
        techStack
      });
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050B18] text-white">
      {/* Hero Header */}
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(71,93,178,0.25),transparent_45%)]">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#9ab0ff]">
            Foundrly Akademi & Kaynaklar
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Girişim{" "}
            <span className="bg-[linear-gradient(135deg,#9ab0ff,#56d08c)] bg-clip-text text-transparent">
              Merkezi
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300">
            Fikrinizi test etmekten, kurucu ortak bulmaya, yatırım alma süreçlerinden büyüme taktiklerine kadar startup yolculuğunun her adımında yanınızdayız.
          </p>

          {/* Search bar inside hero */}
          <div className="mx-auto mt-8 max-w-md">
            <div className="relative rounded-full border border-white/12 bg-white/5 p-1 backdrop-blur focus-within:border-primary/50 transition">
              <input
                type="text"
                placeholder="Rehber veya makale ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-5 py-3 text-sm text-white placeholder-white/40 outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-white/75">🔍</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Main content area */}
          <div className="space-y-12">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-primary text-white shadow-lg"
                      : "bg-white/5 border border-white/8 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Articles Grid */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black mb-6 flex items-center gap-3">
                <span>📚</span> Seçilen Konudaki Kılavuzlar
              </h2>

              {filteredArticles.length === 0 ? (
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-12 text-center backdrop-blur">
                  <p className="text-lg text-white/75 font-semibold">Eşleşen makale bulunamadı.</p>
                  <p className="text-sm text-white/70 mt-1">Lütfen arama teriminizi veya kategori filtrenizi değiştirin.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {filteredArticles.map((art) => (
                    <article
                      key={art.id}
                      onClick={() => setActiveArticle(art)}
                      className="group cursor-pointer rounded-[2rem] border border-white/10 bg-white/5 p-6 hover:bg-white/8 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-bold text-[#9ab0ff]">
                            {art.category}
                          </span>
                          <span className="text-xs text-white/75">{art.readTime}</span>
                        </div>
                        <h3 className="text-lg font-bold group-hover:text-[#9ab0ff] transition-colors leading-snug">
                          {art.icon} {art.title}
                        </h3>
                        <p className="mt-3 text-sm text-white/75 line-clamp-3 leading-relaxed">
                          {art.excerpt}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-white/5 pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary to-[#3FB170] flex items-center justify-center text-[11px] font-bold text-white uppercase">
                            {art.author.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-white/80">{art.author}</p>
                            <p className="text-[9px] text-white/70">{art.authorTitle}</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          Devamını Oku ➔
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Templates & Resources Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black mb-6 flex items-center gap-3">
                <span>📁</span> Ücretsiz Startup Şablonları & Araç Kitleri
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {TEMPLATES.map((tpl) => (
                  <div
                    key={tpl.title}
                    className="rounded-2xl border border-white/10 bg-white/3 p-5 flex items-start gap-4 hover:bg-white/5 transition-all"
                  >
                    <div className="text-3xl p-3 bg-white/5 rounded-xl border border-white/8">{tpl.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-white truncate">{tpl.title}</h4>
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/75 font-bold">{tpl.type}</span>
                      </div>
                      <p className="text-xs text-white/75 mt-1 leading-normal line-clamp-2">{tpl.desc}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] text-white/70">{tpl.size}</span>
                        <button
                          onClick={() => alert(`"${tpl.title}" şablonu indirme simülasyonu başlatıldı. Bilgisayarınıza indiriliyor...`)}
                          className="text-xs font-bold text-success hover:underline"
                        >
                          Şablonu Edin 💾
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* AI Startup Idea Validator widget */}
            <div className="rounded-[2rem] border border-primary/30 bg-[linear-gradient(180deg,rgba(71,93,178,0.2),rgba(8,14,25,0.92))] p-6 backdrop-blur shadow-[0_24px_50px_rgba(71,93,178,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-primary/30 to-transparent rounded-bl-full pointer-events-none" />
              <span className="inline-block rounded-full bg-success/20 px-3 py-1 text-[10px] font-bold text-success uppercase tracking-widest">
                Foundrly Yapay Zeka
              </span>
              <h3 className="mt-3 text-lg sm:text-xl font-bold text-white">Startup Fikir Test Cihazı</h3>
              <p className="mt-2 text-xs text-white/65 leading-relaxed">
                Aklınızdaki startup fikrini veya ürün hipotezini yazın. Foundrly Yapay Zekası pazar potansiyelini değerlendirsin ve size özel eylem adımları hazırlasın!
              </p>

              <form onSubmit={handleSimulateIdea} className="mt-5 space-y-3">
                <textarea
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  placeholder="Örn: Üniversite öğrencileri için AI destekli ders çalışma ve akıllı not paylaşım platformu..."
                  className="w-full h-24 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white outline-none focus:border-primary/50 transition placeholder-white/30 resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={isSimulating}
                  className="w-full rounded-xl bg-[linear-gradient(135deg,#5b73db_0%,#475DB2_45%,#3FB170_100%)] py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 transition disabled:opacity-50"
                >
                  {isSimulating ? "Analiz Ediliyor... ⚙️" : "Fikri Analiz Et 🔮"}
                </button>
              </form>

              {/* Simulation Result Overlay/Section */}
              {isSimulating && (
                <div className="mt-5 flex flex-col items-center justify-center py-6 border-t border-white/5">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-primary"></div>
                  <p className="text-xs text-white/75 mt-3 font-semibold">Pazar talebi ve teknik analiz yapılıyor...</p>
                </div>
              )}

              {simResult && (
                <div className="mt-5 border-t border-white/10 pt-4 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/70">Pazar Uyum Skoru:</span>
                    <span className={`text-lg font-black ${simResult.score > 85 ? "text-success" : "text-[#9ab0ff]"}`}>
                      {simResult.score}%
                    </span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-[#3FB170] h-full transition-all duration-1000"
                      style={{ width: `${simResult.score}%` }}
                    />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-white/75 uppercase">Değerlendirme:</h4>
                    <p className="text-xs text-white/80 leading-relaxed mt-1">{simResult.feedback}</p>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-white/75 uppercase">Önerilen Teknolojiler:</h4>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {simResult.techStack.map((tech) => (
                        <span key={tech} className="rounded-full bg-white/5 border border-white/8 px-2 py-0.5 text-[9px] text-white/70">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-white/75 uppercase">Bir Sonraki Adımlar:</h4>
                    <ul className="list-disc pl-4 text-xs text-white/70 space-y-1.5 mt-1.5">
                      {simResult.actionItems.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Quick tips widget */}
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">Girişimci Tüyoları</span>
              <div className="mt-4 space-y-4">
                {[
                  { q: "Müşteri Mülakatı", a: "Fikrinizi satmaya çalışmayın. Karşı tarafın yaşadığı zorlukları dinleyin." },
                  { q: "Hız (Velocity)", a: "Mükemmel olana değil, hızlıca çalışan ürüne odaklanın. İlk versiyon utandırmalıdır." },
                  { q: "Pazarlama (GTM)", a: "Ürünü bitirmeden bekleme listenizi kurup sosyal medyada inşa sürecinizi paylaşın." }
                ].map((tip) => (
                  <div key={tip.q} className="rounded-xl border border-white/5 bg-black/20 p-3.5">
                    <h4 className="text-xs font-bold text-[#9ab0ff]">{tip.q}</h4>
                    <p className="text-[11px] text-white/75 mt-1 leading-normal">{tip.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Reader Modal (Lightweight overlay to read articles) */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-[#071121] p-8 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 right-6 text-2xl text-white/75 hover:text-white transition"
              aria-label="Kapat"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-[#9ab0ff]">
                {activeArticle.category}
              </span>
              <span className="text-xs text-white/75">{activeArticle.date} · {activeArticle.readTime}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-4">
              {activeArticle.icon} {activeArticle.title}
            </h2>

            <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-[#3FB170] flex items-center justify-center text-sm font-bold text-white uppercase">
                {activeArticle.author.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{activeArticle.author}</p>
                <p className="text-[10px] text-white/75">{activeArticle.authorTitle}</p>
              </div>
            </div>

            <div className="text-sm sm:text-base text-white/80 whitespace-pre-wrap leading-relaxed space-y-4">
              {activeArticle.content}
            </div>

            <div className="mt-8 border-t border-white/5 pt-6 flex justify-between items-center">
              <p className="text-xs text-white/75">Faydalı buldunuz mu?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => alert("Geri bildiriminiz için teşekkürler!")}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/80 hover:bg-white/10"
                >
                  👍 Evet
                </button>
                <button
                  onClick={() => alert("Geri bildiriminiz için teşekkürler!")}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/80 hover:bg-white/10"
                >
                  👎 Hayır
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
