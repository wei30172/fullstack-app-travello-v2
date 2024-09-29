"use client"

import { MAX_FREE_COVER, MAX_FREE_ASKAI } from "@/constants/board"
import { getAvailableBoardCoverCount, getAvailableAskAiCount } from "@/lib/actions/user-limit/handle-count"
import { CountType } from "@/lib/models/types"
import { useCurrentUser } from "@/hooks/use-session"

import { FaRegUserCircle } from "react-icons/fa"
import { FiCreditCard } from "react-icons/fi"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { AvailableCount } from "@/components/shared/available-count"

interface InfoProps {
  isPro: boolean
}

export const Info = ({
  isPro,
}: InfoProps) => {
  const user = useCurrentUser()

  if (!user) {
    return null
  }
  
  return (
    <div className="flex items-center gap-x-4">
      <Avatar className="h-12 w-12 relative">
        <AvatarImage src={user?.image || ""} className="object-cover"/>
        <AvatarFallback className="bg-primary-500">
          <FaRegUserCircle className="h-full w-full"/>
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <p className="font-semibold text-xl">
          {user?.name}
        </p>
        <div className="flex items-center gap-x-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <FiCreditCard className="h-3 w-3 mr-1" />
            {isPro ? "Pro" : "Free"}
          </div>
          <AvailableCount
            availableCount={CountType.ASK_AI_COUNT}
            getAvailableCount={getAvailableAskAiCount}
            maxCount={MAX_FREE_ASKAI}
            label="{remaining} AI uses remaining"
            description={`You have ${MAX_FREE_ASKAI} free AI uses available in Free Workspaces.`}
          />
          <AvailableCount
            availableCount={CountType.BOARD_COVER_COUNT}
            getAvailableCount={getAvailableBoardCoverCount}
            maxCount={MAX_FREE_COVER}
            label="{remaining} cover uploads remaining"
            description={`You have ${MAX_FREE_COVER} free board cover uploads available in Free Workspaces.`}
          />
        </div>
      </div>
    </div>
  )
}

Info.Skeleton = function SkeletonInfo() {
  return (
    <div className="flex items-center gap-x-4">
      <div className="w-[60px] h-[60px] relative">
        <Skeleton className="w-full h-full absolute" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-[200px]" />
        <div className="flex items-center">
          <Skeleton className="h-10 sm:h-4 w-[300px] sm:w-[400px]" />
        </div>
      </div>
    </div>
  )
}