import Link from "next/link";
import SkillCard from "@/components/SkillCard";
import { getSkills, getDomains, domainEmoji, domainLabel, DOMAIN_META } from "@/lib/api";
import { CATEGORIES } from "@/lib/mockData";

export const revalidate = 60;

export default async function HomePage() {
  let trendingSkills: any[] = [];
  let domains: { domain: string; count: number }[] = [];
  let totalSkills = 0;

  try {
    [trendingSkills, domains] = await Promise.all([getSkills(undefined, 1, 6), getDomains()]);
    totalSkills = domains.reduce((sum, d) => sum + d.count, 0);
  } catch {
    // fallback to empty — page still renders
  }

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#0d0f14] scanlines">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(#2a2d35 1px, transparent 1px), linear-gradient(90deg, #2a2d35 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-24 flex flex-col items-center text-center gap-8">
          <div
            id="hermit-crab-stage"
            className="flex items-center justify-center border-2 border-amber-400 bg-[#161920]"
            style={{ width: 300, height: 200, boxShadow: "4px 4px 0px #000, 0 0 30px #f59e0b30" }}
          >
            <span
              className="text-amber-400 text-[10px] animate-pulse text-center px-4"
              style={{ fontFamily: "'Press Start 2P', monospace", lineHeight: "1.8" }}
            >
              [ CRAB GOES HERE ]
            </span>
          </div>

          <h1
            className="text-2xl md:text-3xl text-white leading-relaxed"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            Skills your AI{" "}
            <span className="text-amber-400">can wear.</span>
          </h1>

          <p className="text-sm text-gray-400 max-w-lg leading-relaxed">
            Each skill is a <span className="text-amber-400">structured knowledge base</span> — principles, techniques, expert frameworks, and semantic search. Not just prompts.{" "}
            <span className="text-gray-300">Your AI thinks like an expert.</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/skills"
              className="text-[10px] bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 transition-all duration-100 active:translate-x-0.5 active:translate-y-0.5"
              style={{ fontFamily: "'Press Start 2P', monospace", boxShadow: "3px 3px 0px #000" }}
            >
              Browse Skills
            </Link>
            <Link
              href="/sell"
              className="text-[10px] text-amber-400 border-2 border-amber-400 hover:bg-amber-400 hover:text-black px-6 py-3 transition-all duration-100"
              style={{ fontFamily: "'Press Start 2P', monospace", boxShadow: "3px 3px 0px #000" }}
            >
              Sell Your Skill
            </Link>
          </div>
        </div>
      </section>

      {/* ── What is a skill ── */}
      <section className="border-b border-[#2a2d35] bg-[#0d0f14] py-14">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: "🧠",
              title: "Deep Knowledge",
              body: "Each skill contains hundreds of expert principles, techniques, and the reasoning behind them — extracted from the world's best practitioners.",
            },
            {
              icon: "🔍",
              title: "Semantic Search",
              body: "Your AI retrieves the right knowledge for any situation. Ask a question, get expert-level context — not keyword matches.",
            },
            {
              icon: "🕸️",
              title: "Knowledge Graph",
              body: "Skills connect to each other. Related techniques, shared equipment, overlapping frameworks — your AI navigates a web of expertise.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#161920] border-2 border-[#2a2d35] p-6"
              style={{ boxShadow: "2px 2px 0px #000" }}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3
                className="text-[9px] text-amber-400 mb-3"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {item.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="max-w-5xl mx-auto px-4 mt-6">
          <div
            className="bg-[#161920] border-2 border-amber-400/20 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            style={{ boxShadow: "2px 2px 0px #000" }}
          >
            <span className="text-2xl">🐚</span>
            <p className="text-xs text-gray-400 leading-relaxed">
              <span className="text-white font-medium">Skills are not prompt files.</span>{" "}
              They're structured databases of expert knowledge — principles with explanations, direct quotes, technique taxonomies, and interconnected concepts — all queryable by your AI in real time.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-[#161920] border-y border-[#2a2d35] py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p
            className="text-amber-400 text-[10px] tracking-wider"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            {totalSkills || 23} skills · {domains.length || 9} domains · Built by creators
          </p>
        </div>
      </section>

      {/* ── Trending Skills ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <h2
          className="text-sm text-white mb-8"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          <span className="text-amber-400">▶</span> TRENDING SKILLS
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
          {trendingSkills.map((skill) => (
            <div key={skill.skill_id} className="min-w-[240px] max-w-[240px] snap-start flex-shrink-0">
              <Link href={`/skills/${skill.skill_id}`} className="block h-full">
                <div
                  className="bg-[#161920] border-2 border-[#2a2d35] hover:border-amber-400 p-4 h-full transition-all duration-150 flex flex-col gap-3"
                  style={{ boxShadow: "2px 2px 0px #000" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{domainEmoji(skill.domain)}</span>
                    <span className="text-[8px] text-amber-400 border border-amber-400/50 px-2 py-0.5"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}>
                      FREE
                    </span>
                  </div>
                  <div>
                    <p className="text-[9px] text-white leading-relaxed line-clamp-2"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}>
                      {skill.title}
                    </p>
                    {skill.chef && (
                      <p className="text-[8px] text-gray-500 mt-1">by @{skill.chef.toLowerCase().replace(/\s+/g, '')}</p>
                    )}
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-amber-400 text-xs">★★★★☆</span>
                    <span className="text-[8px] text-gray-500">{skill.num_principles} principles</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories (real domains) ── */}
      <section className="bg-[#161920]/50 border-y border-[#2a2d35] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-sm text-white mb-8 text-center"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            <span className="text-amber-400">▶</span> BROWSE BY DOMAIN
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {(domains.length > 0 ? domains : Object.entries(DOMAIN_META).map(([k, v]) => ({ domain: k, count: 0 }))).map((d) => (
              <Link
                key={d.domain}
                href={`/skills?domain=${d.domain}`}
                className="flex items-center gap-2 bg-[#161920] border-2 border-[#2a2d35] hover:border-amber-400 px-4 py-3 transition-all group"
                style={{ boxShadow: "2px 2px 0px #000" }}
              >
                <span className="text-lg">{domainEmoji(d.domain)}</span>
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-400 group-hover:text-amber-400 transition-colors"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                    {domainLabel(d.domain)}
                  </span>
                  {d.count > 0 && <span className="text-[7px] text-gray-600">{d.count} skills</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2
          className="text-base md:text-xl text-white mb-4 leading-relaxed"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          Built by creators.{" "}
          <span className="text-amber-400">Worn by AI.</span>
        </h2>
        <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto">
          {totalSkills || 23} skills across {domains.length || 9} domains. More added every week.
        </p>
        <Link
          href="/sell"
          className="text-[10px] bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-4 inline-block transition-all"
          style={{ fontFamily: "'Press Start 2P', monospace", boxShadow: "3px 3px 0px #000" }}
        >
          Start Creating →
        </Link>
      </section>
    </div>
  );
}
