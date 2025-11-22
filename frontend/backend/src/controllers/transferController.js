import Transfer from "../models/Transfer.js"
import Product from "../models/Product.js"
import StockLedger from "../models/StockLedger.js"

const generateTransferNumber = () => {
  return `TRF-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export const getTransfers = async (req, res, next) => {
  try {
    const transfers = await Transfer.find()
      .populate("product", "sku name")
      .populate("fromWarehouse", "name code")
      .populate("toWarehouse", "name code")
      .populate("transferredBy", "name")
      .sort("-createdAt")
    res.status(200).json({ success: true, data: transfers })
  } catch (error) {
    next(error)
  }
}

export const createTransfer = async (req, res, next) => {
  try {
    const { product: productId, fromWarehouse, toWarehouse, quantity } = req.body

    if (fromWarehouse === toWarehouse) {
      return res.status(400).json({ message: "Cannot transfer to the same warehouse" })
    }

    // Check source product stock
    const sourceProduct = await Product.findOne({
      _id: productId,
      warehouse: fromWarehouse,
    })

    if (!sourceProduct) {
      return res.status(404).json({ message: "Product not found in source warehouse" })
    }

    if (sourceProduct.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock in source warehouse" })
    }

    // Generate transfer number
    const transferNumber = generateTransferNumber()

    // Create transfer
    const transfer = await Transfer.create({
      ...req.body,
      transferNumber,
      transferredBy: req.user._id,
    })

    // Update source product stock
    const sourceQuantityBefore = sourceProduct.quantity
    sourceProduct.quantity -= quantity
    await sourceProduct.save()

    // Create ledger entry for source
    await StockLedger.create({
      product: productId,
      warehouse: fromWarehouse,
      operationType: "transfer",
      operationId: transfer._id,
      quantityBefore: sourceQuantityBefore,
      quantityChange: -quantity,
      quantityAfter: sourceProduct.quantity,
      reference: transferNumber,
      notes: `Transfer to ${toWarehouse}`,
      performedBy: req.user._id,
    })

    // Check if product exists in destination warehouse
    const destProduct = await Product.findOne({
      _id: productId,
      warehouse: toWarehouse,
    })

    if (destProduct) {
      // Update existing product
      const destQuantityBefore = destProduct.quantity
      destProduct.quantity += quantity
      await destProduct.save()

      // Create ledger entry for destination
      await StockLedger.create({
        product: productId,
        warehouse: toWarehouse,
        operationType: "transfer",
        operationId: transfer._id,
        quantityBefore: destQuantityBefore,
        quantityChange: quantity,
        quantityAfter: destProduct.quantity,
        reference: transferNumber,
        notes: `Transfer from ${fromWarehouse}`,
        performedBy: req.user._id,
      })
    }

    const populated = await transfer.populate(["product", "fromWarehouse", "toWarehouse", "transferredBy"])
    res.status(201).json({ success: true, data: populated })
  } catch (error) {
    next(error)
  }
}

export const updateTransfer = async (req, res, next) => {
  try {
    const transfer = await Transfer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate(["product", "fromWarehouse", "toWarehouse", "transferredBy"])

    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" })
    }

    res.status(200).json({ success: true, data: transfer })
  } catch (error) {
    next(error)
  }
}

export const deleteTransfer = async (req, res, next) => {
  try {
    const transfer = await Transfer.findByIdAndDelete(req.params.id)

    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" })
    }

    res.status(200).json({ success: true, message: "Transfer deleted" })
  } catch (error) {
    next(error)
  }
}
