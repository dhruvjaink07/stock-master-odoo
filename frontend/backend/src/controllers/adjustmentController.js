import Adjustment from "../models/Adjustment.js"
import Product from "../models/Product.js"
import StockLedger from "../models/StockLedger.js"

const generateAdjustmentNumber = () => {
  return `ADJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export const getAdjustments = async (req, res, next) => {
  try {
    const adjustments = await Adjustment.find()
      .populate("product", "sku name")
      .populate("warehouse", "name code")
      .populate("adjustedBy", "name")
      .sort("-createdAt")
    res.status(200).json({ success: true, data: adjustments })
  } catch (error) {
    next(error)
  }
}

export const createAdjustment = async (req, res, next) => {
  try {
    const { product: productId, warehouse, quantityAfter, adjustmentType, reason, notes } = req.body

    // Get current product
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    const quantityBefore = product.quantity
    const quantityChange = quantityAfter - quantityBefore

    // Generate adjustment number
    const adjustmentNumber = generateAdjustmentNumber()

    // Create adjustment
    const adjustment = await Adjustment.create({
      adjustmentNumber,
      product: productId,
      warehouse,
      quantityBefore,
      quantityAfter,
      adjustmentType,
      reason,
      notes,
      adjustedBy: req.user._id,
    })

    // Update product stock
    product.quantity = quantityAfter
    await product.save()

    // Create stock ledger entry
    await StockLedger.create({
      product: productId,
      warehouse,
      operationType: "adjustment",
      operationId: adjustment._id,
      quantityBefore,
      quantityChange,
      quantityAfter,
      reference: adjustmentNumber,
      notes: `${adjustmentType}: ${reason || notes}`,
      performedBy: req.user._id,
    })

    const populated = await adjustment.populate(["product", "warehouse", "adjustedBy"])
    res.status(201).json({ success: true, data: populated })
  } catch (error) {
    next(error)
  }
}

export const updateAdjustment = async (req, res, next) => {
  try {
    const adjustment = await Adjustment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate(["product", "warehouse", "adjustedBy"])

    if (!adjustment) {
      return res.status(404).json({ message: "Adjustment not found" })
    }

    res.status(200).json({ success: true, data: adjustment })
  } catch (error) {
    next(error)
  }
}

export const deleteAdjustment = async (req, res, next) => {
  try {
    const adjustment = await Adjustment.findByIdAndDelete(req.params.id)

    if (!adjustment) {
      return res.status(404).json({ message: "Adjustment not found" })
    }

    res.status(200).json({ success: true, message: "Adjustment deleted" })
  } catch (error) {
    next(error)
  }
}
