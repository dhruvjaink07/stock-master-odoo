import Product from "../models/Product.js"
import Receipt from "../models/Receipt.js"
import Delivery from "../models/Delivery.js"
import Transfer from "../models/Transfer.js"

export const getKPIs = async (req, res, next) => {
  try {
    // Total products
    const totalProducts = await Product.countDocuments()

    // Get all products to calculate stock levels
    const allProducts = await Product.find()

    const lowStockCount = allProducts.filter((p) => p.quantity > 0 && p.quantity <= p.minStockLevel).length

    const outOfStockCount = allProducts.filter((p) => p.quantity === 0).length

    // Pending operations
    const pendingReceipts = await Receipt.countDocuments({ status: "pending" })
    const pendingDeliveries = await Delivery.countDocuments({
      status: { $in: ["pending", "picked", "packed"] },
    })
    const pendingTransfers = await Transfer.countDocuments({
      status: { $in: ["pending", "in-transit"] },
    })

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        lowStockCount,
        outOfStockCount,
        pendingReceipts,
        pendingDeliveries,
        pendingTransfers,
        totalValue: allProducts.reduce((sum, p) => sum + (p.price || 0) * p.quantity, 0),
      },
    })
  } catch (error) {
    next(error)
  }
}
