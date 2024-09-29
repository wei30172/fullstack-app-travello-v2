import { getSubscriptionStatus } from "@/lib/actions/user-limit/get-subscription-status"

import { Separator } from "@/components/ui/separator"
import { SettingsForm } from "./_components/settings-form"
import { Info } from "../boards/_components/info"

const SettingsPage = async () => {
  const isPro = await getSubscriptionStatus()

  return (
    <section className="w-full">
      <Info isPro={isPro} />
      <Separator className="my-2" />
      <SettingsForm />
    </section>
  )
}

export default SettingsPage
