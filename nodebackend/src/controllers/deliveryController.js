import Delivery from "../models/Delivery.js"
import Product from "../models/Product.js"
import StockLedger from "../models/StockLedger.js"

const generateDeliveryNumber = () => {
  return `DEL-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export const getDeliveries = async (req, res, next) => {
  try {
    const deliveries = await Delivery.find()
      .populate("product", "sku name")
      .populate("warehouse", "name code")
      .populate("deliveredBy", "name")
      .sort("-createdAt")
    res.status(200).json({ success: true, data: deliveries })
  } catch (error) {
    next(error)
  }
}

export const createDelivery = async (req, res, next) => {
  try {
    const { product: productId, warehouse, quantity } = req.body

    // Check if product has enough stock
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock for delivery" })
    }

    // Generate delivery number
    const deliveryNumber = generateDeliveryNumber()

    // Create delivery
    const delivery = await Delivery.create({
      ...req.body,
      deliveryNumber,
      deliveredBy: req.user._id,
    })

    // Update product stock
    const quantityBefore = product.quantity
    product.quantity -= quantity
    await product.save()

    // Create stock ledger entry
    await StockLedger.create({
      product: productId,
      warehouse,
      operationType: "delivery",
      operationId: delivery._id,
      quantityBefore,
      quantityChange: -quantity,
      quantityAfter: product.quantity,
      reference: deliveryNumber,
      notes: req.body.notes,
      performedBy: req.user._id,
    })

    const populated = await delivery.populate(["product", "warehouse", "deliveredBy"])
    res.status(201).json({ success: true, data: populated })
  } catch (error) {
    next(error)
  }
}

export const updateDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate(["product", "warehouse", "deliveredBy"])

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" })
    }

    res.status(200).json({ success: true, data: delivery })
  } catch (error) {
    next(error)
  }
}

export const deleteDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id)

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" })
    }

    res.status(200).json({ success: true, message: "Delivery deleted" })
  } catch (error) {
    next(error)
  }
}
