import { useQuery } from "@tanstack/react-query"
import { MAX_FREE_ASKAI } from "@/constants/board"
import { getAvailableCount} from "@/lib/actions/user-limit"
import { useCheckRole } from "@/hooks/use-session"

import { Skeleton } from "@/components/ui/skeleton"
import { Hint } from "@/components/shared/hint"
import { IoIosHelpCircleOutline } from "react-icons/io"

export const AvailableCount = () => {
  const checkRole = useCheckRole()

  const { data: availableCount, isLoading, isError } = useQuery<number>({
    queryKey: ["availableCount"],
    queryFn: () => getAvailableCount()
  })

  if (isError) {
    return (
      <div className="p-2 pt-0">
        <span className="text-xs">
          Error loading available count.
        </span>
      </div>
    )
  }

  if (isLoading || !availableCount) {
    return (
      <div className="flex justify-between items-center p-2 pt-0">
        <Skeleton className="h-4 w-1/3 bg-gray-200" />
        <Skeleton className="h-[16px] w-[16px] bg-gray-200 rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex justify-between items-center p-2 pt-0">
      <span className="text-xs">
        {checkRole ? "Unlimited" : `${MAX_FREE_ASKAI - availableCount} remaining`}
      </span>
      <Hint
        sideOffset={10}
        description={`You have 5 free AI uses available in Free Workspaces.`}
      >
        <IoIosHelpCircleOutline
          className="h-[16px] w-[16px]"
        />
      </Hint>
    </div>
  )
}