import express from "express"
import { getDeliveries, createDelivery, updateDelivery, deleteDelivery } from "../controllers/deliveryController.js"
import { protect } from "../middleware/auth.js"
import { validateRequest } from "../middleware/validateRequest.js"
import { deliverySchema } from "../validators/schemas.js"

const router = express.Router()

router.use(protect)

router.route("/").get(getDeliveries).post(validateRequest(deliverySchema), createDelivery)

router.route("/:id").put(updateDelivery).delete(deleteDelivery)

export default router
