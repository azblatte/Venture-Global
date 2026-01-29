"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AssistantPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I’m the VG Analyst (rule-based). Ask me about VG, its projects, fleet, or LNG pricing spreads.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data?.answer || "Sorry, I couldn’t process that yet.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-[0_12px_40px_-25px_rgba(15,23,42,0.35)]">
        <div className="max-h-[360px] space-y-3 overflow-y-auto pr-2 text-sm">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={
                message.role === "assistant"
                  ? "rounded-xl bg-slate-100/70 p-3 text-slate-700"
                  : "ml-auto max-w-[85%] rounded-xl bg-slate-900 p-3 text-white"
              }
            >
              {message.content}
            </div>
          ))}
          {isLoading ? <div className="text-xs text-slate-400">Thinking...</div> : null}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about VG, pricing spreads, or terminals"
          className="flex-1 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
        >
          Send
        </button>
      </div>

      <div className="text-xs text-slate-500">
        This assistant is rule-based and uses local project notes only. No external AI API calls.
      </div>
    </div>
  );
}
