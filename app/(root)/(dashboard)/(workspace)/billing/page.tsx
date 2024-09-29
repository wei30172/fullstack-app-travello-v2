import { getSubscriptionStatus } from "@/lib/actions/user-limit/get-subscription-status"

import { Separator } from "@/components/ui/separator"
import { SubscriptionButton } from "./_components/subscription-button"
import { Info } from "../boards/_components/info"

const BillingPage = async () => {
  const isPro = await getSubscriptionStatus()

  return (
    <section className="w-full">
      <Info isPro={isPro} />
      <Separator className="my-2" />
      <SubscriptionButton
        isPro={isPro}
      />
    </section>
  )
}

export default BillingPage