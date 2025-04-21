import { useState } from "react"
import { useTranslations } from "next-intl"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DeleteConfirmDialogProps {
  actiontitle?: string
  children: React.ReactNode
  onConfirm: () => void
}

export const ConfirmDialog = ({
  actiontitle,
  children,
  onConfirm
}: DeleteConfirmDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const tUi = useTranslations("ConfirmDialog.ui")
  
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <div onClick={() => setIsOpen(true)}>
          {children}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tUi("title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {tUi("description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            {tUi("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500"
            onClick={onConfirm}>
            {actiontitle || tUi("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}