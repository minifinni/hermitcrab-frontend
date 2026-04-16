import Link from "next/link";
import { getPack, getPacks, domainEmoji, domainLabel } from "@/lib/api";
import { notFound } from "next/navigation";

export const revalidate = 60;

// Generate static params for all packs
export async function generateStaticParams() {
  try {
    const packs = await getPacks();
    return packs.map((pack) => ({
      id: pack.pack_id,
    }));
  } catch {
    return [];
  }
}

export default async function PackDetailPage({ params }: { params: { id: string } }) {
  let pack: any = null;

  try {
    pack = await getPack(params.id);
  } catch {
    notFound();
  }

  if (!pack) notFound();

  const skills = pack.skills || [];

  return (
    <div className="min-h-screen bg-[#0d0f14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Navigation */}
        <Link
          href="/packs"
          className="text-[9px] text-gray-500 hover:text-amber-400 transition-colors mb-8 block"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          ← ALL PACKS
        </Link>

        {/* Pack Header */}
        <div
          className="bg-[#161920] border-2 border-[#2a2d35] p-8 mb-10 flex flex-col sm:flex-row items-start gap-6"
          style={{ boxShadow: "3px 3px 0px #000" }}
        >
          <div className="w-20 h-20 border-2 border-amber-400/40 flex items-center justify-center text-4xl bg-[#0d0f14] flex-shrink-0">
            {domainEmoji(pack.domain)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span
                className="text-[8px] text-amber-400 border border-amber-400/50 px-2 py-0.5"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                BRAIN PACK
              </span>
              <span className="text-[8px] text-gray-500">
                {domainLabel(pack.domain)}
              </span>
            </div>
            <h1
              className="text-base text-white mb-2 leading-relaxed"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              {pack.name}
            </h1>
            {pack.creator_name && (
              <p className="text-[9px] text-gray-500">
                Curated by {pack.creator_name}
                {pack.creator_handle && (
                  <span className="text-gray-600"> @{pack.creator_handle}</span>
                )}
              </p>
            )}
            {pack.description && (
              <p className="text-sm text-gray-400 mt-4 leading-relaxed max-w-2xl">
                {pack.description}
              </p>
            )}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-[8px] text-gray-500">
                {pack.skill_count} brain{pack.skill_count !== 1 ? 's' : ''}
              </span>
              <button
                className="text-[8px] text-black bg-amber-400 hover:bg-amber-300 transition-colors px-4 py-2"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                RENT THIS PACK →
              </button>
            </div>
          </div>
        </div>

        {/* Brains Grid */}
        <h2
          className="text-[9px] text-white mb-6"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          <span className="text-amber-400">▶</span> BRAINS IN THIS PACK ({skills.length})
        </h2>

        {skills.length === 0 ? (
          <div
            className="bg-[#161920] border-2 border-[#2a2d35] p-8 text-center"
            style={{ boxShadow: "2px 2px 0px #000" }}
          >
            <p
              className="text-gray-500 text-[10px]"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              NO BRAINS IN THIS PACK YET
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill: any) => (
              <Link key={skill.skill_id} href={`/skills/${skill.skill_id}`}>
                <div
                  className="bg-[#161920] border-2 border-[#2a2d35] hover:border-amber-400 p-5 h-full transition-all duration-150 flex flex-col gap-3 cursor-pointer group"
                  style={{ boxShadow: "2px 2px 0px #000" }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[7px] text-gray-500 uppercase tracking-widest border border-[#2a2d35] px-2 py-0.5">
                      {domainEmoji(skill.domain)} {domainLabel(skill.domain)}
                    </span>
                    <span
                      className="text-[8px] text-amber-400 border border-amber-400/50 px-2 py-0.5"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}
                    >
                      FREE
                    </span>
                  </div>

                  {/* Title */}
                  <p
                    className="text-[9px] text-white leading-relaxed group-hover:text-amber-300 transition-colors line-clamp-2"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    {skill.title}
                  </p>

                  {/* Techniques */}
                  {skill.techniques?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {skill.techniques.slice(0, 3).map((t: string) => (
                        <span
                          key={t}
                          className="text-[7px] text-gray-500 bg-[#0d0f14] border border-[#2a2d35] px-2 py-0.5"
                        >
                          {t.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#2a2d35]">
                    <span className="text-[8px] text-gray-500">
                      {skill.num_principles} principles
                    </span>
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

        {/* Related Navigation */}
        <div className="mt-12 pt-8 border-t border-[#2a2d35]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">
                Want to explore more?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/packs"
                className="text-[9px] text-amber-400 hover:text-amber-300 transition-colors border border-amber-400/50 px-4 py-2"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                ALL PACKS
              </Link>
              <Link
                href="/skills"
                className="text-[9px] text-gray-400 hover:text-gray-300 transition-colors border border-gray-600 px-4 py-2"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                ALL CREATORS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
