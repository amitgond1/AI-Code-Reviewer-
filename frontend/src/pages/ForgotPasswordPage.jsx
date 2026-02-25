import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [devToken, setDevToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const { data } = await api.post("/forgot-password", { email });
      setMessage(data.message);
      setDevToken(data.devResetToken || "");
    } catch (err) {
      setMessage(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="glass-card w-full max-w-md rounded-2xl p-6">
        <h1 className="mb-4 text-3xl font-bold">Forgot Password</h1>
        <p className="mb-4 text-sm text-slate-300">We will email you a reset link.</p>

        <label className="mb-4 block text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2"
          />
        </label>

        <button className="w-full rounded-xl bg-brand-primary px-4 py-2 font-semibold text-white" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && <p className="mt-3 text-sm text-slate-200">{message}</p>}
        {devToken && (
          <p className="mt-2 rounded-lg bg-slate-800/70 p-2 text-xs">
            Dev token: {devToken} (open /reset-password/{devToken})
          </p>
        )}

        <p className="mt-4 text-sm">
          <Link to="/login" className="text-brand-secondary hover:underline">Back to login</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;

