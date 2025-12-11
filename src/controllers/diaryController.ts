import type { Context } from "hono"
import prisma from "../../prisma/helper"
import type { CreateDiaryRequest, UpdateDiaryRequest } from "../types/diary"
import { ApiResponse } from "../utils/response"
import { NotFoundError, ForbiddenError } from "../utils/errors"

export const createDiary = async (c: Context) => {
  try {
    const userId = c.get("userId") as number
    const { title, content, mood, isPublic, tagIds } = c.get(
      "validatedBody"
    ) as CreateDiaryRequest

    // Validate tags belong to user if provided
    if (tagIds && tagIds.length > 0) {
      const validTags = await prisma.tag.findMany({
        where: {
          id: { in: tagIds },
          userId,
        },
        select: { id: true },
      })

      if (validTags.length !== tagIds.length) {
        return ApiResponse.badRequest(c, "One or more tags are invalid or don't belong to you")
      }
    }

    // Create diary with tags
    const diary = await prisma.diary.create({
      data: {
        title,
        content,
        mood: mood || null,
        isPublic: isPublic ?? false,
        userId,
        diaryTags: tagIds
          ? {
              create: tagIds.map((tagId) => ({
                tagId,
              })),
            }
          : undefined,
      },
      include: {
        diaryTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    })

    // Format response
    const formattedDiary = {
      ...diary,
      tags: diary.diaryTags.map((dt) => dt.tag),
      diaryTags: undefined,
    }
    delete formattedDiary.diaryTags

    return ApiResponse.created(c, formattedDiary, "Diary created successfully")
  } catch (error) {
    console.error("Create diary error:", error)
    return ApiResponse.internalError(c, "Failed to create diary")
  }
}

export const getDiaries = async (c: Context) => {
  try {
    const userId = c.get("userId") as number
    const query = c.get("validatedQuery") as any

    const {
      page = 1,
      limit = 10,
      mood,
      tagIds,
      startDate,
      endDate,
      search,
      isPublic,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      userId,
    }

    if (mood) {
      where.mood = mood
    }

    if (isPublic !== undefined) {
      where.isPublic = isPublic
    }

    if (tagIds && tagIds.length > 0) {
      where.diaryTags = {
        some: {
          tagId: { in: tagIds },
        },
      }
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = startDate
      }
      if (endDate) {
        where.createdAt.lte = endDate
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ]
    }

    // Get total count
    const total = await prisma.diary.count({ where })

    // Get diaries
    const diaries = await prisma.diary.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        diaryTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
        _count: {
          select: {
            attachments: true,
          },
        },
      },
    })

    // Format response
    const formattedDiaries = diaries.map((diary) => ({
      ...diary,
      tags: diary.diaryTags.map((dt) => dt.tag),
      attachmentsCount: diary._count.attachments,
      diaryTags: undefined,
      _count: undefined,
    }))

    return ApiResponse.success(
      c,
      formattedDiaries,
      "Diaries retrieved successfully",
      200,
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    )
  } catch (error) {
    console.error("Get diaries error:", error)
    return ApiResponse.internalError(c, "Failed to retrieve diaries")
  }
}

export const getDiaryById = async (c: Context) => {
  try {
    const userId = c.get("userId") as number
    const id = parseInt(c.req.param("id"))

    if (isNaN(id)) {
      return ApiResponse.badRequest(c, "Invalid diary ID")
    }

    const diary = await prisma.diary.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        diaryTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
        attachments: {
          select: {
            id: true,
            filename: true,
            url: true,
            fileType: true,
            fileSize: true,
            createdAt: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    })

    if (!diary) {
      return ApiResponse.notFound(c, "Diary not found")
    }

    // Format response
    const formattedDiary = {
      ...diary,
      tags: diary.diaryTags.map((dt) => dt.tag),
      diaryTags: undefined,
    }
    delete formattedDiary.diaryTags

    return ApiResponse.success(c, formattedDiary, "Diary retrieved successfully")
  } catch (error) {
    console.error("Get diary error:", error)
    return ApiResponse.internalError(c, "Failed to retrieve diary")
  }
}

export const updateDiary = async (c: Context) => {
  try {
    const userId = c.get("userId") as number
    const id = parseInt(c.req.param("id"))

    if (isNaN(id)) {
      return ApiResponse.badRequest(c, "Invalid diary ID")
    }

    const { title, content, mood, isPublic, tagIds } = c.get(
      "validatedBody"
    ) as UpdateDiaryRequest

    // Check if diary exists and belongs to user
    const existingDiary = await prisma.diary.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existingDiary) {
      return ApiResponse.notFound(c, "Diary not found")
    }

    // Validate tags if provided
    if (tagIds && tagIds.length > 0) {
      const validTags = await prisma.tag.findMany({
        where: {
          id: { in: tagIds },
          userId,
        },
        select: { id: true },
      })

      if (validTags.length !== tagIds.length) {
        return ApiResponse.badRequest(c, "One or more tags are invalid or don't belong to you")
      }
    }

    // Update diary
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (mood !== undefined) updateData.mood = mood
    if (isPublic !== undefined) updateData.isPublic = isPublic

    // Handle tags update
    const diary = await prisma.$transaction(async (tx) => {
      // Update diary
      const updatedDiary = await tx.diary.update({
        where: { id },
        data: updateData,
      })

      // Update tags if provided
      if (tagIds !== undefined) {
        // Delete existing tags
        await tx.diaryTag.deleteMany({
          where: { diaryId: id },
        })

        // Create new tags
        if (tagIds.length > 0) {
          await tx.diaryTag.createMany({
            data: tagIds.map((tagId) => ({
              diaryId: id,
              tagId,
            })),
          })
        }
      }

      // Fetch complete diary with relations
      return tx.diary.findUnique({
        where: { id },
        include: {
          diaryTags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  color: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      })
    })

    // Format response
    const formattedDiary = {
      ...diary,
      tags: diary?.diaryTags.map((dt) => dt.tag),
      diaryTags: undefined,
    }
    delete formattedDiary.diaryTags

    return ApiResponse.success(c, formattedDiary, "Diary updated successfully")
  } catch (error) {
    console.error("Update diary error:", error)
    return ApiResponse.internalError(c, "Failed to update diary")
  }
}

export const deleteDiary = async (c: Context) => {
  try {
    const userId = c.get("userId") as number
    const id = parseInt(c.req.param("id"))

    if (isNaN(id)) {
      return ApiResponse.badRequest(c, "Invalid diary ID")
    }

    // Check if diary exists and belongs to user
    const existingDiary = await prisma.diary.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existingDiary) {
      return ApiResponse.notFound(c, "Diary not found")
    }

    // Delete diary (cascade will handle related records)
    await prisma.diary.delete({
      where: { id },
    })

    return ApiResponse.success(c, null, "Diary deleted successfully")
  } catch (error) {
    console.error("Delete diary error:", error)
    return ApiResponse.internalError(c, "Failed to delete diary")
  }
}

export const getDiaryStats = async (c: Context) => {
  try {
    const userId = c.get("userId") as number

    const [totalDiaries, moodStats, recentDiaries, tagsUsage] = await Promise.all([
      // Total diaries
      prisma.diary.count({ where: { userId } }),

      // Mood distribution
      prisma.diary.groupBy({
        by: ["mood"],
        where: { userId, mood: { not: null } },
        _count: true,
      }),

      // Recent activity (last 7 days)
      prisma.diary.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Most used tags
      prisma.diaryTag.groupBy({
        by: ["tagId"],
        where: {
          diary: { userId },
        },
        _count: true,
        orderBy: {
          _count: {
            tagId: "desc",
          },
        },
        take: 5,
      }),
    ])

    // Get tag details
    const tagIds = tagsUsage.map((t) => t.tagId)
    const tags = await prisma.tag.findMany({
      where: { id: { in: tagIds } },
      select: { id: true, name: true, color: true },
    })

    const tagMap = new Map(tags.map((t) => [t.id, t]))
    const topTags = tagsUsage.map((t) => ({
      tag: tagMap.get(t.tagId),
      count: t._count,
    }))

    const stats = {
      totalDiaries,
      recentDiaries,
      moodDistribution: moodStats.map((m) => ({
        mood: m.mood,
        count: m._count,
      })),
      topTags,
    }

    return ApiResponse.success(c, stats, "Stats retrieved successfully")
  } catch (error) {
    console.error("Get stats error:", error)
    return ApiResponse.internalError(c, "Failed to retrieve stats")
  }
}
