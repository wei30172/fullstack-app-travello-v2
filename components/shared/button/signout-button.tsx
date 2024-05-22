"use client"

import { logout } from "@/lib/actions/auth/signout"
import { Button } from "@/components/ui/button"

interface SignOutButtonProps {
  children: React.ReactNode
}

export const SignOutButton = ({
  children
}: SignOutButtonProps) => {

  return (
    <Button onClick={() => logout()} variant="destructive" className="w-full">
      {children}
    </Button>
  )
}
