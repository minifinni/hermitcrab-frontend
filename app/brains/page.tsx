import Link from "next/link";
import { getAllBrains } from "@/lib/brains";
import HermitSprite from "@/components/HermitSprite";

export const metadata = { title: "Brains — Hermitcrab" };

export default function BrainsPage() {
  const brains = getAllBrains();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-12">
        <div
          className="text-[7px] text-amber-400 uppercase tracking-widest mb-3"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          ▶ RENT A BRAIN
        </div>
        <h1
          className="text-xl text-white mb-4"
          style={{ fontFamily: "'Press Start 2P', monospace", lineHeight: "1.8" }}
        >
          Expert Brains
        </h1>
        <p className="text-gray-400 text-sm max-w-xl">
          Someone you trust already decided. Rent their decision-making framework
          and get opinionated guidance you can act on.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {brains.map(brain => (
          <Link key={brain.slug} href={`/brains/${brain.slug}`}>
            <div
              className="border border-[#2a2d35] p-5 hover:border-amber-400/60 transition-colors cursor-pointer h-full flex flex-col"
              style={{ background: "#161920", boxShadow: "2px 2px 0px #000" }}
            >
              {/* Domain sprite + badge */}
              <div className="flex items-start justify-between mb-4">
                <HermitSprite domain={brain.domains[0] ?? "general"} size={40} />
                <div
                  className="text-[6px] text-amber-400 border border-amber-400/40 px-2 py-1 uppercase tracking-widest"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  BRAIN
                </div>
              </div>

              {/* Title */}
              <h2
                className="text-[9px] text-white mb-2 leading-relaxed"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {brain.title}
              </h2>

              {/* Author */}
              <p
                className="text-[7px] text-amber-400/70 mb-3"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {brain.author.split("(")[0].trim()}
              </p>

              {/* Description */}
              <p className="text-gray-500 text-xs leading-relaxed flex-1">
                {brain.description.slice(0, 100)}
                {brain.description.length > 100 ? "…" : ""}
              </p>

              {/* Domains */}
              <div className="flex flex-wrap gap-2 mt-4">
                {brain.domains.slice(0, 3).map(d => (
                  <span
                    key={d}
                    className="text-[6px] uppercase tracking-widest border border-amber-600/30 bg-amber-600/10 text-amber-600/70 px-2 py-0.5"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div
                className="text-[7px] text-amber-400 mt-4"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                RENT BRAIN →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Brainify CTA */}
      <div
        className="mt-16 border border-[#2a2d35] p-8 text-center"
        style={{ boxShadow: "2px 2px 0px #000" }}
      >
        <div
          className="text-[7px] text-gray-500 uppercase tracking-widest mb-3"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          GOT YOUR OWN EXPERT?
        </div>
        <p className="text-gray-400 text-sm mb-6">
          Upload transcripts and we'll extract the frameworks, mental models, and
          decisions into a rentable brain.
        </p>
        <Link
          href="/brainify"
          className="inline-block bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 transition-colors"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", boxShadow: "2px 2px 0px #000" }}
        >
          BRAINIFY →
        </Link>
      </div>
    </div>
  );
}
