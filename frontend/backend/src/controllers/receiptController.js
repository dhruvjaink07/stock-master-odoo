import Receipt from "../models/Receipt.js"
import Product from "../models/Product.js"
import StockLedger from "../models/StockLedger.js"

const generateReceiptNumber = () => {
  return `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export const getReceipts = async (req, res, next) => {
  try {
    const receipts = await Receipt.find()
      .populate("product", "sku name")
      .populate("warehouse", "name code")
      .populate("receivedBy", "name")
      .sort("-createdAt")
    res.status(200).json({ success: true, data: receipts })
  } catch (error) {
    next(error)
  }
}

export const createReceipt = async (req, res, next) => {
  try {
    const { product: productId, warehouse, quantity } = req.body

    // Generate receipt number
    const receiptNumber = generateReceiptNumber()

    // Create receipt
    const receipt = await Receipt.create({
      ...req.body,
      receiptNumber,
      receivedBy: req.user._id,
    })

    // Update product stock
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    const quantityBefore = product.quantity
    product.quantity += quantity
    await product.save()

    // Create stock ledger entry
    await StockLedger.create({
      product: productId,
      warehouse,
      operationType: "receipt",
      operationId: receipt._id,
      quantityBefore,
      quantityChange: quantity,
      quantityAfter: product.quantity,
      reference: receiptNumber,
      notes: req.body.notes,
      performedBy: req.user._id,
    })

    const populated = await receipt.populate(["product", "warehouse", "receivedBy"])
    res.status(201).json({ success: true, data: populated })
  } catch (error) {
    next(error)
  }
}

export const updateReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate(["product", "warehouse", "receivedBy"])

    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" })
    }

    res.status(200).json({ success: true, data: receipt })
  } catch (error) {
    next(error)
  }
}

export const deleteReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findByIdAndDelete(req.params.id)

    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" })
    }

    res.status(200).json({ success: true, message: "Receipt deleted" })
  } catch (error) {
    next(error)
  }
}
