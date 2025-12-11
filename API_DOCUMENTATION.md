# Day Your Read API

A comprehensive RESTful API for a diary/journal application built with Hono, Prisma, and Bun.

## Features

- 🔐 **Authentication & Authorization**: JWT-based authentication
- 📝 **Diary Management**: Create, read, update, delete diary entries
- 🏷️ **Tags System**: Organize diaries with custom tags
- 😊 **Mood Tracking**: Track your mood with each diary entry
- 📊 **Statistics**: Get insights about your diary writing habits
- 🔍 **Advanced Filtering**: Filter diaries by date, mood, tags, and search
- 📄 **Pagination**: Efficient pagination for large datasets
- ✅ **Validation**: Comprehensive input validation with Zod
- 🛡️ **Error Handling**: Consistent error responses across the API

## Tech Stack

- **Runtime**: Bun
- **Framework**: Hono
- **Database**: MySQL with Prisma ORM
- **Validation**: Zod
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Bun installed
- MySQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Copy `.env.example` to `.env` and configure your environment variables:
   ```bash
   cp .env.example .env
   ```

4. Run database migrations:
   ```bash
   bunx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   bun run dev
   ```

The API will be available at `http://localhost:3000`

## API Endpoints

### Health Check

#### GET /
Get API information

**Response:**
```json
{
  "success": true,
  "message": "Welcome to Day Your Read API",
  "version": "1.0.0",
  "documentation": "/api/health"
}
```

#### GET /api/health
Check API health status

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-12-11T05:10:24.000Z"
}
```

### Authentication

#### POST /api/auth/register
Register a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2025-12-11T05:10:24.000Z",
    "updatedAt": "2025-12-11T05:10:24.000Z"
  }
}
```

#### POST /api/auth/login
Login with existing credentials

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2025-12-11T05:10:24.000Z",
      "updatedAt": "2025-12-11T05:10:24.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### User Profile

All user endpoints require authentication via Bearer token.

#### GET /api/user/profile
Get current user profile

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2025-12-11T05:10:24.000Z",
    "updatedAt": "2025-12-11T05:10:24.000Z",
    "diariesCount": 15,
    "tagsCount": 5
  }
}
```

#### PUT /api/user/profile
Update user profile

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "John Updated",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2025-12-11T05:10:24.000Z",
    "updatedAt": "2025-12-11T05:15:24.000Z"
  }
}
```

#### POST /api/user/change-password
Change user password

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Diaries

All diary endpoints require authentication via Bearer token.

#### POST /api/diaries
Create a new diary entry

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "My Amazing Day",
  "content": "Today was a great day. I learned a lot and had fun!",
  "mood": "HAPPY",
  "isPublic": false,
  "tagIds": [1, 2]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Diary created successfully",
  "data": {
    "id": 1,
    "title": "My Amazing Day",
    "content": "Today was a great day. I learned a lot and had fun!",
    "mood": "HAPPY",
    "isPublic": false,
    "userId": 1,
    "createdAt": "2025-12-11T05:10:24.000Z",
    "updatedAt": "2025-12-11T05:10:24.000Z",
    "tags": [
      {
        "id": 1,
        "name": "Personal",
        "color": "#3B82F6"
      },
      {
        "id": 2,
        "name": "Learning",
        "color": "#10B981"
      }
    ],
    "user": {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe"
    }
  }
}
```

#### GET /api/diaries
Get all diaries with filtering and pagination

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10, max: 100) - Items per page
- `mood` (string) - Filter by mood (HAPPY, SAD, EXCITED, etc.)
- `tagIds` (string) - Comma-separated tag IDs (e.g., "1,2,3")
- `startDate` (ISO date) - Filter entries from this date
- `endDate` (ISO date) - Filter entries until this date
- `search` (string) - Search in title and content
- `isPublic` (boolean) - Filter by public/private status
- `sortBy` (string, default: "createdAt") - Sort field (createdAt, updatedAt, title)
- `sortOrder` (string, default: "desc") - Sort order (asc, desc)

**Example:**
```
GET /api/diaries?page=1&limit=10&mood=HAPPY&search=great&sortBy=createdAt&sortOrder=desc
```

**Response (200):**
```json
{
  "success": true,
  "message": "Diaries retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "My Amazing Day",
      "content": "Today was a great day...",
      "mood": "HAPPY",
      "isPublic": false,
      "userId": 1,
      "createdAt": "2025-12-11T05:10:24.000Z",
      "updatedAt": "2025-12-11T05:10:24.000Z",
      "tags": [
        {
          "id": 1,
          "name": "Personal",
          "color": "#3B82F6"
        }
      ],
      "attachmentsCount": 2
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

#### GET /api/diaries/:id
Get a specific diary entry

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Diary retrieved successfully",
  "data": {
    "id": 1,
    "title": "My Amazing Day",
    "content": "Today was a great day. I learned a lot and had fun!",
    "mood": "HAPPY",
    "isPublic": false,
    "userId": 1,
    "createdAt": "2025-12-11T05:10:24.000Z",
    "updatedAt": "2025-12-11T05:10:24.000Z",
    "tags": [
      {
        "id": 1,
        "name": "Personal",
        "color": "#3B82F6"
      }
    ],
    "attachments": [],
    "user": {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe"
    }
  }
}
```

#### PUT /api/diaries/:id
Update a diary entry

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "mood": "GRATEFUL",
  "isPublic": true,
  "tagIds": [1, 3]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Diary updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Title",
    "content": "Updated content",
    "mood": "GRATEFUL",
    "isPublic": true,
    "userId": 1,
    "createdAt": "2025-12-11T05:10:24.000Z",
    "updatedAt": "2025-12-11T05:20:24.000Z",
    "tags": [
      {
        "id": 1,
        "name": "Personal",
        "color": "#3B82F6"
      },
      {
        "id": 3,
        "name": "Gratitude",
        "color": "#F59E0B"
      }
    ],
    "user": {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe"
    }
  }
}
```

#### DELETE /api/diaries/:id
Delete a diary entry

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Diary deleted successfully"
}
```

#### GET /api/diaries/stats
Get diary statistics

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Stats retrieved successfully",
  "data": {
    "totalDiaries": 15,
    "recentDiaries": 3,
    "moodDistribution": [
      {
        "mood": "HAPPY",
        "count": 5
      },
      {
        "mood": "GRATEFUL",
        "count": 3
      },
      {
        "mood": "CALM",
        "count": 2
      }
    ],
    "topTags": [
      {
        "tag": {
          "id": 1,
          "name": "Personal",
          "color": "#3B82F6"
        },
        "count": 8
      },
      {
        "tag": {
          "id": 2,
          "name": "Learning",
          "color": "#10B981"
        },
        "count": 5
      }
    ]
  }
}
```

### Tags

All tag endpoints require authentication via Bearer token.

#### POST /api/tags
Create a new tag

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Work",
  "color": "#EF4444"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Tag created successfully",
  "data": {
    "id": 4,
    "name": "Work",
    "color": "#EF4444",
    "createdAt": "2025-12-11T05:10:24.000Z",
    "usageCount": 0
  }
}
```

#### GET /api/tags
Get all tags

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `search` (string) - Search tags by name

**Response (200):**
```json
{
  "success": true,
  "message": "Tags retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Personal",
      "color": "#3B82F6",
      "createdAt": "2025-12-11T05:00:00.000Z",
      "usageCount": 8
    },
    {
      "id": 2,
      "name": "Learning",
      "color": "#10B981",
      "createdAt": "2025-12-11T05:00:00.000Z",
      "usageCount": 5
    }
  ]
}
```

#### GET /api/tags/:id
Get a specific tag

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Tag retrieved successfully",
  "data": {
    "id": 1,
    "name": "Personal",
    "color": "#3B82F6",
    "createdAt": "2025-12-11T05:00:00.000Z",
    "usageCount": 8,
    "recentDiaries": [
      {
        "id": 10,
        "title": "Recent Entry",
        "createdAt": "2025-12-11T05:10:24.000Z"
      }
    ]
  }
}
```

#### PUT /api/tags/:id
Update a tag

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Work Projects",
  "color": "#DC2626"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Tag updated successfully",
  "data": {
    "id": 4,
    "name": "Work Projects",
    "color": "#DC2626",
    "createdAt": "2025-12-11T05:00:00.000Z",
    "usageCount": 3
  }
}
```

#### DELETE /api/tags/:id
Delete a tag

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Tag deleted successfully"
}
```

## Mood Types

Available mood options for diary entries:
- `HAPPY`
- `SAD`
- `EXCITED`
- `ANXIOUS`
- `CALM`
- `ANGRY`
- `GRATEFUL`
- `TIRED`
- `MOTIVATED`
- `CONFUSED`

## Error Responses

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": {
    "field": "Field-specific error message"
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity (Validation Error)
- `500` - Internal Server Error

## Validation Rules

### User Registration
- `name`: 1-100 characters
- `username`: 3-32 characters, alphanumeric and underscore only
- `email`: Valid email format
- `password`: 6-128 characters

### Diary Entry
- `title`: Required, 1-255 characters
- `content`: Required, 1-50000 characters
- `mood`: Optional, must be one of the valid mood types
- `isPublic`: Optional, boolean (default: false)
- `tagIds`: Optional, array of positive integers

### Tag
- `name`: Required, 1-50 characters, alphanumeric, spaces, hyphens, underscores
- `color`: Optional, valid hex color code (e.g., #FF5733)

## Best Practices

1. **Authentication**: Always include the Bearer token in the Authorization header
2. **Pagination**: Use pagination for list endpoints to optimize performance
3. **Filtering**: Combine multiple filters for precise data retrieval
4. **Error Handling**: Check the `success` field in responses and handle errors appropriately
5. **Validation**: The API validates all inputs - refer to error messages for fixing issues

## Security

- Passwords are hashed using Bun's password hashing
- JWT tokens expire after 1 hour
- All protected routes require valid authentication
- Users can only access their own data

## Database Schema

The application uses the following main models:
- **User**: User accounts and authentication
- **Diary**: Diary entries with mood and privacy settings
- **Tag**: Custom tags for organizing diaries
- **DiaryTag**: Many-to-many relationship between diaries and tags
- **Attachment**: File attachments for diaries (schema ready, implementation pending)

## License

MIT
