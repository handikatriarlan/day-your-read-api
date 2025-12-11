import type { Context } from "hono"
import prisma from "../../prisma/helper"
import { ApiResponse } from "../utils/response"
import { NotFoundError, ValidationError } from "../utils/errors"

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
      throw new NotFoundError("User not found")
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
      throw new ValidationError("Name is required")
    }

    if (name.trim().length > 100) {
      throw new ValidationError("Name must be at most 100 characters")
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
      throw new ValidationError("Current password and new password are required")
    }

    if (newPassword.length < 6) {
      throw new ValidationError("New password must be at least 6 characters")
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    })

    if (!user || !user.password) {
      throw new NotFoundError("User not found")
    }

    const isPasswordValid = await Bun.password.verify(currentPassword, user.password)

    if (!isPasswordValid) {
      throw new ValidationError("Current password is incorrect")
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
