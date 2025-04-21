import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useCheckRole } from "@/hooks/use-session"

import { Skeleton } from "@/components/ui/skeleton"
import { Hint } from "@/components/shared/hint"
import { IoIosHelpCircleOutline } from "react-icons/io"

interface AvailableCountProps {
  queryKey: string
  queryFn: () => Promise<number>
  maxCount: number
  description: string
  label: string
}

export const AvailableCount = ({
  queryKey,
  queryFn,
  maxCount,
  description,
  label
}: AvailableCountProps) => {
  const checkRole = useCheckRole()
  const tUi = useTranslations("BoardForm.ui")

  const { data: count, isLoading, isError } = useQuery<number>({
    queryKey: [queryKey],
    queryFn: () => queryFn()
  })

  if (isError) {
    return (
      <div className="p-2 pt-0">
        <span className="text-xs">
          {tUi("aiCountLoadError")}
        </span>
      </div>
    )
  }

  if (isLoading || count == null) {
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
        {checkRole ? "Unlimited" : label.replace("{remaining}", `${maxCount - count}`)}
      </span>
      <Hint
        sideOffset={10}
        description={description}
      >
        <IoIosHelpCircleOutline
          className="h-[16px] w-[16px]"
        />
      </Hint>
    </div>
  )
}