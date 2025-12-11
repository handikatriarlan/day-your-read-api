# Day Your Read API 📔

A comprehensive, production-ready RESTful API for a diary/journal application built with modern technologies.

## ✨ Features

- 🔐 **Secure Authentication**: JWT-based authentication with password hashing
- 📝 **Diary Management**: Full CRUD operations for diary entries
- 🏷️ **Tagging System**: Organize diaries with customizable colored tags
- 😊 **Mood Tracking**: Track emotions with 10 different mood types
- 📊 **Analytics & Statistics**: Get insights about writing habits and mood patterns
- 🔍 **Advanced Filtering**: Filter by date range, mood, tags, and search content
- 📄 **Pagination**: Efficient data loading with customizable page sizes
- ✅ **Input Validation**: Comprehensive validation using Zod schemas
- 🛡️ **Error Handling**: Consistent error responses with proper HTTP status codes
- 🌐 **CORS Support**: Ready for cross-origin requests
- 📝 **Pretty JSON**: Human-readable JSON responses in development
- 🚀 **High Performance**: Built on Bun runtime for maximum speed

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh/) - Fast all-in-one JavaScript runtime
- **Framework**: [Hono](https://hono.dev/) - Lightweight, ultra-fast web framework
- **Database**: MySQL with [Prisma ORM](https://www.prisma.io/)
- **Validation**: [Zod](https://zod.dev/) - TypeScript-first schema validation
- **Authentication**: JWT (JSON Web Tokens)

## 📋 Prerequisites

- [Bun](https://bun.sh/) (v1.0 or higher)
- MySQL database

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd day-your-read-api
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your database connection and JWT secret:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/day_your_read"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

4. **Run database migrations**
   ```bash
   bunx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   bun run dev
   ```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

For complete API documentation with examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick API Overview

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

#### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/change-password` - Change password

#### Diaries
- `GET /api/diaries` - Get all diaries (with filters & pagination)
- `POST /api/diaries` - Create new diary
- `GET /api/diaries/:id` - Get specific diary
- `PUT /api/diaries/:id` - Update diary
- `DELETE /api/diaries/:id` - Delete diary
- `GET /api/diaries/stats` - Get statistics

#### Tags
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create new tag
- `GET /api/tags/:id` - Get specific tag
- `PUT /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Delete tag

## 🎭 Mood Types

The API supports 10 different mood types:
- `HAPPY` - Feeling joyful and content
- `SAD` - Feeling down or melancholic
- `EXCITED` - Full of enthusiasm
- `ANXIOUS` - Feeling worried or nervous
- `CALM` - Peaceful and relaxed
- `ANGRY` - Feeling frustrated or upset
- `GRATEFUL` - Appreciative and thankful
- `TIRED` - Exhausted or fatigued
- `MOTIVATED` - Driven and inspired
- `CONFUSED` - Uncertain or puzzled

## 🗄️ Database Schema

The application uses a well-structured relational database:

- **users** - User accounts and authentication
- **diaries** - Diary entries with mood tracking
- **tags** - Custom tags with colors
- **diary_tags** - Many-to-many relationship
- **attachments** - File attachments (schema ready)

## 🔒 Security Features

- ✅ Password hashing with Bun's native crypto
- ✅ JWT token authentication with expiration
- ✅ Protected routes with middleware
- ✅ User data isolation (users only see their own data)
- ✅ Input validation and sanitization
- ✅ SQL injection prevention via Prisma

## 📊 Project Structure

```
day-your-read-api/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── helper/                # Prisma client instance
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── loginController.ts
│   │   ├── registerController.ts
│   │   ├── diaryController.ts
│   │   ├── tagController.ts
│   │   └── userController.ts
│   ├── middlewares/           # Custom middlewares
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── validateQuery.middleware.ts
│   ├── routes/                # Route definitions
│   │   ├── index.ts
│   │   ├── diary.routes.ts
│   │   ├── tag.routes.ts
│   │   └── user.routes.ts
│   ├── schemas/               # Zod validation schemas
│   │   ├── auth.schema.ts
│   │   ├── diary.schema.ts
│   │   └── user.schema.ts
│   ├── types/                 # TypeScript types
│   │   ├── auth.ts
│   │   ├── diary.ts
│   │   └── user.ts
│   ├── utils/                 # Utility functions
│   │   ├── response.ts        # API response helpers
│   │   ├── errors.ts          # Custom error classes
│   │   └── validation.ts
│   └── index.ts               # Application entry point
├── .env.example               # Environment variables template
├── API_DOCUMENTATION.md       # Complete API documentation
└── README.md                  # This file
```

## 🧪 Testing

You can test the API using:
- [Bruno](https://www.usebruno.com/) - API collection included in `/bruno` folder
- [Postman](https://www.postman.com/)
- [curl](https://curl.se/)
- [HTTPie](https://httpie.io/)

### Example Request
```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'

# Create a diary (replace TOKEN with your JWT)
curl -X POST http://localhost:3000/api/diaries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "My First Day",
    "content": "Today was amazing!",
    "mood": "HAPPY"
  }'
```

## 🎯 Best Practices Implemented

- ✅ RESTful API design
- ✅ Proper HTTP status codes
- ✅ Consistent response format
- ✅ Comprehensive error handling
- ✅ Input validation at multiple levels
- ✅ Separation of concerns (MVC pattern)
- ✅ Type safety with TypeScript
- ✅ Database transactions for data integrity
- ✅ Efficient queries with proper indexing
- ✅ Request logging for debugging
- ✅ CORS configuration
- ✅ Environment-based configuration

## 🔄 Future Enhancements

- [ ] File upload support for diary attachments
- [ ] Public diary sharing with unique links
- [ ] Email notifications
- [ ] Social features (followers, likes)
- [ ] Export diaries to PDF
- [ ] Rich text editor support
- [ ] Mobile app support
- [ ] Rate limiting
- [ ] Caching layer
- [ ] Automated testing suite

## 📄 License

MIT

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!
