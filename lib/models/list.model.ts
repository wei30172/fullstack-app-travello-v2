import mongoose from "mongoose"

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true
  },
  cards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Card"
  }]
}, { timestamps: true })

const List = mongoose.models.List || mongoose.model("List", listSchema)

export default List