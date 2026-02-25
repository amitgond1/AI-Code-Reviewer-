import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiCode, FiLock, FiTrendingUp } from "react-icons/fi";

const features = [
  { icon: FiCode, title: "AI Code Review", desc: "Static analysis + AI insights for bugs, smells, security and performance." },
  { icon: FiTrendingUp, title: "Analytics", desc: "Track scores, language trends, and progress over time with visual dashboards." },
  { icon: FiLock, title: "Secure Workspace", desc: "JWT auth, password hashing, protected routes, and account controls." }
];

const techStack = ["React", "Tailwind", "Framer Motion", "Express", "MongoDB", "FastAPI", "Monaco", "OpenAI"];

const testimonials = [
  { name: "Nina Shah", role: "Senior Engineer", quote: "The review quality is shockingly practical. We caught production issues early." },
  { name: "Ethan Cole", role: "CTO", quote: "This feels like having a staff engineer paired with every PR." },
  { name: "Maya Chen", role: "Tech Lead", quote: "The analytics and history view made coaching junior devs much easier." }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen px-4 py-6 sm:px-8">
      <header className="mx-auto mb-10 flex w-full max-w-7xl items-center justify-between rounded-2xl border border-slate-700/60 bg-slate-900/55 px-5 py-4 backdrop-blur-xl">
        <h1 className="brand-font text-xl font-bold">CodePulse AI</h1>
        <div className="flex items-center gap-2">
          <Link to="/login" className="rounded-xl border border-slate-600 px-4 py-2 text-sm">Login</Link>
          <Link to="/signup" className="rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2 text-sm text-white">Start Reviewing</Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-24">
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-secondary/40 bg-brand-secondary/10 px-3 py-1 text-xs text-brand-secondary">
              <FiCheckCircle /> Production-grade AI Review Platform
            </p>
            <h2 className="brand-font text-4xl font-extrabold sm:text-5xl">AI Powered Code Reviewer</h2>
            <p className="mt-4 max-w-xl text-slate-300">
              Upload your code and get professional AI feedback instantly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-3 font-semibold text-white shadow-glow">
                Start Reviewing
                <FiArrowRight />
              </Link>
              <a href="#demo" className="rounded-xl border border-slate-600 px-5 py-3 font-semibold">View Demo</a>
            </div>
          </motion.div>

          <motion.div id="demo" className="glass-card rounded-3xl p-6" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="mb-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-800/70 p-3">
                <p className="text-xs text-slate-400">Avg Score</p>
                <p className="text-2xl font-bold text-brand-secondary">84</p>
              </div>
              <div className="rounded-xl bg-slate-800/70 p-3">
                <p className="text-xs text-slate-400">Reviews</p>
                <p className="text-2xl font-bold text-brand-secondary">12.8K</p>
              </div>
              <div className="rounded-xl bg-slate-800/70 p-3">
                <p className="text-xs text-slate-400">Speed</p>
                <p className="text-2xl font-bold text-brand-secondary">6s</p>
              </div>
            </div>
            <div className="rounded-xl border border-slate-700/60 bg-slate-900/80 p-4 text-sm text-slate-300">
              <p className="mb-2 text-brand-secondary">Sample AI Insight</p>
              <p>
                Nested loop detected. Time complexity may degrade to O(n^2). Consider using hash maps to reduce repeated search.
              </p>
            </div>
          </motion.div>
        </section>

        <section>
          <h3 className="mb-6 text-2xl font-bold">Features</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map(({ title, desc, icon: Icon }) => (
              <div key={title} className="glass-card rounded-2xl p-5">
                <Icon className="mb-3 text-2xl text-brand-secondary" />
                <h4 className="mb-2 font-semibold">{title}</h4>
                <p className="text-sm text-slate-300">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-6 text-2xl font-bold">Screenshots</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {["Review Engine", "Analytics", "History"].map((shot) => (
              <div key={shot} className="glass-card rounded-2xl p-4">
                <div className="mb-3 h-36 rounded-xl bg-gradient-to-br from-brand-primary/30 to-brand-secondary/25" />
                <p className="font-semibold">{shot}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-6 text-2xl font-bold">Technology Stack</h3>
          <div className="flex flex-wrap gap-2">
            {techStack.map((item) => (
              <span key={item} className="rounded-full border border-slate-600 bg-slate-900/50 px-3 py-1 text-sm">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-6 text-2xl font-bold">Testimonials</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-5">
                <p className="mb-3 text-sm text-slate-200">"{t.quote}"</p>
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-slate-400">{t.role}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-20 w-full max-w-7xl border-t border-slate-700/60 py-6 text-sm text-slate-400">
        <p>© {new Date().getFullYear()} CodePulse AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

