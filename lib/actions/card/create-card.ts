"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import List from "@/lib/models/list.model"
import Card from "@/lib/models/card.model"
import { CreateCardValidation } from "@/lib/validations/card"

type CreateCardInput = z.infer<typeof CreateCardValidation>

export const createCard = async (
  values: CreateCardInput
) => {
  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = CreateCardValidation.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: "Invalid fields!",
      errors: validatedFields.error.flatten().fieldErrors
    }
  }

  const { title, boardId, listId, order } = validatedFields.data

  try {
    await connectDB()

    const list = await List.findById(listId)
    
    if (!list) {
      return { error: "List not found" }
    }
    
    let newOrder = order
    if (newOrder === undefined) {
      const lastCard = await Card.findOne({ listId })
      .sort({ order: -1 }) // Descending order
      .select({ order: 1 }) // Select the order field
      newOrder = lastCard ? lastCard.order + 1 : 0
    }

    const card = new Card({ title, listId, order: newOrder })
    // console.log({card})

    await card.save()

    await List.findByIdAndUpdate(
      listId,
      { $push: { cards: card._id }
    })

    revalidatePath(`/board/${boardId}`)
    return { data: {
      ...card._doc,
      _id: card._id.toString(),
      listId: card.listId.toString()
    }}

  } catch (error) {
    return { error: "Failed to create" }
  }
}