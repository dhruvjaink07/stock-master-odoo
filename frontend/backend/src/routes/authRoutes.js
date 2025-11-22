import express from "express"
import { signup, login } from "../controllers/authController.js"
import { validateRequest } from "../middleware/validateRequest.js"
import { signupSchema, loginSchema } from "../validators/schemas.js"

const router = express.Router()

router.post("/signup", validateRequest(signupSchema), signup)
router.post("/login", validateRequest(loginSchema), login)

export default router
