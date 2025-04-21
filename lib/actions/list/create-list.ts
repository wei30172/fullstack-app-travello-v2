"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { currentUser } from "@/lib/session"
import { Board } from "@/lib/models/board.model"
import { List } from "@/lib/models/list.model"
import { IList } from "@/lib/models/types"
import { 
  CreateListFormValues,
  getCreateListSchema
} from "@/lib/validations/list"
import { createCard } from "@/lib/actions/card/create-card"
import { deleteCard } from "@/lib/actions/card/delete-card"

export const createList = async (
  values: CreateListFormValues
) => {
  const tError = await getTranslations("Common.error")

  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: tError("unauthorized") }
  }

  const validatedFields = getCreateListSchema().safeParse(values)

  if (!validatedFields.success) {
    return {
      error: tError("invalidFields"),
      errors: validatedFields.error.flatten().fieldErrors
    }
  }

  const { title, boardId, cardTitles } = validatedFields.data

  try {
    await connectDB()

    const board = await Board.findById(boardId)

    if (!board) {
      return { error: tError("boardNotFound") }
    }

    if (
      board.userId.toString() !== user._id.toString() &&
      !board.editors.includes(user.email)
    ) {
      return { error: tError("unauthorized") }
    }
    
    const lastList = await List.findOne({ boardId })
      .sort({ order: -1 }) // Descending order
      .select({ order: 1 }) // Select the order field
    
    const newOrder = lastList ? lastList.order + 1 : 0

    const list: IList = new List({ title, boardId, order: newOrder })
    // console.log({list})

    await list.save()

    await Board.findByIdAndUpdate(
      boardId,
      { $push: { lists: list._id }
    })

    if (cardTitles && cardTitles?.length > 0) {
      // console.log({cardTitles})
      const cardPromises = cardTitles.map((title, index) => createCard({
        title,
        boardId,
        listId: list._id.toString(),
        order: index
      }))

      // Executes multiple promises in parallel,
      // returning a single promise that resolves after all of the input promises have either resolved or rejected,
      // with an array of objects describing the outcome of each promise.
      const cardResults = await Promise.allSettled(cardPromises)
      
      const failedCards = cardResults.filter(result => result.status === "rejected")
      
      if (failedCards.length > 0) {
        const succeededCards = cardResults.filter(result => result.status === "fulfilled") as PromiseFulfilledResult<any>[]
        const deletePromises = succeededCards.map(card => deleteCard({
          id: card.value.data._id,
          boardId
        }))

        await Promise.allSettled(deletePromises)
        throw new Error(tError("listAndCardsCreationFailed"))
      }
    }

    revalidatePath(`/board/${boardId}`)
    return { data: { title: list.title } }

  } catch (error) {
    return { error:
      (error instanceof Error && error.message) ||
      tError("actionFailed") }
  }
}