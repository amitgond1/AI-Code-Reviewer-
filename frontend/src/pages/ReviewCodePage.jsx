import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { FiGithub, FiUploadCloud } from "react-icons/fi";
import PageTransition from "../components/PageTransition";
import LoadingScreen from "../components/LoadingScreen";
import ScoreRadial from "../components/ScoreRadial";
import ComplexityChart from "../components/ComplexityChart";
import ReviewResultCards from "../components/ReviewResultCards";
import ChatAssistant from "../components/ChatAssistant";
import { useTheme } from "../hooks/useTheme";
import api from "../utils/api";

const languageFromFile = (name = "") => {
  const low = name.toLowerCase();
  if (low.endsWith(".cpp") || low.endsWith(".cc") || low.endsWith(".cxx")) return "cpp";
  if (low.endsWith(".py")) return "python";
  if (low.endsWith(".js") || low.endsWith(".jsx") || low.endsWith(".ts") || low.endsWith(".tsx")) return "javascript";
  if (low.endsWith(".java")) return "java";
  if (low.endsWith(".c")) return "c";
  return "text";
};

const initialSnippet = `def two_sum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []`;

const ReviewCodePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [code, setCode] = useState(initialSnippet);
  const [language, setLanguage] = useState("python");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(22);
  const [review, setReview] = useState(null);
  const [error, setError] = useState("");

  const linesOfCode = useMemo(() => code.split(/\r?\n/).filter((line) => line.trim()).length, [code]);

  useEffect(() => {
    if (!isAnalyzing) return undefined;
    const id = setInterval(() => {
      setProgress((prev) => (prev >= 92 ? prev : prev + Math.random() * 8));
    }, 450);
    return () => clearInterval(id);
  }, [isAnalyzing]);

  const onFileChange = async (event) => {
    const picked = event.target.files?.[0];
    if (!picked) return;

    setFile(picked);
    setFileName(picked.name);
    const detected = languageFromFile(picked.name);
    setLanguage(detected);

    const text = await picked.text();
    setCode(text);
  };

  const submitReview = async () => {
    setError("");
    setIsAnalyzing(true);
    setProgress(25);

    try {
      let response;
      if (githubRepo.trim()) {
        response = await api.post("/review/github", { githubRepo: githubRepo.trim(), language });
      } else if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("language", language);
        response = await api.post("/review", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        response = await api.post("/review", { code, language });
      }

      setProgress(100);
      setReview(response.data.review);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to review code.");
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
        setProgress(22);
      }, 400);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Review Code</h1>

        <div className="grid gap-4 xl:grid-cols-3">
          <div className="glass-card rounded-2xl p-4 xl:col-span-2">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm"
              >
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="c">C</option>
                <option value="text">Text</option>
              </select>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm">
                <FiUploadCloud /> Upload File
                <input type="file" className="hidden" accept=".cpp,.py,.js,.java,.txt,.c" onChange={onFileChange} />
              </label>

              <button
                onClick={submitReview}
                className="ml-auto rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2 text-sm font-semibold text-white"
              >
                Review Code
              </button>
            </div>

            <div className="mb-3 grid gap-2 text-xs text-slate-300 sm:grid-cols-3">
              <p className="rounded-lg border border-slate-700/60 px-2 py-1">File: {fileName || "Pasted code"}</p>
              <p className="rounded-lg border border-slate-700/60 px-2 py-1">Language: {language}</p>
              <p className="rounded-lg border border-slate-700/60 px-2 py-1">Lines: {linesOfCode}</p>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-700/60">
              <Editor
                height="500px"
                language={language === "cpp" ? "cpp" : language}
                value={code}
                onChange={(val) => setCode(val || "")}
                theme={theme === "dark" ? "vs-dark" : "light"}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  automaticLayout: true,
                  tabSize: 2,
                  autoIndent: "advanced"
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-4">
              <p className="mb-3 text-sm text-slate-400">GitHub Integration</p>
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-700/70 px-3 py-2">
                <FiGithub className="text-slate-300" />
                <input
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="https://github.com/user/repo"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
              <p className="text-xs text-slate-400">Paste a public repo link and run review automatically.</p>
            </div>

            <ChatAssistant code={code} language={language} />
          </div>
        </div>

        {error && <p className="rounded-xl bg-red-500/20 px-3 py-2 text-sm text-red-200">{error}</p>}

        {isAnalyzing && <LoadingScreen progress={progress} />}

        {review && !isAnalyzing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Latest Review</h2>
              <button
                onClick={() => navigate(`/app/history/${review._id}`)}
                className="rounded-xl border border-brand-secondary px-3 py-2 text-sm text-brand-secondary"
              >
                Open Full Result
              </button>
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              <ScoreRadial score={review.score} />
              <div className="xl:col-span-2">
                <ComplexityChart
                  timeComplexity={review.time_complexity}
                  spaceComplexity={review.space_complexity}
                />
              </div>
            </div>
            <ReviewResultCards review={review} />
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default ReviewCodePage;

