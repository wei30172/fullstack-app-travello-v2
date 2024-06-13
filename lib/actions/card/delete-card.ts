"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Card } from "@/lib/models/card.model"
import { List } from "@/lib/models/list.model"
import { DeleteCardValidation } from "@/lib/validations/card"

type DeleteCardInput = z.infer<typeof DeleteCardValidation>

export const deleteCard = async (
  values: DeleteCardInput
) => {
  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: "Unauthorized" }
  }

  const validatedFields = DeleteCardValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { id, boardId } = validatedFields.data

  try {
    await connectDB()
    
    const card = await Card.findById(id)
    
    if (!card) {
      return { error: "Card not found" }
    }
  
    // Delete the Card itself
    await Card.findByIdAndDelete(id)

    // Remove the List's reference to the Card
    await List.findByIdAndUpdate(card.listId, {
      $pull: { cards: id }
    })

    revalidatePath(`/board/${boardId}`)
    return { data: { title: card.title } }

  } catch (error) {
    return { error: "Failed to delete" }
  }
}