import Product from "../models/Product.js"

export const getProducts = async (req, res, next) => {
  try {
    const { search, category, warehouse, stockStatus } = req.query

    const query = {}

    if (search) {
      query.$or = [{ sku: { $regex: search, $options: "i" } }, { name: { $regex: search, $options: "i" } }]
    }

    if (category) query.category = category
    if (warehouse) query.warehouse = warehouse

    let products = await Product.find(query).populate("category", "name").populate("warehouse", "name code")

    // Filter by stock status if provided
    if (stockStatus) {
      products = products.filter((p) => p.stockStatus === stockStatus)
    }

    res.status(200).json({ success: true, data: products })
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body)
    const populated = await product.populate(["category", "warehouse"])
    res.status(201).json({ success: true, data: populated })
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate(["category", "warehouse"])

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.status(200).json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.status(200).json({ success: true, message: "Product deleted" })
  } catch (error) {
    next(error)
  }
}
