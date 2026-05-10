import Link from "next/link";
import { getCreators, getPacks, domainLabel, DOMAIN_META } from "@/lib/api";
import HermitSprite from "@/components/HermitSprite";
import HeroQueries from "@/components/HeroQueries";

export const revalidate = 60;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.hermitcrab.app";
const API_KEY = process.env.HERMITCRAB_API_KEY || process.env.NEXT_PUBLIC_HERMITCRAB_API_KEY || "";

async function getStats() {
  try {
    const res = await fetch(`${API_URL}/v1/admin/stats`, {
      headers: { "X-API-Key": API_KEY },
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { total_skills: 600, total_principles: 7000, total_channels: 57 };
  }
}

export default async function HomePage() {
  const [creators, packs, stats] = await Promise.all([
    getCreators().catch(() => []),
    getPacks().catch(() => []),
    getStats(),
  ]);

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
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-8">
          <div
            className="flex items-center justify-center border-2 border-amber-400"
            style={{ width: 220, height: 150, boxShadow: "4px 4px 0px #000, 0 0 30px #f59e0b30", background: "#0d0f14" }}
          >
            <img
              src="/crab.gif"
              alt="Hermit crab"
              style={{ imageRendering: "pixelated", width: "180px", height: "auto", mixBlendMode: "screen" }}
            />
          </div>

          <HeroQueries />

          <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
            {stats.total_skills.toLocaleString()} expert skills · {stats.total_principles.toLocaleString()} principles · {stats.total_channels} creators
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-y border-[#2a2d35] bg-[#0d0f14] py-14">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              label: "01",
              title: "Decisions, Not Answers",
              body: "Generic LLMs say \"it depends.\" Expert brains say \"do this.\" Get opinionated, prescriptive guidance — like Hormozi saying \"charge more\" not \"consider your market positioning.\"",
            },
            {
              label: "02",
              title: "Named Accountability",
              body: "\"According to Lenny...\" — know who decided. If you get challenged, you can cite the expert. Someone you trust already made this call, now you can too.",
            },
            {
              label: "03",
              title: "Works with Any AI",
              body: "Add a brain to Claude, ChatGPT, or your own agent via MCP. Your AI stops guessing and starts applying real expert frameworks to your exact problem.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#161920] border border-[#2a2d35] p-6"
              style={{ boxShadow: "2px 2px 0px #000" }}
            >
              <div
                className="text-[7px] text-amber-400/50 mb-3"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {item.label}
              </div>
              <h3
                className="text-[9px] text-white mb-3 leading-relaxed"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Packs ── */}
      {packs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="flex items-center justify-between mb-8">
            <h2
              className="text-[10px] text-white"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              ▶ BRAIN PACKS
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
                  className="bg-[#161920] border border-[#2a2d35] hover:border-amber-400 p-5 h-full transition-all duration-150 flex flex-col gap-3 cursor-pointer group"
                  style={{ boxShadow: "2px 2px 0px #000" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 border border-amber-400/30 flex items-center justify-center bg-[#0d0f14]">
                      <HermitSprite domain={pack.domain} size={40} />
                    </div>
                    <span
                      className="text-[6px] text-amber-400/60 border border-amber-400/30 px-2 py-0.5"
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
                    <span className="text-[7px] text-gray-600">
                      {pack.skill_count} skills
                    </span>
                    <span
                      className="text-[7px] text-amber-400 group-hover:text-amber-300"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}
                    >
                      USE →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Creators ── */}
      <section className="border-t border-[#2a2d35] bg-[#0a0c10] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2
              className="text-[10px] text-white"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              ▶ EXPERT BRAINS
            </h2>
            <Link
              href="/skills"
              className="text-[8px] text-amber-400 hover:text-amber-300 transition-colors"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              VIEW ALL →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {creators.filter((c: any) => c.status === "done").slice(0, 10).map((c: any) => (
              <Link
                key={c.handle}
                href={`/creators/${c.handle.replace(/^@/, "")}`}
                className="group flex flex-col gap-2 bg-[#161920] border border-[#2a2d35] hover:border-amber-400 px-4 py-4 transition-all"
                style={{ boxShadow: "2px 2px 0px #000" }}
              >
                <div className="flex items-center gap-2">
                  <HermitSprite domain={c.category} size={20} />
                  <span
                    className="text-[8px] text-gray-300 group-hover:text-amber-400 transition-colors truncate"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    {c.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[6px] text-gray-600 uppercase tracking-widest">{c.category}</span>
                  <span className="text-[6px] text-gray-600">{c.skill_count || 0} skills</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── For AI devs ── */}
      <section className="border-t border-[#2a2d35] bg-[#0d0f14] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div
                className="text-[7px] text-amber-400 mb-3 uppercase tracking-widest"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                ▶ FOR AI BUILDERS
              </div>
              <h2
                className="text-sm text-white mb-4 leading-relaxed"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                Connect via MCP
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Add expert brains directly to Claude, Cursor, or your own agent. One MCP server gives your AI access to 600+ expert skills — no prompting required.
              </p>
              <Link
                href="/dashboard"
                className="inline-block text-[9px] border border-amber-400/50 text-amber-400 hover:bg-amber-400/10 px-5 py-3 transition-colors"
                style={{ fontFamily: "'Press Start 2P', monospace", boxShadow: "2px 2px 0px #000" }}
              >
                GET API KEY →
              </Link>
            </div>
            <div
              className="bg-[#0a0c10] border border-[#2a2d35] p-5 font-mono text-xs"
              style={{ boxShadow: "2px 2px 0px #000" }}
            >
              <div className="text-gray-600 mb-3 text-[10px]">claude_desktop_config.json</div>
              <pre className="text-green-400 leading-relaxed overflow-x-auto text-[10px]">{`{
  "mcpServers": {
    "hermitcrab": {
      "url": "https://api.hermitcrab.app/mcp/",
      "headers": {
        "X-API-Key": "your_key"
      }
    }
  }
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-[#2a2d35] py-20 text-center bg-[#0a0c10]">
        <div className="max-w-xl mx-auto px-4">
          <h2
            className="text-sm text-white mb-4 leading-relaxed"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            Got an audience?{" "}
            <span className="text-amber-400">Brainify yourself.</span>
          </h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Upload your transcripts and we'll extract your frameworks, mental models, and decisions into an expert brain anyone can use.
          </p>
          <Link
            href="/brainify"
            className="text-[9px] bg-amber-500 hover:bg-amber-400 text-black px-8 py-4 inline-block transition-all"
            style={{ fontFamily: "'Press Start 2P', monospace", boxShadow: "3px 3px 0px #000" }}
          >
            BRAINIFY →
          </Link>
        </div>
      </section>

    </div>
  );
}
