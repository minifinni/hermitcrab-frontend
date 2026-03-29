"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface ApiKey {
  key_prefix: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.hermitcrab.app";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setUserEmail(user.email || null);
      fetchKeys(user.email!);
    });
  }, []);

  async function fetchKeys(email: string) {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/v1/keys`, {
        headers: { "X-User-Email": email },
      });
      if (res.ok) setKeys(await res.json());
    } catch {}
    setLoading(false);
  }

  async function generateKey() {
    if (!userEmail || !newKeyName.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch(`${API_URL}/v1/keys`, {
        method: "POST",
        headers: { "X-User-Email": userEmail, "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setNewKeyValue(data.api_key);
        setNewKeyName("");
        fetchKeys(userEmail);
      }
    } catch {}
    setGenerating(false);
  }

  async function revokeKey(prefix: string) {
    if (!userEmail) return;
    if (!confirm("Revoke this key? Any integrations using it will stop working.")) return;
    try {
      await fetch(`${API_URL}/v1/keys/${prefix}`, {
        method: "DELETE",
        headers: { "X-User-Email": userEmail },
      });
      fetchKeys(userEmail);
    } catch {}
  }

  function copyKey() {
    if (!newKeyValue) return;
    navigator.clipboard.writeText(newKeyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <h2
        className="text-[9px] text-amber-400 mb-4"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        API KEYS
      </h2>
      <p className="text-xs text-gray-400 mb-8">
        Use these keys to query hermitcrab from your agent or app.
      </p>

      {/* New key revealed */}
      {newKeyValue && (
        <div
          className="bg-[#0d0f14] border-2 border-amber-400 p-6 mb-6"
          style={{ boxShadow: "4px 4px 0px #f59e0b40" }}
        >
          <p
            className="text-[9px] text-amber-400 mb-3"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            COPY YOUR KEY NOW — IT WON'T BE SHOWN AGAIN
          </p>
          <div className="flex items-center gap-3 bg-[#161920] border border-[#2a2d35] p-3 mb-3">
            <code className="text-xs text-green-400 flex-1 break-all font-mono">
              {newKeyValue}
            </code>
            <button
              onClick={copyKey}
              className="text-[8px] px-3 py-2 border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition-all shrink-0"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                boxShadow: "2px 2px 0px #000",
              }}
            >
              {copied ? "COPIED!" : "COPY"}
            </button>
          </div>
          <button
            onClick={() => setNewKeyValue(null)}
            className="text-[8px] text-gray-500 hover:text-gray-300 transition-colors"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            I've saved it →
          </button>
        </div>
      )}

      {/* Generate new key */}
      <div
        className="bg-[#161920] border-2 border-[#2a2d35] p-6 mb-6"
        style={{ boxShadow: "2px 2px 0px #000" }}
      >
        <h3
          className="text-[9px] text-amber-400 mb-4"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          GENERATE NEW KEY
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name (e.g. My Agent)"
            className="flex-1 bg-[#0d0f14] border-2 border-[#2a2d35] text-white text-xs px-4 py-3 focus:border-amber-400 outline-none transition-colors"
            onKeyDown={(e) => e.key === "Enter" && generateKey()}
          />
          <button
            onClick={generateKey}
            disabled={generating || !newKeyName.trim()}
            className="text-[9px] bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold px-6 py-3 transition-all"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              boxShadow: "2px 2px 0px #000",
            }}
          >
            {generating ? "..." : "GENERATE"}
          </button>
        </div>
      </div>

      {/* Existing keys */}
      <div
        className="bg-[#161920] border-2 border-[#2a2d35] p-6 mb-6"
        style={{ boxShadow: "2px 2px 0px #000" }}
      >
        <h3
          className="text-[9px] text-amber-400 mb-4"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          ACTIVE KEYS
        </h3>

        {loading ? (
          <p
            className="text-[9px] text-gray-500 animate-pulse"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            LOADING...
          </p>
        ) : keys.length === 0 ? (
          <p className="text-xs text-gray-500">No keys yet. Generate one above.</p>
        ) : (
          <div className="space-y-3">
            {keys.map((key) => (
              <div
                key={key.key_prefix}
                className="flex items-center justify-between gap-4 bg-[#0d0f14] border border-[#2a2d35] p-4"
              >
                <div>
                  <p
                    className="text-[9px] text-white"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    {key.name}
                  </p>
                  <p className="text-[8px] text-gray-500 mt-1 font-mono">
                    {key.key_prefix}...
                  </p>
                  <p className="text-[7px] text-gray-600 mt-1">
                    Created {new Date(key.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => revokeKey(key.key_prefix)}
                  className="text-[8px] text-red-500 border border-red-500/30 hover:bg-red-500/10 px-3 py-2 transition-all shrink-0"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  REVOKE
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Usage example */}
      <div
        className="bg-[#161920] border-2 border-[#2a2d35] p-6"
        style={{ boxShadow: "2px 2px 0px #000" }}
      >
        <h3
          className="text-[9px] text-amber-400 mb-4"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          USAGE
        </h3>
        <pre className="text-[10px] text-green-400 bg-[#0d0f14] p-4 overflow-x-auto leading-relaxed font-mono">
          {`curl -X POST https://api.hermitcrab.app/v1/search \\
  -H "X-API-Key: hc_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "how to validate a startup idea", 
       "domain": "business", "limit": 5}'`}
        </pre>
      </div>
    </div>
  );
}
