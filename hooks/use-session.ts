import { useSession } from "next-auth/react"
import { UserRole } from "@/lib/models/types"

export const useCurrentUser = () => {
  const session = useSession()

  return session.data?.user
}

export const useCheckRole = () => {
  const session = useSession()

  const role = session.data?.user?.role
  return role === UserRole.ADMIN || role === UserRole.MEMBER
}