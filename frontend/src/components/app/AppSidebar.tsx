import { useState } from "react";

type CurrentUser = {
  full_name: string;
  title: string;
  is_premium: boolean;
  is_staff: boolean;
  profile_picture?: string | null;
};

type NavItem = {
  icon: string;
  label: string;
  href: string;
  badge?: "premium" | "count" | "admin" | "gold";
  adminOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { icon: "🏠", label: "Dashboard", href: "#app-home" },
  { icon: "📁", label: "Projeler", href: "#app-create" },
  { icon: "🔍", label: "Keşfet", href: "#discover" },
  { icon: "🤖", label: "YZ Takım Kurucu", href: "#app-ai-builder", badge: "premium" },
  { icon: "💬", label: "Mesajlar", href: "#app-messages", badge: "count" },
  { icon: "🎓", label: "Mentörler", href: "#app-mentors" },
  { icon: "🎤", label: "Etkinlikler", href: "#events" },
  { icon: "👤", label: "Profilim", href: "#app-profile" },
  { icon: "⭐", label: "Premium", href: "#premium", badge: "gold" },
  { icon: "🛡️", label: "Yönetim", href: "#app-admin", badge: "admin", adminOnly: true },
];

interface AppSidebarProps {
  currentRoute: string;
  currentUser: CurrentUser | null;
  onLogout: () => void;
  unreadMessages?: number;
  isAdmin?: boolean;
}

export default function AppSidebar({
  currentRoute,
  currentUser,
  onLogout,
  unreadMessages = 0,
  isAdmin = false,
}: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const visibleNav = NAV_ITEMS.filter((item) => {
    if (item.adminOnly) return isAdmin;
    return true;
  });

  const initials = currentUser?.full_name
    ? currentUser.full_name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const isActive = (href: string) => {
    const routeKey = href.replace("#", "");
    return currentRoute === routeKey || currentRoute === href;
  };

  return (
    <aside
      className={`
        relative flex flex-col h-screen transition-all duration-300 ease-in-out select-none
        ${collapsed ? "w-[72px]" : "w-[240px]"}
        shrink-0
      `}
      style={{
        background:
          "linear-gradient(180deg, rgba(24,35,63,0.98) 0%, rgba(35,52,93,0.97) 55%, rgba(27,45,73,0.99) 100%)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "4px 0 32px rgba(11,20,41,0.22)",
      }}
    >
      {/* Top: Logo + Collapse Button */}
      <div
        className={`flex items-center h-16 px-3 shrink-0 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        {!collapsed && (
          <a
            href="#app-home"
            className="flex items-center gap-2 group"
            tabIndex={0}
          >
            {/* Logo Mark */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #475DB2 0%, #6B7FCC 100%)",
                boxShadow: "0 4px 14px rgba(71,93,178,0.45)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M3 14L7.5 4L12 9.5L15 6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="15" cy="6" r="1.5" fill="#D7B56D" />
              </svg>
            </div>
            <span
              className="font-black tracking-tight text-white text-lg leading-none"
              style={{ letterSpacing: "-0.02em" }}
            >
              Foundrly
            </span>
          </a>
        )}

        {collapsed && (
          <a href="#app-home" className="block">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #475DB2 0%, #6B7FCC 100%)",
                boxShadow: "0 4px 14px rgba(71,93,178,0.45)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M3 14L7.5 4L12 9.5L15 6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="15" cy="6" r="1.5" fill="#D7B56D" />
              </svg>
            </div>
          </a>
        )}

        <button
          onClick={() => setCollapsed((v) => !v)}
          className={`
            flex items-center justify-center w-7 h-7 rounded-md transition-all duration-200
            hover:bg-white/10 text-white/70 hover:text-white
            ${collapsed ? "absolute -right-3 top-[18px] bg-[#2A3D60] border border-white/10 shadow-lg w-6 h-6 rounded-full" : ""}
          `}
          title={collapsed ? "Menüyü Genişlet" : "Menüyü Daralt"}
          aria-label={collapsed ? "Genişlet" : "Daralt"}
        >
          {collapsed ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M4 2L8 6L4 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M9 2L5 7L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5 scrollbar-thin">
        {visibleNav.map((item) => {
          const active = isActive(item.href);
          const isGold = item.badge === "gold";
          const isPremiumBadge = item.badge === "premium";
          const isCountBadge = item.badge === "count";
          const isAdminBadge = item.badge === "admin";

          return (
            <a
              key={item.href}
              href={item.href}
              className={`
                group relative flex items-center gap-3 rounded-xl px-3 py-2.5
                transition-all duration-200 no-underline
                ${collapsed ? "justify-center" : ""}
                ${
                  active
                    ? "bg-primary/20 text-white shadow-[0_0_0_1px_rgba(71,93,178,0.35),inset_0_1px_0_rgba(255,255,255,0.07)]"
                    : isGold
                    ? "text-aurum/80 hover:bg-aurum/10 hover:text-aurum"
                    : isAdminBadge
                    ? "text-white/75 hover:bg-white/8 hover:text-white"
                    : "text-white/75 hover:bg-white/8 hover:text-white"
                }
              `}
              title={collapsed ? item.label : undefined}
            >
              {/* Active indicator bar */}
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
                  aria-hidden="true"
                />
              )}

              {/* Icon */}
              <span
                className={`text-base leading-none shrink-0 transition-transform duration-200 ${
                  active ? "" : "group-hover:scale-110"
                }`}
              >
                {item.icon}
              </span>

              {/* Label + Badges */}
              {!collapsed && (
                <>
                  <span
                    className={`flex-1 text-sm font-medium truncate ${
                      active ? "font-semibold text-white" : ""
                    } ${isGold && !active ? "font-semibold" : ""}`}
                  >
                    {item.label}
                  </span>

                  {/* Premium badge */}
                  {isPremiumBadge && (
                    <span
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide"
                      style={{
                        background: "linear-gradient(135deg, rgba(71,93,178,0.35) 0%, rgba(107,127,204,0.30) 100%)",
                        border: "1px solid rgba(71,93,178,0.35)",
                        color: "#8fa3e8",
                      }}
                    >
                      PRO
                    </span>
                  )}

                  {/* Unread count badge */}
                  {isCountBadge && unreadMessages > 0 && (
                    <span
                      className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg, #475DB2 0%, #3b50a0 100%)",
                        boxShadow: "0 2px 8px rgba(71,93,178,0.5)",
                      }}
                    >
                      {unreadMessages > 99 ? "99+" : unreadMessages}
                    </span>
                  )}

                  {/* Admin badge */}
                  {isAdminBadge && (
                    <span
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide"
                      style={{
                        background: "rgba(215,181,109,0.15)",
                        border: "1px solid rgba(215,181,109,0.3)",
                        color: "#D7B56D",
                      }}
                    >
                      YÖN
                    </span>
                  )}

                  {/* Gold star for premium item */}
                  {isGold && (
                    <span className="text-aurum text-xs">✦</span>
                  )}
                </>
              )}

              {/* Collapsed: count dot */}
              {collapsed && isCountBadge && unreadMessages > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #475DB2 0%, #3b50a0 100%)",
                    boxShadow: "0 2px 6px rgba(71,93,178,0.5)",
                  }}
                >
                  {unreadMessages > 9 ? "9+" : unreadMessages}
                </span>
              )}

              {/* Collapsed tooltip on hover */}
              {collapsed && (
                <span
                  className="
                    pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2
                    whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-white
                    opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50
                  "
                  style={{
                    background: "linear-gradient(135deg, #1B2D49 0%, #243461 100%)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                  }}
                >
                  {item.label}
                  {isPremiumBadge && (
                    <span className="ml-1.5 text-[9px] font-bold text-primary/80 uppercase">PRO</span>
                  )}
                  {isCountBadge && unreadMessages > 0 && (
                    <span className="ml-1.5 text-[9px] font-bold text-white/80">
                      ({unreadMessages})
                    </span>
                  )}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Divider */}
      <div
        className="mx-3 shrink-0"
        style={{ height: "1px", background: "rgba(255,255,255,0.07)" }}
      />

      {/* Bottom: User Info + Logout */}
      <div className={`shrink-0 p-3 ${collapsed ? "flex flex-col items-center gap-2" : ""}`}>
        {/* User Info */}
        <div
          className={`flex items-center gap-3 rounded-xl p-2.5 transition-colors duration-200 hover:bg-white/8 cursor-pointer ${
            collapsed ? "justify-center" : ""
          }`}
          onClick={() => { window.location.hash = "#app-profile"; }}
          title={collapsed ? `${currentUser?.full_name ?? "Kullanıcı"} — Profilim` : undefined}
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            {currentUser?.profile_picture ? (
              <img
                src={currentUser.profile_picture}
                alt={currentUser.full_name}
                className="w-9 h-9 rounded-full object-cover"
                style={{
                  border: currentUser.is_premium
                    ? "2px solid rgba(215,181,109,0.7)"
                    : "2px solid rgba(255,255,255,0.15)",
                  boxShadow: currentUser.is_premium
                    ? "0 0 12px rgba(215,181,109,0.3)"
                    : "none",
                }}
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #475DB2 0%, #6B7FCC 100%)",
                  border: currentUser?.is_premium
                    ? "2px solid rgba(215,181,109,0.7)"
                    : "2px solid rgba(255,255,255,0.15)",
                  boxShadow: currentUser?.is_premium
                    ? "0 0 12px rgba(215,181,109,0.3)"
                    : "none",
                }}
              >
                {initials}
              </div>
            )}

            {/* Premium crown indicator */}
            {currentUser?.is_premium && (
              <span
                className="absolute -top-1 -right-1 text-[10px] leading-none"
                title="Premium üye"
              >
                ✦
              </span>
            )}

            {/* Online dot */}
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
              style={{
                background: "#3FB170",
                borderColor: "rgba(24,35,63,0.98)",
              }}
            />
          </div>

          {/* Name & Role */}
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white/90 truncate leading-tight">
                {currentUser?.full_name ?? "Kullanıcı"}
              </p>
              <p className="text-xs text-white/70 truncate leading-tight mt-0.5">
                {currentUser?.title ?? "Kurucu"}
              </p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        {!collapsed ? (
          <button
            onClick={onLogout}
            className="
              mt-1 w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium
              text-white/70 hover:text-white hover:bg-white/8
              transition-all duration-200 group
            "
          >
            <svg
              className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Çıkış Yap</span>
          </button>
        ) : (
          <button
            onClick={onLogout}
            className="
              flex items-center justify-center w-9 h-9 rounded-xl
              text-white/70 hover:text-white hover:bg-white/8
              transition-all duration-200
            "
            title="Çıkış Yap"
            aria-label="Çıkış Yap"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Version tag */}
        {!collapsed && (
          <p className="mt-2 text-center text-[10px] text-white/65 font-medium tracking-widest uppercase">
            Foundrly v1.0
          </p>
        )}
      </div>
    </aside>
  );
}
