'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface DownloadButtonProps {
  skillId: string
}

export default function DownloadButton({ skillId }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const router = useRouter()

  const handleDownload = async () => {
    setLoading(true)

    // Check if user is logged in
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_id: skillId }),
      })

      if (res.ok) {
        setDownloaded(true)
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to download skill')
      }
    } catch {
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (downloaded) {
    return (
      <div className="text-center">
        <div
          className="text-[10px] text-amber-400 border-2 border-amber-400 px-10 py-4 inline-block"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          ✓ SAVED TO DASHBOARD
        </div>
        <p className="text-[8px] text-gray-600 mt-3">
          <a href="/dashboard" className="hover:text-amber-400 transition-colors">
            View in Dashboard →
          </a>
        </p>
      </div>
    )
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="text-[10px] bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-black font-bold px-10 py-4 transition-all"
      style={{ fontFamily: "'Press Start 2P', monospace", boxShadow: "3px 3px 0px #000" }}
    >
      {loading ? 'SAVING...' : 'DOWNLOAD FREE →'}
    </button>
  )
}
