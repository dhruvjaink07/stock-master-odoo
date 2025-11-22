import express from "express"
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } from "../controllers/warehouseController.js"
import { protect, authorize } from "../middleware/auth.js"
import { validateRequest } from "../middleware/validateRequest.js"
import { warehouseSchema } from "../validators/schemas.js"

const router = express.Router()

router.use(protect)

router
  .route("/")
  .get(getWarehouses)
  .post(authorize("admin", "manager"), validateRequest(warehouseSchema), createWarehouse)

router.route("/:id").put(authorize("admin", "manager"), updateWarehouse).delete(authorize("admin"), deleteWarehouse)

export default router
