import type { Context } from "hono"

interface SuccessResponse<T = any> {
  success: true
  message: string
  data?: T
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

interface ErrorResponse {
  success: false
  message: string
  errors?: Record<string, any>
}

export class ApiResponse {
  static success<T = any>(
    c: Context,
    data?: T,
    message: string = "Success",
    statusCode: number = 200,
    meta?: SuccessResponse["meta"]
  ) {
    const response: SuccessResponse<T> = {
      success: true,
      message,
    }

    if (data !== undefined) {
      response.data = data
    }

    if (meta) {
      response.meta = meta
    }

    return c.json(response, statusCode as any)
  }

  static created<T = any>(c: Context, data?: T, message: string = "Created successfully") {
    return this.success(c, data, message, 201)
  }

  static error(
    c: Context,
    message: string = "An error occurred",
    statusCode: number = 500,
    errors?: Record<string, any>
  ) {
    const response: ErrorResponse = {
      success: false,
      message,
    }

    if (errors) {
      response.errors = errors
    }

    return c.json(response, statusCode as any)
  }

  static badRequest(c: Context, message: string = "Bad request", errors?: Record<string, any>) {
    return this.error(c, message, 400, errors)
  }

  static unauthorized(c: Context, message: string = "Unauthorized") {
    return this.error(c, message, 401)
  }

  static forbidden(c: Context, message: string = "Forbidden") {
    return this.error(c, message, 403)
  }

  static notFound(c: Context, message: string = "Resource not found") {
    return this.error(c, message, 404)
  }

  static conflict(c: Context, message: string = "Resource already exists", errors?: Record<string, any>) {
    return this.error(c, message, 409, errors)
  }

  static unprocessable(c: Context, message: string = "Unprocessable entity", errors?: Record<string, any>) {
    return this.error(c, message, 422, errors)
  }

  static internalError(c: Context, message: string = "Internal server error") {
    return this.error(c, message, 500)
  }
}
