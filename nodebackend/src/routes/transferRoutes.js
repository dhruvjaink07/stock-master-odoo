import express from "express"
import { getTransfers, createTransfer, updateTransfer, deleteTransfer } from "../controllers/transferController.js"
import { protect } from "../middleware/auth.js"
import { validateRequest } from "../middleware/validateRequest.js"
import { transferSchema } from "../validators/schemas.js"

const router = express.Router()

router.use(protect)

router.route("/").get(getTransfers).post(validateRequest(transferSchema), createTransfer)

router.route("/:id").put(updateTransfer).delete(deleteTransfer)

export default router
