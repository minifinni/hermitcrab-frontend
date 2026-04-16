import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! as string)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  // If webhook secret is configured, verify signature
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event: Stripe.Event

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured — rejecting webhook')
    return NextResponse.json({ error: 'Webhook verification not configured' }, { status: 500 })
  }

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log(`[Stripe Webhook] Event type: ${event.type}`)

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      const skillId = session.metadata?.skill_id

      if (userId && skillId) {
        const supabase = createServiceClient()
        const { error } = await supabase.from('entitlements').upsert(
          {
            user_id: userId,
            skill_id: skillId,
            type: 'paid',
            stripe_session_id: session.id,
          },
          { onConflict: 'user_id,skill_id' }
        )

        if (error) {
          console.error('[Webhook] Failed to create entitlement:', error)
        } else {
          console.log(`[Webhook] Entitlement created for user ${userId}, skill ${skillId}`)
        }
      }
      break
    }

    case 'payment_intent.succeeded':
      console.log(`[Stripe Webhook] Payment succeeded: ${(event.data.object as Stripe.PaymentIntent).id}`)
      break

    case 'payment_intent.payment_failed':
      console.log(`[Stripe Webhook] Payment failed: ${(event.data.object as Stripe.PaymentIntent).id}`)
      break

    default:
      console.log(`[Stripe Webhook] Unhandled event: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

// Stripe needs raw body for signature verification
export const dynamic = 'force-dynamic'
