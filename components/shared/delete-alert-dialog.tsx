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
import { Button } from "@/components/ui/button"

interface DeleteConfirmDialogProps {
  title: string
  onConfirm: () => void
  isPending: boolean
}

export const DeleteAlertDialog = ({
  title,
  onConfirm,
  isPending,
}: DeleteConfirmDialogProps) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        variant="destructive"
        className="w-full"
        disabled={isPending}
      >
        {title}
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          className="bg-red-500"
          onClick={onConfirm}>
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)