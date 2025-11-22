import mongoose from "mongoose"

const stockLedgerSchema = new mongoose.Schema(
  {
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
    operationType: {
      type: String,
      enum: ["receipt", "delivery", "transfer", "adjustment"],
      required: true,
    },
    operationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    quantityBefore: {
      type: Number,
      required: true,
    },
    quantityChange: {
      type: Number,
      required: true,
    },
    quantityAfter: {
      type: Number,
      required: true,
    },
    reference: String,
    notes: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
)

stockLedgerSchema.index({ product: 1, createdAt: -1 })

export default mongoose.model("StockLedger", stockLedgerSchema)
