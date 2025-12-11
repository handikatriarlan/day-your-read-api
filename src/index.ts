import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import { Routes } from "./routes"
import { ApiResponse } from "./utils/response"
import { 
  AppError, 
  ValidationError, 
  NotFoundError, 
  UnauthorizedError, 
  ForbiddenError, 
  ConflictError 
} from "./utils/errors"

const app = new Hono()

// Middlewares
app.use("*", logger())
app.use("*", prettyJSON())
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
)

// API routes
app.route("/api", Routes)

// Root endpoint
app.get("/", (c) => {
  return c.json({
    success: true,
    message: "Welcome to Day Your Read API",
    version: "1.0.0",
    documentation: "/api/health",
  })
})

// 404 handler
app.notFound((c) => {
  return ApiResponse.notFound(c, "Endpoint not found")
})

// Global error handler
app.onError((err, c) => {
  console.error("Global error:", err)
  
  // Handle custom application errors
  if (err instanceof ValidationError) {
    return ApiResponse.unprocessable(c, err.message, err.errors)
  }
  
  if (err instanceof NotFoundError) {
    return ApiResponse.notFound(c, err.message)
  }
  
  if (err instanceof UnauthorizedError) {
    return ApiResponse.unauthorized(c, err.message)
  }
  
  if (err instanceof ForbiddenError) {
    return ApiResponse.forbidden(c, err.message)
  }
  
  if (err instanceof ConflictError) {
    return ApiResponse.conflict(c, err.message, err.errors)
  }
  
  if (err instanceof AppError) {
    return c.json({
      success: false,
      message: err.message,
      errors: err.errors,
    }, err.statusCode as any)
  }
  
  // Handle database constraint errors
  if (err.message.includes("Unique constraint")) {
    return ApiResponse.conflict(c, "Resource already exists")
  }
  
  if (err.message.includes("Foreign key constraint")) {
    return ApiResponse.badRequest(c, "Invalid reference to related resource")
  }
  
  // Default error response
  return ApiResponse.internalError(c, "An unexpected error occurred")
})

export default app
