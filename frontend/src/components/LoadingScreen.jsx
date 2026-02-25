import { motion } from "framer-motion";

const LoadingScreen = ({ text = "Analyzing your code...", progress = 65 }) => {
  return (
    <div className="glass-card rounded-2xl p-8 text-center">
      <motion.div
        className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-brand-primary/30 border-t-brand-secondary"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      />
      <p className="mb-3 text-lg font-semibold">{text}</p>
      <motion.p
        className="mb-5 text-slate-300"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        Please wait while the AI inspects logic, quality, security and performance...
      </motion.p>
      <div className="mx-auto h-2 w-full max-w-xl overflow-hidden rounded-full bg-slate-700/40">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;

