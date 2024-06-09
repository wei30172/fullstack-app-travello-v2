"use client"

import { Draggable } from "@hello-pangea/dnd"

import { ICard } from "@/lib/models/types"
import { useCardModal } from "@/hooks/use-card-modal"

interface CardItemProps {
  cardData: ICard
  index: number
}

export const CardItem = ({
  cardData,
  index,
}: CardItemProps) => {
  const cardModal = useCardModal()

  return (
    <Draggable draggableId={cardData._id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => cardModal.onOpen(cardData._id)}
          className={`truncate border-2 ${
            cardData.isCompleted ? 'bg-green-100 hover:bg-green-200' : 'bg-white hover:bg-gray-100'
          } border-transparent hover:border-black py-2 px-3 text-sm text-teal-900 rounded-md shadow-sm`}
        >
          {cardData.title}
        </div>
      )}
    </Draggable>
  )
}