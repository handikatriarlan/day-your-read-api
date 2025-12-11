import { z } from "zod"

export const moodEnum = z.enum([
  "HAPPY",
  "SAD",
  "EXCITED",
  "ANXIOUS",
  "CALM",
  "ANGRY",
  "GRATEFUL",
  "TIRED",
  "MOTIVATED",
  "CONFUSED",
])

export const createDiarySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be at most 255 characters"),
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(50000, "Content must be at most 50000 characters"),
  mood: moodEnum.optional(),
  isPublic: z.boolean().optional().default(false),
  tagIds: z.array(z.number().int().positive()).optional(),
})

export const updateDiarySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(255, "Title must be at most 255 characters")
    .optional(),
  content: z
    .string()
    .trim()
    .min(1, "Content cannot be empty")
    .max(50000, "Content must be at most 50000 characters")
    .optional(),
  mood: moodEnum.nullable().optional(),
  isPublic: z.boolean().optional(),
  tagIds: z.array(z.number().int().positive()).optional(),
})

export const getDiariesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  mood: moodEnum.optional(),
  tagIds: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id))
    )
    .optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  search: z.string().trim().optional(),
  isPublic: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "title"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
})

export const createTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tag name is required")
    .max(50, "Tag name must be at most 50 characters")
    .regex(
      /^[a-zA-Z0-9\s_-]+$/,
      "Tag name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color code (e.g., #FF5733)")
    .optional(),
})

export const updateTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tag name cannot be empty")
    .max(50, "Tag name must be at most 50 characters")
    .regex(
      /^[a-zA-Z0-9\s_-]+$/,
      "Tag name can only contain letters, numbers, spaces, hyphens, and underscores"
    )
    .optional(),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color code (e.g., #FF5733)")
    .optional(),
})
