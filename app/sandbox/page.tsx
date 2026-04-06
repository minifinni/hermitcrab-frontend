"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { domainSprite, domainLabel, ApiPack, DOMAIN_META } from "@/lib/api";

/* ── Types ── */

interface Crab {
  id: string;
  pack: ApiPack;
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: "left" | "right";
  size: number;
  sprite: string;
}

interface Sandbox {
  id: string;
  name: string;
  crabIds: string[];
}

/* ── Constants ── */

const SPEED = 0.3;
const BOUNDARY_PADDING = 80;
const GROUND_HEIGHT = 80; // px from bottom for the search bar area
const STORAGE_KEY = "hermitcrab-sandboxes";
const POPULAR_DOMAINS = ["business", "ai", "fitness", "cooking", "tech", "marketing", "finance", "design"];
const PIXEL_FONT: React.CSSProperties = { fontFamily: "'Press Start 2P', monospace" };

/* ── Helpers ── */

function randomVelocity() {
  const angle = Math.random() * Math.PI * 2;
  return { vx: Math.cos(angle) * SPEED, vy: Math.sin(angle) * SPEED };
}

function crabSize(_skillCount: number) {
  return 56; // All crabs same size
}

function saveSandboxes(sandboxes: Sandbox[]) {
  if (sandboxes.length === 0) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sandboxes));
  }
}

/* ── Component ── */

export default function SandboxPage() {
  const [packs, setPacks] = useState<ApiPack[]>([]);
  const [crabs, setCrabs] = useState<Crab[]>([]);
  const [sandboxes, setSandboxes] = useState<Sandbox[]>([]);
  const [activeSandbox, setActiveSandbox] = useState<string>("all");
  const [newSandboxName, setNewSandboxName] = useState("");
  const [hoveredCrab, setHoveredCrab] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const hoveredRef = useRef<string | null>(null);

  // Keep ref in sync so animation loop can read it without re-renders
  useEffect(() => {
    hoveredRef.current = hoveredCrab;
  }, [hoveredCrab]);

  /* ── Data fetching ── */
  useEffect(() => {
    fetch("/api/packs")
      .then((r) => r.json())
      .then((p: ApiPack[]) => {
        setPacks(p);
        const initialCrabs: Crab[] = p.map((pack) => {
          const { vx, vy } = randomVelocity();
          return {
            id: pack.pack_id,
            pack,
            x: 60 + Math.random() * 600,
            y: 40 + Math.random() * 280,
            vx,
            vy,
            facing: vx > 0 ? ("right" as const) : ("left" as const),
            size: crabSize(pack.skill_count),
            sprite: domainSprite(pack.domain),
          };
        });
        setCrabs(initialCrabs);
      })
      .catch((e) => console.error("Failed to load packs:", e));

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSandboxes(JSON.parse(saved));
      } catch {
        /* corrupted storage */
      }
    }
  }, []);

  /* ── Persist sandboxes ── */
  useEffect(() => {
    saveSandboxes(sandboxes);
  }, [sandboxes]);

  /* ── Animation loop ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || crabs.length === 0) return;

    let lastTime = performance.now();

    function animate(now: number) {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      setCrabs((prev) =>
        prev.map((crab) => {
          // Pause hovered crab
          if (hoveredRef.current === crab.id) return crab;

          const rect = container!.getBoundingClientRect();
          const maxX = rect.width - BOUNDARY_PADDING;
          const maxY = rect.height - BOUNDARY_PADDING - GROUND_HEIGHT;

          let { x, y, vx, vy } = crab;
          x += vx * dt * 0.06;
          y += vy * dt * 0.06;

          if (x < 20 || x > maxX) {
            vx = -vx;
            x = Math.max(20, Math.min(maxX, x));
          }
          if (y < 20 || y > maxY) {
            vy = -vy;
            y = Math.max(20, Math.min(maxY, y));
          }

          // Random direction change
          if (Math.random() < 0.002) {
            const nv = randomVelocity();
            vx = nv.vx;
            vy = nv.vy;
          }

          return { ...crab, x, y, vx, vy, facing: vx > 0 ? "right" : "left" };
        })
      );

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [crabs.length]);

  /* ── Derived state ── */
  const currentSandbox = sandboxes.find((s) => s.id === activeSandbox);

  const visibleCrabs =
    activeSandbox === "all"
      ? crabs
      : crabs.filter((c) => {
          const sb = sandboxes.find((s) => s.id === activeSandbox);
          return sb?.crabIds.includes(c.id);
        });

  const searchResults = searchQuery.trim()
    ? packs.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.domain || "").toLowerCase().includes(q) ||
          (p.creator_name || "").toLowerCase().includes(q)
        );
      })
    : [];

  /* ── Sandbox CRUD ── */
  function createSandbox() {
    if (!newSandboxName.trim()) return;
    const sb: Sandbox = {
      id: `sb_${Date.now()}`,
      name: newSandboxName.trim(),
      crabIds: [],
    };
    setSandboxes((prev) => [...prev, sb]);
    setActiveSandbox(sb.id);
    setNewSandboxName("");
  }

  function addCrabToSandbox(packId: string) {
    if (activeSandbox === "all") return;
    setSandboxes((prev) =>
      prev.map((sb) =>
        sb.id === activeSandbox && !sb.crabIds.includes(packId)
          ? { ...sb, crabIds: [...sb.crabIds, packId] }
          : sb
      )
    );
    setSearchQuery("");
  }

  function removeCrabFromSandbox(packId: string) {
    setSandboxes((prev) =>
      prev.map((sb) =>
        sb.id === activeSandbox
          ? { ...sb, crabIds: sb.crabIds.filter((id) => id !== packId) }
          : sb
      )
    );
  }

  function deleteSandbox(sbId: string) {
    setSandboxes((prev) => prev.filter((sb) => sb.id !== sbId));
    setActiveSandbox("all");
  }

  function renameSandbox(newName: string) {
    if (!currentSandbox || !newName.trim()) return;
    setSandboxes((prev) =>
      prev.map((sb) => (sb.id === activeSandbox ? { ...sb, name: newName.trim() } : sb))
    );
  }

  /* ── Export as SKILL.md ── */
  async function exportSkillMd() {
    if (!currentSandbox) return;
    const sbPacks = packs.filter((p) => currentSandbox.crabIds.includes(p.pack_id));
    let md = `# ${currentSandbox.name}\n\nExported from HermitCrab Sandbox\n\n`;
    md += `## Experts (${sbPacks.length})\n\n`;
    for (const p of sbPacks) {
      md += `### ${p.name}\n`;
      md += `- **Domain:** ${domainLabel(p.domain)}\n`;
      md += `- **Skills:** ${p.skill_count}\n`;
      if (p.creator_name) md += `- **Creator:** ${p.creator_name}\n`;
      if (p.description) md += `- **Description:** ${p.description}\n`;
      md += `\n`;
    }
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentSandbox.name.replace(/\s+/g, "_")}_SKILL.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ── Render ── */
  const isProjectSandbox = activeSandbox !== "all" && !!currentSandbox;
  const projectIsEmpty = isProjectSandbox && (currentSandbox?.crabIds.length ?? 0) === 0;

  return (
    <div className="min-h-screen bg-[#0d0f14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-sm text-white" style={PIXEL_FONT}>
            <span className="text-amber-400">&#9654;</span> SANDBOX
          </h1>
          <p className="text-xs text-gray-500">
            Your expert crabs. Click one to explore their skills.
          </p>
        </div>

        {/* Sandbox tabs */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <button
            onClick={() => { setActiveSandbox("all"); setSettingsOpen(false); }}
            className={`text-[8px] px-3 py-1.5 border transition-all ${
              activeSandbox === "all"
                ? "border-amber-400 text-amber-400 bg-amber-400/10"
                : "border-[#2a2d35] text-gray-500 hover:border-amber-400/50"
            }`}
            style={PIXEL_FONT}
          >
            ALL CRABS
          </button>

          {sandboxes.map((sb) => (
            <div key={sb.id} className="flex items-center">
              <button
                onClick={() => { setActiveSandbox(sb.id); setSettingsOpen(false); }}
                className={`text-[8px] px-3 py-1.5 border-l border-t border-b transition-all flex items-center gap-2 ${
                  activeSandbox === sb.id
                    ? "border-amber-400 text-amber-400 bg-amber-400/10"
                    : "border-[#2a2d35] text-gray-500 hover:border-amber-400/50"
                }`}
                style={PIXEL_FONT}
              >
                {sb.name} ({sb.crabIds.length})
                {activeSandbox === sb.id && (
                  <span
                    onClick={(e) => { e.stopPropagation(); setSettingsOpen((v) => !v); }}
                    className="ml-1 text-gray-500 hover:text-amber-400 cursor-pointer"
                    title="Project settings"
                  >
                    &#9881;
                  </span>
                )}
              </button>
              <button
                onClick={() => deleteSandbox(sb.id)}
                className="text-[8px] px-2 py-1.5 border border-[#2a2d35] text-gray-600 hover:text-red-400 hover:border-red-400/50 transition-all"
              >
                &times;
              </button>
            </div>
          ))}

          {/* New sandbox input */}
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={newSandboxName}
              onChange={(e) => setNewSandboxName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createSandbox()}
              placeholder="New project..."
              className="text-[8px] bg-[#161920] border border-[#2a2d35] text-gray-400 px-2 py-1.5 w-28 focus:border-amber-400/50 outline-none"
              style={PIXEL_FONT}
            />
            <button
              onClick={createSandbox}
              className="text-[8px] px-2 py-1.5 border border-amber-400/50 text-amber-400 hover:bg-amber-400/10 transition-all"
              style={PIXEL_FONT}
            >
              +
            </button>
          </div>
        </div>

        {/* ── Arena ── */}
        <div className="relative">
          <div
            ref={containerRef}
            className="relative border-2 border-[#2a2d35] overflow-hidden"
            style={{
              height: "560px",
              boxShadow: "3px 3px 0px #000",
              background: "#0a0c10",
            }}
          >
            {/* Dot grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #1a1d25 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Simple ground line */}
            <div
              className="absolute left-0 right-0"
              style={{ bottom: `${GROUND_HEIGHT}px`, height: "1px", background: "#2a2d3560" }}
            />

            {/* ── Crabs ── */}
            {visibleCrabs.map((crab) => {
              const isHovered = hoveredCrab === crab.id;
              const facingLeft = crab.facing === "left";
              return (
                <div
                  key={crab.id}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${crab.x}px`,
                    top: `${crab.y}px`,
                    transform: `scaleX(${facingLeft ? -1 : 1}) ${isHovered ? "scale(1.1)" : ""}`,
                    transition: isHovered ? "transform 0.15s ease" : "none",
                    zIndex: isHovered ? 50 : Math.floor(crab.y),
                  }}
                  onMouseEnter={() => setHoveredCrab(crab.id)}
                  onMouseLeave={() => setHoveredCrab(null)}
                >
                  {/* Shadow ellipse */}
                  <div
                    className="absolute"
                    style={{
                      bottom: "-4px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: `${crab.size * 0.7}px`,
                      height: `${crab.size * 0.18}px`,
                      background: "radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)",
                      borderRadius: "50%",
                    }}
                  />

                  <Link href={`/packs/${crab.pack.pack_id}`}>
                    <Image
                      src={crab.sprite}
                      alt={crab.pack.name}
                      width={crab.size}
                      height={crab.size}
                      style={{ imageRendering: "pixelated" }}
                      unoptimized
                      className="hover:brightness-125 transition-all"
                    />
                  </Link>

                  {/* Skill count badge */}
                  <div
                    className="absolute flex items-center justify-center"
                    style={{
                      bottom: "-2px",
                      right: "-4px",
                      transform: `scaleX(${facingLeft ? -1 : 1})`,
                      minWidth: "18px",
                      height: "16px",
                      background: "#b45309",
                      border: "1px solid #d97706",
                      borderRadius: "3px",
                      padding: "0 3px",
                    }}
                  >
                    <span
                      className="text-white leading-none"
                      style={{ ...PIXEL_FONT, fontSize: "6px" }}
                    >
                      {crab.pack.skill_count}
                    </span>
                  </div>

                </div>
              );
            })}

            {/* ── Tooltips (rendered at container level, not inside scaled crab divs) ── */}
            {hoveredCrab && (() => {
              const crab = visibleCrabs.find(c => c.id === hoveredCrab);
              if (!crab) return null;
              return (
                <div
                  className="absolute bg-[#161920] border border-amber-400/50 px-3 py-2 whitespace-nowrap pointer-events-none"
                  style={{
                    left: `${crab.x + crab.size / 2}px`,
                    top: `${crab.y - 45}px`,
                    transform: "translateX(-50%)",
                    boxShadow: "2px 2px 0px #000",
                    zIndex: 100,
                  }}
                >
                  <p className="text-[7px] text-amber-400" style={PIXEL_FONT}>
                    {crab.pack.name}
                  </p>
                  <p className="text-[6px] text-gray-500 mt-1" style={PIXEL_FONT}>
                    {crab.pack.skill_count} skills &middot; {domainLabel(crab.pack.domain)}
                  </p>
                </div>
              );
            })()}

            {/* ── Empty state for project sandboxes ── */}
            {projectIsEmpty && (
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ bottom: `${GROUND_HEIGHT}px` }}>
                <Image
                  src="/sprites/hermit_walk.gif"
                  alt="walking crab"
                  width={64}
                  height={64}
                  style={{ imageRendering: "pixelated" }}
                  unoptimized
                  className="mb-4 opacity-60"
                />
                <p className="text-[9px] text-gray-500 mb-3" style={PIXEL_FONT}>
                  SEARCH FOR EXPERTS BELOW
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-md px-4">
                  {POPULAR_DOMAINS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSearchQuery(d)}
                      className="text-[7px] px-3 py-1.5 border border-[#2a2d35] text-gray-500 hover:border-amber-400/50 hover:text-amber-400 transition-all rounded-sm"
                      style={PIXEL_FONT}
                    >
                      {DOMAIN_META[d]?.emoji || ""} {domainLabel(d)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Search bar at bottom of arena ── */}
            <div
              className="absolute left-0 right-0 bottom-0 px-4 pb-3 pt-2"
              style={{ height: `${GROUND_HEIGHT}px`, zIndex: 60 }}
            >
              {/* Search results chips */}
              {searchResults.length > 0 && (
                <div
                  className="flex gap-2 mb-2 overflow-x-auto pb-1 scrollbar-thin"
                  style={{ maxHeight: "36px" }}
                >
                  {searchResults.slice(0, 20).map((p) => (
                    <button
                      key={p.pack_id}
                      onClick={() => {
                        if (isProjectSandbox) {
                          addCrabToSandbox(p.pack_id);
                        }
                      }}
                      className={`flex-shrink-0 flex items-center gap-1.5 text-[7px] px-2 py-1 border rounded-sm transition-all ${
                        isProjectSandbox
                          ? "border-amber-400/30 text-amber-400 hover:bg-amber-400/10 cursor-pointer"
                          : "border-[#2a2d35] text-gray-500 cursor-default"
                      }`}
                      style={PIXEL_FONT}
                      title={isProjectSandbox ? "Click to add to project" : "Create a project to add experts"}
                    >
                      <Image
                        src={domainSprite(p.domain)}
                        alt=""
                        width={14}
                        height={14}
                        style={{ imageRendering: "pixelated" }}
                        unoptimized
                      />
                      {p.name}
                      <span className="text-gray-600">{p.skill_count}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isProjectSandbox ? "Search experts to add..." : "Search experts..."}
                  className="w-full text-[8px] bg-[#0a0c10] border border-[#2a2d35] text-gray-300 px-3 py-2 pl-7 focus:border-amber-400/50 outline-none rounded-sm"
                  style={PIXEL_FONT}
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600 text-xs">
                  &#128269;
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 text-xs"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Settings slide-out panel ── */}
          {settingsOpen && currentSandbox && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/40 z-[70]"
                onClick={() => setSettingsOpen(false)}
              />
              <div
                className="fixed top-0 right-0 h-full bg-[#111418] border-l border-[#2a2d35] z-[80] overflow-y-auto"
                style={{
                  width: "400px",
                  boxShadow: "-4px 0 16px rgba(0,0,0,0.5)",
                  animation: "slideInRight 0.2s ease-out",
                }}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[10px] text-amber-400" style={PIXEL_FONT}>
                      PROJECT SETTINGS
                    </h2>
                    <button
                      onClick={() => setSettingsOpen(false)}
                      className="text-gray-500 hover:text-gray-300 text-lg"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Project name */}
                  <div className="mb-6">
                    <label className="text-[7px] text-gray-500 block mb-2" style={PIXEL_FONT}>
                      PROJECT NAME
                    </label>
                    <input
                      type="text"
                      defaultValue={currentSandbox.name}
                      onBlur={(e) => renameSandbox(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                      }}
                      className="w-full text-[9px] bg-[#0a0c10] border border-[#2a2d35] text-gray-300 px-3 py-2 focus:border-amber-400/50 outline-none"
                      style={PIXEL_FONT}
                    />
                  </div>

                  {/* API Key */}
                  <div className="mb-6">
                    <label className="text-[7px] text-gray-500 block mb-2" style={PIXEL_FONT}>
                      API KEY
                    </label>
                    <div className="bg-[#0a0c10] border border-[#2a2d35] px-3 py-3 text-[8px] text-gray-600" style={PIXEL_FONT}>
                      Coming soon &mdash; connect your own API key to query experts programmatically.
                    </div>
                  </div>

                  {/* Crabs list */}
                  <div className="mb-6">
                    <label className="text-[7px] text-gray-500 block mb-2" style={PIXEL_FONT}>
                      EXPERTS ({currentSandbox.crabIds.length})
                    </label>
                    {currentSandbox.crabIds.length === 0 ? (
                      <p className="text-[7px] text-gray-700" style={PIXEL_FONT}>
                        No experts added yet.
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {currentSandbox.crabIds.map((cid) => {
                          const p = packs.find((pk) => pk.pack_id === cid);
                          if (!p) return null;
                          return (
                            <div
                              key={cid}
                              className="flex items-center justify-between bg-[#0a0c10] border border-[#2a2d35] px-3 py-2 group"
                            >
                              <div className="flex items-center gap-2">
                                <Image
                                  src={domainSprite(p.domain)}
                                  alt=""
                                  width={18}
                                  height={18}
                                  style={{ imageRendering: "pixelated" }}
                                  unoptimized
                                />
                                <div>
                                  <p className="text-[7px] text-gray-300" style={PIXEL_FONT}>
                                    {p.name}
                                  </p>
                                  <p className="text-[6px] text-gray-600" style={PIXEL_FONT}>
                                    {p.skill_count} skills &middot; {domainLabel(p.domain)}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => removeCrabFromSandbox(cid)}
                                className="text-[7px] text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={PIXEL_FONT}
                              >
                                REMOVE
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Export button */}
                  <button
                    onClick={exportSkillMd}
                    disabled={currentSandbox.crabIds.length === 0}
                    className="w-full text-[8px] px-4 py-2.5 border border-amber-400/50 text-amber-400 hover:bg-amber-400/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    style={PIXEL_FONT}
                  >
                    EXPORT AS SKILL.MD
                  </button>

                  {/* Delete project */}
                  <button
                    onClick={() => {
                      deleteSandbox(currentSandbox.id);
                      setSettingsOpen(false);
                    }}
                    className="w-full mt-3 text-[8px] px-4 py-2.5 border border-red-400/30 text-red-400/60 hover:bg-red-400/10 hover:text-red-400 transition-all"
                    style={PIXEL_FONT}
                  >
                    DELETE PROJECT
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-[7px] text-gray-600">
          <span>Click a crab to view their skill pack</span>
          <span>&middot;</span>
          <span>Hover to inspect</span>
          <span>&middot;</span>
          <span>Create project sandboxes to curate your expert team</span>
        </div>
      </div>

      {/* Slide-in animation */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #2a2d35;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
