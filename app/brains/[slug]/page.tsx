import { notFound } from "next/navigation";
import Link from "next/link";
import { getBrain, getAllBrains } from "@/lib/brains";
import HermitSprite from "@/components/HermitSprite";

export async function generateStaticParams() {
  return getAllBrains().map(b => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brain = getBrain(slug);
  if (!brain) return {};
  return { title: `${brain.title} — Hermitcrab` };
}

export default async function BrainPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brain = getBrain(slug);
  if (!brain) notFound();

  const sections = parseMarkdownSections(brain.content);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Back */}
      <Link
        href="/brains"
        className="text-[7px] text-gray-500 hover:text-amber-400 transition-colors mb-8 inline-block"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        ← ALL BRAINS
      </Link>

      {/* Hero */}
      <div
        className="border border-[#2a2d35] p-8 mb-8"
        style={{ background: "#161920", boxShadow: "2px 2px 0px #000" }}
      >
        <div className="flex items-start gap-5">
          <HermitSprite domain={brain.domains[0] ?? "general"} size={56} />
          <div className="flex-1 min-w-0">
            <div
              className="text-[6px] text-amber-400 border border-amber-400/40 inline-block px-2 py-1 mb-3 uppercase tracking-widest"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              BRAIN
            </div>
            <h1
              className="text-sm text-white mb-2 leading-relaxed"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              {brain.title}
            </h1>
            <p
              className="text-[7px] text-amber-400/70 mb-4"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              {brain.author}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              {brain.description}
            </p>
          </div>
        </div>

        {/* Domains */}
        <div className="flex flex-wrap gap-2 mt-5">
          {brain.domains.map(d => (
            <span
              key={d}
              className="text-[6px] uppercase tracking-widest border border-amber-600/30 bg-amber-600/10 text-amber-600/70 px-2 py-0.5"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Rent CTA */}
        <div className="mt-6 flex gap-3">
          <button
            className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 transition-colors"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", boxShadow: "2px 2px 0px #000" }}
          >
            RENT BRAIN →
          </button>
          <a
            href={`/brains/${slug}/raw`}
            className="border border-[#2a2d35] hover:border-amber-400/50 text-gray-400 hover:text-amber-400 px-6 py-3 transition-colors text-center"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px" }}
          >
            RAW .MD
          </a>
        </div>
      </div>

      {/* Triggers */}
      {brain.triggers.length > 0 && (
        <div className="mb-8">
          <div
            className="text-[7px] text-gray-500 uppercase tracking-widest mb-3"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            ACTIVATES WHEN YOU ASK ABOUT
          </div>
          <div className="flex flex-wrap gap-2">
            {brain.triggers.map(t => (
              <span
                key={t}
                className="text-xs text-gray-400 border border-[#2a2d35] px-3 py-1"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content sections */}
      <div className="space-y-6">
        {sections.map((section, i) => (
          <ContentSection key={i} heading={section.heading} body={section.body} />
        ))}
      </div>

      {/* Footer nav */}
      <div className="mt-16 flex justify-between items-center">
        <Link
          href="/brains"
          className="text-[7px] text-gray-500 hover:text-amber-400 transition-colors"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          ← ALL BRAINS
        </Link>
        <Link
          href="/brainify"
          className="text-[7px] text-gray-500 hover:text-amber-400 transition-colors"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          BUILD YOUR OWN →
        </Link>
      </div>
    </div>
  );
}

function ContentSection({ heading, body }: { heading: string; body: string }) {
  return (
    <div
      className="border border-[#2a2d35] p-6"
      style={{ background: "#161920", boxShadow: "2px 2px 0px #000" }}
    >
      <div
        className="text-[7px] text-amber-400 uppercase tracking-widest mb-4"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        ▶ {heading.replace(/^#+\s*/, "")}
      </div>
      <div className="prose-brain text-gray-400 text-sm leading-relaxed space-y-3">
        {renderBody(body)}
      </div>
    </div>
  );
}

function renderBody(body: string) {
  const lines = body.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Sub-heading (###)
    if (line.startsWith("### ")) {
      elements.push(
        <p key={i} className="text-[8px] text-white font-semibold mt-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          {line.replace(/^###\s*/, "")}
        </p>
      );
    }
    // Bold line (**text**)
    else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={i} className="text-gray-300 font-semibold">
          {line.slice(2, -2)}
        </p>
      );
    }
    // Blockquote
    else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="border-l-2 border-amber-400/50 pl-4 italic text-gray-500">
          {line.slice(2)}
        </blockquote>
      );
    }
    // Bullet / checklist
    else if (line.match(/^[-*] |^❌ |^✅ /)) {
      const isAnti = line.startsWith("❌");
      const isDo = line.startsWith("✅");
      const text = line.replace(/^[-*❌✅]\s*/, "");
      elements.push(
        <div key={i} className={`flex gap-2 ${isAnti ? "text-red-400/80" : isDo ? "text-green-400/80" : "text-gray-400"}`}>
          <span className="shrink-0">{isAnti ? "❌" : isDo ? "✅" : "·"}</span>
          <span dangerouslySetInnerHTML={{ __html: inlineFormat(text) }} />
        </div>
      );
    }
    // Table row
    else if (line.startsWith("|") && !line.startsWith("| --") && !line.startsWith("|--")) {
      const cells = line.split("|").filter((c, idx) => idx > 0 && idx < line.split("|").length - 1);
      const isHeader = lines[i + 1]?.match(/^\|[-| ]+\|/);
      elements.push(
        <div key={i} className={`grid gap-2 text-xs ${cells.length === 2 ? "grid-cols-2" : "grid-cols-3"} ${isHeader ? "text-amber-400/80 border-b border-[#2a2d35] pb-1" : ""}`}>
          {cells.map((c, ci) => (
            <span key={ci} dangerouslySetInnerHTML={{ __html: inlineFormat(c.trim()) }} />
          ))}
        </div>
      );
      if (isHeader) i++; // skip separator row
    }
    // Separator
    else if (line === "---") {
      elements.push(<hr key={i} className="border-[#2a2d35] my-2" />);
    }
    // Blank line
    else if (line.trim() === "") {
      // skip
    }
    // Normal paragraph
    else if (line.trim()) {
      elements.push(
        <p key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />
      );
    }

    i++;
  }

  return elements;
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong class='text-gray-300'>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code class='text-amber-400/80 bg-amber-400/10 px-1'>$1</code>");
}

function parseMarkdownSections(content: string): { heading: string; body: string }[] {
  const lines = content.split("\n");
  const sections: { heading: string; body: string }[] = [];
  let current: { heading: string; lines: string[] } | null = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) sections.push({ heading: current.heading, body: current.lines.join("\n") });
      current = { heading: line, lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push({ heading: current.heading, body: current.lines.join("\n") });

  return sections.filter(s => s.body.trim().length > 0);
}
