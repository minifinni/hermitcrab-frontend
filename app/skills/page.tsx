"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getCreators, ApiCreator } from "@/lib/api";

function categoryEmoji(category: string) {
  const map: Record<string, string> = {
    cooking: "🍳",
    food: "🍳",
    business: "📊",
    writing: "✍️",
    coding: "💻",
    sales: "📧",
    seo: "🔍",
    research: "🔬",
    music: "🎵",
    general: "⚡",
  };
  return map[category?.toLowerCase()] ?? "🐚";
}

export default function SkillsPage() {
  const [creators, setCreators] = useState<ApiCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    setLoading(true);
    getCreators()
      .then(setCreators)
      .catch(() => setCreators([]))
      .finally(() => setLoading(false));
  }, []);

  // Extract unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set(creators.map((c) => c.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [creators]);

  // Filter creators by category
  const filteredCreators = useMemo(() => {
    if (activeCategory === "all") return creators;
    return creators.filter((c) => c.category === activeCategory);
  }, [creators, activeCategory]);

  const doneCreators = filteredCreators.filter((c) => c.status === "done");
  const pendingCreators = filteredCreators.filter((c) => c.status !== "done");

  return (
    <div className="min-h-screen bg-[#0d0f14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <Link
          href="/packs"
          className="text-[9px] text-gray-500 hover:text-amber-400 transition-colors mb-6 block"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          ← ALL PACKS
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-lg text-white mb-2"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            <span className="text-amber-400">▶</span> ASK THE EXPERTS
          </h1>
          <p className="text-sm text-gray-400">
            Someone you trust already decided. Get confidence to act, not just information.
          </p>
        </div>

        {/* Category filters */}
        <div className="mb-10">
          <p
            className="text-[8px] text-gray-600 uppercase tracking-widest mb-3"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            Category
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`text-[9px] px-4 py-2 border-2 transition-all ${
                activeCategory === "all"
                  ? "border-amber-400 text-amber-400 bg-amber-400/10"
                  : "border-[#2a2d35] text-gray-400 hover:border-amber-400/50"
              }`}
              style={{
                fontFamily: "'Press Start 2P', monospace",
                boxShadow: "2px 2px 0px #000",
              }}
            >
              ALL
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[9px] px-4 py-2 border-2 transition-all ${
                  activeCategory === cat
                    ? "border-amber-400 text-amber-400 bg-amber-400/10"
                    : "border-[#2a2d35] text-gray-400 hover:border-amber-400/50"
                }`}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  boxShadow: "2px 2px 0px #000",
                }}
              >
                {categoryEmoji(cat)} {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-20">
            <p
              className="text-amber-400 text-[10px] animate-pulse"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              LOADING...
            </p>
          </div>
        ) : (
          <>
            {/* Done Creators - Clickable */}
            {doneCreators.length > 0 && (
              <>
                <p
                  className="text-[9px] text-gray-500 mb-4"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  {doneCreators.length} AVAILABLE
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                  {doneCreators.map((creator) => (
                    <Link
                      key={creator.handle}
                      href={`/creators/${creator.handle}`}
                    >
                      <div
                        className="bg-[#161920] border-2 border-[#2a2d35] hover:border-amber-400 p-6 h-full transition-all duration-150 flex flex-col gap-4 cursor-pointer group"
                        style={{
                          boxShadow: "2px 2px 0px #000",
                        }}
                      >
                        {/* Header row */}
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 border-2 border-amber-400/40 flex items-center justify-center text-2xl bg-[#0d0f14] flex-shrink-0">
                            {categoryEmoji(creator.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-[10px] text-white group-hover:text-amber-300 transition-colors truncate"
                              style={{
                                fontFamily: "'Press Start 2P', monospace",
                              }}
                            >
                              {creator.name}
                            </p>
                            <p className="text-[8px] text-gray-500 mt-1">
                              @{creator.handle}
                            </p>
                          </div>
                        </div>

                        {/* Category tag */}
                        <div>
                          <span className="text-[7px] text-amber-600 uppercase tracking-widest border border-amber-600/30 bg-amber-600/10 px-2 py-0.5">
                            {creator.category}
                          </span>
                        </div>

                        {/* Progress / Stats */}
                        <div className="mt-auto pt-3 border-t border-[#2a2d35]">
                          {(creator.progress_pct === 0 || creator.progress_pct === undefined) && (
                            <p className="text-[7px] text-gray-500 mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                              QUEUED
                            </p>
                          )}
                          {creator.progress_pct && creator.progress_pct > 0 && creator.progress_pct < 100 && (
                            <div className="mb-2">
                              <div className="h-1 bg-[#2a2d35] w-full mb-1">
                                <div
                                  className="h-full bg-amber-500"
                                  style={{ width: `${creator.progress_pct}%` }}
                                />
                              </div>
                              <p className="text-[7px] text-amber-500" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                {creator.videos_processed || 0}/{creator.video_count} VIDEOS
                              </p>
                            </div>
                          )}
                          {creator.progress_pct === 100 && (
                            <p className="text-[7px] text-green-500 mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                              ✓ READY
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex gap-3">
                              <span className="text-[8px] text-gray-500">
                                {creator.skill_count || 0} skills
                              </span>
                              <span className="text-[8px] text-gray-500">
                                {creator.video_count} sources
                              </span>
                            </div>
                            <span
                              className="text-[8px] text-amber-400 group-hover:text-amber-300 transition-colors"
                              style={{
                                fontFamily: "'Press Start 2P', monospace",
                              }}
                            >
                              VIEW →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Pending/Processing Creators - Greyed out */}
            {pendingCreators.length > 0 && (
              <>
                <p
                  className="text-[9px] text-gray-600 mb-4"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  {pendingCreators.length} COMING SOON
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
                  {pendingCreators.map((creator) => (
                    <div
                      key={creator.handle}
                      className="bg-[#161920] border-2 border-[#2a2d35] p-6 h-full flex flex-col gap-4 cursor-not-allowed"
                      style={{
                        boxShadow: "2px 2px 0px #000",
                      }}
                    >
                      {/* Header row */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 border-2 border-gray-700 flex items-center justify-center text-2xl bg-[#0d0f14] flex-shrink-0 grayscale">
                          {categoryEmoji(creator.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-[10px] text-gray-400 truncate"
                            style={{ fontFamily: "'Press Start 2P', monospace" }}
                          >
                            {creator.name}
                          </p>
                          <p className="text-[8px] text-gray-600 mt-1">
                            @{creator.handle}
                          </p>
                        </div>
                      </div>

                      {/* Category + Progress */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[7px] text-gray-600 uppercase tracking-widest border border-gray-700 px-2 py-0.5 w-fit">
                          {creator.category}
                        </span>

                        {/* Progress indicator */}
                        {(creator.progress_pct === 0 || creator.progress_pct === undefined) && (
                          <p className="text-[7px] text-gray-500" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                            QUEUED
                          </p>
                        )}
                        {creator.progress_pct && creator.progress_pct > 0 && creator.progress_pct < 100 && (
                          <div>
                            <div className="h-1 bg-[#2a2d35] w-full mb-1">
                              <div
                                className="h-full bg-amber-500"
                                style={{ width: `${creator.progress_pct}%` }}
                              />
                            </div>
                            <p className="text-[7px] text-amber-500" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                              {creator.videos_processed || 0}/{creator.video_count} VIDEOS
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Stats placeholder */}
                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#2a2d35]">
                        <span className="text-[8px] text-gray-600">
                          {creator.video_count} sources
                        </span>
                        <span
                          className="text-[8px] text-gray-600"
                          style={{ fontFamily: "'Press Start 2P', monospace" }}
                        >
                          ...
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Empty state */}
            {filteredCreators.length === 0 && (
              <div className="text-center py-20">
                <p
                  className="text-gray-500 text-[10px]"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  NO CREATORS FOUND
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
