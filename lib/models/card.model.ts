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
  }
}, { timestamps: true })

const Card = mongoose.models.Card || mongoose.model("Card", cardSchema)

export default Card
