"use client"

import { ICard } from "@/lib/models/types"
import { useCardModal } from "@/hooks/use-card-modal"

interface ReadOnlyCardItemProps {
  cardData: ICard,
}

export const ReadOnlyCardItem = ({
  cardData
}: ReadOnlyCardItemProps) => {
  const cardModal = useCardModal()

  return (
    <div
      role="button"
      onClick={() => cardModal.onOpen(cardData._id)}
      className={`truncate border-2 ${
        cardData.isCompleted ? 'bg-green-100 hover:bg-green-200' : 'bg-white hover:bg-gray-100'
      } border-transparent hover:border-black py-2 px-3 text-sm text-teal-900 rounded-md shadow-sm`}
    >
      {cardData.title}
    </div>
  )
}