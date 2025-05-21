"use client"

import { useState, useTransition } from "react"
import { useParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { CardWithList, BoardRole } from "@/lib/database/models/types"
import { updateCard } from "@/lib/actions/card/update-card"

import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { LuMapPin } from "react-icons/lu"
import { GoCircleSlash } from "react-icons/go"

interface ColorPickerProps {
  data: CardWithList
}

export const ColorPicker = ({ data }: ColorPickerProps) => {
  const params = useParams()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  const [cardColor, setCardColor] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const tUi = useTranslations("CardForm.ui")
  const tToast = useTranslations("CardForm.toast")
  const tError = useTranslations("Common.error")
  
  const colors = [
    "", "#e57373", "#f06292", "#ba68c8", "#9575cd", "#7986cb",
    "#64b5f6", "#4fc3f7", "#4dd0e1", "#4db6ac", "#81c784", "#aed581",
    "#dce775", "#fff176", "#ffd54f", "#ffb74d", "#ff8a65", "#a1887f",
    "#e0e0e0", "#90a4ae", "#f8bbd0", "#d1c4e9", "#b3e5fc", "#b2dfdb"
  ]

  const selectColor = (color: string) => {
    if (data.role === BoardRole.VIEWER) {
      toast({ status: "warning", description: tError("unauthorized") })
      return
    }

    setCardColor(color)
    const boardId = params.boardId as string

    startTransition(() => {
      updateCard({ color, boardId, id: data._id })
        .then((res) => {
          if (res?.data) {
            queryClient.invalidateQueries({
              queryKey: ["card", res?.data._id]
            })
            toast({
              status: "success",
              title: tToast("success.colorUpdated", { title: res?.data.title })
            })
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: tError("generic") }))
    })
  }
  
  return (
    <div className="flex items-start gap-x-4 w-full">
      <LuMapPin className="h-5 w-5 mt-0.5 text-gray-700" />
      <div className="w-full">
        <p className="font-semibold text-gray-700 mb-2">
          {tUi("color")}
        </p>
        <div className="p-4 bg-gray-800 rounded-lg grid grid-cols-6 sm:grid-cols-8 gap-2">
          {colors.map(color => (
            <Button
              key={color}
              onClick={() => selectColor(color)}
              style={{ backgroundColor: color || "transparent" }}
              className={`w-8 h-8 rounded-full p-0 focus:outline-none ${cardColor === color ? "ring-2 ring-white": ""}`}
              disabled={isPending}
            >
              {color === "" && <GoCircleSlash className="text-gray-400 w-full h-full" />}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

ColorPicker.Skeleton = function ColorPickerSkeleton() {
  return (
    <div className="flex items-start gap-x-4 w-full">
      <Skeleton className="h-5 w-5 bg-gray-200" />
      <div className="w-full">
        <div className="p-4 bg-gray-800 rounded-lg grid grid-cols-6 sm:grid-cols-8 gap-2">
          {Array(24).fill(null).map((_, index) => (
            <Skeleton key={index} className="w-8 h-8 rounded-full bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  )
}