"use client"

import { useTransition } from "react"
import Image from "next/image"
import { useProModal } from "@/hooks/use-pro-modal"
import { getStripeRedirect } from "@/lib/actions/user-limit/get-stripe-redirect"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

export const ProModal = () => {
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
  
  return (
    <Dialog
      open={proModal.isOpen}
      onOpenChange={proModal.onClose}
    >
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center">
          <Image
            src="/images/upgrade-hero-image.png"
            alt="Upgrade Image"
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
        <div className="mx-auto space-y-6 p-6">
          <h2 className="font-semibold text-xl text-teal-700">
            Unlock Travello Pro Features!
          </h2>
          <p className="text-xs font-semibold">
            Elevate your travel planning to the next level
          </p>
          <div className="pl-3">
            <ul className="text-sm list-disc">
              <li>Unlimited access to AI travel tools</li>
              <li>Unlimited uploads of trip cover</li>
            </ul>
          </div>
          <Button
            disabled={isPending}
            onClick={handleUpgrade}
            className="w-full"
            variant="primary"
          >
            Upgrade now for unlimited features!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}