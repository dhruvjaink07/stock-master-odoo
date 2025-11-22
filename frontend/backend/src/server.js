import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import { errorHandler } from "./middleware/errorHandler.js"
import { seedDatabase } from "./seed/seedData.js"

// Import routes
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import warehouseRoutes from "./routes/warehouseRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import receiptRoutes from "./routes/receiptRoutes.js"
import deliveryRoutes from "./routes/deliveryRoutes.js"
import transferRoutes from "./routes/transferRoutes.js"
import adjustmentRoutes from "./routes/adjustmentRoutes.js"
import stockLedgerRoutes from "./routes/stockLedgerRoutes.js"
import kpiRoutes from "./routes/kpiRoutes.js"

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/warehouses", warehouseRoutes)
app.use("/api/v1/categories", categoryRoutes)
app.use("/api/v1/products", productRoutes)
app.use("/api/v1/receipts", receiptRoutes)
app.use("/api/v1/deliveries", deliveryRoutes)
app.use("/api/v1/transfers", transferRoutes)
app.use("/api/v1/adjustments", adjustmentRoutes)
app.use("/api/v1/stock-ledger", stockLedgerRoutes)
app.use("/api/v1/kpis", kpiRoutes)

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "StockMaster API is running" })
})

// Error handler (must be last)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDB()
    await seedDatabase()

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
