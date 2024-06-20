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

  const backgroundColor = cardData.isCompleted ? "bg-green-100 hover:bg-green-200" : "bg-white hover:bg-gray-100"
  const colorBarStyle = cardData.color || "transparent"

  return (
    <div
      role="button"
      onClick={() => cardModal.onOpen(cardData._id)}
      className={`flex items-center
        truncate py-2 px-3 text-sm ${backgroundColor} text-teal-900 rounded-md shadow-sm
        border-2 border-transparent hover:border-black`}
    >
      <span className="h-4 w-2 mr-2 inline-block" style={{ backgroundColor: colorBarStyle }}></span>
      {cardData.title}
    </div>
  )
}