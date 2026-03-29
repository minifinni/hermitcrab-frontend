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

  const { skill_id, price_cents } = body
  if (!skill_id || !price_cents) {
    return NextResponse.json({ error: 'skill_id and price_cents are required' }, { status: 400 })
  }

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
