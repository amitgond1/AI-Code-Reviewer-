import { useEffect, useState } from "react";
import { FiBell, FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { formatDate } from "../utils/helpers";

const Topbar = ({ menuOpen = false, onMenuToggle }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    const { data } = await api.get("/notifications");
    setNotifications(data.notifications || []);
    setUnreadCount(data.unreadCount || 0);
  };

  useEffect(() => {
    loadNotifications().catch(() => {});
  }, []);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    loadNotifications().catch(() => {});
  };

  return (
    <header className="sticky top-0 z-30 mb-6 flex items-center justify-between gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuToggle}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="rounded-lg border border-slate-700/70 p-2 text-slate-200 lg:hidden"
        >
          {menuOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
        </button>
        <p className="hidden text-sm text-slate-300 sm:block">Build better code with AI.</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="rounded-xl border border-slate-700/70 p-2 text-slate-200 hover:border-brand-secondary"
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="relative rounded-xl border border-slate-700/70 p-2 text-slate-200 hover:border-brand-primary"
          >
            <FiBell />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-700/60 bg-slate-900 p-3 shadow-glass">
              <p className="mb-2 text-sm font-semibold">Notifications</p>
              <div className="max-h-80 space-y-2 overflow-auto">
                {notifications.length ? (
                  notifications.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => markRead(item._id)}
                      className={`w-full rounded-lg border px-3 py-2 text-left ${
                        item.isRead
                          ? "border-slate-700/40 bg-slate-800/40"
                          : "border-brand-primary/50 bg-brand-primary/10"
                      }`}
                    >
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-slate-300">{item.message}</p>
                      <p className="mt-1 text-[11px] text-slate-400">{formatDate(item.createdAt)}</p>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No notifications yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-700/70 px-2 py-1">
          <img
            src={
              user?.profileImage
                ? `${import.meta.env.VITE_API_URL?.replace("/api", "")}${user.profileImage}`
                : "https://api.dicebear.com/9.x/initials/svg?seed=AI"
            }
            alt="avatar"
            className="h-8 w-8 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold leading-none">{user?.name}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

