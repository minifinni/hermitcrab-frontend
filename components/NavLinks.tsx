"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/packs", label: "Packs" },
  { href: "/skills", label: "Creators" },
  { href: "/sell", label: "Sell Your Skill" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center gap-8">
      {LINKS.map(({ href, label }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`text-xs transition-colors ${
              isActive
                ? "text-amber-400"
                : "text-gray-400 hover:text-amber-400"
            }`}
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px" }}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
