'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface NavbarAuthProps {
  user: { email?: string; id: string } | null
  avatarUrl?: string
  displayName?: string
}

export default function NavbarAuth({ user, avatarUrl, displayName }: NavbarAuthProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="text-[8px] text-gray-400 hover:text-amber-400 transition-colors"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          DASHBOARD
        </Link>
        <Link
          href="/settings/api-keys"
          className="text-[8px] text-gray-400 hover:text-amber-400 transition-colors"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          SETTINGS
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 group"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-7 h-7 border border-amber-400/60 group-hover:border-amber-400 transition-colors"
            />
          ) : (
            <div className="w-7 h-7 bg-amber-400/20 border border-amber-400/60 group-hover:border-amber-400 flex items-center justify-center transition-colors">
              <span
                className="text-amber-400"
                style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px' }}
              >
                {(displayName || 'U')[0].toUpperCase()}
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={handleSignOut}
          className="text-[8px] text-gray-600 hover:text-gray-400 transition-colors px-2 py-1"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          OUT
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="text-[9px] bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 font-bold transition-colors"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          boxShadow: '2px 2px 0px #000',
        }}
      >
        LOGIN
      </Link>
    </div>
  )
}
