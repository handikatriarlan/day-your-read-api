import type { Context } from "hono"
import prisma from "../../prisma/helper"
import type { RegisterRequest } from "../types/auth"
import { ApiResponse } from "../utils/response"
import { ConflictError } from "../utils/errors"

export const register = async (c: Context) => {
  try {
    const { name, username, email, password } = c.get(
      "validatedBody"
    ) as RegisterRequest

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
      select: { id: true, email: true, username: true },
    })

    if (existing) {
      const conflictField =
        existing.email === email
          ? "email"
          : existing.username === username
          ? "username"
          : "email"
      const message = conflictField === "email"
        ? "Email already registered"
        : "Username already taken"
      throw new ConflictError(message, { [conflictField]: "Already in use" })
    }

    const hashedPassword = await Bun.password.hash(password)

    const user = await prisma.user.create({
      data: { name, username, email, password: hashedPassword },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return ApiResponse.created(c, user, "User registered successfully")
  } catch (err) {
    console.error("Register error:", err)
    if (err instanceof ConflictError) {
      throw err
    }
    return ApiResponse.internalError(c, "Failed to register user")
  }
}
