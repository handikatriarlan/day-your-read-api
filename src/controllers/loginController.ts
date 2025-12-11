import type { Context } from "hono"
import prisma from "../../prisma/helper"
import type { LoginRequest } from "../types/auth"
import { sign } from "hono/jwt"
import { ApiResponse } from "../utils/response"

export const login = async (c: Context) => {
  try {
    const { username, password } = c.get("validatedBody") as LoginRequest

    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return ApiResponse.unauthorized(c, "User not found")
    }

    const isPasswordValid = user.password
      ? await Bun.password.verify(password, user.password)
      : false

    if (!isPasswordValid) {
      return ApiResponse.unauthorized(c, "Invalid password")
    }

    const payload = {
      sub: user.id,
      username: user.username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    }

    const secret = process.env.JWT_SECRET || "default"
    const token = await sign(payload, secret)
    const { password: _, ...userData } = user

    return ApiResponse.success(
      c,
      {
        user: userData,
        token: token,
      },
      "Login successful"
    )
  } catch (error) {
    console.error("Login error:", error)
    return ApiResponse.internalError(c, "Failed to login")
  }
}
