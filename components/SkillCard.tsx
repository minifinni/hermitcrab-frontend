import Link from "next/link";
import { Download } from "lucide-react";
import StarRating from "./StarRating";
import PriceBadge from "./PriceBadge";
import type { Skill } from "@/lib/mockData";

interface SkillCardProps {
  skill: Skill;
  compact?: boolean;
}

export default function SkillCard({ skill, compact = false }: SkillCardProps) {
  return (
    <Link href={`/skills/${skill.slug}`} className="block group">
      <div
        className="bg-[#161920] border-2 border-[#2a2d35] hover:border-amber-400 transition-all duration-200 p-4 flex flex-col gap-3 h-full skill-card-hover"
        style={{ boxShadow: "2px 2px 0px #000" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl"></span>
            <div>
              <h3
                className="text-[10px] text-white leading-tight group-hover:text-amber-400 transition-colors line-clamp-2"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {skill.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{skill.creator}</p>
            </div>
          </div>
          <PriceBadge price={skill.price} priceType={skill.priceType} />
        </div>

        {/* Category badge */}
        <div className="flex items-center gap-2">
          <span
            className="text-[8px] text-gray-400 border border-[#2a2d35] px-2 py-0.5"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            {skill.category}
          </span>
        </div>

        {!compact && (
          <p className="text-xs text-gray-400 line-clamp-2 flex-1">{skill.description}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#2a2d35]">
          <StarRating rating={skill.rating} />
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Download size={11} />
            <span>{skill.downloads}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
