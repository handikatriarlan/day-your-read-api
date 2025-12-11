import type { Context } from "hono"
import prisma from "../../prisma/helper"
import { ApiResponse } from "../utils/response"

export const getProfile = async (c: Context) => {
  try {
    const userId = c.get("userId") as number

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            diaries: true,
            tags: true,
          },
        },
      },
    })

    if (!user) {
      return ApiResponse.notFound(c, "User not found")
    }

    const formattedUser = {
      ...user,
      diariesCount: user._count.diaries,
      tagsCount: user._count.tags,
      _count: undefined,
    }
    delete formattedUser._count

    return ApiResponse.success(c, formattedUser, "Profile retrieved successfully")
  } catch (error) {
    console.error("Get profile error:", error)
    return ApiResponse.internalError(c, "Failed to retrieve profile")
  }
}

export const updateProfile = async (c: Context) => {
  try {
    const userId = c.get("userId") as number
    const { name } = await c.req.json()

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return ApiResponse.badRequest(c, "Name is required")
    }

    if (name.trim().length > 100) {
      return ApiResponse.badRequest(c, "Name must be at most 100 characters")
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return ApiResponse.success(c, user, "Profile updated successfully")
  } catch (error) {
    console.error("Update profile error:", error)
    return ApiResponse.internalError(c, "Failed to update profile")
  }
}

export const changePassword = async (c: Context) => {
  try {
    const userId = c.get("userId") as number
    const { currentPassword, newPassword } = await c.req.json()

    if (!currentPassword || !newPassword) {
      return ApiResponse.badRequest(c, "Current password and new password are required")
    }

    if (newPassword.length < 6) {
      return ApiResponse.badRequest(c, "New password must be at least 6 characters")
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    })

    if (!user || !user.password) {
      return ApiResponse.notFound(c, "User not found")
    }

    const isPasswordValid = await Bun.password.verify(currentPassword, user.password)

    if (!isPasswordValid) {
      return ApiResponse.badRequest(c, "Current password is incorrect")
    }

    const hashedPassword = await Bun.password.hash(newPassword)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return ApiResponse.success(c, null, "Password changed successfully")
  } catch (error) {
    console.error("Change password error:", error)
    return ApiResponse.internalError(c, "Failed to change password")
  }
}
