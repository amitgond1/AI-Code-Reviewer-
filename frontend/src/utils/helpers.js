export const formatDate = (date) => new Date(date).toLocaleString();

export const getComplexitySeverity = (complexity = "") => {
  if (complexity.includes("n^2") || complexity.includes("2^n") || complexity.includes("n!")) return "High";
  if (complexity.includes("n log n") || complexity.includes("n")) return "Medium";
  return "Low";
};

export const languageLabel = (lang = "text") => {
  const map = {
    cpp: "C++",
    c: "C",
    javascript: "JavaScript",
    python: "Python",
    java: "Java",
    mixed: "Mixed",
    text: "Text"
  };
  return map[lang] || lang;
};

export const calcProgress = (value = 0, max = 100) => Math.max(0, Math.min(100, Math.round((value / max) * 100)));
