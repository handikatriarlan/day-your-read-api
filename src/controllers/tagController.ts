import type { Context } from "hono"
import prisma from "../../prisma/helper"
import type { CreateTagRequest, UpdateTagRequest } from "../types/diary"
import { ApiResponse } from "../utils/response"

export const createTag = async (c: Context) => {
  try {
    const userId = c.get("userId") as number
    const { name, color } = c.get("validatedBody") as CreateTagRequest

    // Check if tag already exists for user
    const existing = await prisma.tag.findFirst({
      where: {
        userId,
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    })

    if (existing) {
      return ApiResponse.conflict(c, "Tag with this name already exists")
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        color: color || "#6B7280",
        userId,
      },
      select: {
        id: true,
        name: true,
        color: true,
        createdAt: true,
        _count: {
          select: {
            diaryTags: true,
          },
        },
      },
    })

    const formattedTag = {
      ...tag,
      usageCount: tag._count.diaryTags,
      _count: undefined,
    }
    delete formattedTag._count

    return ApiResponse.created(c, formattedTag, "Tag created successfully")
  } catch (error) {
    console.error("Create tag error:", error)
    return ApiResponse.internalError(c, "Failed to create tag")
  }
}

export const getTags = async (c: Context) => {
  try {
    const userId = c.get("userId") as number
    const search = c.req.query("search")

    const where: any = { userId }
    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      }
    }

    const tags = await prisma.tag.findMany({
      where,
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        color: true,
        createdAt: true,
        _count: {
          select: {
            diaryTags: true,
          },
        },
      },
    })

    const formattedTags = tags.map((tag) => ({
      ...tag,
      usageCount: tag._count.diaryTags,
      _count: undefined,
    }))

    formattedTags.forEach((tag) => delete tag._count)

    return ApiResponse.success(c, formattedTags, "Tags retrieved successfully")
  } catch (error) {
    console.error("Get tags error:", error)
    return ApiResponse.internalError(c, "Failed to retrieve tags")
  }
}

export const getTagById = async (c: Context) => {
  try {
    const userId = c.get("userId") as number
    const id = parseInt(c.req.param("id"))

    if (isNaN(id)) {
      return ApiResponse.badRequest(c, "Invalid tag ID")
    }

    const tag = await prisma.tag.findFirst({
      where: {
        id,
        userId,
      },
      select: {
        id: true,
        name: true,
        color: true,
        createdAt: true,
        _count: {
          select: {
            diaryTags: true,
          },
        },
        diaryTags: {
          select: {
            diary: {
              select: {
                id: true,
                title: true,
                createdAt: true,
              },
            },
          },
          take: 5,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!tag) {
      return ApiResponse.notFound(c, "Tag not found")
    }

    const formattedTag = {
      ...tag,
      usageCount: tag._count.diaryTags,
      recentDiaries: tag.diaryTags.map((dt) => dt.diary),
      _count: undefined,
      diaryTags: undefined,
    }
    delete formattedTag._count
    delete formattedTag.diaryTags

    return ApiResponse.success(c, formattedTag, "Tag retrieved successfully")
  } catch (error) {
    console.error("Get tag error:", error)
    return ApiResponse.internalError(c, "Failed to retrieve tag")
  }
}

export const updateTag = async (c: Context) => {
  try {
    const userId = c.get("userId") as number
    const id = parseInt(c.req.param("id"))

    if (isNaN(id)) {
      return ApiResponse.badRequest(c, "Invalid tag ID")
    }

    const { name, color } = c.get("validatedBody") as UpdateTagRequest

    // Check if tag exists and belongs to user
    const existingTag = await prisma.tag.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existingTag) {
      return ApiResponse.notFound(c, "Tag not found")
    }

    // Check if new name conflicts with another tag
    if (name && name.toLowerCase() !== existingTag.name.toLowerCase()) {
      const duplicate = await prisma.tag.findFirst({
        where: {
          userId,
          name: {
            equals: name,
            mode: "insensitive",
          },
          id: { not: id },
        },
      })

      if (duplicate) {
        return ApiResponse.conflict(c, "Tag with this name already exists")
      }
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (color !== undefined) updateData.color = color

    const tag = await prisma.tag.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        color: true,
        createdAt: true,
        _count: {
          select: {
            diaryTags: true,
          },
        },
      },
    })

    const formattedTag = {
      ...tag,
      usageCount: tag._count.diaryTags,
      _count: undefined,
    }
    delete formattedTag._count

    return ApiResponse.success(c, formattedTag, "Tag updated successfully")
  } catch (error) {
    console.error("Update tag error:", error)
    return ApiResponse.internalError(c, "Failed to update tag")
  }
}

export const deleteTag = async (c: Context) => {
  try {
    const userId = c.get("userId") as number
    const id = parseInt(c.req.param("id"))

    if (isNaN(id)) {
      return ApiResponse.badRequest(c, "Invalid tag ID")
    }

    // Check if tag exists and belongs to user
    const existingTag = await prisma.tag.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existingTag) {
      return ApiResponse.notFound(c, "Tag not found")
    }

    // Delete tag (cascade will handle diary_tags)
    await prisma.tag.delete({
      where: { id },
    })

    return ApiResponse.success(c, null, "Tag deleted successfully")
  } catch (error) {
    console.error("Delete tag error:", error)
    return ApiResponse.internalError(c, "Failed to delete tag")
  }
}
