"use client"

import { ElementRef, useRef, useState } from "react"
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { ListWithCards } from "@/lib/models/types"
import { cn } from "@/lib/utils"

import { ListHeader } from "./list-header"
import { CardItem } from "./card-item"
import { CardForm } from "./card-form"

interface ListItemProps {
  listData: ListWithCards
  index: number
}

export const ListItem = ({
  listData,
  index,
}: ListItemProps) => {
  const textareaRef = useRef<ElementRef<"textarea">>(null)

  const [isEditing, setIsEditing] = useState(false)

  const disableEditing = () => {
    setIsEditing(false)
  }

  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    })
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
          />
        </div>
      </li>
    )}
    </Draggable>
  )
}