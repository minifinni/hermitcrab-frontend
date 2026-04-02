import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#2a2d35] bg-[#0d0f14] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image
              src="/sprites/hermit_walk.gif"
              alt="Hermitcrab"
              width={80}
              height={80}
              style={{ imageRendering: "pixelated" }}
              unoptimized
            />
            <div>
              <span
                className="text-amber-400 text-xs"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                HERMITCRAB
              </span>
              <p className="text-xs text-gray-600 mt-2">Skills your AI can wear.</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {[
              ["Browse", "/skills"],
              ["Sell", "/sell"],
              ["Creators", "/creators"],
              ["Docs", "#"],
              ["Twitter", "#"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="text-[9px] text-gray-500 hover:text-gray-300 transition-colors"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#2a2d35] text-center">
          <p className="text-[9px] text-gray-700" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            © 2026 HERMITCRAB · Built with ⚙️ by Clank
          </p>
        </div>
      </div>
    </footer>
  );
}
