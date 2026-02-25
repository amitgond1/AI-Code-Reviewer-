const extensionToLanguage = {
  ".py": "python",
  ".js": "javascript",
  ".jsx": "javascript",
  ".ts": "javascript",
  ".tsx": "javascript",
  ".cpp": "cpp",
  ".cc": "cpp",
  ".cxx": "cpp",
  ".c": "c",
  ".java": "java",
  ".txt": "text"
};

export const detectLanguageByFileName = (name = "") => {
  const lowered = name.toLowerCase();
  const key = Object.keys(extensionToLanguage).find((ext) => lowered.endsWith(ext));
  return key ? extensionToLanguage[key] : "text";
};

export const detectLanguageByContent = (code = "") => {
  const sample = code.slice(0, 1200);

  if (/^\s*#include\s*</m.test(sample)) return "cpp";
  if (/^\s*def\s+\w+\(/m.test(sample) || /^\s*import\s+\w+/m.test(sample)) return "python";
  if (/^\s*function\s+\w+\(/m.test(sample) || /console\.log\(/.test(sample)) return "javascript";
  if (/^\s*public\s+class\s+\w+/m.test(sample) || /System\.out\.println/.test(sample)) return "java";
  if (/^\s*int\s+main\s*\(/m.test(sample)) return "c";

  return "text";
};

export const countCodeLines = (code = "") =>
  code
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .length;
