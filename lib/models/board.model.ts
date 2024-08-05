import mongoose from "mongoose"
import { BoardRole, TokenStatus } from "@/lib/models/types"

const boardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  imageUrl: {
    type: String
  },
  lists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "List"
  }],
  viewers: {
    type: [String],
    default: [],
  },
  editors: {
    type: [String],
    default: [],
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

const Board = mongoose.models.Board || mongoose.model("Board", boardSchema)

const invitationSchema = new mongoose.Schema({
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: [BoardRole.VIEWER, BoardRole.EDITOR],
    default: BoardRole.VIEWER
  },
  token: {
    type: String,
    unique: true,
    required: true
  },
  expires: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: [TokenStatus.PENDING, TokenStatus.ACCEPTED, TokenStatus.EXPIRED],
    default: TokenStatus.PENDING
  }
}, { timestamps: true })

const Invitation = mongoose.models.Invitation || mongoose.model("Invitation", invitationSchema)

const mediaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
}, { timestamps: true })

const Media = mongoose.models.Media || mongoose.model("Media", mediaSchema)

export { Board, Invitation, Media }