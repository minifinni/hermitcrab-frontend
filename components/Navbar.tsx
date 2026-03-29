import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NavbarAuth from "./NavbarAuth";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch profile for avatar
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const displayName = profile?.display_name || user?.email?.split("@")[0] || "User";

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

          {/* Auth section — client component handles interactivity */}
          <NavbarAuth
            user={user ? { email: user.email, id: user.id } : null}
            avatarUrl={avatarUrl}
            displayName={displayName}
          />
        </div>
      </div>
    </nav>
  );
}
