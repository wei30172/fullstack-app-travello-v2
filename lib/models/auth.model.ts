import mongoose from "mongoose"

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String
  },
  image: {
    type: String
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  provider: {
    type: String,
    enum: ["google", "credentials"],
    default: "credentials"
  },
  emailVerified: {
    type: Date
  },
  isTwoFactorEnabled: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

const User = mongoose.models?.User || mongoose.model("User", userSchema)


const twoFactorTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  token: {
    type: String,
    unique: true,
    required: true
  },
  expires: {
    type: Date,
    required: true
  }
})

const TwoFactorToken = mongoose.models?.TwoFactorToken || mongoose.model("TwoFactorToken", twoFactorTokenSchema)


export const twoFactorConfirmationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true
  }
})

const TwoFactorConfirmation = mongoose.models?.TwoFactorConfirmation || mongoose.model("TwoFactorConfirmation", twoFactorConfirmationSchema)


export { User, TwoFactorToken, TwoFactorConfirmation }