import { useState } from "react";

interface ConnectionUser {
  id: number;
  name: string;
  username: string;
  role: string;
  skills: string[];
  common: string;
  match: number;
  initials: string;
  connected: boolean;
}

const INITIAL_NETWORK_USERS: ConnectionUser[] = [
  { id: 1, name: "Cem Yılmaz", username: "cemy", role: "Backend Geliştirici", skills: ["Python", "Django"], common: "Python ile örtüşüyor", match: 88, initials: "CY", connected: false },
  { id: 2, name: "Elif Öztürk", username: "elifo", role: "UI/UX Tasarımcı", skills: ["Figma", "Design"], common: "Tasarım araçlarında ortak", match: 82, initials: "EÖ", connected: false },
  { id: 3, name: "Hasan Demir", username: "hasand", role: "YZ Mühendisi", skills: ["Python", "ML"], common: "Python ve ML'de örtüşüyor", match: 91, initials: "HD", connected: false },
  { id: 4, name: "İrem Şahin", username: "irems", role: "Ürün Yöneticisi", skills: ["Agile", "Notion"], common: "Agile metodoloji", match: 76, initials: "İŞ", connected: false },
  { id: 5, name: "Kaan Arslan", username: "kaana", role: "Full-Stack Geliştirici", skills: ["React", "Node.js"], common: "React stack'inde ortak", match: 85, initials: "KA", connected: true },
  { id: 6, name: "Melis Aydın", username: "melisa", role: "Veri Bilimci", skills: ["Python", "SQL"], common: "Veri analizi alanında ortak", match: 79, initials: "MA", connected: true },
  { id: 7, name: "Onur Koç", username: "onurk", role: "Mobile Geliştirici", skills: ["Flutter", "Swift"], common: "Cross-platform geliştirme", match: 83, initials: "OK", connected: false },
  { id: 8, name: "Pelin Kara", username: "pelinka", role: "Startup Kurucusu", skills: ["Strategy", "Growth"], common: "Startup dünyası ortak", match: 71, initials: "PK", connected: false },
];

interface NetworkPageProps {
  onStartChat?: (name: string) => void;
  onViewProfile?: (name: string) => void;
}

export default function NetworkPage({ onStartChat, onViewProfile }: NetworkPageProps) {
  const [users, setUsers] = useState<ConnectionUser[]>(INITIAL_NETWORK_USERS);
  const [tab, setTab] = useState<"discover" | "connections">("discover");
  const [requested, setRequested] = useState<Set<number>>(new Set());
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const connected = users.filter((u) => u.connected);
  const discover = users.filter((u) => !u.connected);

  const handleRequestConnection = (userId: number) => {
    const s = new Set(requested);
    if (s.has(userId)) {
      s.delete(userId);
    } else {
      s.add(userId);
      setAlertMessage("Bağlantı isteğiniz başarıyla iletildi!");
      setTimeout(() => setAlertMessage(null), 3000);
    }
    setRequested(s);
  };

  const handleRemoveConnection = (userId: number, userName: string) => {
    if (window.confirm(`${userName} isimli kişiyi bağlantılarınızdan silmek istediğinize emin misiniz?`)) {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, connected: false } : u))
      );
      setAlertMessage(`${userName} bağlantılarınızdan başarıyla kaldırıldı.`);
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Alert toast notification */}
      {alertMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-success/20 bg-[#071521] px-5 py-4 text-sm text-success shadow-[0_20px_50px_rgba(63,177,112,0.2)] animate-slideUp">
          <span>🤝</span>
          <span className="font-semibold">{alertMessage}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { value: connected.length + 22, label: "Toplam Bağlantı", icon: "🤝" },
          { value: "7", label: "Bu Hafta Yeni", icon: "📈" },
          { value: "12,430", label: "Topluluk Üyesi", icon: "🌐" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/5 bg-white/3 p-6 shadow-sm">
            <div className="text-2xl">{s.icon}</div>
            <p className="mt-2 text-3xl font-extrabold text-white">{s.value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/75">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-4">
        {[
          { key: "discover", label: "Keşfet" },
          { key: "connections", label: `Bağlantılarım (${connected.length})` },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key as "discover" | "connections")}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
              tab === t.key
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white/5 border border-white/8 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Discover Section */}
      {tab === "discover" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {discover.map((user) => (
            <article
              key={user.id}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-primary/30 hover:bg-white/8 flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#475DB2,#3FB170)] text-lg font-black text-white shadow-lg">
                    {user.initials}
                  </div>
                  <h3 className="mt-4 font-bold text-white leading-tight">{user.name}</h3>
                  <p className="text-xs text-white/75">@{user.username}</p>
                  <p className="mt-1 text-xs font-semibold text-[#9ab0ff]">{user.role}</p>
                </div>

                <div className="mt-4 rounded-xl border border-white/5 bg-white/3 px-3 py-2.5 text-xs font-semibold text-white/80 text-center">
                  🔗 {user.common}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-white/75">{user.match}% uyum</span>
                  <div className="h-1.5 w-24 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-1.5 rounded-full bg-primary" style={{ width: `${user.match}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleRequestConnection(user.id)}
                  className={`rounded-xl py-2 text-xs font-bold transition ${
                    requested.has(user.id)
                      ? "border border-success/30 bg-success/15 text-success"
                      : "bg-primary text-white hover:opacity-90"
                  }`}
                >
                  {requested.has(user.id) ? "✓ Gönderildi" : "Bağlantı İste"}
                </button>
                <button
                  type="button"
                  onClick={() => onViewProfile ? onViewProfile(user.name) : alert(`${user.name} profil detayları simüle ediliyor...`)}
                  className="rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/8"
                >
                  Profil
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Connections Section */}
      {tab === "connections" && (
        <div className="space-y-3">
          {connected.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-12 text-center backdrop-blur">
              <p className="text-lg text-white/75 font-semibold">Aktif bağlantınız bulunmuyor.</p>
              <p className="text-sm text-white/70 mt-1">Yeni bağlantılar kurmak için "Keşfet" sekmesini ziyaret edin.</p>
            </div>
          ) : (
            connected.map((user) => (
              <div
                key={user.id}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 backdrop-blur hover:border-white/18 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#475DB2,#3FB170)] text-sm font-black text-white">
                    {user.initials}
                  </div>
                  <div>
                    <p className="font-bold text-white">{user.name}</p>
                    <p className="text-xs text-white/75">
                      {user.role} · <span className="text-[#9ab0ff]">@{user.username}</span>
                    </p>
                    <p className="mt-0.5 text-[10px] font-bold text-success uppercase tracking-wider flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-success inline-block"></span> Bağlı
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onStartChat ? onStartChat(user.name) : alert(`${user.name} ile sohbet arayüzü başlatılıyor...`)}
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-95 transition"
                  >
                    Mesaj Gönder
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveConnection(user.id, user.name)}
                    className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition"
                  >
                    Bağlantıyı Sil 🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
