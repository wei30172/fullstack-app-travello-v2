"use client"

import { useRef } from "react"
import { ListWithCards, BoardRole } from "@/lib/database/types"
import { cn } from "@/lib/utils"

import { ListHeader } from "./list-header"
import { ReadOnlyCardItem } from "./read-only-card-item"

interface ReadOnlyListItemProps {
  listData: ListWithCards
  role: BoardRole
}

export const ReadOnlyListItem = ({
  listData,
  role
}: ReadOnlyListItemProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const enableEditing = () => {
    setTimeout(() => {
      textareaRef.current?.focus()
    })
  }

  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <div className="w-full rounded-md bg-gray-100 shadow-md pb-2">
        <ListHeader
          onAddCard={enableEditing}
          listData={listData}
          role={role}
        />
        <ol
          className={cn(
            "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
            listData.cards.length > 0 ? "mt-2" : "mt-0",
          )}
        >
          {(listData.cards).map((card, index) => (
            <ReadOnlyCardItem
              key={card._id}
              cardData={card}
            />
          ))}
        </ol>
      </div>
    </li>
  )
}