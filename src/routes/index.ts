import { Hono } from "hono"
import { validateBody } from "../middlewares/validate.middleware"
import { registerSchema, loginSchema } from "../schemas/auth.schema"
import { register } from "../controllers/registerController"
import { login } from "../controllers/loginController"
import { diaryRoutes } from "./diary.routes"
import { tagRoutes } from "./tag.routes"
import { userRoutes } from "./user.routes"

const router = new Hono()

// Health check
router.get("/health", (c) => {
  return c.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  })
})

// Auth routes (public)
router.post("/auth/register", validateBody(registerSchema), register)
router.post("/auth/login", validateBody(loginSchema), login)

// Protected routes
router.route("/diaries", diaryRoutes)
router.route("/tags", tagRoutes)
router.route("/user", userRoutes)

export const Routes = router
