import mongoose from "mongoose"

export const userLimitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
})

const UserLimit = mongoose.models?.UserLimit || mongoose.model("UserLimit", userLimitSchema)

export { UserLimit }