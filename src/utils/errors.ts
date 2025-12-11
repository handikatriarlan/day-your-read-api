export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors?: Record<string, any>
  ) {
    super(message)
    this.name = "AppError"
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed", errors?: Record<string, any>) {
    super(message, 422, errors)
    this.name = "ValidationError"
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404)
    this.name = "NotFoundError"
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401)
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403)
    this.name = "ForbiddenError"
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists", errors?: Record<string, any>) {
    super(message, 409, errors)
    this.name = "ConflictError"
  }
}
