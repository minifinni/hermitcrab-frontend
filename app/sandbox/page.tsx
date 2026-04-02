"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPacks, domainSprite, domainLabel, ApiPack } from "@/lib/api";

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

const SPEED = 0.3;
const BOUNDARY_PADDING = 80;

function randomVelocity() {
  const angle = Math.random() * Math.PI * 2;
  return { vx: Math.cos(angle) * SPEED, vy: Math.sin(angle) * SPEED };
}

export default function SandboxPage() {
  const [packs, setPacks] = useState<ApiPack[]>([]);
  const [crabs, setCrabs] = useState<Crab[]>([]);
  const [sandboxes, setSandboxes] = useState<Sandbox[]>([]);
  const [activeSandbox, setActiveSandbox] = useState<string>("all");
  const [newSandboxName, setNewSandboxName] = useState("");
  const [showAddCrab, setShowAddCrab] = useState(false);
  const [hoveredCrab, setHoveredCrab] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);

  // Load packs and saved sandboxes
  useEffect(() => {
    // Fetch via server-side proxy to avoid exposing API key in browser
    fetch("/api/packs").then(r => r.json()).then((p: ApiPack[]) => {
      setPacks(p);
      const initialCrabs = p.map((pack, i) => {
        const { vx, vy } = randomVelocity();
        return {
          id: pack.pack_id,
          pack,
          x: 100 + Math.random() * 600,
          y: 100 + Math.random() * 300,
          vx,
          vy,
          facing: vx > 0 ? "right" as const : "left" as const,
          size: Math.min(80, Math.max(48, 32 + (pack.skill_count || 0) * 0.3)),
          sprite: domainSprite(pack.domain),
        };
      });
      setCrabs(initialCrabs);
    }).catch((e) => { console.error("Failed to load packs:", e); });

    // Load sandboxes from localStorage
    const saved = localStorage.getItem("hermitcrab-sandboxes");
    if (saved) setSandboxes(JSON.parse(saved));
  }, []);

  // Save sandboxes to localStorage
  useEffect(() => {
    if (sandboxes.length > 0) {
      localStorage.setItem("hermitcrab-sandboxes", JSON.stringify(sandboxes));
    }
  }, [sandboxes]);

  // Animation loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastTime = performance.now();

    function animate(now: number) {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      setCrabs((prev) =>
        prev.map((crab) => {
          const rect = container!.getBoundingClientRect();
          const maxX = rect.width - BOUNDARY_PADDING;
          const maxY = rect.height - BOUNDARY_PADDING;

          let { x, y, vx, vy } = crab;
          x += vx * dt * 0.06;
          y += vy * dt * 0.06;

          // Bounce off walls
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
            const { vx: nvx, vy: nvy } = randomVelocity();
            vx = nvx;
            vy = nvy;
          }

          return {
            ...crab,
            x,
            y,
            vx,
            vy,
            facing: vx > 0 ? "right" : "left",
          };
        })
      );

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [crabs.length]);

  // Filter crabs by active sandbox
  const visibleCrabs =
    activeSandbox === "all"
      ? crabs
      : crabs.filter((c) => {
          const sb = sandboxes.find((s) => s.id === activeSandbox);
          return sb?.crabIds.includes(c.id);
        });

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
    setSandboxes((prev) =>
      prev.map((sb) =>
        sb.id === activeSandbox && !sb.crabIds.includes(packId)
          ? { ...sb, crabIds: [...sb.crabIds, packId] }
          : sb
      )
    );
    setShowAddCrab(false);
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

  const currentSandbox = sandboxes.find((s) => s.id === activeSandbox);

  return (
    <div className="min-h-screen bg-[#0d0f14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-sm text-white"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            <span className="text-amber-400">▶</span> SANDBOX
          </h1>
          <p className="text-xs text-gray-500">
            Your expert crabs. Click one to explore their skills.
          </p>
        </div>

        {/* Sandbox tabs */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setActiveSandbox("all")}
            className={`text-[8px] px-3 py-1.5 border transition-all ${
              activeSandbox === "all"
                ? "border-amber-400 text-amber-400 bg-amber-400/10"
                : "border-[#2a2d35] text-gray-500 hover:border-amber-400/50"
            }`}
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            ALL CRABS
          </button>
          {sandboxes.map((sb) => (
            <div key={sb.id} className="flex items-center">
              <button
                onClick={() => setActiveSandbox(sb.id)}
                className={`text-[8px] px-3 py-1.5 border-l border-t border-b transition-all ${
                  activeSandbox === sb.id
                    ? "border-amber-400 text-amber-400 bg-amber-400/10"
                    : "border-[#2a2d35] text-gray-500 hover:border-amber-400/50"
                }`}
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {sb.name} ({sb.crabIds.length})
              </button>
              <button
                onClick={() => deleteSandbox(sb.id)}
                className="text-[8px] px-2 py-1.5 border border-[#2a2d35] text-gray-600 hover:text-red-400 hover:border-red-400/50 transition-all"
              >
                ×
              </button>
            </div>
          ))}
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={newSandboxName}
              onChange={(e) => setNewSandboxName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createSandbox()}
              placeholder="New project..."
              className="text-[8px] bg-[#161920] border border-[#2a2d35] text-gray-400 px-2 py-1.5 w-28 focus:border-amber-400/50 outline-none"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            />
            <button
              onClick={createSandbox}
              className="text-[8px] px-2 py-1.5 border border-amber-400/50 text-amber-400 hover:bg-amber-400/10 transition-all"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              +
            </button>
          </div>
        </div>

        {/* Add crab button for custom sandboxes */}
        {currentSandbox && (
          <div className="mb-4 flex items-center gap-2">
            <button
              onClick={() => setShowAddCrab(!showAddCrab)}
              className="text-[8px] px-3 py-1.5 border border-amber-400/50 text-amber-400 hover:bg-amber-400/10 transition-all"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              {showAddCrab ? "CLOSE" : "+ ADD EXPERT"}
            </button>
            {showAddCrab && (
              <div className="flex flex-wrap gap-2">
                {packs
                  .filter((p) => !currentSandbox.crabIds.includes(p.pack_id))
                  .map((p) => (
                    <button
                      key={p.pack_id}
                      onClick={() => addCrabToSandbox(p.pack_id)}
                      className="text-[7px] px-2 py-1 border border-[#2a2d35] text-gray-400 hover:border-amber-400/50 hover:text-amber-400 transition-all flex items-center gap-1"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}
                    >
                      <Image
                        src={domainSprite(p.domain)}
                        alt=""
                        width={16}
                        height={16}
                        style={{ imageRendering: "pixelated" }}
                        unoptimized
                      />
                      {p.name}
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* The sandbox arena */}
        <div
          ref={containerRef}
          className="relative bg-[#0a0c10] border-2 border-[#2a2d35] overflow-hidden"
          style={{
            height: "500px",
            boxShadow: "3px 3px 0px #000",
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #1a1d25 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        >
          {/* Ground line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#2a2d35]" />

          {visibleCrabs.map((crab) => (
            <div
              key={crab.id}
              className="absolute cursor-pointer transition-transform duration-75 group"
              style={{
                left: `${crab.x}px`,
                top: `${crab.y}px`,
                transform: `scaleX(${crab.facing === "left" ? -1 : 1})`,
              }}
              onMouseEnter={() => setHoveredCrab(crab.id)}
              onMouseLeave={() => setHoveredCrab(null)}
            >
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

              {/* Tooltip */}
              {hoveredCrab === crab.id && (
                <div
                  className="absolute -top-16 left-1/2 bg-[#161920] border border-amber-400/50 px-3 py-2 whitespace-nowrap z-50 pointer-events-none"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    transform: `scaleX(${crab.facing === "left" ? -1 : 1}) translateX(-50%)`,
                    boxShadow: "2px 2px 0px #000",
                  }}
                >
                  <div style={{ transform: `scaleX(${crab.facing === "left" ? -1 : 1})` }}>
                    <p className="text-[7px] text-amber-400">{crab.pack.name}</p>
                    <p className="text-[6px] text-gray-500 mt-1">
                      {crab.pack.skill_count} skills · {domainLabel(crab.pack.domain)}
                    </p>
                  </div>
                  {currentSandbox && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeCrabFromSandbox(crab.id);
                      }}
                      className="text-[6px] text-red-400 mt-1 pointer-events-auto"
                    >
                      remove
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {visibleCrabs.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p
                  className="text-[9px] text-gray-600 mb-2"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  NO CRABS HERE YET
                </p>
                <p className="text-[8px] text-gray-700">
                  Click &quot;+ ADD EXPERT&quot; to populate this sandbox
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-[7px] text-gray-600">
          <span>Crab size = number of skills</span>
          <span>·</span>
          <span>Click a crab to view their skill pack</span>
          <span>·</span>
          <span>Create project sandboxes to curate your expert team</span>
        </div>
      </div>
    </div>
  );
}
