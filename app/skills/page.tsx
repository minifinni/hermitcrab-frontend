"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSkills, getDomains, domainEmoji, domainLabel, ApiSkill } from "@/lib/api";

export default function SkillsPage() {
  const [skills, setSkills] = useState<ApiSkill[]>([]);
  const [domains, setDomains] = useState<{ domain: string; count: number }[]>([]);
  const [activeDomain, setActiveDomain] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDomains().then(setDomains).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getSkills(activeDomain === "all" ? undefined : activeDomain, 1, 50)
      .then(setSkills)
      .catch(() => setSkills([]))
      .finally(() => setLoading(false));
  }, [activeDomain]);

  return (
    <div className="min-h-screen bg-[#0d0f14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-lg text-white mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            <span className="text-amber-400">▶</span> BROWSE SKILLS
          </h1>
          <p className="text-sm text-gray-400">Find the perfect skill for your AI agent</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {/* Domain filters */}
          <button
            onClick={() => setActiveDomain("all")}
            className={`text-[9px] px-4 py-2 border-2 transition-all ${activeDomain === "all" ? "border-amber-400 text-amber-400 bg-amber-400/10" : "border-[#2a2d35] text-gray-400 hover:border-amber-400/50"}`}
            style={{ fontFamily: "'Press Start 2P', monospace", boxShadow: "2px 2px 0px #000" }}
          >
            ALL
          </button>
          {domains.map((d) => (
            <button
              key={d.domain}
              onClick={() => setActiveDomain(d.domain)}
              className={`text-[9px] px-4 py-2 border-2 transition-all ${activeDomain === d.domain ? "border-amber-400 text-amber-400 bg-amber-400/10" : "border-[#2a2d35] text-gray-400 hover:border-amber-400/50"}`}
              style={{ fontFamily: "'Press Start 2P', monospace", boxShadow: "2px 2px 0px #000" }}
            >
              {domainEmoji(d.domain)} {d.domain.toUpperCase()} ({d.count})
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-amber-400 text-[10px] animate-pulse" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              LOADING...
            </p>
          </div>
        ) : (
          <>
            <p className="text-[9px] text-gray-500 mb-6" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              {skills.length} SKILLS FOUND
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <Link key={skill.skill_id} href={`/skills/${skill.skill_id}`}>
                  <div
                    className="bg-[#161920] border-2 border-[#2a2d35] hover:border-amber-400 p-5 h-full transition-all duration-150 flex flex-col gap-3 cursor-pointer group"
                    style={{ boxShadow: "2px 2px 0px #000" }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-2xl">{domainEmoji(skill.domain)}</span>
                      <span className="text-[8px] text-amber-400 border border-amber-400/50 px-2 py-0.5 shrink-0"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                        FREE
                      </span>
                    </div>
                    <div>
                      <p className="text-[9px] text-white leading-relaxed group-hover:text-amber-300 transition-colors line-clamp-2"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                        {skill.title}
                      </p>
                      {skill.chef && (
                        <p className="text-[8px] text-gray-500 mt-1">@{skill.chef.toLowerCase().replace(/\s+/g, '')}</p>
                      )}
                    </div>
                    {skill.techniques.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {skill.techniques.slice(0, 3).map((t) => (
                          <span key={t} className="text-[7px] text-gray-500 bg-[#0d0f14] border border-[#2a2d35] px-2 py-0.5">
                            {t.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#2a2d35]">
                      <span className="text-amber-400 text-xs">★★★★☆</span>
                      <span className="text-[8px] text-gray-500">{skill.num_principles} principles</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
