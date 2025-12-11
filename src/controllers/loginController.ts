import type { Context } from "hono"
import prisma from "../../prisma/helper"
import type { LoginRequest } from "../types/auth"
import { sign } from "hono/jwt"
import { ApiResponse } from "../utils/response"
import { UnauthorizedError } from "../utils/errors"

export const login = async (c: Context) => {
  try {
    const { username, password } = c.get("validatedBody") as LoginRequest

    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      throw new UnauthorizedError("Invalid username or password")
    }

    const isPasswordValid = user.password
      ? await Bun.password.verify(password, user.password)
      : false

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid username or password")
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
    if (error instanceof UnauthorizedError) {
      throw error
    }
    return ApiResponse.internalError(c, "Failed to login")
  }
}
