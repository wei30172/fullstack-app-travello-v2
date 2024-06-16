"use client"

import { useRef, useState } from "react"
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { ListWithCards, BoardRole } from "@/lib/models/types"
import { cn } from "@/lib/utils"

import { ListHeader } from "./list-header"
import { CardItem } from "./card-item"
import { CardForm } from "./card-form"

interface ListItemProps {
  listData: ListWithCards
  index: number,
  role: BoardRole
}

export const ListItem = ({
  listData,
  index,
  role
}: ListItemProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [isEditing, setIsEditing] = useState(false)

  const enableEditing = () => {
    if (role === BoardRole.VIEWER) return

    setIsEditing(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    })
  }

  const disableEditing = () => {
    setIsEditing(false)
  }
  
  return (
    <Draggable draggableId={listData._id} index={index}>
      {(provided) => (
        <li 
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-gray-100 shadow-md pb-2"
          >
            <ListHeader 
              onAddCard={enableEditing}
              listData={listData}
              role={role}
            />
            <Droppable droppableId={listData._id} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                    listData.cards.length > 0 ? "mt-2" : "mt-0",
                  )}
                >
                  {
                    (listData.cards).map((card, index) => (
                      <CardItem
                        index={index}
                        key={card._id}
                        cardData={card}
                      />
                    ))
                  }
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              listId={listData._id}
              ref={textareaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
              role={role}
            />
          </div>
        </li>
      )}
    </Draggable>
  )
}