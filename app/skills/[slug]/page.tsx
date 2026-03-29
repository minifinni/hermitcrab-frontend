import Link from "next/link";
import { getSkill, getRelatedSkills, domainEmoji, domainLabel } from "@/lib/api";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function SkillDetailPage({ params }: { params: { slug: string } }) {
  let skill: any;
  let related: any[] = [];

  try {
    [skill, related] = await Promise.all([
      getSkill(params.slug),
      getRelatedSkills(params.slug).catch(() => []),
    ]);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0d0f14]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <Link href="/skills" className="text-[9px] text-gray-500 hover:text-amber-400 transition-colors mb-8 block"
          style={{ fontFamily: "'Press Start 2P', monospace" }}>
          ← BACK TO SKILLS
        </Link>

        {/* Hero */}
        <div className="bg-[#161920] border-2 border-[#2a2d35] p-8 mb-6"
          style={{ boxShadow: "3px 3px 0px #000" }}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <span className="text-5xl">{domainEmoji(skill.domain)}</span>
            <span className="text-[8px] text-amber-400 border border-amber-400 px-3 py-1"
              style={{ fontFamily: "'Press Start 2P', monospace" }}>
              FREE
            </span>
          </div>
          <h1 className="text-sm text-white leading-relaxed mb-3"
            style={{ fontFamily: "'Press Start 2P', monospace" }}>
            {skill.title}
          </h1>
          {skill.chef && (
            <p className="text-[9px] text-gray-400 mb-2">by @{skill.chef.toLowerCase().replace(/\s+/g, '')}</p>
          )}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[9px] text-amber-400 border border-amber-400/30 bg-amber-400/10 px-3 py-1">
              {domainEmoji(skill.domain)} {domainLabel(skill.domain)}
            </span>
            <span className="text-amber-400">★★★★☆</span>
            <span className="text-[8px] text-gray-500">{skill.num_principles} principles</span>
          </div>
        </div>

        {/* Context */}
        {skill.context && (
          <div className="bg-[#161920] border-2 border-[#2a2d35] p-6 mb-6"
            style={{ boxShadow: "2px 2px 0px #000" }}>
            <h2 className="text-[9px] text-amber-400 mb-3" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              ABOUT THIS SKILL
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">{skill.context}</p>
          </div>
        )}

        {/* Techniques */}
        {skill.techniques?.length > 0 && (
          <div className="bg-[#161920] border-2 border-[#2a2d35] p-6 mb-6"
            style={{ boxShadow: "2px 2px 0px #000" }}>
            <h2 className="text-[9px] text-amber-400 mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              TECHNIQUES
            </h2>
            <div className="flex flex-wrap gap-2">
              {skill.techniques.map((t: string) => (
                <span key={t} className="text-[8px] text-gray-400 bg-[#0d0f14] border border-[#2a2d35] px-3 py-1">
                  {t.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Principles */}
        {skill.principles?.length > 0 && (
          <div className="bg-[#161920] border-2 border-[#2a2d35] p-6 mb-6"
            style={{ boxShadow: "2px 2px 0px #000" }}>
            <h2 className="text-[9px] text-amber-400 mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              KEY PRINCIPLES ({skill.principles.length})
            </h2>
            <div className="space-y-4">
              {skill.principles.slice(0, 8).map((p: any) => (
                <div key={p.principle_id} className="border-l-2 border-amber-400/30 pl-4">
                  {p.category && (
                    <span className="text-[7px] text-amber-600 uppercase tracking-widest">{p.category}</span>
                  )}
                  <p className="text-[9px] text-white mt-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                    {p.principle}
                  </p>
                  {p.details && <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{p.details}</p>}
                  {p.why && <p className="text-[11px] text-gray-500 mt-1 italic leading-relaxed">Why: {p.why}</p>}
                  {p.chef_quotes?.length > 0 && (
                    <p className="text-[11px] text-amber-300/70 mt-2 italic">"{p.chef_quotes[0]}"</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Download CTA */}
        <div className="bg-[#161920] border-2 border-amber-400 p-8 mb-6 text-center"
          style={{ boxShadow: "4px 4px 0px #f59e0b40" }}>
          <p className="text-[9px] text-gray-400 mb-4">Compatible with OpenClaw, Claude, ChatGPT</p>
          <button
            className="text-[10px] bg-amber-500 hover:bg-amber-400 text-black font-bold px-10 py-4 transition-all"
            style={{ fontFamily: "'Press Start 2P', monospace", boxShadow: "3px 3px 0px #000" }}
          >
            DOWNLOAD FREE →
          </button>
          <p className="text-[8px] text-gray-600 mt-3">Auth coming soon · Free during beta</p>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-[9px] text-white mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              <span className="text-amber-400">▶</span> RELATED SKILLS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.slice(0, 3).map((r: any) => (
                <Link key={r.skill_id} href={`/skills/${r.skill_id}`}>
                  <div className="bg-[#161920] border-2 border-[#2a2d35] hover:border-amber-400 p-4 transition-all"
                    style={{ boxShadow: "2px 2px 0px #000" }}>
                    <span className="text-xl">{domainEmoji(r.domain)}</span>
                    <p className="text-[8px] text-white mt-2 leading-relaxed line-clamp-2"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}>
                      {r.title}
                    </p>
                    <p className="text-[7px] text-gray-500 mt-1">{r.shared_techniques} shared techniques</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
