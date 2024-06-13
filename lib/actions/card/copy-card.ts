"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { List } from "@/lib/models/list.model"
import { Card } from "@/lib/models/card.model"
import { CopyCardValidation } from "@/lib/validations/card"

type CopyCardInput = z.infer<typeof CopyCardValidation>

export const copyCard = async (
  values: CopyCardInput
) => {
  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = CopyCardValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { id, boardId } = validatedFields.data

  try {
    await connectDB()
    
    const cardToCopy = await Card.findById(id)
    if (!cardToCopy) { return { error: "Card not found" } }
    
    const lastCard = await Card.findOne({ listId: cardToCopy.listId })
      .sort({ order: -1 }) // Descending order
      .select({ order: 1 }) // Select the order field

    const newOrder = lastCard ? lastCard.order + 1 : 0

    const card = new Card({
      title: `${cardToCopy.title} - Copy`,
      description: cardToCopy.description,
      listId: cardToCopy.listId,
      order: newOrder
    })

    await card.save()

    await List.findByIdAndUpdate(
      card.listId,
      { $push: { cards: card._id }
    })

    revalidatePath(`/board/${boardId}`)
    return { data: { title: card.title } }

  } catch (error) {
    return { error: "Failed to copy" }
  }
}