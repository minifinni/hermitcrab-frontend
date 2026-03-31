import Link from "next/link";
import { getPacks, domainEmoji, domainLabel } from "@/lib/api";
import HermitSprite from "@/components/HermitSprite";

export const revalidate = 60;

export default async function PacksPage() {
  let packs: any[] = [];

  try {
    packs = await getPacks();
  } catch {
    // fallback to empty — page still renders
  }

  return (
    <div className="min-h-screen bg-[#0d0f14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-lg text-white mb-3"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            <span className="text-amber-400">▶</span> SKILL PACKS
          </h1>
          <p className="text-sm text-gray-400 max-w-xl">
            Curated collections of expert skills. Each pack contains domain-specific knowledge from trusted creators.
          </p>
        </div>

        {/* Packs Grid */}
        {packs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {packs.map((pack) => (
              <Link key={pack.pack_id} href={`/packs/${pack.pack_id}`}>
                <div
                  className="bg-[#161920] border-2 border-[#2a2d35] hover:border-amber-400 p-6 h-full transition-all duration-150 flex flex-col gap-4 cursor-pointer group"
                  style={{ boxShadow: "2px 2px 0px #000" }}
                >
                  {/* Icon + Domain */}
                  <div className="flex items-start justify-between">
                    <div className="w-16 h-16 border-2 border-amber-400/40 flex items-center justify-center bg-[#0d0f14] flex-shrink-0">
                      <HermitSprite domain={pack.domain} size={48} />
                    </div>
                    <span
                      className="text-[8px] text-amber-400 border border-amber-400/50 px-2 py-0.5"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}
                    >
                      PACK
                    </span>
                  </div>

                  {/* Pack Info */}
                  <div>
                    <h2
                      className="text-[10px] text-white leading-relaxed group-hover:text-amber-300 transition-colors line-clamp-2"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}
                    >
                      {pack.name}
                    </h2>
                    {pack.creator_name && (
                      <p className="text-[8px] text-gray-500 mt-2">
                        by {pack.creator_name}
                      </p>
                    )}
                  </div>

                  {/* Domain Tag */}
                  <div>
                    <span className="text-[7px] text-amber-600 uppercase tracking-widest border border-amber-600/30 bg-amber-600/10 px-2 py-0.5">
                      {domainLabel(pack.domain)}
                    </span>
                  </div>

                  {/* Stats Footer */}
                  <div className="mt-auto pt-4 border-t border-[#2a2d35] flex items-center justify-between">
                    <span className="text-[8px] text-gray-500">
                      {pack.skill_count} skill{pack.skill_count !== 1 ? 's' : ''}
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
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div
              className="inline-block bg-[#161920] border-2 border-[#2a2d35] p-10"
              style={{ boxShadow: "3px 3px 0px #000" }}
            >
              <p
                className="text-amber-400 text-3xl mb-4"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                🐚
              </p>
              <p
                className="text-gray-500 text-[10px]"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                NO PACKS FOUND
              </p>
              <p className="text-gray-600 text-xs mt-3">
                Check back soon for new skill collections
              </p>
            </div>
          </div>
        )}

        {/* Browse All Link */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Looking for individual creators?
          </p>
          <Link
            href="/skills"
            className="text-[9px] text-amber-400 hover:text-amber-300 transition-colors border border-amber-400/50 px-4 py-2 inline-block"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            BROWSE ALL CREATORS →
          </Link>
        </div>
      </div>
    </div>
  );
}
