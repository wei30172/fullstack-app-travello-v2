"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useSession } from "next-auth/react"
import { UserRole, UserProvider } from "@/lib/models/types"
import { SettingsValidation } from "@/lib/validations/auth"
import { settings } from "@/lib/actions/auth/settings"

import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { FormError } from "@/components/shared/form/form-error"
import { FormSuccess } from "@/components/shared/form/form-success"
import { Skeleton } from "@/components/ui/skeleton"

export const SettingsForm = () => {
  const { data: session, status, update } = useSession({ required: true })
  const user = session?.user
  // console.log({user})

  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof SettingsValidation>>({
    resolver: zodResolver(SettingsValidation),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      newPassword: "",
      role: user?.role || UserRole.USER,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || false
    }
  })

  async function onSubmit(values: z.infer<typeof SettingsValidation>) {
    // console.log(values)
    setError("")
    setSuccess("")

    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error)
          } else if (data?.success) {
            update()
            setSuccess(data.success)
          }
        })
        .catch(() => setError("Something went wrong"))
    })
  }

  if (status === "loading") {
    return <SettingsForm.Skeleton />
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          Settings
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="your username on the web"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending || user?.provider !== UserProvider.CREDENTIALS}
                        placeholder="mail@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    {field.value !== user?.email && (
                      <FormDescription className="text-red-500">
                        Changing your email will cause trips shared with you by others to be lost.
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
              {user?.provider === UserProvider.CREDENTIALS && (
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            type="password"
                            placeholder="your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New password</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            type="password"
                            placeholder="new password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {user?.provider === UserProvider.CREDENTIALS && (
                <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Two Factor Authentication</FormLabel>
                      <FormDescription>
                        Enable two factor authentication
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
                />
              )}
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              size="lg"
              className="w-full my-6"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

SettingsForm.Skeleton = function SkeletonSettingsForm() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <Skeleton className="h-10 w-1/2 mx-auto my-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6 my-6">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}