import express from "express"
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js"
import { protect, authorize } from "../middleware/auth.js"
import { validateRequest } from "../middleware/validateRequest.js"
import { productSchema } from "../validators/schemas.js"

const router = express.Router()

router.use(protect)

router.route("/").get(getProducts).post(authorize("admin", "manager"), validateRequest(productSchema), createProduct)

router.route("/:id").put(authorize("admin", "manager"), updateProduct).delete(authorize("admin"), deleteProduct)

export default router
