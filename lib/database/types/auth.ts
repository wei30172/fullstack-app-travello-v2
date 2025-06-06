// User role enum
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MEMBER = "member"
}

// User provider enum
export enum UserProvider {
  GOOGLE = "google",
  CREDENTIALS = "credentials"
}

// Token status enum
export enum TokenStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  EXPIRED = "expired"
}

// Count type enum
export enum CountType {
  ASK_AI_COUNT = "askAiCount",
  BOARD_COVER_COUNT = "boardCoverCount"
}

// User interface
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

// Two-factor confirmation
export interface ITwoFactorConfirmation {
  _id: string
  userId: string
}

// User limit interface
export interface IUserLimit {
  _id: string
  userId: string
  askAiCount: number
  boardCoverCount: number
}