import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

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

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-[8px] text-gray-500 hover:text-amber-400 transition-colors"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            ← DASHBOARD
          </Link>
        </div>

        {/* SETTINGS heading */}
        <h1
          className="text-sm text-white mb-8"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          <span className="text-amber-400">▶</span> SETTINGS
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-48 shrink-0">
            <nav className="space-y-2">
              <Link
                href="/settings/api-keys"
                className="block text-[9px] px-4 py-3 text-amber-400 border-2 border-amber-400 bg-amber-400/10 transition-all"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                API KEYS
              </Link>
              <Link
                href="/settings/profile"
                className="block text-[9px] px-4 py-3 text-gray-400 border-2 border-[#2a2d35] hover:border-amber-400 hover:text-amber-400 transition-all"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                PROFILE
              </Link>
              <div
                className="block text-[9px] px-4 py-3 text-gray-600 border-2 border-[#2a2d35]/50 cursor-not-allowed"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                BILLING
                <span className="block text-[7px] text-gray-700 mt-1">COMING SOON</span>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
