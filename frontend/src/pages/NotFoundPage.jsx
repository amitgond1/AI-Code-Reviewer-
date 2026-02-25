import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center p-6">
    <div className="glass-card rounded-2xl p-8 text-center">
      <h1 className="mb-2 text-3xl font-bold">404</h1>
      <p className="mb-4 text-slate-300">Page not found.</p>
      <Link to="/" className="rounded-xl bg-brand-primary px-4 py-2 text-white">
        Back Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;

