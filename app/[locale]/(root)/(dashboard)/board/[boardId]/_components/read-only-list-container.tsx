"use client"

import { useState, useEffect  } from "react"
import { ListWithCards, BoardRole } from "@/lib/database/types"

import { ReadOnlyListItem } from "./read-only-list-item"

interface ReadOnlyListContainerProps {
  data: ListWithCards[],
  role: BoardRole
}

export const ReadOnlyListContainer = ({
  data,
  role
}: ReadOnlyListContainerProps) => {

  const [orderedData, setOrderedData] = useState(data)

  useEffect(() => {
    setOrderedData(data)
  }, [data])
  
  return (
    <ol className="flex gap-x-3 h-full">
      {orderedData.map((list) => {
        return (
          <ReadOnlyListItem
            key={list._id}
            listData={list}
            role={role}
          />
        )
      })}
      <div className="flex-shrink-0 w-1" />
    </ol>
  )
}