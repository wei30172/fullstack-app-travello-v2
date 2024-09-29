"use server"

import { revalidatePath } from "next/cache"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { UserSubscription } from "@/lib/models/user.model"
import { stripe } from "@/lib/stripe"

export const getStripeRedirect = async () => {
  const user = await currentUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const userId = user._id

  const settingsUrl = `${process.env.NEXT_PUBLIC_APP_URL}/settings`

  let url = ""

  try {
    await connectDB()
    
    const userSubscription = await UserSubscription.findOne({ userId })
    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl
      })

      url = stripeSession.url
    } else {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user.email!,
        line_items: [{
          price_data: {
            currency: "USD",
            unit_amount: 2000, // $20
            product_data: {
              name: "Travello Pro",
              description: "Unlimited AI planning and cover uploads"
            },
            recurring: {
              interval: "month"
            },
          },
          quantity: 1,
        }],
        metadata: {
          userId
        }
      })
  
      url = stripeSession.url || ""
    }
  } catch {
    return { error: "Something went wrong!" }
  }

  revalidatePath("/settings")
  return { data: url }
}