import mongoose from "mongoose"

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "List",
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: ""
  }
}, { timestamps: true })

const Card = mongoose.models.Card || mongoose.model("Card", cardSchema)

export { Card }
