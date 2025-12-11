import type { MiddlewareHandler } from "hono"
import { ApiResponse } from "../utils/response"

export const validateQuery = (schema: any): MiddlewareHandler => {
  return async (c, next) => {
    try {
      const query = c.req.query()
      const parsed = schema.parse(query)
      c.set("validatedQuery", parsed)
      await next()
    } catch (error: any) {
      const errors: Record<string, string> = {}
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const field = err.path.join(".")
          errors[field] = err.message
        })
      }
      return ApiResponse.unprocessable(c, "Query validation failed", errors)
    }
  }
}
