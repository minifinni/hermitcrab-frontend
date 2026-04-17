"use client";

import { useState } from "react";
import { Brain, Upload, Zap, CheckCircle, AlertCircle } from "lucide-react";
import HermitSprite from "@/components/HermitSprite";

const DOMAINS = [
  "business", "product", "ai", "marketing", "copywriting",
  "finance", "fitness", "health", "tech", "design", "general",
];

type Status = "idle" | "processing" | "done" | "error";

interface BrainResult {
  pack_id: string;
  brain_url: string;
  status_url: string;
  transcripts_queued: number;
}

export default function BrainifyPage() {
  const [creatorName, setCreatorName] = useState("");
  const [creatorHandle, setCreatorHandle] = useState("");
  const [domain, setDomain] = useState("general");
  const [description, setDescription] = useState("");
  const [transcripts, setTranscripts] = useState([{ title: "", transcript: "" }]);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<BrainResult | null>(null);
  const [error, setError] = useState("");

  function addTranscript() {
    setTranscripts([...transcripts, { title: "", transcript: "" }]);
  }

  function removeTranscript(i: number) {
    setTranscripts(transcripts.filter((_, idx) => idx !== i));
  }

  function updateTranscript(i: number, field: "title" | "transcript", value: string) {
    setTranscripts(transcripts.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
  }

  async function handleFile(i: number, file: File) {
    const text = await file.text();
    const title = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    setTranscripts(transcripts.map((t, idx) => idx === i ? { title, transcript: text } : t));
  }

  async function handleBrainify() {
    if (!creatorName || !creatorHandle) {
      setError("Creator name and handle are required.");
      return;
    }
    const valid = transcripts.filter(t => t.transcript.trim().length > 50);
    if (valid.length === 0) {
      setError("At least one transcript with content is required.");
      return;
    }

    setStatus("processing");
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://api.hermitcrab.app"}/v1/brainify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator_name: creatorName,
          creator_handle: creatorHandle,
          domain,
          description,
          transcripts: valid,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Error ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
      setStatus("done");
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="flex justify-center mb-4">
          <HermitSprite domain={domain} size={48} />
        </div>
        <div
          className="text-[8px] text-amber-400 tracking-widest uppercase mb-3 border border-amber-400/40 inline-block px-3 py-1"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          BRAINIFY
        </div>
        <h1
          className="text-lg text-white mb-4"
          style={{ fontFamily: "'Press Start 2P', monospace", lineHeight: "2" }}
        >
          Build a Brain
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Upload transcripts from a creator, podcast, or expert. We extract the principles,
          mental models, and decisions — and package it into a queryable brain.
        </p>
      </div>

      {status === "done" && result ? (
        <DoneState result={result} creatorName={creatorName} domain={domain} />
      ) : (
        <form
          onSubmit={e => { e.preventDefault(); handleBrainify(); }}
          className="space-y-6"
        >
          {/* Creator info */}
          <div
            className="border border-[#2a2d35] p-6"
            style={{ boxShadow: "2px 2px 0px #000" }}
          >
            <div
              className="text-[7px] text-amber-400 uppercase tracking-widest mb-5"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              ▶ CREATOR INFO
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-[7px] text-gray-400 uppercase tracking-widest mb-2"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={e => setCreatorName(e.target.value)}
                  placeholder="Lenny Rachitsky"
                  className="w-full bg-[#0d0f14] border-2 border-[#2a2d35] text-white text-xs px-4 py-3 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label
                  className="block text-[7px] text-gray-400 uppercase tracking-widest mb-2"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  Handle
                </label>
                <input
                  type="text"
                  value={creatorHandle}
                  onChange={e => setCreatorHandle(e.target.value)}
                  placeholder="@LennyRachitsky"
                  className="w-full bg-[#0d0f14] border-2 border-[#2a2d35] text-white text-xs px-4 py-3 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                className="block text-[7px] text-gray-400 uppercase tracking-widest mb-2"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                Domain
              </label>
              <select
                value={domain}
                onChange={e => setDomain(e.target.value)}
                className="w-full bg-[#0d0f14] border-2 border-[#2a2d35] text-white text-xs px-4 py-3 focus:border-amber-400 focus:outline-none"
              >
                {DOMAINS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label
                className="block text-[7px] text-gray-400 uppercase tracking-widest mb-2"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                placeholder="What does this brain teach?"
                className="w-full bg-[#0d0f14] border-2 border-[#2a2d35] text-white text-xs px-4 py-3 focus:border-amber-400 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Transcripts */}
          <div
            className="border border-[#2a2d35] p-6"
            style={{ boxShadow: "2px 2px 0px #000" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div
                className="text-[7px] text-amber-400 uppercase tracking-widest"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                ▶ TRANSCRIPTS ({transcripts.length})
              </div>
              <button
                type="button"
                onClick={addTranscript}
                className="text-[7px] text-amber-400 border border-amber-400/50 px-3 py-1 hover:bg-amber-400/10 transition-colors"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                + ADD
              </button>
            </div>

            <div className="space-y-5">
              {transcripts.map((t, i) => (
                <TranscriptSlot
                  key={i}
                  index={i}
                  item={t}
                  onUpdate={(field, val) => updateTranscript(i, field, val)}
                  onFile={file => handleFile(i, file)}
                  onRemove={transcripts.length > 1 ? () => removeTranscript(i) : undefined}
                />
              ))}
            </div>
          </div>

          {/* Error */}
          {(status === "error" || error) && (
            <div className="flex items-center gap-2 text-red-400 text-xs border border-red-400/30 px-4 py-3">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "processing"}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black py-4 transition-colors flex items-center justify-center gap-3"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px", boxShadow: "2px 2px 0px #000" }}
          >
            {status === "processing" ? (
              <>
                <Zap size={14} className="animate-pulse" />
                BRAINIFYING...
              </>
            ) : (
              <>
                <Brain size={14} />
                BRAINIFY →
              </>
            )}
          </button>

          {status === "processing" && (
            <p className="text-center text-[7px] text-gray-500" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              Extracting principles and mental models. This takes a few minutes per transcript.
            </p>
          )}
        </form>
      )}
    </div>
  );
}

function TranscriptSlot({
  index,
  item,
  onUpdate,
  onFile,
  onRemove,
}: {
  index: number;
  item: { title: string; transcript: string };
  onUpdate: (field: "title" | "transcript", val: string) => void;
  onFile: (file: File) => void;
  onRemove?: () => void;
}) {
  const wordCount = item.transcript.trim() ? item.transcript.split(/\s+/).length : 0;

  return (
    <div className="border border-[#2a2d35] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span
          className="text-[7px] text-gray-500 uppercase"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          SOURCE {index + 1}
        </span>
        <div className="flex items-center gap-3">
          {wordCount > 0 && (
            <span className="text-[7px] text-amber-400/70" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              {wordCount.toLocaleString()} words
            </span>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-[7px] text-gray-500 hover:text-red-400 transition-colors"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              REMOVE
            </button>
          )}
        </div>
      </div>

      <input
        type="text"
        value={item.title}
        onChange={e => onUpdate("title", e.target.value)}
        placeholder="Episode title or source name"
        className="w-full bg-[#0d0f14] border border-[#2a2d35] text-white text-xs px-3 py-2 focus:border-amber-400 focus:outline-none"
      />

      {/* File drop or textarea */}
      {item.transcript ? (
        <div className="relative">
          <textarea
            value={item.transcript}
            onChange={e => onUpdate("transcript", e.target.value)}
            rows={4}
            className="w-full bg-[#0d0f14] border border-[#2a2d35] text-white text-xs px-3 py-2 focus:border-amber-400 focus:outline-none resize-none font-mono"
            placeholder="Paste transcript here..."
          />
        </div>
      ) : (
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-[#2a2d35] hover:border-amber-400/50 transition-colors px-4 py-8 text-center">
            <Upload size={20} className="text-gray-600 mx-auto mb-2" />
            <p className="text-[7px] text-gray-500" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              DROP .TXT FILE OR PASTE BELOW
            </p>
          </div>
          <input
            type="file"
            accept=".txt,.md,.srt,.vtt"
            className="hidden"
            onChange={e => e.target.files?.[0] && onFile(e.target.files[0])}
          />
        </label>
      )}

      {!item.transcript && (
        <textarea
          value={item.transcript}
          onChange={e => onUpdate("transcript", e.target.value)}
          rows={3}
          className="w-full bg-[#0d0f14] border border-[#2a2d35] text-white text-xs px-3 py-2 focus:border-amber-400 focus:outline-none resize-none font-mono"
          placeholder="...or paste transcript text here"
        />
      )}
    </div>
  );
}

function DoneState({ result, creatorName, domain }: { result: BrainResult; creatorName: string; domain: string }) {
  return (
    <div
      className="border border-amber-400/30 p-8 text-center"
      style={{ boxShadow: "2px 2px 0px #000" }}
    >
      <CheckCircle size={32} className="text-amber-400 mx-auto mb-4" />
      <div
        className="text-[8px] text-amber-400 mb-2"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        BRAIN BUILDING
      </div>
      <p className="text-gray-400 text-sm mb-6">
        {result.transcripts_queued} transcript{result.transcripts_queued !== 1 ? "s" : ""} queued for extraction.
        The brain will be ready in a few minutes.
      </p>

      <div className="space-y-3">
        <a
          href={result.brain_url}
          className="block w-full bg-amber-500 hover:bg-amber-400 text-black text-center py-3 transition-colors"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", boxShadow: "2px 2px 0px #000" }}
        >
          VIEW BRAIN →
        </a>
        <a
          href="/brainify"
          className="block w-full border border-[#2a2d35] text-gray-400 hover:text-amber-400 hover:border-amber-400/50 text-center py-3 transition-colors"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px" }}
        >
          ADD ANOTHER BRAIN
        </a>
      </div>
    </div>
  );
}
