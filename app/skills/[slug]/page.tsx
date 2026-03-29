import { notFound } from "next/navigation";
import Link from "next/link";
import { Download, ArrowLeft, Check } from "lucide-react";
import StarRating from "@/components/StarRating";
import PriceBadge from "@/components/PriceBadge";
import SkillCard from "@/components/SkillCard";
import { MOCK_SKILLS, MOCK_REVIEWS } from "@/lib/mockData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOCK_SKILLS.map((skill) => ({ slug: skill.slug }));
}

export default async function SkillDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const skill = MOCK_SKILLS.find((s) => s.slug === slug);

  if (!skill) notFound();

  const related = MOCK_SKILLS.filter(
    (s) => s.id !== skill.id && s.category === skill.category
  ).slice(0, 3);

  const compatibleWith = ["OpenClaw", "Claude", "ChatGPT"];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back */}
      <Link
        href="/skills"
        className="inline-flex items-center gap-2 text-[9px] text-gray-500 hover:text-amber-400 transition-colors mb-8"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        <ArrowLeft size={12} />
        Back to Skills
      </Link>

      {/* Hero */}
      <div className="bg-[#161920] border-2 border-[#2a2d35] p-8 mb-8" style={{ boxShadow: "3px 3px 0px #000" }}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{skill.emoji}</span>
              <div>
                <span
                  className="text-[9px] text-gray-500 border border-[#2a2d35] px-2 py-0.5"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  {skill.category}
                </span>
              </div>
            </div>

            <h1
              className="text-lg md:text-xl text-white leading-relaxed mb-2"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              {skill.name}
            </h1>

            <p className="text-sm text-gray-400 mb-4">
              by{" "}
              <span className="text-amber-400 hover:text-amber-300 cursor-pointer">
                {skill.creator}
              </span>
            </p>

            <div className="flex items-center gap-4">
              <StarRating rating={skill.rating} size="md" />
              <span className="text-xs text-gray-500">({skill.ratingCount} reviews)</span>
              <Download size={14} className="text-gray-500" />
              <span className="text-xs text-gray-500">{skill.downloads} downloads</span>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <PriceBadge price={skill.price} priceType={skill.priceType} />
            <button
              className="text-[10px] bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-4 w-full md:w-auto transition-all duration-100 active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-2 justify-center"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                boxShadow: "3px 3px 0px #000",
              }}
            >
              <Download size={14} />
              {skill.priceType === "rental" ? "Rent Now" : skill.priceType === "paid" ? "Buy Now" : "Download Free"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section>
            <h2
              className="text-[11px] text-amber-400 mb-4"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              About This Skill
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">{skill.description}</p>
          </section>

          {/* What it does */}
          <section className="bg-[#161920] border-2 border-[#2a2d35] p-6" style={{ boxShadow: "2px 2px 0px #000" }}>
            <h2
              className="text-[11px] text-white mb-5"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              What this skill does
            </h2>
            <ul className="space-y-3">
              {skill.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <Check size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  {bullet}
                </li>
              ))}
            </ul>
          </section>

          {/* Reviews */}
          <section>
            <h2
              className="text-[11px] text-white mb-6"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              <span className="text-amber-400">▶</span> Reviews
            </h2>
            <div className="space-y-4">
              {MOCK_REVIEWS.map((review, i) => (
                <div
                  key={i}
                  className="bg-[#161920] border-2 border-[#2a2d35] p-5"
                  style={{ boxShadow: "2px 2px 0px #000" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-amber-400">{review.username}</span>
                      <StarRating rating={review.stars} />
                    </div>
                    <span className="text-xs text-gray-600">{review.date}</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{review.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Compatible with */}
          <div className="bg-[#161920] border-2 border-[#2a2d35] p-5" style={{ boxShadow: "2px 2px 0px #000" }}>
            <h3
              className="text-[10px] text-white mb-4"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              Compatible with
            </h3>
            <div className="space-y-2">
              {compatibleWith.map((platform) => (
                <div
                  key={platform}
                  className="flex items-center gap-2 text-xs text-gray-400 bg-[#0d0f14] border border-[#2a2d35] px-3 py-2"
                >
                  <Check size={11} className="text-emerald-400" />
                  {platform}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-[#161920] border-2 border-[#2a2d35] p-5" style={{ boxShadow: "2px 2px 0px #000" }}>
            <h3
              className="text-[10px] text-white mb-4"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[8px] text-gray-400 border border-[#2a2d35] px-2 py-1 hover:border-amber-400 hover:text-amber-400 cursor-pointer transition-colors"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related skills */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2
            className="text-[11px] text-white mb-6"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            <span className="text-amber-400">▶</span> Related Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((s) => (
              <SkillCard key={s.id} skill={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
