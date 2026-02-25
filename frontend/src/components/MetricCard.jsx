import { motion } from "framer-motion";

const MetricCard = ({ label, value, accent = "from-brand-primary to-brand-secondary" }) => {
  return (
    <motion.div
      className="glass-card rounded-2xl p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-2 bg-gradient-to-r ${accent} bg-clip-text text-2xl font-bold text-transparent`}>{value}</p>
    </motion.div>
  );
};

export default MetricCard;

