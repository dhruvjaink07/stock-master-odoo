import express from "express"
import { getReceipts, createReceipt, updateReceipt, deleteReceipt } from "../controllers/receiptController.js"
import { protect } from "../middleware/auth.js"
import { validateRequest } from "../middleware/validateRequest.js"
import { receiptSchema } from "../validators/schemas.js"

const router = express.Router()

router.use(protect)

router.route("/").get(getReceipts).post(validateRequest(receiptSchema), createReceipt)

router.route("/:id").put(updateReceipt).delete(deleteReceipt)

export default router
