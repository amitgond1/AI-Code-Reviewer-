import { motion } from "framer-motion";

const ReviewResultCards = ({ review }) => {
  const cards = [
    ["Bug Detection", review?.bugs],
    ["Improvements", review?.improvements],
    ["Best Practices", review?.code_smells],
    ["Security Warnings", review?.security_warnings],
    ["Duplicate Code", review?.duplicate_code],
    ["Performance Suggestions", review?.performance_suggestions],
    ["Naming Suggestions", review?.naming_suggestions],
    ["Better Code", review?.better_code]
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map(([title, text], idx) => (
        <motion.div
          key={title}
          className="glass-card rounded-2xl p-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.04 }}
        >
          <h3 className="mb-2 text-sm font-semibold text-brand-secondary">{title}</h3>
          <p className="text-sm text-slate-200">{text || "N/A"}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default ReviewResultCards;

