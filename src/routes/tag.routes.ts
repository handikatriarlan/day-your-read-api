import { Hono } from "hono"
import { validateBody } from "../middlewares/validate.middleware"
import { verifyToken } from "../middlewares/auth.middleware"
import { createTagSchema, updateTagSchema } from "../schemas/diary.schema"
import {
  createTag,
  getTags,
  getTagById,
  updateTag,
  deleteTag,
} from "../controllers/tagController"

const router = new Hono()

// All tag routes require authentication
router.use("/*", verifyToken)

// Get all tags
router.get("/", getTags)

// Create a new tag
router.post("/", validateBody(createTagSchema), createTag)

// Get a specific tag
router.get("/:id", getTagById)

// Update a tag
router.put("/:id", validateBody(updateTagSchema), updateTag)

// Delete a tag
router.delete("/:id", deleteTag)

export const tagRoutes = router
