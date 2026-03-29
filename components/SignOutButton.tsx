'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-[8px] text-gray-500 hover:text-red-400 border border-[#2a2d35] hover:border-red-400/50 px-3 py-2 transition-all"
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      SIGN OUT
    </button>
  )
}
