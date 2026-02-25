import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", rememberMe: true });
  const [error, setError] = useState("");
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form);
      navigate(location.state?.from || "/app/dashboard", { replace: true });
    } catch (err) {
      if (!err.response) {
        setError(`Cannot reach server (${apiBase}). Start backend service and try again.`);
      } else {
        setError(err.response?.data?.message || "Unable to login");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="glass-card w-full max-w-md rounded-2xl p-6">
        <h1 className="mb-6 text-3xl font-bold">Login</h1>

        {error && <p className="mb-3 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">{error}</p>}

        <label className="mb-3 block text-sm">
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2 outline-none focus:border-brand-primary"
          />
        </label>

        <label className="mb-3 block text-sm">
          Password
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2 outline-none focus:border-brand-primary"
          />
        </label>

        <label className="mb-4 flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={form.rememberMe}
            onChange={(e) => setForm((prev) => ({ ...prev, rememberMe: e.target.checked }))}
          />
          Remember Me
        </label>

        <button
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <div className="mt-4 flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="text-brand-secondary hover:underline">
            Forgot Password?
          </Link>
          <Link to="/signup" className="text-brand-secondary hover:underline">
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

