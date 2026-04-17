import Link from "next/link";
import { Lock } from "lucide-react";
import type { Skill } from "@/lib/mockData";

interface BrainCardProps {
  brain: Skill & { tier?: string; locked?: boolean };
  compact?: boolean;
}

export default function BrainCard({ brain, compact = false }: BrainCardProps) {
  const locked = brain.locked ?? false;
  const tier = brain.tier ?? "free";

  return (
    <Link href={`/skills/${brain.slug}`} className="block group">
      <div
        className={`bg-[#161920] border-2 transition-all duration-200 p-4 flex flex-col gap-3 h-full brain-card-hover ${
          locked ? "border-[#2a2d35] hover:border-gray-500" : "border-[#2a2d35] hover:border-amber-400"
        }`}
        style={{ boxShadow: "2px 2px 0px #000" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <h3
                className={`text-[10px] leading-tight line-clamp-2 transition-colors ${
                  locked ? "text-gray-500 group-hover:text-gray-400" : "text-white group-hover:text-amber-400"
                }`}
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {brain.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{brain.creator}</p>
            </div>
          </div>

          {locked ? (
            <div className="flex items-center gap-1 border border-gray-600 px-2 py-1 shrink-0">
              <Lock size={8} className="text-gray-500" />
              <span className="text-[7px] text-gray-500 uppercase" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                PAID
              </span>
            </div>
          ) : tier === "paid" ? (
            <span className="text-[7px] text-green-400 border border-green-400/50 px-2 py-1 shrink-0"
              style={{ fontFamily: "'Press Start 2P', monospace" }}>
              UNLOCKED
            </span>
          ) : (
            <span className="text-[7px] text-amber-400 border border-amber-400 px-2 py-1 shrink-0"
              style={{ fontFamily: "'Press Start 2P', monospace" }}>
              FREE
            </span>
          )}
        </div>

        {/* Category badge */}
        <div className="flex items-center gap-2">
          <span className="text-[8px] text-gray-400 border border-[#2a2d35] px-2 py-0.5"
            style={{ fontFamily: "'Press Start 2P', monospace" }}>
            {brain.category}
          </span>
        </div>

        {!compact && (
          <p className={`text-xs line-clamp-2 flex-1 ${locked ? "text-gray-600" : "text-gray-400"}`}>
            {brain.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#2a2d35]">
          {locked ? (
            <span className="text-[7px] text-gray-600" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              Subscribe to unlock
            </span>
          ) : (
            <span className="text-[7px] text-amber-400/60" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              RENT →
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
