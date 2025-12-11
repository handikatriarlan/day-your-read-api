import type { MiddlewareHandler } from "hono"
import { verify } from "hono/jwt"
import { ApiResponse } from "../utils/response"

export const verifyToken: MiddlewareHandler = async (c, next) => {
  const header =
    c.req.header("Authorization") || c.req.header("authorization") || ""
  const token = header.startsWith("Bearer ")
    ? header.slice(7).trim()
    : header.trim()

  if (!token) {
    return ApiResponse.unauthorized(c, "Authentication token required")
  }

  try {
    const secret = process.env.JWT_SECRET || "default"
    const payload = await verify(token, secret)

    const userId = (payload as any).id ?? (payload as any).sub
    
    if (!userId) {
      return ApiResponse.unauthorized(c, "Invalid token payload")
    }
    
    c.set("userId", userId)

    await next()
  } catch (error) {
    console.error("Token verification error:", error)
    return ApiResponse.unauthorized(c, "Invalid or expired token")
  }
}
