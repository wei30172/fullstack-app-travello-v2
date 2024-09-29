"use client"

import { useTransition } from "react"
import { useProModal } from "@/hooks/use-pro-modal"
import { getStripeRedirect } from "@/lib/actions/user-limit/get-stripe-redirect"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface SubscriptionButtonProps {
  isPro: boolean
}

export const SubscriptionButton = ({ 
  isPro,
 }: SubscriptionButtonProps) => {
  const proModal = useProModal()
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()
  
  const handleUpgrade = () => {
    startTransition(() => {
      getStripeRedirect()
      .then((res) => {
        if (res?.data) {
          window.location.href = res?.data
        } else if (res?.error) {
          toast({ status: "error", description: res.error })
        }
      })
      .catch(() => toast({ status: "error", description: "Something went wrong" }))
    })
  }

  const onClick = () => isPro ? handleUpgrade() : proModal.onOpen()

  return (
    <Button
      variant="primary"
      onClick={onClick}
      disabled={isPending}
    >
      {isPro ? "Manage your Pro subscription" : "Upgrade now for unlimited features!"}
    </Button>
  )
}