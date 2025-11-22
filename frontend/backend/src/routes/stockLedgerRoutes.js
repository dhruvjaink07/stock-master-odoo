import express from "express"
import { getStockLedger } from "../controllers/stockLedgerController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

router.use(protect)

router.get("/", getStockLedger)

export default router
