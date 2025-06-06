import { useSession } from "next-auth/react"
import { UserRole } from "@/lib/database/types"

export const useCurrentUser = () => {
  const { data: session } = useSession()

  return session?.user
}

export const useCheckRole = () => {
  const { data: session } = useSession()

  const role = session?.user?.role
  return role === UserRole.ADMIN || role === UserRole.MEMBER
}