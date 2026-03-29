import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SignOutButton from '@/components/SignOutButton'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch entitlements
  const { data: entitlements } = await supabase
    .from('entitlements')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const displayName = profile?.display_name || user.email?.split('@')[0] || 'User'
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url

  return (
    <div className="min-h-screen bg-[#0d0f14]">
      {/* Pixel grid */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#2a2d35 1px, transparent 1px), linear-gradient(90deg, #2a2d35 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User header */}
        <div
          className="bg-[#161920] border-2 border-[#2a2d35] p-6 mb-8 flex items-center gap-4"
          style={{ boxShadow: '3px 3px 0px #000' }}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-16 h-16 border-2 border-amber-400"
            />
          ) : (
            <div className="w-16 h-16 bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center">
              <span
                className="text-amber-400 text-lg"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {displayName[0].toUpperCase()}
              </span>
            </div>
          )}

          <div className="flex-1">
            <h1
              className="text-[11px] text-white mb-1"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              {displayName}
            </h1>
            <p className="text-[8px] text-gray-500">{user.email}</p>
          </div>

          <SignOutButton />
        </div>

        {/* My Skills */}
        <div className="mb-8">
          {/* API Keys shortcut */}
        <Link
          href="/dashboard/api-keys"
          className="block bg-[#161920] border-2 border-amber-400/40 hover:border-amber-400 p-5 mb-6 transition-all group"
          style={{ boxShadow: "2px 2px 0px #000" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] text-amber-400" style={{ fontFamily: "'Press Start 2P', monospace" }}>API KEYS</p>
              <p className="text-xs text-gray-400 mt-2">Generate a key to query hermitcrab from your agent or app</p>
            </div>
            <span className="text-amber-400 text-lg group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>

        <h2
            className="text-[9px] text-white mb-4"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            <span className="text-amber-400">▶</span> MY SKILLS
          </h2>

          {!entitlements || entitlements.length === 0 ? (
            <div
              className="bg-[#161920] border-2 border-[#2a2d35] p-8 text-center"
              style={{ boxShadow: '2px 2px 0px #000' }}
            >
              <p
                className="text-[8px] text-gray-500 mb-4 leading-loose"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                No skills yet. Start downloading!
              </p>
              <Link
                href="/skills"
                className="text-[9px] bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 transition-all inline-block"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  boxShadow: '2px 2px 0px #000',
                }}
              >
                BROWSE SKILLS →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {entitlements.map((ent: any) => (
                <div
                  key={ent.id}
                  className="bg-[#161920] border-2 border-[#2a2d35] p-4"
                  style={{ boxShadow: '2px 2px 0px #000' }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p
                        className="text-[8px] text-white mb-1"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}
                      >
                        {ent.skill_id}
                      </p>
                      <span className="text-[7px] text-amber-400 border border-amber-400/30 bg-amber-400/10 px-2 py-0.5">
                        {ent.type.toUpperCase()}
                      </span>
                    </div>
                    <Link
                      href={`/skills/${ent.skill_id}`}
                      className="text-[7px] text-gray-500 hover:text-amber-400 transition-colors"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}
                    >
                      VIEW →
                    </Link>
                  </div>
                  <p className="text-[7px] text-gray-600 mt-2">
                    {new Date(ent.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Browse CTA */}
        {entitlements && entitlements.length > 0 && (
          <div className="text-center">
            <Link
              href="/skills"
              className="text-[9px] bg-[#161920] hover:bg-[#1e2028] border-2 border-amber-400/60 hover:border-amber-400 text-amber-400 font-bold px-6 py-3 transition-all inline-block"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                boxShadow: '2px 2px 0px #000',
              }}
            >
              BROWSE MORE →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
