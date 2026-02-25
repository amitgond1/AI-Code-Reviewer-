import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const { data } = await api.post(`/reset-password/${token}`, { password });
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="glass-card w-full max-w-md rounded-2xl p-6">
        <h1 className="mb-4 text-3xl font-bold">Reset Password</h1>

        <label className="mb-4 block text-sm">
          New Password
          <input
            type="password"
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2"
          />
        </label>

        <button className="w-full rounded-xl bg-brand-primary px-4 py-2 font-semibold text-white" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>

        {message && <p className="mt-3 text-sm text-slate-200">{message}</p>}

        <p className="mt-4 text-sm">
          <Link to="/login" className="text-brand-secondary hover:underline">Back to login</Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPasswordPage;

