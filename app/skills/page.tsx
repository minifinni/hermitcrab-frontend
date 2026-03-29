"use client";

import { useState } from "react";
import SkillCard from "@/components/SkillCard";
import { MOCK_SKILLS, CATEGORIES } from "@/lib/mockData";

const FILTERS = ["All", "Free", "Paid", "Rental"];

export default function SkillsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(9);

  const filtered = MOCK_SKILLS.filter((skill) => {
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Free" && skill.priceType === "free") ||
      (activeFilter === "Paid" && skill.priceType === "paid") ||
      (activeFilter === "Rental" && skill.priceType === "rental");

    const matchesCategory =
      activeCategory === "All" ||
      skill.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesFilter && matchesCategory;
  });

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="mb-10">
        <h1
          className="text-base text-white mb-2"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          <span className="text-amber-400">▶</span> BROWSE SKILLS
        </h1>
        <p className="text-sm text-gray-400">
          {MOCK_SKILLS.length} skills available · Find your next power-up
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-[#2a2d35]">
        {/* Type filters */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => {
                setActiveFilter(f);
                setVisibleCount(9);
              }}
              className={`text-[9px] px-3 py-1.5 border-2 transition-all ${
                activeFilter === f
                  ? "border-amber-400 text-amber-400 bg-amber-400/10"
                  : "border-[#2a2d35] text-gray-400 hover:border-gray-500 hover:text-gray-300"
              }`}
              style={{ fontFamily: "'Press Start 2P', monospace", boxShadow: "1px 1px 0px #000" }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Category dropdown */}
        <select
          value={activeCategory}
          onChange={(e) => {
            setActiveCategory(e.target.value);
            setVisibleCount(9);
          }}
          className="text-[9px] bg-[#161920] border-2 border-[#2a2d35] text-gray-400 px-3 py-1.5 focus:border-amber-400 focus:outline-none cursor-pointer hover:border-gray-500 transition-colors"
          style={{ fontFamily: "'Press Start 2P', monospace", boxShadow: "1px 1px 0px #000" }}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.emoji} {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Skills grid */}
      {visible.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>

          {/* Load more */}
          {visibleCount < filtered.length && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + 6)}
                className="text-[10px] text-amber-400 border-2 border-amber-400 hover:bg-amber-400 hover:text-black px-8 py-3 transition-all duration-100"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  boxShadow: "3px 3px 0px #000",
                }}
              >
                Load More ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24">
          <p
            className="text-gray-600 text-[10px]"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            No skills match these filters.
          </p>
          <button
            onClick={() => {
              setActiveFilter("All");
              setActiveCategory("All");
            }}
            className="mt-4 text-[9px] text-amber-400 underline"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
