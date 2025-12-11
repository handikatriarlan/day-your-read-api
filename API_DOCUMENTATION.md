# Day Your Read - API Documentation

> **Complete REST API Reference v1.0**

Backend API for [Day Your Read](https://github.com/handikatriarlan/day-your-read) - A modern digital diary application.

---

## 📋 Quick Reference

**Base URL**: `http://localhost:3000`  
**Authentication**: JWT Bearer Token  
**Content-Type**: `application/json`  
**API Version**: 1.0

### Endpoint Summary

| Category | Endpoints | Auth Required |
|----------|-----------|---------------|
| **Health** | 2 endpoints | ❌ |
| **Authentication** | 2 endpoints | ❌ |
| **User Profile** | 3 endpoints | ✅ |
| **Diaries** | 6 endpoints | ✅ |
| **Tags** | 5 endpoints | ✅ |

---

## 🔐 Authentication

### How It Works

1. **Register** or **Login** to receive a JWT token
2. Include token in `Authorization` header for protected endpoints:
   ```http
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Token expires after **1 hour** - login again to refresh

### Protected Endpoints

All endpoints except Health Check and Authentication require a valid JWT token.

---

## 📡 API Endpoints

### Health Check

#### `GET /`

**Description**: API welcome message  
**Auth**: Not required

**Response**:
```json
{
  "success": true,
  "message": "Welcome to Day Your Read API",
  "version": "1.0.0",
  "documentation": "/api/health"
}
```

---

#### `GET /api/health`

**Description**: Health status check  
**Auth**: Not required

**Response**:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-12-11T05:10:24.000Z"
}
```

---

### Authentication

#### `POST /api/auth/register`

**Description**: Create new user account  
**Auth**: Not required

**Request Body**:
```json
{
  "name": "John Doe",           // optional, 1-100 chars
  "username": "johndoe",        // required, 3-32 chars, unique
  "email": "john@example.com",  // required, valid email, unique
  "password": "password123"     // required, 6-128 chars
}
```

**Success Response** `201`:
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

**Error Responses**:
- `409 Conflict`: Username or email already exists
- `422 Unprocessable Entity`: Validation failed

---

#### `POST /api/auth/login`

**Description**: Login and receive JWT token  
**Auth**: Not required

**Request Body**:
```json
{
  "username": "johndoe",      // required
  "password": "password123"   // required
}
```

**Success Response** `200`:
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

**Error Response**:
- `401 Unauthorized`: Invalid credentials

---

### User Profile

All user endpoints require authentication.

#### `GET /api/user/profile`

**Description**: Get current user profile with statistics  
**Auth**: Required

**Headers**:
```http
Authorization: Bearer YOUR_TOKEN
```

**Response** `200`:
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

---

#### `PUT /api/user/profile`

**Description**: Update user profile name  
**Auth**: Required

**Request Body**:
```json
{
  "name": "John Updated"  // required, 1-100 chars
}
```

**Response** `200`:
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

---

#### `POST /api/user/change-password`

**Description**: Change account password  
**Auth**: Required

**Request Body**:
```json
{
  "currentPassword": "password123",  // required
  "newPassword": "newpassword456"    // required, min 6 chars
}
```

**Response** `200`:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Response**:
- `422 Unprocessable Entity`: Current password incorrect

---

### Diaries

All diary endpoints require authentication.

#### `POST /api/diaries`

**Description**: Create new diary entry  
**Auth**: Required

**Request Body**:
```json
{
  "title": "My Amazing Day",            // required, 1-255 chars
  "content": "Today was great...",      // required, 1-50000 chars
  "mood": "HAPPY",                      // optional, see Mood Types
  "isPublic": false,                    // optional, default: false
  "tagIds": [1, 2]                      // optional, array of tag IDs
}
```

**Response** `201`:
```json
{
  "success": true,
  "message": "Diary created successfully",
  "data": {
    "id": 1,
    "title": "My Amazing Day",
    "content": "Today was great...",
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
    "user": {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe"
    }
  }
}
```

---

#### `GET /api/diaries`

**Description**: Get all diaries with filtering and pagination  
**Auth**: Required

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 100) |
| `mood` | string | - | Filter by mood |
| `tagIds` | string | - | Comma-separated tag IDs (e.g., "1,2,3") |
| `startDate` | ISO date | - | Filter from date |
| `endDate` | ISO date | - | Filter until date |
| `search` | string | - | Search in title and content |
| `isPublic` | boolean | - | Filter by public/private |
| `sortBy` | string | createdAt | Sort field (createdAt, updatedAt, title) |
| `sortOrder` | string | desc | Sort order (asc, desc) |

**Example Request**:
```
GET /api/diaries?page=1&limit=10&mood=HAPPY&search=amazing&sortBy=createdAt&sortOrder=desc
```

**Response** `200`:
```json
{
  "success": true,
  "message": "Diaries retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "My Amazing Day",
      "content": "Today was great...",
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
      "attachmentsCount": 0
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

---

#### `GET /api/diaries/stats`

**Description**: Get diary writing statistics  
**Auth**: Required

**Response** `200`:
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
      }
    ]
  }
}
```

---

#### `GET /api/diaries/:id`

**Description**: Get specific diary by ID  
**Auth**: Required

**URL Parameters**:
- `id` (number): Diary ID

**Response** `200`:
```json
{
  "success": true,
  "message": "Diary retrieved successfully",
  "data": {
    "id": 1,
    "title": "My Amazing Day",
    "content": "Today was great...",
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

**Error Response**:
- `404 Not Found`: Diary doesn't exist or doesn't belong to user

---

#### `PUT /api/diaries/:id`

**Description**: Update diary entry  
**Auth**: Required

**URL Parameters**:
- `id` (number): Diary ID

**Request Body** (all fields optional):
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "mood": "GRATEFUL",
  "isPublic": true,
  "tagIds": [1, 3]
}
```

**Response** `200`:
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

---

#### `DELETE /api/diaries/:id`

**Description**: Delete diary entry  
**Auth**: Required

**URL Parameters**:
- `id` (number): Diary ID

**Response** `200`:
```json
{
  "success": true,
  "message": "Diary deleted successfully"
}
```

**Error Response**:
- `404 Not Found`: Diary doesn't exist or doesn't belong to user

---

### Tags

All tag endpoints require authentication.

#### `POST /api/tags`

**Description**: Create new tag  
**Auth**: Required

**Request Body**:
```json
{
  "name": "Work",              // required, 1-50 chars, unique per user
  "color": "#EF4444"           // optional, hex color code, default: #6B7280
}
```

**Response** `201`:
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

**Error Response**:
- `409 Conflict`: Tag name already exists for user

---

#### `GET /api/tags`

**Description**: Get all user tags  
**Auth**: Required

**Query Parameters**:
- `search` (string, optional): Search tags by name

**Response** `200`:
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
      "name": "Work",
      "color": "#EF4444",
      "createdAt": "2025-12-11T05:05:00.000Z",
      "usageCount": 5
    }
  ]
}
```

---

#### `GET /api/tags/:id`

**Description**: Get tag with usage statistics  
**Auth**: Required

**URL Parameters**:
- `id` (number): Tag ID

**Response** `200`:
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

**Error Response**:
- `404 Not Found`: Tag doesn't exist or doesn't belong to user

---

#### `PUT /api/tags/:id`

**Description**: Update tag  
**Auth**: Required

**URL Parameters**:
- `id` (number): Tag ID

**Request Body** (all fields optional):
```json
{
  "name": "Work Projects",
  "color": "#DC2626"
}
```

**Response** `200`:
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

**Error Response**:
- `409 Conflict`: New tag name already exists for user

---

#### `DELETE /api/tags/:id`

**Description**: Delete tag (removes from all diaries)  
**Auth**: Required

**URL Parameters**:
- `id` (number): Tag ID

**Response** `200`:
```json
{
  "success": true,
  "message": "Tag deleted successfully"
}
```

**Error Response**:
- `404 Not Found`: Tag doesn't exist or doesn't belong to user

---

## 📊 Data Models

### Mood Types

| Mood | Description |
|------|-------------|
| `HAPPY` | Joyful and content |
| `SAD` | Down or melancholic |
| `EXCITED` | Full of enthusiasm |
| `ANXIOUS` | Worried or nervous |
| `CALM` | Peaceful and relaxed |
| `ANGRY` | Frustrated or upset |
| `GRATEFUL` | Appreciative and thankful |
| `TIRED` | Exhausted or fatigued |
| `MOTIVATED` | Driven and inspired |
| `CONFUSED` | Uncertain or puzzled |

---

## ✅ Validation Rules

### User Registration

| Field | Type | Rules |
|-------|------|-------|
| `name` | string | Optional, 1-100 characters |
| `username` | string | Required, 3-32 characters, alphanumeric + underscore, unique |
| `email` | string | Required, valid email format, unique |
| `password` | string | Required, 6-128 characters |

### Diary Entry

| Field | Type | Rules |
|-------|------|-------|
| `title` | string | Required, 1-255 characters |
| `content` | string | Required, 1-50,000 characters |
| `mood` | enum | Optional, must be valid mood type |
| `isPublic` | boolean | Optional, default: false |
| `tagIds` | array | Optional, array of positive integers |

### Tag

| Field | Type | Rules |
|-------|------|-------|
| `name` | string | Required, 1-50 characters, unique per user |
| `color` | string | Optional, valid hex color code (e.g., #FF5733) |

---

## 🔄 HTTP Status Codes

| Code | Name | Description |
|------|------|-------------|
| `200` | OK | Successful GET, PUT, DELETE |
| `201` | Created | Successful POST |
| `400` | Bad Request | Invalid request format |
| `401` | Unauthorized | Missing/invalid token |
| `403` | Forbidden | Authenticated but not authorized |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate resource |
| `422` | Unprocessable Entity | Validation failed |
| `500` | Internal Server Error | Server error |

---

## 🧪 Testing Examples

### Complete Workflow

```bash
# 1. Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","username":"janedoe","email":"jane@example.com","password":"pass123"}'

# 2. Login and get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"janedoe","password":"pass123"}'

# Save token
export TOKEN="eyJhbGci..."

# 3. Create tag
curl -X POST http://localhost:3000/api/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Personal","color":"#3B82F6"}'

# 4. Create diary
curl -X POST http://localhost:3000/api/diaries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"My Day","content":"Amazing day!","mood":"HAPPY","tagIds":[1]}'

# 5. Get all diaries
curl -X GET "http://localhost:3000/api/diaries?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# 6. Get statistics
curl -X GET http://localhost:3000/api/diaries/stats \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📚 Additional Resources

- **Main Documentation**: [README.md](./README.md)
- **Frontend Repository**: [day-your-read](https://github.com/handikatriarlan/day-your-read)
- **Testing Collection**: Check `/bruno` folder for complete Bruno API collection

---

## 🔗 Related Links

- **GitHub**: [@handikatriarlan](https://github.com/handikatriarlan)
- **Frontend**: [day-your-read](https://github.com/handikatriarlan/day-your-read)
- **Backend**: [day-your-read-api](https://github.com/handikatriarlan/day-your-read-api)

---

<div align="center">

**Last Updated**: December 11, 2025  
**API Version**: 1.0  
**Made with ❤️ by [Handika Tri Arlan](https://github.com/handikatriarlan)**

</div>
