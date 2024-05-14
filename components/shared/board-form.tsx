"use client"

import { useState, useRef, useTransition } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import DatePicker from "react-datepicker"
import { CreateBoardValidation } from "@/lib/validations/board"
import { IBoard } from "@/lib/models/types"
import { createBoard } from "@/lib/actions/board/create-board"
import { updateBoard } from "@/lib/actions/board/update-board"
// import { createList } from "@/lib/actions/list/create-list"
import { calculateDays } from "@/lib/utils"

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
// import AIResponse from "./AI-response"

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
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()
  const [tripItinerary, setTripItinerary] = useState<TripItinerary | null>(null)
  const [openAIResponse, setOpenAIResponse] = useState<string>("")
  const [isStreaming, setIsStreaming] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const eventDefaultValues = {
    title: "",
    location: "",
    imageUrl: "",
    startDate: new Date(),
    endDate: new Date()
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

  async function askAI () {
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
      
      const res: any = await fetch("/api/boards/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          location: values.location,
          days
        }),
        signal: abortControllerRef.current.signal
      })
      
      if (!res.ok || !res.body) {
        toast({
          status: "error",
          title: "Error sending message!",
          description: "The OpenAI API key is currently not available for use."
        })
        return
      }
  
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let chunks = ""
      
      while (true) {
        const { value, done } = await reader?.read()
  
        setOpenAIResponse((prev) => prev + decoder.decode(value))
  
        if (done) break
        chunks += decoder.decode(value, { stream: !done })
      }

      setTripItinerary(JSON.parse(chunks))
    } catch (error: any) {
      console.log({error})
      if (error.name !== "AbortError") {
        toast({
          status: "error",
          description: "Error sending message!"
        })
      }
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

  // async function applySuggestions() {
  //   if (!boardData?._id) {
  //     toast({
  //       status: "error",
  //       description: "Board data is not available."
  //     })
  //     return
  //   }

  //   if (!tripItinerary) {
  //     toast({
  //       status: "warning",
  //       description: "No AI-generated itinerary to apply."
  //     })
  //     return
  //   }

  //   try {
  //     const boardId = boardData._id
  //     for (const [title, cardTitles] of Object.entries(tripItinerary)) {
  //       startTransition(() => {
  //         createList({ title, boardId, cardTitles })
  //         .then((res) => {
  //           if (res?.data) {
  //             toast({ status: "success", title: `Itinerary "${res?.data.title}" created` })
  //             router.refresh()
  //             onClose()
  //           } else if (res?.error) {
  //             toast({ status: "error", description: res?.error })
  //           }
  //         })
  //         .catch(() => toast({ status: "error", description: "Something went wrong" }))
  //       })
  //     }
  //   } catch (error) {
  //     console.error(error)
  //     toast({
  //       status: "error",
  //       description: "Failed to apply suggestions."
  //     })
  //   }
  // }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-2">
        {type === "Create" &&
          <div className="text-sm font-medium text-center text-teal-900 pb-2">
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
            <FormItem>
              <div className="flex items-center justify-center gap-1">
                <FormLabel className="flex items-center gap-1 text-sm">
                  <p className="text-muted-foreground whitespace-nowrap w-20">Start Date</p>
                </FormLabel>
                <FormControl className="cursor-pointer text-sm flex">
                  <DatePicker
                    selected={field.value} 
                    onChange={(date: Date) => {
                      const normalizedDate = new Date(date.setHours(0, 0, 0, 0))
                      field.onChange(normalizedDate)
                    }}
                    dateFormat="MM/dd/yyyy"
                    wrapperClassName="datePicker"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem >
              <div className="flex items-center justify-center gap-1">
                <FormLabel className="flex items-center gap-1 text-sm">
                  <p className="text-muted-foreground whitespace-nowrap w-20">End Date</p>
                </FormLabel>
                <FormControl className="cursor-pointer text-sm flex">
                  <DatePicker
                    selected={field.value} 
                    onChange={(date: Date) => {
                      const normalizedDate = new Date(date.setHours(0, 0, 0, 0))
                      field.onChange(normalizedDate)
                    }} 
                    dateFormat="MM/dd/yyyy"
                    wrapperClassName="datePicker"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full mt-4"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : type}
        </Button>
        {/* {
          type === "Update" && (
            <AIResponse
              isStreaming={isStreaming}
              openAIResponse={openAIResponse}
              tripItinerary={tripItinerary}
              askAI={askAI}
              handleStop={handleStop}
              applySuggestions={applySuggestions}
              pending={isPending}
            />
          )
        } */}
      </form>
    </Form>
  )
}