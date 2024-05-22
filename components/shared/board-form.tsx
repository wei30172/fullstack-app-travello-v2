"use client"

import { useState, useRef, useTransition } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import DatePicker from "react-datepicker"
import { CreateBoardValidation } from "@/lib/validations/board"
import { IBoard } from "@/lib/models/types"
import { createBoard } from "@/lib/actions/board/create-board"
import { updateBoard } from "@/lib/actions/board/update-board"
import { createList } from "@/lib/actions/list/create-list"
import { 
  hasAvailableCount,
  incrementAvailableCount
} from "@/lib/actions/user-limit"
import { useCheckRole } from "@/hooks/use-session"
import { askAI } from "@/lib/api-handler/board"
import { calculateDays } from "@/lib/date"

import "react-datepicker/dist/react-datepicker.css"
import { LuGoal, LuMapPin } from "react-icons/lu"
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
import { useToast } from "@/components/ui/use-toast"
import AIResponse from "./AI-response"

interface DatePickerFieldProps {
  label: string
  value: Date
  onChange: (date: Date) => void
}

const DatePickerField = ({
  label,
  value,
  onChange
}: DatePickerFieldProps) => (
  <FormItem>
    <div className="flex items-center justify-center gap-1">
      <FormLabel className="flex items-center gap-1 text-sm">
        <p className="text-muted-foreground whitespace-nowrap w-20">{label}</p>
      </FormLabel>
      <FormControl className="cursor-pointer text-sm flex">
        <DatePicker
          selected={value}
          onChange={onChange}
          dateFormat="MM/dd/yyyy"
          wrapperClassName="datePicker"
        />
      </FormControl>
    </div>
    <FormMessage />
  </FormItem>
)

interface BoardFormProps {
  type: "Create" | "Update",
  onClose: () => void
  boardData?: IBoard
}

interface TripItinerary {
  [key: string]: string[]
}

export const BoardForm = ({
  type,
  onClose,
  boardData
}: BoardFormProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const checkRole = useCheckRole()

  const [language, setLanguage] = useState("English")
  const [isPending, startTransition] = useTransition()
  const [tripItinerary, setTripItinerary] = useState<TripItinerary | null>(null)
  const [openAIResponse, setOpenAIResponse] = useState<string>("")
  const [isStreaming, setIsStreaming] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const eventDefaultValues = {
    title: "",
    location: "",
    imageUrl: "",
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(0, 0, 0, 0))
  }

  const initialValues = boardData && type === "Update" 
    ? { 
      ...boardData, 
      startDate: new Date(boardData.startDate), 
      endDate: new Date(boardData.endDate)
    }
    : eventDefaultValues

  const form = useForm<z.infer<typeof CreateBoardValidation>>({
    resolver: zodResolver(CreateBoardValidation),
    defaultValues: initialValues
  })

  async function onSubmit(values: z.infer<typeof CreateBoardValidation>) {
    // console.log({values})
    if (type === "Create") {
      startTransition(() => {
        createBoard({
          title: values.title,
          location: values.location,
          startDate: values.startDate,
          endDate: values.endDate,
          imageUrl: values.imageUrl
        })
        .then((res) => {
          if (res?.data) {
            toast({ status: "success", title: "Trip created!" })
            form.reset()
            onClose()
            router.push(`/board/${res?.data._id}`)
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: "Something went wrong" }))
      })
    }

    if (type === "Update") {
      if (!boardData?._id) {
        router.back()
        return
      }
      onClose()
      startTransition(() => {
        updateBoard({
          title: values.title,
          location: values.location,
          startDate: values.startDate,
          endDate: values.endDate,
          imageUrl: values.imageUrl,
          id: boardData._id
        })
        .then((res) => {
          if (res?.data) {
            toast({ status: "success", title: `Trip "${res?.data.title}" updated` })
            form.reset()
            onClose()
          } else if (res?.error) {
            toast({ status: "error", description: res?.error })
          }
        })
        .catch(() => toast({ status: "error", description: "Something went wrong" }))
      })
    }
  }

  const handleAskAI = async () => {
    const canUse = await hasAvailableCount()

    if (!canUse && !checkRole) {
      toast({
        status: "warning",
        description: "You have reached your limit of free AI uses."
      })
      return
    }

    setIsStreaming(true)
    setTripItinerary(null)
    setOpenAIResponse("")

    const values = form.watch()
    if (!values.location || !values.startDate || !values.endDate) {
      toast({
        status: "warning",
        description: "Please provide location, start date, and end date."
      })
      setIsStreaming(false)
      return
    }

    const days = calculateDays(values.startDate, values.endDate)

    if (days < 1 || days > 10) {
      toast({
        status: "warning",
        description: "The AI feature is only available for trips that within 10 days"
      })
      setIsStreaming(false)
      return
    }

    try {
      abortControllerRef.current = new AbortController()
      const params = { location: values.location, days, language }
      const res: any = await askAI(params, abortControllerRef.current.signal)

      if (res.ok && res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let chunks = ""
        
        while (true) {
          const { value, done } = await reader?.read()
    
          setOpenAIResponse((prev) => prev + decoder.decode(value))
    
          if (done) break
          chunks += decoder.decode(value, { stream: !done })
        }
  
        setTripItinerary(JSON.parse(chunks))

        if (!checkRole) {
          await incrementAvailableCount()
          queryClient.invalidateQueries({
            queryKey: ["availableCount"]
          })
        }
        
      } else if (!res.aborted) {
        toast({
          status: "error",
          description: `Error: ${res.error}`
        })
      }
    } catch (error) {
      console.error((error as Error).message)
    } finally {
      abortControllerRef.current = null
      setIsStreaming(false)
    }
  }

  const handleStop = () => {
    if (!abortControllerRef.current) {
      return
    }
    abortControllerRef.current.abort()
    abortControllerRef.current = null
  }

  async function applySuggestions() {
    if (!boardData?._id) {
      toast({
        status: "error",
        description: "Board data is not available."
      })
      return
    }

    if (!tripItinerary) {
      toast({
        status: "warning",
        description: "No AI-generated itinerary to apply."
      })
      return
    }

    try {
      const boardId = boardData._id
      for (const [title, cardTitles] of Object.entries(tripItinerary)) {
        startTransition(() => {
          createList({ title, boardId, cardTitles })
          .then((res) => {
            if (res?.data) {
              toast({ status: "success", title: `Itinerary "${res?.data.title}" created` })
              router.refresh()
              onClose()
            } else if (res?.error) {
              toast({ status: "error", description: res?.error })
            }
          })
          .catch(() => toast({ status: "error", description: "Something went wrong" }))
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        status: "error",
        description: "Failed to apply suggestions."
      })
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-2">
        {type === "Create" &&
          <div className="text-md font-medium text-center text-teal-600 pb-2">
            Create Trip
          </div>
        }
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-center gap-1">
                <FormLabel>
                  <LuGoal  className="h-4 w-4 m-1" />
                </FormLabel>
                <FormControl>
                  <Input placeholder="Trip title" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FileImage className="h-4 w-4 m-1" />
              </FormLabel>
              <FormControl className="h-36">
                <Input placeholder="todo: Image" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-center gap-1">
                <FormLabel>
                  <LuMapPin className="h-4 w-4 m-1" />
                </FormLabel>
                <FormControl>
                  <Input placeholder="Trip location" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <DatePickerField
              label="Start Date"
              value={field.value}
              onChange={(date: Date) => {
                field.onChange(new Date(date.setHours(0, 0, 0, 0)))
              }}
            />
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <DatePickerField
              label="End Date"
              value={field.value}
              onChange={(date: Date) => {
                field.onChange(new Date(date.setHours(0, 0, 0, 0)))
              }}
            />
          )}
        />
        <Button
          className="w-full mt-4"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : type}
        </Button>
        {
          type === "Update" && (
            <AIResponse
              language={language}
              setLanguage={setLanguage}
              isStreaming={isStreaming}
              openAIResponse={openAIResponse}
              tripItinerary={tripItinerary}
              handleAskAI={handleAskAI}
              handleStop={handleStop}
              applySuggestions={applySuggestions}
              pending={isPending}
            />
          )
        }
      </form>
    </Form>
  )
}