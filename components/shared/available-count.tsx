import { useQuery } from "@tanstack/react-query"
import { getSubscriptionStatus } from "@/lib/actions/user-limit/get-subscription-status"

import { Skeleton } from "@/components/ui/skeleton"
import { Hint } from "@/components/shared/hint"
import { IoIosHelpCircleOutline } from "react-icons/io"

interface AvailableCountProps {
  availableCount: string
  getAvailableCount: () => Promise<number>
  maxCount: number
  description: string
  label: string
}

export const AvailableCount = ({
  availableCount,
  getAvailableCount,
  maxCount,
  description,
  label
}: AvailableCountProps) => {
  const { data: isPro, isLoading: isLoadingSubscription, isError: isSubscriptionError } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => getSubscriptionStatus()
  })

  const { data: count, isLoading: isLoadingCount, isError: isCountError } = useQuery<number>({
    queryKey: [availableCount],
    queryFn: () => getAvailableCount()
  })

  if (isSubscriptionError || isCountError) {
    return (
      <div className="p-2">
        <span className="text-xs">
          Error loading available count.
        </span>
      </div>
    )
  }

  if (isLoadingSubscription || isLoadingCount) {
    return (
      <div className="flex justify-between items-center p-2">
        <Skeleton className="h-4 w-[120px] bg-gray-200" />
        <Skeleton className="h-4 w-4 bg-gray-200 rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex justify-between items-center p-2">
      <span className="text-xs">
      {isPro ? "Unlimited" : count !== undefined ? label.replace("{remaining}", `${maxCount - count}`) : "remaining 0"}
      </span>
      <Hint
        sideOffset={10}
        description={description}
      >
        <IoIosHelpCircleOutline
          className="h-4 w-4"
        />
      </Hint>
    </div>
  )
}