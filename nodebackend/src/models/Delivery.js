import mongoose from "mongoose"

const deliverySchema = new mongoose.Schema(
  {
    deliveryNumber: {
      type: String,
      required: true,
      unique: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    customer: String,
    destination: String,
    status: {
      type: String,
      enum: ["pending", "picked", "packed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    notes: String,
    deliveredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deliveredAt: Date,
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("Delivery", deliverySchema)
