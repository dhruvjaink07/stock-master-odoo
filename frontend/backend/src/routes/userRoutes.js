import express from "express"
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js"
import { protect, authorize } from "../middleware/auth.js"

const router = express.Router()

router.use(protect)

router.route("/").get(getUsers).post(authorize("admin"), createUser)

router.route("/:id").put(updateUser).delete(authorize("admin"), deleteUser)

export default router
