// Board role enum
export enum BoardRole {
  VIEWER = "viewer",
  EDITOR = "editor",
  OWNER = "owner"
}

// Board interface
export interface IBoard {
  _id: string
  userId: string
  title: string
  location: string
  startDate: Date
  endDate: Date
  imageUrl?: string
  lists?: string[]
  viewers: string[]
  editors: string[]
  isArchived: boolean
  createdAt?: Date
  updatedAt?: Date
  role?: BoardRole
}

// List interface
export interface IList {
  _id: string
  title: string
  order: number
  boardId: string
  cards?: string[]
  createdAt?: Date
  updatedAt?: Date
}

// Card interface
export interface ICard {
  _id: string
  title: string
  order: number
  description?: string
  listId: string
  isCompleted: boolean
  color: string
  createdAt?: Date
  updatedAt?: Date
}

// List with cards
export interface ListWithCards {
  _id: string
  title: string
  order: number
  boardId: string
  cards: ICard[]
  createdAt?: Date
  updatedAt?: Date
}

// Card with list
export interface CardWithList {
  _id: string
  title: string
  order: number
  description?: string
  listId: string
  isCompleted: boolean
  createdAt?: Date
  updatedAt?: Date
  list: { title: string }
  role?: BoardRole
}