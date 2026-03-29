import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#2a2d35] bg-[#0d0f14]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span
              className="text-amber-400 text-sm tracking-wider group-hover:text-amber-300 transition-colors"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              HERMITCRAB
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/skills"
              className="text-xs text-gray-400 hover:text-amber-400 transition-colors"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px" }}
            >
              Browse
            </Link>
            <Link
              href="/creators"
              className="text-xs text-gray-400 hover:text-amber-400 transition-colors"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px" }}
            >
              Creators
            </Link>
            <Link
              href="/sell"
              className="text-xs text-gray-400 hover:text-amber-400 transition-colors"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px" }}
            >
              Sell Your Skill
            </Link>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <button
              className="text-[9px] text-gray-400 hover:text-white transition-colors px-3 py-1.5 border border-transparent hover:border-[#2a2d35]"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              Login
            </button>
            <button
              className="text-[9px] bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 font-bold transition-colors"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                boxShadow: "2px 2px 0px #000",
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
