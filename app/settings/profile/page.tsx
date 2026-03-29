"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setEmail(user.email || null);
      setAvatarUrl(
        user.user_metadata?.avatar_url || null
      );
      fetchProfile(user.id);
    });
  }, []);

  async function fetchProfile(userId: string) {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .eq("id", userId)
      .single();

    if (data) {
      setProfile(data);
      setDisplayName(data.display_name || "");
      if (data.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    }
    setLoading(false);
  }

  async function saveProfile() {
    if (!profile) return;
    setSaving(true);
    setSaved(false);

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName.trim() || null })
      .eq("id", profile.id);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }

    setSaving(false);
  }

  const effectiveDisplayName =
    displayName || email?.split("@")[0] || "User";

  return (
    <div>
      <h2
        className="text-[9px] text-amber-400 mb-4"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        PROFILE
      </h2>
      <p className="text-xs text-gray-400 mb-8">
        Manage your account settings and public profile.
      </p>

      {loading ? (
        <p
          className="text-[9px] text-gray-500 animate-pulse"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          LOADING...
        </p>
      ) : (
        <div
          className="bg-[#161920] border-2 border-[#2a2d35] p-6"
          style={{ boxShadow: "2px 2px 0px #000" }}
        >
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-8">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={effectiveDisplayName}
                className="w-20 h-20 border-2 border-amber-400"
              />
            ) : (
              <div className="w-20 h-20 bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center">
                <span
                  className="text-amber-400 text-xl"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  {effectiveDisplayName[0].toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p
                className="text-[9px] text-white"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {effectiveDisplayName}
              </p>
              <p className="text-[8px] text-gray-500 mt-1">{email}</p>
            </div>
          </div>

          {/* Display Name */}
          <div className="mb-6">
            <label
              className="block text-[8px] text-gray-400 mb-2"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              DISPLAY NAME
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter display name"
              className="w-full bg-[#0d0f14] border-2 border-[#2a2d35] text-white text-xs px-4 py-3 focus:border-amber-400 outline-none transition-colors"
              maxLength={50}
            />
          </div>

          {/* Email (read-only) */}
          <div className="mb-6">
            <label
              className="block text-[8px] text-gray-400 mb-2"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              EMAIL
            </label>
            <input
              type="email"
              value={email || ""}
              disabled
              className="w-full bg-[#0d0f14]/50 border-2 border-[#2a2d35]/50 text-gray-500 text-xs px-4 py-3 cursor-not-allowed"
            />
            <p className="text-[7px] text-gray-600 mt-1">
              Email is managed via OAuth provider
            </p>
          </div>

          {/* Save button */}
          <div className="flex items-center gap-4">
            <button
              onClick={saveProfile}
              disabled={saving}
              className="text-[9px] bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold px-6 py-3 transition-all"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                boxShadow: "2px 2px 0px #000",
              }}
            >
              {saving ? "SAVING..." : saved ? "SAVED!" : "SAVE"}
            </button>
            {saved && (
              <span className="text-[8px] text-green-400">✓ Changes saved</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
