import { useQuery } from "@tanstack/react-query"
import { getUserEmailById } from "@/lib/actions/auth/get-user"

import { Skeleton } from "@/components/ui/skeleton"

interface BoardOwnerProps {
  userId: string
}

export const BoardOwner = ({
  userId
}: BoardOwnerProps) => {
  const { data: userEmail, isLoading, isError } = useQuery<string>({
    queryKey: ["userEmail", userId],
    queryFn: () => getUserEmailById(userId),
    enabled: !!userId
  })

  if (isError) {
    return (
      <div className="text-sm text-center text-gray-500 pb-4">
        Error loading board owner.
      </div>
    )
  }

  if (isLoading || userEmail == null) {
    return (
      <div className="flex justify-center items-center pb-4">
        <Skeleton className="h-4 w-2/3 bg-gray-200" />
      </div>
    )
  }

  return (
    <div className="text-sm text-center text-gray-500 pb-4">
      Owner: {userEmail}
    </div>
  )
}