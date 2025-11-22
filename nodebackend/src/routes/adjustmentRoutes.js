import express from "express"
import {
  getAdjustments,
  createAdjustment,
  updateAdjustment,
  deleteAdjustment,
} from "../controllers/adjustmentController.js"
import { protect } from "../middleware/auth.js"
import { validateRequest } from "../middleware/validateRequest.js"
import { adjustmentSchema } from "../validators/schemas.js"

const router = express.Router()

router.use(protect)

router.route("/").get(getAdjustments).post(validateRequest(adjustmentSchema), createAdjustment)

router.route("/:id").put(updateAdjustment).delete(deleteAdjustment)

export default router
