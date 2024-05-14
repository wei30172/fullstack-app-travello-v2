"use client"

import { useQuery } from "@tanstack/react-query"

import { CardWithList } from "@/lib/models/types"
import { fetcher } from "@/lib/utils"
import { useCardModal } from "@/hooks/use-card-modal"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Header } from "./header"
import { Description } from "./description"
import { Options } from "./options"

export const CardModal = () => {
  const id = useCardModal((state) => state.id)
  const isOpen = useCardModal((state) => state.isOpen)
  const onClose = useCardModal((state) => state.onClose)

  const { data: cardData, isLoading, error } = useQuery<CardWithList, Error>({
    queryKey: ["card", id],
    queryFn: () => (id ? fetcher(`/api/card/${id}`) : Promise.reject(new Error("No ID provided"))),
    enabled: !!id
  })

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div>Error loading card: {error.message}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {isLoading || !cardData ? (
          <>
            <Header.Skeleton />
            <Description.Skeleton />
            <Options.Skeleton />
          </>
        ) : (
          <>
            <Header data={cardData} />
            <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
              <div className="col-span-3">
                <div className="w-full space-y-6">
                  <Description data={cardData} />
                </div>
              </div>
              <Options data={cardData} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}