import mongoose from "mongoose"

const boardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  }]
}, { timestamps: true })

const Board = mongoose.models.Board || mongoose.model("Board", boardSchema)

export default Board