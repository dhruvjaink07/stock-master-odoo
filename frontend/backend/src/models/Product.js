import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: [true, "Warehouse is required"],
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    minStockLevel: {
      type: Number,
      default: 10,
    },
    unit: {
      type: String,
      default: "pcs",
    },
    price: Number,
    description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Virtual for stock status
productSchema.virtual("stockStatus").get(function () {
  if (this.quantity === 0) return "OUT_OF_STOCK"
  if (this.quantity <= this.minStockLevel) return "LOW_STOCK"
  return "IN_STOCK"
})

productSchema.set("toJSON", { virtuals: true })
productSchema.set("toObject", { virtuals: true })

export default mongoose.model("Product", productSchema)
