import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import api from "../utils/api";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, setDark, setLight } = useTheme();
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [status, setStatus] = useState("");

  const changePassword = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      const { data } = await api.put("/change-password", passwords);
      setStatus(data.message);
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setStatus(err.response?.data?.message || "Password update failed");
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Delete account permanently?")) return;

    try {
      await api.delete("/account");
      await logout();
      navigate("/");
    } catch {
      setStatus("Unable to delete account");
    }
  };

  return (
    <PageTransition>
      <div className="space-y-4">
        <section className="glass-card rounded-2xl p-5">
          <h1 className="mb-4 text-xl font-bold">Theme</h1>
          <div className="flex gap-2">
            <button
              onClick={setDark}
              className={`rounded-xl px-4 py-2 ${theme === "dark" ? "bg-brand-primary text-white" : "border border-slate-700"}`}
            >
              Dark Mode
            </button>
            <button
              onClick={setLight}
              className={`rounded-xl px-4 py-2 ${theme === "light" ? "bg-brand-primary text-white" : "border border-slate-700"}`}
            >
              Light Mode
            </button>
          </div>
        </section>

        <section className="glass-card rounded-2xl p-5">
          <h2 className="mb-4 text-xl font-bold">Change Password</h2>
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={changePassword}>
            <input
              type="password"
              placeholder="Current Password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords((prev) => ({ ...prev, currentPassword: e.target.value }))}
              className="rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2"
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))}
              className="rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2"
              required
            />
            <button className="rounded-xl bg-brand-primary px-4 py-2 text-white sm:col-span-2" type="submit">
              Update Password
            </button>
          </form>
        </section>

        <section className="glass-card rounded-2xl border border-red-500/40 p-5">
          <h2 className="mb-3 text-xl font-bold text-red-300">Danger Zone</h2>
          <button onClick={deleteAccount} className="rounded-xl bg-red-500 px-4 py-2 text-white">
            Delete Account
          </button>
        </section>

        {status && <p className="rounded-lg bg-slate-800/70 px-3 py-2 text-sm">{status}</p>}
      </div>
    </PageTransition>
  );
};

export default SettingsPage;

