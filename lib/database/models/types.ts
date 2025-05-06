export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MEMBER = "member"
}

export enum UserProvider {
  GOOGLE = "google",
  CREDENTIALS = "credentials"
}

export enum BoardRole {
  VIEWER = "viewer",
  EDITOR = "editor",
  OWNER = "owner"
}

export enum TokenStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  EXPIRED = "expired"
}

export enum CountType {
  ASK_AI_COUNT = "askAiCount",
  BOARD_COVER_COUNT = "boardCoverCount"
}

export interface IUser {
  _id: string
  name: string
  email: string
  password?: string
  image?: string
  role: UserRole
  provider: UserProvider
  emailVerified: Date
  isTwoFactorEnabled: boolean
  emailPendingVerification?: string
  createdAt: Date
  updatedAt: Date
}

export interface TwoFactorConfirmation {
  _id: string
  userId: string
}

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

export interface IList {
  _id: string
  title: string
  order: number
  boardId: string
  cards?: string[]
  createdAt?: Date
  updatedAt?: Date
}

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

export interface ListWithCards {
  _id: string
  title: string
  order: number
  boardId: string
  cards: ICard[]
  createdAt?: Date
  updatedAt?: Date
}

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

export interface IUserLimit {
  _id: string
  userId: string
  askAiCount: number
  boardCoverCount: number
}