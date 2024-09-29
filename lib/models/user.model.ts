import mongoose from "mongoose"

export const userLimitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
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

export const userSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true
  },
  stripeCustomerId: {
    type: String,
    unique: true,
    sparse: true,
    // The field must have a unique value, but with sparse: true, uniqueness is only enforced on documents 
    // where this field has a value. Documents where this field is null or missing will not trigger uniqueness errors.
    // This allows multiple documents to have null or missing values without violating the uniqueness constraint.
    alias: "stripe_customer_id"
  },
  stripeSubscriptionId: {
    type: String,
    unique: true,
    sparse: true,
    alias: "stripe_subscription_id"
  },
  stripePriceId: {
    type: String,
    sparse: true,
    // With sparse: true, indexes will only be created for documents where this field has a value.
    // Documents where this field is null or missing will not be indexed, improving performance for sparse datasets.
    alias: "stripe_price_id"
  },
  stripeCurrentPeriodEnd: {
    type: Date,
    sparse: true,
    alias: "stripe_current_period_end"
  }
})

const UserSubscription = mongoose.models?.UserSubscription || mongoose.model("UserSubscription", userSubscriptionSchema)

export { UserLimit, UserSubscription }