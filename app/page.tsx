import Link from "next/link";
import { getSkills, getDomains, getCreators, getPacks, domainLabel, DOMAIN_META } from "@/lib/api";

export const revalidate = 60;

export default async function HomePage() {
  let trendingSkills: any[] = [];
  let creators: any[] = [];
  let packs: any[] = [];
  let totalSkills = 0;

  try {
    [trendingSkills, creators, packs] = await Promise.all([
      getSkills(undefined, 1, 6),
      getCreators(),
      getPacks()
    ]);
    totalSkills = trendingSkills.length > 0 ? 50 : 0; // approximate until we have a count endpoint
  } catch {
    // fallback to empty — page still renders
  }

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#0d0f14]">
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
            className="flex items-center justify-center border-2 border-amber-400"
            style={{ width: 300, height: 200, boxShadow: "4px 4px 0px #000, 0 0 30px #f59e0b30", background: "#0d0f14" }}
          >
            <img
              src="/crab.gif"
              alt="Hermit crab"
              style={{ imageRendering: "pixelated", width: "240px", height: "auto", mixBlendMode: "screen" }}
            />
          </div>

          <h1
            className="text-2xl md:text-3xl text-white leading-relaxed"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            Rent a{" "}
            <span className="text-amber-400">brain.</span>
          </h1>

          <p className="text-sm text-gray-400 max-w-lg leading-relaxed">
            Temporarily borrow an expert's decision-making mind.{" "}
            <span className="text-amber-400">Someone you trust already decided.</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/packs"
              className="text-[10px] bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 transition-all duration-100"
              style={{ fontFamily: "'Press Start 2P', monospace", boxShadow: "3px 3px 0px #000" }}
            >
              Browse Packs
            </Link>
            <Link
              href="/skills"
              className="text-[10px] text-amber-400 border-2 border-amber-400 hover:bg-amber-400 hover:text-black px-6 py-3 transition-all duration-100"
              style={{ fontFamily: "'Press Start 2P', monospace", boxShadow: "3px 3px 0px #000" }}
            >
              All Creators
            </Link>
          </div>
        </div>
      </section>

      {/* ── What is a brain ── */}
      <section className="border-b border-[#2a2d35] bg-[#0d0f14] py-14">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "Decisions, Not Just Answers",
              body: "Generic LLMs say 'it depends.' Experts say 'do this.' Get opinionated, prescriptive guidance — like 'Always move to AWS early' not 'consider your scale and budget...'",
            },
            {
              title: "Accountability You Can Reference",
              body: "\"According to Kenji...\" — know who decided. Social proof builds confidence. And if questioned, you can cite the expert. Someone you trust already made this call.",
            },
            {
              title: "What Would [Expert] Do?",
              body: "Mental models, decision frameworks, specific prescriptions. Not generic advice — the exact heuristics experts use. Learn how Karpathy, Greg, or Babish actually think.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#161920] border-2 border-[#2a2d35] p-6"
              style={{ boxShadow: "2px 2px 0px #000" }}
            >
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
            className="bg-[#161920] border-2 border-amber-400/20 p-5"
            style={{ boxShadow: "2px 2px 0px #000" }}
          >
            <p className="text-xs text-gray-400 leading-relaxed">
              <span className="text-white font-medium">A prompt file tells your AI how to behave.</span>{" "}
              A hermitcrab brain gives it actual expertise to rent — like borrowing a doctor's mind for a specific diagnosis instead of reading a generic textbook. You're not buying a tool, you're temporarily renting an expert's decision-making brain.
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
            {packs.length || 0} brain packs · {totalSkills || 50} expert brains · {creators.length || 0} creators
          </p>
        </div>
      </section>

      {/* ── Featured Packs ── */}
      {packs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="flex items-center justify-between mb-8">
            <h2
              className="text-sm text-white"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              FEATURED BRAIN PACKS
            </h2>
            <Link
              href="/packs"
              className="text-[8px] text-amber-400 hover:text-amber-300 transition-colors"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              VIEW ALL →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {packs.slice(0, 4).map((pack) => (
              <Link key={pack.pack_id} href={`/packs/${pack.pack_id}`}>
                <div
                  className="bg-[#161920] border-2 border-[#2a2d35] hover:border-amber-400 p-5 h-full transition-all duration-150 flex flex-col gap-3 cursor-pointer group"
                  style={{ boxShadow: "2px 2px 0px #000" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 border-2 border-amber-400/40 flex items-center justify-center text-xl bg-[#0d0f14] flex-shrink-0">
                      {(() => {
                        const emojiMap: Record<string, string> = {
                          cooking: "🍳",
                          business: "📊",
                          writing: "✍️",
                          coding: "💻",
                          sales: "📧",
                          seo: "🔍",
                          research: "🔬",
                          music: "🎵",
                          general: "⚡",
                        };
                        return emojiMap[pack.domain?.toLowerCase()] ?? "🐚";
                      })()}
                    </div>
                    <span
                      className="text-[7px] text-amber-400 border border-amber-400/50 px-2 py-0.5"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}
                    >
                      PACK
                    </span>
                  </div>

                  <p
                    className="text-[9px] text-white leading-relaxed group-hover:text-amber-300 transition-colors line-clamp-2"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    {pack.name}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#2a2d35]">
                    <span className="text-[8px] text-gray-500">
                      {pack.skill_count} skill{pack.skill_count !== 1 ? 's' : ''}
                    </span>
                    <span className="text-[8px] text-gray-600">View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Trending Creators ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <h2
          className="text-sm text-white mb-8"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          TRENDING CREATORS
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
          {creators.slice(0, 8).map((creator) => (
            <div key={creator.handle} className="min-w-[240px] max-w-[240px] snap-start flex-shrink-0">
              <Link href={`/creators/${creator.handle}`} className="block h-full">
                <div
                  className="bg-[#161920] border-2 border-[#2a2d35] hover:border-amber-400 p-4 h-full transition-all duration-150 flex flex-col gap-3"
                  style={{ boxShadow: "2px 2px 0px #000" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-gray-500 uppercase tracking-widest">{creator.category}</span>
                    <span className="text-[8px] text-amber-400 border border-amber-400/50 px-2 py-0.5"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}>
                      CREATOR
                    </span>
                  </div>
                  <div>
                    <p className="text-[9px] text-white leading-relaxed line-clamp-2"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}>
                      {creator.name}
                    </p>
                    {creator.top_skill && (
                      <p className="text-[8px] text-amber-400/80 mt-2 font-medium">
                        {creator.top_skill}
                      </p>
                    )}
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[8px] text-gray-500">{creator.skill_count || 1} skill{(creator.skill_count || 1) > 1 ? 's' : ''}</span>
                    <span className="text-[8px] text-gray-600">View →</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Creators ── */}
      <section className="bg-[#161920]/50 border-y border-[#2a2d35] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2
              className="text-sm text-white"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              BROWSE BY CREATOR
            </h2>
            <Link
              href="/skills"
              className="text-[8px] text-amber-400 hover:text-amber-300 transition-colors"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              VIEW ALL →
            </Link>
          </div>
          {creators.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {creators.slice(0, 8).map((c: any) => (
                <Link
                  key={c.handle}
                  href={`/creators/${c.handle}`}
                  className="flex flex-col gap-2 bg-[#161920] border-2 border-[#2a2d35] hover:border-amber-400 px-4 py-4 transition-all group"
                  style={{ boxShadow: "2px 2px 0px #000" }}
                >
                  <span
                    className="text-[9px] text-gray-300 group-hover:text-amber-400 transition-colors truncate"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    {c.name}
                  </span>
                  <span className="text-[7px] text-gray-600 uppercase tracking-widest">{c.category}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {Object.keys(DOMAIN_META).slice(0, 8).map((k) => (
                <Link
                  key={k}
                  href={`/skills?domain=${k}`}
                  className="flex items-center justify-between bg-[#161920] border-2 border-[#2a2d35] hover:border-amber-400 px-4 py-3 transition-all group"
                  style={{ boxShadow: "2px 2px 0px #000" }}
                >
                  <span className="text-[9px] text-gray-400 group-hover:text-amber-400 transition-colors uppercase"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                    {domainLabel(k)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2
          className="text-base md:text-xl text-white mb-4 leading-relaxed"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          Know something.{" "}
          <span className="text-amber-400">Rent your brain.</span>
        </h2>
        <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto">
          If you're an expert in anything — cooking, SEO, finance, copywriting — your decision-making brain can be rented by others. Publish once. Earn every time someone borrows your mind.
        </p>
        <Link
          href="/sell"
          className="text-[10px] bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-4 inline-block transition-all"
          style={{ fontFamily: "'Press Start 2P', monospace", boxShadow: "3px 3px 0px #000" }}
        >
          Start Creating
        </Link>
      </section>
    </div>
  );
}
