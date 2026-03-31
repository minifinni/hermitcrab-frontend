import Link from "next/link";
import { getCreators, getSkillsByCreator, domainLabel } from "@/lib/api";
import { notFound } from "next/navigation";
import HermitSprite from "@/components/HermitSprite";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function CreatorPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  let creator: any = null;
  let skills: any[] = [];

  try {
    const [creators, creatorSkills] = await Promise.all([
      getCreators(),
      getSkillsByCreator(handle).catch(() => []),
    ]);
    creator = creators.find((c: any) => c.handle === handle);
    skills = creatorSkills;
  } catch (e) {
    console.error("Creator page error:", e);
    notFound();
  }

  if (!creator) notFound();

  const domains = Array.from(new Set(skills.map((s: any) => s.domain)));

  return (
    <div className="min-h-screen bg-[#0d0f14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/packs"
          className="text-[9px] text-gray-500 hover:text-amber-400 transition-colors mb-8 block"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          ← ALL PACKS
        </Link>

        {/* Creator header */}
        <div
          className="bg-[#161920] border-2 border-[#2a2d35] p-8 mb-8 flex flex-col sm:flex-row items-start gap-6"
          style={{ boxShadow: "3px 3px 0px #000" }}
        >
          <div className="w-16 h-16 border-2 border-amber-400/40 flex items-center justify-center bg-[#0d0f14] flex-shrink-0">
            <HermitSprite domain={creator.category} size={56} />
          </div>
          <div className="flex-1">
            <h1
              className="text-base text-white mb-1 leading-relaxed"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              {creator.name}
            </h1>
            <p className="text-[9px] text-gray-500 mb-3">{creator.handle}</p>
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-[7px] text-amber-600 uppercase tracking-widest border border-amber-600/30 bg-amber-600/10 px-2 py-0.5">
                {creator.category}
              </span>
              <span className="text-[8px] text-gray-500">{creator.skill_count || skills.length} skills</span>
              <span className="text-[8px] text-gray-500">{creator.video_count} sources</span>
            </div>
          </div>
        </div>

        {/* Domain tags */}
        {domains.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {domains.map((d: string) => (
              <span
                key={d}
                className="text-[8px] text-gray-400 border border-[#2a2d35] bg-[#161920] px-3 py-1 flex items-center gap-1"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                <HermitSprite domain={d} size={20} /> {domainLabel(d)}
              </span>
            ))}
          </div>
        )}

        {/* Skills grid */}
        <h2
          className="text-[9px] text-white mb-6"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          <span className="text-amber-400">▶</span> SKILLS ({skills.length})
        </h2>

        {skills.length === 0 ? (
          <p className="text-[9px] text-gray-500" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            No skills extracted yet — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill: any) => (
              <Link key={skill.skill_id} href={`/skills/${skill.skill_id}`}>
                <div
                  className="bg-[#161920] border-2 border-[#2a2d35] hover:border-amber-400 p-5 h-full transition-all duration-150 flex flex-col gap-3 cursor-pointer group"
                  style={{ boxShadow: "2px 2px 0px #000" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[7px] text-gray-500 uppercase tracking-widest border border-[#2a2d35] px-2 py-0.5 flex items-center gap-1">
                      <HermitSprite domain={skill.domain} size={20} /> {domainLabel(skill.domain)}
                    </span>
                    <span
                      className="text-[8px] text-amber-400 border border-amber-400/50 px-2 py-0.5"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}
                    >
                      FREE
                    </span>
                  </div>

                  <p
                    className="text-[9px] text-white leading-relaxed group-hover:text-amber-300 transition-colors line-clamp-2"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    {skill.title}
                  </p>

                  {skill.techniques?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {skill.techniques.slice(0, 3).map((t: string) => (
                        <span key={t} className="text-[7px] text-gray-500 bg-[#0d0f14] border border-[#2a2d35] px-2 py-0.5">
                          {t.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#2a2d35]">
                    <span className="text-[8px] text-gray-500">{skill.num_principles} principles</span>
                    <span
                      className="text-[8px] text-amber-400 group-hover:text-amber-300 transition-colors"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}
                    >
                      VIEW →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
