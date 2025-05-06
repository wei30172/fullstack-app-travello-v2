import mongoose from "mongoose"

export const userLimitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  askAiCount: {
    type: Number,
    default: 0
  },
  boardCoverCount: {
    type: Number,
    default: 0
  }
})

const UserLimit = mongoose.models?.UserLimit || mongoose.model("UserLimit", userLimitSchema)

export { UserLimit }