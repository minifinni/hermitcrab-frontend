import Link from "next/link";
import SkillCard from "@/components/SkillCard";
import { MOCK_SKILLS, CATEGORIES } from "@/lib/mockData";

export default function HomePage() {
  const trendingSkills = MOCK_SKILLS.slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#0d0f14] scanlines">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(#2a2d35 1px, transparent 1px), linear-gradient(90deg, #2a2d35 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-24 flex flex-col items-center text-center gap-8">
          {/* Crab stage placeholder */}
          <div
            id="hermit-crab-stage"
            className="flex items-center justify-center border-2 border-amber-400 bg-[#161920]"
            style={{
              width: 300,
              height: 200,
              boxShadow: "4px 4px 0px #000, 0 0 30px #f59e0b30",
            }}
          >
            <span
              className="text-amber-400 text-[10px] animate-pulse text-center px-4"
              style={{ fontFamily: "'Press Start 2P', monospace", lineHeight: "1.8" }}
            >
              [ CRAB GOES HERE ]
            </span>
          </div>

          {/* Tagline */}
          <h1
            className="text-2xl md:text-3xl text-white leading-relaxed"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            Skills your AI{" "}
            <span className="text-amber-400">can wear.</span>
          </h1>

          <p className="text-sm text-gray-400 max-w-lg leading-relaxed">
            Browse, rent, or download agent skills built by creators.{" "}
            <span className="text-gray-300">Swap skills. Stay sharp.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/skills"
              className="text-[10px] bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 transition-all duration-100 active:translate-x-0.5 active:translate-y-0.5"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                boxShadow: "3px 3px 0px #000",
              }}
            >
              Browse Skills
            </Link>
            <Link
              href="/sell"
              className="text-[10px] text-amber-400 border-2 border-amber-400 hover:bg-amber-400 hover:text-black px-6 py-3 transition-all duration-100 active:translate-x-0.5 active:translate-y-0.5"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                boxShadow: "3px 3px 0px #000",
              }}
            >
              Sell Your Skill
            </Link>
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
            247 skills · 89 creators · 14,302 downloads this week
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

        {/* Horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
          {trendingSkills.map((skill) => (
            <div
              key={skill.id}
              className="min-w-[240px] max-w-[240px] snap-start flex-shrink-0"
            >
              <SkillCard skill={skill} compact />
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="bg-[#161920]/50 border-y border-[#2a2d35] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-sm text-white mb-8 text-center"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            <span className="text-amber-400">▶</span> BROWSE BY CATEGORY
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/skills?category=${cat.name.toLowerCase()}`}
                className="flex items-center gap-2 bg-[#161920] border-2 border-[#2a2d35] hover:border-amber-400 px-4 py-3 transition-all duration-150 group"
                style={{ boxShadow: "2px 2px 0px #000" }}
              >
                <span className="text-lg">{cat.emoji}</span>
                <span
                  className="text-[9px] text-gray-400 group-hover:text-amber-400 transition-colors"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  {cat.name}
                </span>
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
          Join 89 creators already publishing skills and earning from their expertise.
        </p>
        <Link
          href="/sell"
          className="text-[10px] bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-4 inline-block transition-all"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            boxShadow: "3px 3px 0px #000",
          }}
        >
          Start Creating →
        </Link>
      </section>
    </div>
  );
}
