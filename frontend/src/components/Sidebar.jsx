import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiCode,
  FiClock,
  FiHome,
  FiLogOut,
  FiSettings,
  FiUser
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";

const links = [
  { label: "Dashboard", to: "/app/dashboard", icon: FiHome },
  { label: "Review Code", to: "/app/review", icon: FiCode },
  { label: "Review History", to: "/app/history", icon: FiClock },
  { label: "Analytics", to: "/app/analytics", icon: FiBarChart2 },
  { label: "Profile", to: "/app/profile", icon: FiUser },
  { label: "Settings", to: "/app/settings", icon: FiSettings }
];

const linkStyles = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2 transition ${
    isActive
      ? "bg-gradient-to-r from-brand-primary/90 to-brand-secondary/90 text-white shadow-glow"
      : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
  }`;

const Sidebar = ({ mobile = false, onNavigate }) => {
  const { logout } = useAuth();

  return (
    <motion.aside
      initial={{ x: mobile ? -40 : 0, opacity: mobile ? 0 : 1 }}
      animate={{ x: 0, opacity: 1 }}
      className="glass-card h-full w-72 rounded-r-2xl border-l-0 p-5"
    >
      <div className="mb-8 flex items-center gap-2">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary" />
        <h1 className="brand-font text-xl font-bold">CodePulse AI</h1>
      </div>

      <nav className="space-y-2">
        {links.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={linkStyles}
          >
            <Icon className="text-lg" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="mt-8 flex w-full items-center gap-3 rounded-xl border border-slate-700/70 px-3 py-2 text-slate-300 transition hover:border-red-500/70 hover:text-red-300"
      >
        <FiLogOut />
        Logout
      </button>
    </motion.aside>
  );
};

export default Sidebar;

