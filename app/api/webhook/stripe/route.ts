import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"

import { stripe } from "@/lib/stripe"
import connectDB from "@/lib/db"
import { User } from "@/lib/models/auth.model"
import { UserSubscription } from "@/lib/models/user.model"
import { UserRole } from "@/lib/models/types"

export async function POST(
  req: Request
) {
  const body = await req.text()
  const signature = req.headers.get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (error) {
    return new NextResponse("Webhook error", { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    if (!session?.metadata?.userId) {
      return new NextResponse("User ID is required", { status: 400 })
    }

    await connectDB()

    const userSubscription = new UserSubscription({
      userId: session?.metadata?.userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(
        subscription.current_period_end * 1000
      )
    })

    await userSubscription.save()
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    await UserSubscription.findOneAndUpdate(
      { stripeSubscriptionId: subscription.id },
      {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        )
      },
      { new: true }
    )
  }
  
  await User.findByIdAndUpdate(session?.metadata?.userId, {
    role: UserRole.MEMBER
  })

  return new NextResponse(null, { status: 200 })
}