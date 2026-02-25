import { useState } from "react";
import { FiSend } from "react-icons/fi";
import api from "../utils/api";

const ChatAssistant = ({ code = "", language = "text" }) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Ask me anything about improving this code." }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim() || loading) return;

    const q = question.trim();
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);

    try {
      const { data } = await api.post("/chat", { question: q, code, language });
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Unable to reach AI assistant." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4">
      <p className="mb-3 text-sm text-slate-400">AI Chat Assistant</p>

      <div className="mb-3 h-56 space-y-2 overflow-auto rounded-xl border border-slate-700/70 p-3">
        {messages.map((msg, index) => (
          <div
            key={`${msg.role}-${index}`}
            className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
              msg.role === "assistant"
                ? "bg-slate-800/80 text-slate-100"
                : "ml-auto bg-brand-primary/80 text-white"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="How to improve this code?"
          className="w-full rounded-xl border border-slate-700/70 bg-slate-800/50 px-3 py-2 outline-none focus:border-brand-primary"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary px-4 text-white disabled:opacity-60"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default ChatAssistant;

