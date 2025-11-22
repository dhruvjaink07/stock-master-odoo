import StockLedger from "../models/StockLedger.js"

export const getStockLedger = async (req, res, next) => {
  try {
    const { product, warehouse, operationType, startDate, endDate } = req.query

    const query = {}

    if (product) query.product = product
    if (warehouse) query.warehouse = warehouse
    if (operationType) query.operationType = operationType

    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) query.createdAt.$lte = new Date(endDate)
    }

    const ledgerEntries = await StockLedger.find(query)
      .populate("product", "sku name")
      .populate("warehouse", "name code")
      .populate("performedBy", "name")
      .sort("-createdAt")
      .limit(1000)

    res.status(200).json({ success: true, data: ledgerEntries })
  } catch (error) {
    next(error)
  }
}
