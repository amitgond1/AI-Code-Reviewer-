import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen p-3 sm:p-4">
      <div className="mx-auto flex max-w-[1600px] gap-4">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="fixed inset-0 z-40 bg-slate-950/70 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="h-full w-72"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sidebar mobile onNavigate={() => setMenuOpen(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="w-full">
          <Topbar menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((prev) => !prev)} />
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
