"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const EXPERTS = ["Greg Isenberg", "Lenny Rachitsky", "Alex Hormozi", "Andrej Karpathy"];

const EXAMPLE_QUERIES = [
  "How do I price my SaaS?",
  "What makes a great cold email?",
  "When should I hire my first employee?",
  "How do I find product-market fit?",
  "What's the fastest way to get first 100 users?",
  "Should I build in public?",
];

const PIXEL: React.CSSProperties = { fontFamily: "'Press Start 2P', monospace" };

export default function HeroQueries() {
  const [expertIdx, setExpertIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const iv = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setExpertIdx((i) => (i + 1) % EXPERTS.length);
        setFade(true);
      }, 300);
    }, 2400);
    return () => clearInterval(iv);
  }, []);

  function submit(q: string) {
    if (!q.trim()) return;
    router.push(`/skills?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl">
      {/* Headline */}
      <h1 className="text-xl md:text-2xl text-white text-center leading-relaxed" style={PIXEL}>
        What would{" "}
        <span
          className="text-amber-400"
          style={{ transition: "opacity 0.3s", opacity: fade ? 1 : 0, display: "inline-block", minWidth: "12ch" }}
        >
          {EXPERTS[expertIdx]}
        </span>
        <br />do?
      </h1>

      {/* Search bar */}
      <div className="w-full flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit(query)}
          placeholder="Ask an expert anything..."
          className="flex-1 text-xs bg-[#161920] border-2 border-[#2a2d35] focus:border-amber-400 text-gray-200 px-4 py-3 outline-none placeholder:text-gray-600"
          style={PIXEL}
        />
        <button
          onClick={() => submit(query)}
          className="text-[9px] bg-amber-500 hover:bg-amber-400 text-black px-4 py-3 transition-colors"
          style={{ ...PIXEL, boxShadow: "2px 2px 0px #000" }}
        >
          ASK →
        </button>
      </div>

      {/* Example query chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {EXAMPLE_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => submit(q)}
            className="text-[7px] text-gray-500 border border-[#2a2d35] hover:border-amber-400/50 hover:text-amber-400 px-3 py-1.5 transition-colors"
            style={PIXEL}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
