import { Hono } from "hono"
import { verifyToken } from "../middlewares/auth.middleware"
import { getProfile, updateProfile, changePassword } from "../controllers/userController"

const router = new Hono()

// All user routes require authentication
router.use("/*", verifyToken)

// Get user profile
router.get("/profile", getProfile)

// Update user profile
router.put("/profile", updateProfile)

// Change password
router.post("/change-password", changePassword)

export const userRoutes = router
