"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { acceptInvitation } from "@/lib/actions/board/accept-invitation"

import { FormError } from "@/components/shared/form/form-error"
import { FormSuccess } from "@/components/shared/form/form-success"
import { Spinner } from "@/components/shared/spinner"
import { Button } from "@/components/ui/button"

export const AcceptShareForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [boardId, setBoardId] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const tUi = useTranslations("AcceptShareForm.ui")
  const tError = useTranslations("Common.error")

  const token = searchParams.get("token")

  async function onSubmit() {
    // console.log(token)
    setError("")
    setSuccess("")
    
    if (!token) {
      setError(tError("missingToken"))
      return
    }

    startTransition(() => {
      acceptInvitation(token)
      .then((data) => {
        if (data?.error) {
          setError(data.error)
        } else if (data?.success) {
          setSuccess(data.success)
          setBoardId(data.boardId)
          setTimeout(() => {
            router.push(`/board/${data.boardId}`)
          }, 3000)
        }
      })
      .catch(() => setError(tError("generic")))
    })
  }

  return (
    <div className="flex flex-col items-center w-[360px] p-4 bg-teal-100 rounded-lg shadow-md">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">{tUi("header")}</h1>
      {isPending && (
        <>
          <Spinner className="text-gray-500" />
          <p className="mt-2 text-gray-600">{tUi("processing")}</p>
        </>
      )}
      <FormSuccess message={success} />
      <FormError message={error} />
      {!isPending && !success && (
        <>
          <p className="mb-4 text-sm text-gray-700 text-center">
            {tUi("invitation")}
          </p>
          <Button 
            onClick={onSubmit} 
            variant="primary" 
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            disabled={isPending}
          >
            {tUi("accept")}
          </Button>
        </>
      )}
      {!success && (
        <div className="mt-4 text-sm text-gray-900 text-center">
          {tUi("click")}{" "}
          <Link href={`/board/${boardId}`} className="text-blue-500 underline">
            {tUi("here")}
          </Link>{" "}
          {tUi("goToTrip")}
        </div>
      )}
    </div>
  )
}