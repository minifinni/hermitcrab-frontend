import Link from "next/link";
import { getCreators, getSkillsByCreator, domainEmoji, domainLabel } from "@/lib/api";
import { notFound } from "next/navigation";

export const revalidate = 60;

function categoryEmoji(category: string) {
  const map: Record<string, string> = {
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
  return map[category?.toLowerCase()] ?? "🐚";
}

export default async function CreatorPage({ params }: { params: { handle: string } }) {
  let creator: any = null;
  let skills: any[] = [];

  try {
    const [creators, creatorSkills] = await Promise.all([
      getCreators(),
      getSkillsByCreator(params.handle),
    ]);
    creator = creators.find((c) => c.handle === params.handle);
    skills = creatorSkills;
  } catch {
    notFound();
  }

  if (!creator) notFound();

  // Unique domains across this creator's skills for tag filter
  const domains = Array.from(new Set(skills.map((s) => s.domain)));

  return (
    <div className="min-h-screen bg-[#0d0f14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
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
          <div className="w-16 h-16 border-2 border-amber-400/40 flex items-center justify-center text-3xl bg-[#0d0f14] flex-shrink-0">
            {categoryEmoji(creator.category)}
          </div>
          <div className="flex-1">
            <h1
              className="text-base text-white mb-1 leading-relaxed"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              {creator.name}
            </h1>
            <p className="text-[9px] text-gray-500 mb-3">@{creator.handle}</p>
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-[7px] text-amber-600 uppercase tracking-widest border border-amber-600/30 bg-amber-600/10 px-2 py-0.5">
                {creator.category}
              </span>
              <span className="text-[8px] text-gray-500">{skills.length} brains available</span>
              <span className="text-[8px] text-gray-500">{creator.video_count} sources</span>
            </div>

            {/* Progress Section */}
            <div className="mt-4 pt-4 border-t border-[#2a2d35]">
              {/* Status Badge */}
              {(creator.progress_pct === 0 || creator.progress_pct === undefined) && (
                <span className="inline-block text-[8px] text-gray-400 uppercase tracking-widest border border-gray-600 bg-gray-800/50 px-3 py-1 mb-3" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  ⏸ QUEUED
                </span>
              )}
              {creator.progress_pct && creator.progress_pct > 0 && creator.progress_pct < 100 && (
                <span className="inline-block text-[8px] text-amber-400 uppercase tracking-widest border border-amber-500/50 bg-amber-500/10 px-3 py-1 mb-3" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  ▶ PROCESSING
                </span>
              )}
              {creator.progress_pct === 100 && (
                <span className="inline-block text-[8px] text-green-400 uppercase tracking-widest border border-green-500/50 bg-green-500/10 px-3 py-1 mb-3" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  ✓ READY
                </span>
              )}

              {/* Progress Bar */}
              <div className="h-2 bg-[#2a2d35] w-full max-w-xs mb-2">
                <div
                  className={`h-full ${creator.progress_pct === 100 ? 'bg-green-500' : 'bg-amber-500'}`}
                  style={{ width: `${creator.progress_pct || 0}%` }}
                />
              </div>

              {/* Progress Text */}
              <p className="text-[9px] text-gray-400" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                {creator.videos_processed || 0} OF {creator.video_count} VIDEOS PROCESSED
                {creator.progress_pct !== undefined && creator.progress_pct > 0 && (
                  <span className="text-amber-500 ml-2">({creator.progress_pct}%)</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Domain tags — filter hint */}
        {domains.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {domains.map((d) => (
              <span
                key={d}
                className="text-[8px] text-gray-400 border border-[#2a2d35] bg-[#161920] px-3 py-1"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {domainEmoji(d)} {domainLabel(d)}
              </span>
            ))}
          </div>
        )}

        {/* Brains grid */}
        <h2
          className="text-[9px] text-white mb-6"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          <span className="text-amber-400">▶</span> RENT {creator.name.toUpperCase()}'S BRAIN ({skills.length})
        </h2>

        {skills.length === 0 ? (
          <p className="text-[9px] text-gray-500" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            No brains available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <Link key={skill.skill_id} href={`/skills/${skill.skill_id}`}>
                <div
                  className="bg-[#161920] border-2 border-[#2a2d35] hover:border-amber-400 p-5 h-full transition-all duration-150 flex flex-col gap-3 cursor-pointer group"
                  style={{ boxShadow: "2px 2px 0px #000" }}
                >
                  <div className="flex items-center justify-between">
                    {/* Domain as tag */}
                    <span className="text-[7px] text-gray-500 uppercase tracking-widest border border-[#2a2d35] px-2 py-0.5">
                      {domainEmoji(skill.domain)} {domainLabel(skill.domain)}
                    </span>
                    <span
                      className="text-[8px] text-amber-400 border border-amber-400/50 px-2 py-0.5"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}
                    >
                      RENT
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
                    <span className="text-amber-400 text-xs">★★★★☆</span>
                    <span className="text-[8px] text-gray-500">{skill.num_principles} principles</span>
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
