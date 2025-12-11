import { Hono } from "hono"
import { validateBody } from "../middlewares/validate.middleware"
import { validateQuery } from "../middlewares/validateQuery.middleware"
import { verifyToken } from "../middlewares/auth.middleware"
import {
  createDiarySchema,
  updateDiarySchema,
  getDiariesQuerySchema,
} from "../schemas/diary.schema"
import {
  createDiary,
  getDiaries,
  getDiaryById,
  updateDiary,
  deleteDiary,
  getDiaryStats,
} from "../controllers/diaryController"

const router = new Hono()

// All diary routes require authentication
router.use("/*", verifyToken)

// Get diary statistics
router.get("/stats", getDiaryStats)

// Get all diaries with filtering and pagination
router.get("/", validateQuery(getDiariesQuerySchema), getDiaries)

// Create a new diary
router.post("/", validateBody(createDiarySchema), createDiary)

// Get a specific diary
router.get("/:id", getDiaryById)

// Update a diary
router.put("/:id", validateBody(updateDiarySchema), updateDiary)

// Delete a diary
router.delete("/:id", deleteDiary)

export const diaryRoutes = router
