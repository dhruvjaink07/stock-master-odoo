import express from "express"
import { getKPIs } from "../controllers/kpiController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

router.use(protect)

router.get("/", getKPIs)

export default router
