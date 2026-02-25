import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(form);
      navigate("/app/dashboard");
    } catch (err) {
      if (!err.response) {
        setError(`Cannot reach server (${apiBase}). Start backend service and try again.`);
      } else {
        setError(err.response?.data?.message || "Unable to signup");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="glass-card w-full max-w-md rounded-2xl p-6">
        <h1 className="mb-6 text-3xl font-bold">Create Account</h1>

        {error && <p className="mb-3 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">{error}</p>}

        <label className="mb-3 block text-sm">
          Name
          <input
            required
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2 outline-none focus:border-brand-primary"
          />
        </label>

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

        <label className="mb-4 block text-sm">
          Password
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2 outline-none focus:border-brand-primary"
          />
        </label>

        <button
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Creating..." : "Signup"}
        </button>

        <p className="mt-4 text-sm">
          Already have an account? <Link to="/login" className="text-brand-secondary hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;

