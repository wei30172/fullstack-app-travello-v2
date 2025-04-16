"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ResetFormValues,
  getResetFormSchema
} from "@/lib/validations/auth"
import { resetPassword } from "@/lib/actions/auth/reset-password"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FormError } from "@/components/shared/form/form-error"
import { FormSuccess } from "@/components/shared/form/form-success"
import { FormWrapper } from "@/components/shared/form/form-wrapper"

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const ui = useTranslations("ResetForm.ui")
  const validationMessages = useTranslations("ResetForm.validation")
  const serverError = useTranslations("SomeForm.server.error")

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(getResetFormSchema(validationMessages)),
    defaultValues: {
      email: ""
    }
  })

  async function onSubmit(values: ResetFormValues) {
    // console.log(values)
    setError("")
    setSuccess("")

    startTransition(() => {
      resetPassword(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error)
          } else if (data?.success) {
            setSuccess(data.success)
          }
        })
        .catch(() => setError(serverError("generic")))
    })
  }

  return (
    <FormWrapper
      headerLabel={ui("header")}
      backButtonLabel={ui("backButton")}
      backButtonHref="/signin"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ui("email")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="mail@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            size="lg"
            className="w-full mt-6"
            type="submit"
            disabled={isPending}
          >
            {isPending ? ui("submitting") : ui("submit")}
          </Button>
        </form>
      </Form>
    </FormWrapper>
  )
}