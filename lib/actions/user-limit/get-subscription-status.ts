"use server"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { User } from "@/lib/models/auth.model"
import { UserSubscription } from "@/lib/models/user.model"
import { UserRole } from "@/lib/models/types"

const DAY_IN_MS = 86_400_000 // one day

export const getSubscriptionStatus = async () => {
  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return false
  }

  await connectDB()
  
  const userSubscription = await UserSubscription.findOne(
    { userId: user._id },
    {
      stripeSubscriptionId: 1, // Selects fields to be included in the result
      stripeCurrentPeriodEnd: 1,
      stripeCustomerId: 1,
      stripePriceId: 1,
      _id: 0 // Excludes the default _id field from the result
    }
  )

  if (!userSubscription) {
    return false
  }

  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

  if (!isValid) {
    await User.findByIdAndUpdate(user._id, {
      role: UserRole.USER
    })
  }
  
  return !!isValid
}