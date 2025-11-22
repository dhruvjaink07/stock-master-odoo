import express from "express"
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js"
import { protect, authorize } from "../middleware/auth.js"
import { validateRequest } from "../middleware/validateRequest.js"
import { categorySchema } from "../validators/schemas.js"

const router = express.Router()

router.use(protect)

router
  .route("/")
  .get(getCategories)
  .post(authorize("admin", "manager"), validateRequest(categorySchema), createCategory)

router.route("/:id").put(authorize("admin", "manager"), updateCategory).delete(authorize("admin"), deleteCategory)

export default router
