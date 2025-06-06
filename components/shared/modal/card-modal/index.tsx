"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { getCard } from "@/lib/actions/card/get-card"
import { useCardModal } from "@/hooks/use-card-modal"
import { BoardRole } from "@/lib/database/types"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Header } from "./header"
import { Description } from "./description"
import { Options } from "./options"
import { ColorPicker } from "./color-picker"

export const CardModal = () => {
  const id = useCardModal((state) => state.id)
  const isOpen = useCardModal((state) => state.isOpen)
  const onClose = useCardModal((state) => state.onClose)

  const { data: cardData, isLoading, isError } = useQuery({
    queryKey: ["card", id],
    queryFn: () => (id ? getCard(id)
                       : Promise.reject(new Error("No ID provided"))),
    enabled: !!id
  })

  const [tempDescription, setTempDescription] = useState<string>("")
  const isEditorOrOwner = cardData?.role === BoardRole.EDITOR || cardData?.role === BoardRole.OWNER

  const tUi = useTranslations("CardForm.ui")

  useEffect(() => {
    if (cardData) {
      setTempDescription(cardData.description || "")
    }
  }, [cardData])
  
  if (isError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div>{tUi("attractionLoadError")}</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {isLoading || !cardData ? (
          <>
            <Header.Skeleton />
            <Description.Skeleton />
            <ColorPicker.Skeleton />
          </>
        ) : (
          <>
            <Header data={cardData} />
            <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
              <div className="col-span-3">
                <div className="w-full space-y-6">
                <Description
                  data={cardData}
                  tempDescription={tempDescription}
                  setTempDescription={setTempDescription}
                />
                </div>
              </div>
              {isEditorOrOwner && <Options data={cardData} />}
            </div>
            <ColorPicker data={cardData}/>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}