"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/database/db"
import { currentUser } from "@/lib/session"
import { Card } from "@/lib/database/models/card.model"
import { List } from "@/lib/database/models/list.model"
import { 
  UpdateCardOrderFormValues,
  getUpdateCardOrderSchema
} from "@/lib/validations/card"

export const updateCardOrder = async (
  values: UpdateCardOrderFormValues
) => {
  const tError = await getTranslations("Common.error")

  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: tError("unauthorized") }
  }

  const validatedFields = getUpdateCardOrderSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: tError("invalidFields") }
  }

  const { cards, boardId, } = validatedFields.data

  try {
    await connectDB()

    const updateOperations = cards.map(async (card) => {
      const currentCard = await Card.findById(card._id)
      if (!currentCard) throw new Error(tError("cardNotFound"))

      const sourceListId = currentCard.listId
      const destListId = card.listId

      if (sourceListId.toString() !== destListId.toString()) {
        // Remove card ID from source list
        await List.updateOne(
          { _id: sourceListId },
          { $pull: { cards: card._id } }
        )

        // Add card ID to destination list
        await List.updateOne(
          { _id: destListId },
          { $push: { cards: card._id } }
        )
      }

      // Update the card's order and listId
      return Card.updateOne(
        { _id: card._id },
        { $set: { order: card.order, listId: card.listId } }
      )
    })

    // Executes multiple promises in parallel,
    // returning a single promise that resolves when all of the input promises have resolved,
    // or rejects if any input promise rejects.
    await Promise.all(updateOperations)

    revalidatePath(`/board/${boardId}`)
    return { data: { id: boardId } }

  } catch (error) {
    return { error:
      (error instanceof Error && error.message) ||
      tError("actionFailed") }
  }
}