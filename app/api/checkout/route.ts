import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! as string)

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { skill_id?: string; price_cents?: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { skill_id } = body
  if (!skill_id) {
    return NextResponse.json({ error: 'skill_id is required' }, { status: 400 })
  }

  // Price is server-side only — never trust client-submitted prices
  // All skills are free during beta. When pricing is added, look up from DB.
  const price_cents = 0

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hermitcrab.app'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Hermitcrab Skill: ${skill_id}`,
            description: `Lifetime access to skill ${skill_id}`,
          },
          unit_amount: price_cents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${siteUrl}/dashboard?checkout=success&skill=${skill_id}`,
    cancel_url: `${siteUrl}/skills/${skill_id}`,
    metadata: {
      user_id: user.id,
      skill_id,
    },
    customer_email: user.email,
  })

  return NextResponse.json({ url: session.url })
}
