import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { skill_id?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { skill_id } = body
  if (!skill_id) {
    return NextResponse.json({ error: 'skill_id is required' }, { status: 400 })
  }

  // Use service role to insert entitlement (bypasses RLS for insert)
  const serviceSupabase = createServiceClient()

  const { error: insertError } = await serviceSupabase
    .from('entitlements')
    .upsert(
      {
        user_id: user.id,
        skill_id,
        type: 'free',
      },
      { onConflict: 'user_id,skill_id', ignoreDuplicates: true }
    )

  if (insertError) {
    console.error('Entitlement insert error:', insertError)
    return NextResponse.json({ error: 'Failed to create entitlement' }, { status: 500 })
  }

  return NextResponse.json({ success: true, skill_id })
}
