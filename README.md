# Day Your Read API 📔✨

> **Backend API for [Day Your Read](https://github.com/handikatriarlan/day-your-read)** - A modern digital diary and journaling application

A high-performance, production-ready RESTful API built with Bun, Hono, and Prisma. This backend powers the Day Your Read application, providing secure authentication, diary management, mood tracking, and advanced filtering capabilities.

## 🌟 Features

### Core Features
- 🔐 **JWT Authentication**: Secure user authentication with Bearer token authorization
- 📝 **Diary CRUD Operations**: Complete diary lifecycle management
- 🏷️ **Smart Tagging System**: Organize entries with customizable colored tags
- 😊 **Mood Tracking**: 10 distinct mood types for emotional insights
- 📊 **Statistics Dashboard**: Writing habits, mood distribution, and tag analytics
- 🔍 **Advanced Search & Filtering**: Multi-criteria filtering with full-text search
- 📄 **Pagination Support**: Optimized data loading for large datasets
- 🔒 **Privacy Controls**: Public/private diary entry settings

### Technical Features
- ✅ **Zod Validation**: Type-safe request validation at runtime
- 🛡️ **Centralized Error Handling**: Custom error classes with proper HTTP status codes
- 🌐 **CORS Configured**: Cross-origin support for frontend integration
- 📝 **Pretty JSON**: Human-readable responses in development mode
- 🚀 **Ultra-Fast Performance**: Powered by Bun runtime
- 🔄 **Hot Reload**: Instant updates during development
- 💾 **Transaction Support**: Data integrity with Prisma transactions
- 🗃️ **Optimized Queries**: Indexed fields for fast lookups

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Runtime | [Bun](https://bun.sh/) v1.0+ |
| Framework | [Hono](https://hono.dev/) v4.10.8 |
| Database | MySQL 8.0+ |
| ORM | [Prisma](https://www.prisma.io/) v6.18.0 |
| Validation | [Zod](https://zod.dev/) v4.1.13 |
| Authentication | JWT (via hono/jwt) |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Bun** v1.0 or higher ([Installation Guide](https://bun.sh/docs/installation))
- **MySQL** v8.0 or higher
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/handikatriarlan/day-your-read-api.git
cd day-your-read-api
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/day_your_read"

# JWT Secret (use a strong, random string in production)
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"

# Optional: Server Configuration
PORT=3000
NODE_ENV=development
```

> ⚠️ **Security Note**: Never commit your `.env` file. Use a strong, unique JWT_SECRET in production.

### 4. Database Setup

Run Prisma migrations to create the database schema:

```bash
# Create database tables
bunx prisma migrate dev

# Optional: Generate Prisma Client (auto-generated on migrate)
bunx prisma generate
```

### 5. Start Development Server

```bash
bun run dev
```

The API server will start at **`http://localhost:3000`** with hot reload enabled.

### 6. Verify Installation

Test the health endpoint:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-12-11T05:10:24.000Z"
}
```

## 📚 API Documentation

Comprehensive API documentation with detailed examples: **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

### 🔗 Quick Endpoint Reference

#### 🔐 Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user account | ❌ |
| `POST` | `/api/auth/login` | Login and receive JWT token | ❌ |

#### 👤 User Profile Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/user/profile` | Get current user profile with stats | ✅ |
| `PUT` | `/api/user/profile` | Update user profile (name) | ✅ |
| `POST` | `/api/user/change-password` | Change account password | ✅ |

#### 📔 Diary Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/diaries` | List all diaries (with filters & pagination) | ✅ |
| `POST` | `/api/diaries` | Create new diary entry | ✅ |
| `GET` | `/api/diaries/stats` | Get writing statistics & analytics | ✅ |
| `GET` | `/api/diaries/:id` | Get specific diary by ID | ✅ |
| `PUT` | `/api/diaries/:id` | Update diary entry | ✅ |
| `DELETE` | `/api/diaries/:id` | Delete diary entry | ✅ |

#### 🏷️ Tag Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/tags` | List all user tags | ✅ |
| `POST` | `/api/tags` | Create new tag | ✅ |
| `GET` | `/api/tags/:id` | Get tag with usage stats | ✅ |
| `PUT` | `/api/tags/:id` | Update tag details | ✅ |
| `DELETE` | `/api/tags/:id` | Delete tag (removes from diaries) | ✅ |

#### ⚕️ Health Check
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/` | API welcome & version info | ❌ |
| `GET` | `/api/health` | API health status check | ❌ |

## 🎭 Mood Tracking System

Track your emotional state with 10 distinct mood types:

| Mood | Description | Use Case |
|------|-------------|----------|
| 😊 `HAPPY` | Joyful and content | Good days, celebrations |
| 😢 `SAD` | Down or melancholic | Difficult times, losses |
| 🎉 `EXCITED` | Full of enthusiasm | Anticipation, new beginnings |
| 😰 `ANXIOUS` | Worried or nervous | Stress, uncertainty |
| 😌 `CALM` | Peaceful and relaxed | Meditation, restful moments |
| 😠 `ANGRY` | Frustrated or upset | Conflicts, frustrations |
| 🙏 `GRATEFUL` | Appreciative and thankful | Reflection, gratitude practice |
| 😴 `TIRED` | Exhausted or fatigued | Burnout, physical exhaustion |
| 💪 `MOTIVATED` | Driven and inspired | Goal-setting, achievements |
| 🤔 `CONFUSED` | Uncertain or puzzled | Decision-making, introspection |

## 🗄️ Database Schema

Built on a well-architected relational database with Prisma ORM:

```
┌─────────────┐         ┌─────────────┐
│    Users    │◄────────┤   Diaries   │
│             │ 1     * │             │
│ - id        │         │ - id        │
│ - username  │         │ - title     │
│ - email     │         │ - content   │
│ - password  │         │ - mood      │
└─────────────┘         │ - isPublic  │
      │ 1                └──────┬──────┘
      │                       * │
      │                    ┌────▼────────┐
      │                    │  DiaryTags  │
      │                    └────┬────────┘
      │ 1                       * │
      │                    ┌────▼─────┐
      └────────────────────┤   Tags   │
                         * │          │
                           │ - id     │
                           │ - name   │
                           │ - color  │
                           └──────────┘
```

### Database Models

- **users** - User accounts with authentication credentials
- **diaries** - Diary entries with mood tracking and privacy settings
- **tags** - Customizable tags with hex color codes (unique per user)
- **diary_tags** - Many-to-many junction table (diaries ↔ tags)
- **attachments** - File attachments metadata (schema ready, implementation pending)

### Key Features

- **Cascade Deletes**: Automatic cleanup of related data
- **Unique Constraints**: Email, username, and user-specific tag names
- **Indexes**: Optimized queries on `userId`, `createdAt`, and junction tables
- **Timestamps**: Automatic `createdAt` and `updatedAt` tracking

## 🔒 Security Features

### Authentication & Authorization
- ✅ **Password Hashing**: Bun's native crypto for secure password storage
- ✅ **JWT Tokens**: Stateless authentication with 1-hour expiration
- ✅ **Bearer Token**: Standard Authorization header format
- ✅ **Route Protection**: Middleware guards on all protected endpoints

### Data Security
- ✅ **User Isolation**: Users can only access their own data
- ✅ **SQL Injection Prevention**: Parameterized queries via Prisma
- ✅ **Input Validation**: Multi-layer validation (Zod schemas + custom rules)
- ✅ **Error Message Safety**: No sensitive data leaks in error responses

### Best Practices
- ✅ **Environment Variables**: Sensitive config in `.env` (not committed)
- ✅ **CORS Configuration**: Restricted to allowed origins
- ✅ **Rate Limiting Ready**: Architecture supports future rate limiting
- ✅ **Transaction Support**: Data integrity with atomic operations

## 📊 Project Architecture

### Directory Structure

```
day-your-read-api/
│
├── 📁 prisma/                    # Database Layer
│   ├── schema.prisma             # Database schema & models
│   ├── prisma.config.ts          # Prisma configuration
│   ├── 📁 migrations/            # Database version control
│   ├── 📁 helper/                # Prisma client singleton
│   └── 📁 generated/             # Auto-generated Prisma client
│
├── 📁 src/                       # Application Source
│   │
│   ├── 📁 controllers/           # Business Logic Layer
│   │   ├── diaryController.ts    # Diary CRUD + stats (6 handlers)
│   │   ├── tagController.ts      # Tag management (5 handlers)
│   │   ├── userController.ts     # Profile & password (3 handlers)
│   │   ├── loginController.ts    # Authentication (1 handler)
│   │   └── registerController.ts # User registration (1 handler)
│   │
│   ├── 📁 middlewares/           # Request Processing
│   │   ├── auth.middleware.ts    # JWT verification & user extraction
│   │   ├── validate.middleware.ts# Request body validation (Zod)
│   │   └── validateQuery.middleware.ts # Query params validation
│   │
│   ├── 📁 routes/                # Route Definitions
│   │   ├── index.ts              # Main router aggregator
│   │   ├── diary.routes.ts       # Diary endpoints
│   │   ├── tag.routes.ts         # Tag endpoints
│   │   └── user.routes.ts        # User endpoints
│   │
│   ├── 📁 schemas/               # Validation Schemas (Zod)
│   │   ├── auth.schema.ts        # Login & register schemas
│   │   ├── diary.schema.ts       # Diary CRUD schemas
│   │   └── user.schema.ts        # User update schemas
│   │
│   ├── 📁 types/                 # TypeScript Type Definitions
│   │   ├── auth.ts               # Auth request/response types
│   │   ├── diary.ts              # Diary & tag types
│   │   └── user.ts               # User types
│   │
│   ├── 📁 utils/                 # Shared Utilities
│   │   ├── response.ts           # ApiResponse helper class
│   │   ├── errors.ts             # Custom error classes
│   │   └── validation.ts         # Validation utilities
│   │
│   └── index.ts                  # 🚀 Application Entry Point
│
├── 📁 bruno/                     # API Testing Collection
│   ├── 📁 Auth/                  # Authentication tests
│   ├── 📁 User/                  # User profile tests
│   ├── 📁 Diaries/               # Diary CRUD tests
│   ├── 📁 Tags/                  # Tag management tests
│   └── 📁 environments/          # Test environments
│
├── 📄 package.json               # Dependencies & scripts
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 .env                       # Environment variables (gitignored)
├── 📄 .env.example               # Environment template
├── 📄 API_DOCUMENTATION.md       # Complete API docs
└── 📄 README.md                  # This file
```

### Architecture Pattern: MVC + Middleware

```
┌─────────────┐
│   Request   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   Middlewares   │
│  • Logger       │
│  • CORS         │
│  • Auth         │
│  • Validation   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│     Routes      │
│  (URL Mapping)  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Controllers    │
│ (Business Logic)│
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│   Prisma ORM    │
│   (Database)    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│    Response     │
│   (JSON API)    │
└─────────────────┘
```

## 🧪 API Testing

### Testing Tools

We provide multiple ways to test the API:

#### 🎯 Bruno API Client (Recommended)
Complete API collection included in the `/bruno` folder with:
- ✅ Pre-configured requests for all endpoints
- ✅ Environment variables for easy switching
- ✅ Automatic token management
- ✅ Request documentation and examples

**Setup Bruno:**
1. Download [Bruno](https://www.usebruno.com/)
2. Open Collection → Browse to `/bruno` folder
3. Select `dev` environment
4. Start testing!

#### 🔧 Alternative Tools
- **Postman** - Import endpoints manually
- **Thunder Client** - VS Code extension
- **curl** - Command-line testing
- **HTTPie** - Modern curl alternative

### Quick Testing Examples

#### Example 1: Register & Login Flow

```bash
# 1. Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "username": "janedoe",
    "email": "jane@example.com",
    "password": "securepass123"
  }'

# 2. Login and get JWT token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "janedoe",
    "password": "securepass123"
  }'
# Save the token from response: "token": "eyJhbG..."
```

#### Example 2: Create Diary with Tags

```bash
# 3. Create a tag (replace YOUR_TOKEN)
curl -X POST http://localhost:3000/api/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Personal",
    "color": "#3B82F6"
  }'
# Note the tag ID from response

# 4. Create a diary entry
curl -X POST http://localhost:3000/api/diaries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "My First Day",
    "content": "Today was an amazing day! I learned so much and felt really motivated.",
    "mood": "HAPPY",
    "isPublic": false,
    "tagIds": [1]
  }'
```

#### Example 3: Advanced Filtering

```bash
# 5. Get diaries with filters
curl -X GET "http://localhost:3000/api/diaries?mood=HAPPY&page=1&limit=10&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 6. Search diaries
curl -X GET "http://localhost:3000/api/diaries?search=amazing&tagIds=1,2" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 7. Get statistics
curl -X GET http://localhost:3000/api/diaries/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Testing Workflow

1. **Health Check**: `GET /api/health` (no auth needed)
2. **Register**: `POST /api/auth/register`
3. **Login**: `POST /api/auth/login` → Save token
4. **Create Tags**: `POST /api/tags` (with token)
5. **Create Diaries**: `POST /api/diaries` (with token)
6. **Test CRUD**: Update, get, delete operations
7. **View Stats**: `GET /api/diaries/stats`

For complete request/response examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🎯 Best Practices & Code Quality

### API Design
- ✅ **RESTful Architecture**: Resource-based URLs with proper HTTP verbs
- ✅ **Semantic HTTP Status Codes**: Correct status for each scenario
- ✅ **Consistent Response Format**: Uniform JSON structure across all endpoints
- ✅ **API Versioning Ready**: Prefix `/api` for future version management

### Code Organization
- ✅ **MVC Pattern**: Clear separation of concerns (Models, Views, Controllers)
- ✅ **DRY Principle**: Reusable utilities and middleware
- ✅ **Single Responsibility**: Each module has one clear purpose
- ✅ **Type Safety**: Full TypeScript with strict mode

### Error Handling
- ✅ **Custom Error Classes**: `ValidationError`, `NotFoundError`, `ConflictError`, etc.
- ✅ **Global Error Handler**: Centralized error processing
- ✅ **Error Message Safety**: No sensitive data in error responses
- ✅ **Detailed Validation**: Field-level error messages

### Performance
- ✅ **Database Indexing**: Optimized queries on frequently accessed fields
- ✅ **Pagination**: Efficient data loading for large datasets
- ✅ **Transaction Support**: Atomic operations for data integrity
- ✅ **N+1 Query Prevention**: Proper Prisma includes and selects

### Security
- ✅ **Input Validation**: Multi-layer validation (Zod + custom)
- ✅ **SQL Injection Prevention**: Parameterized queries via Prisma
- ✅ **Password Hashing**: Secure password storage
- ✅ **JWT Authentication**: Stateless, scalable auth

### Development Experience
- ✅ **Hot Reload**: Instant updates during development
- ✅ **Request Logging**: Detailed logs for debugging
- ✅ **Pretty JSON**: Human-readable responses in dev mode
- ✅ **Environment Config**: Separate configs for dev/prod

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] Set strong `JWT_SECRET` (min 32 characters)
- [ ] Configure production database URL
- [ ] Set `NODE_ENV=production`
- [ ] Update CORS origins to your frontend domain
- [ ] Run database migrations: `bunx prisma migrate deploy`
- [ ] Test all endpoints in staging environment
- [ ] Set up database backups
- [ ] Configure logging and monitoring

### Deployment Options

#### Option 1: Traditional Server (VPS, AWS EC2, etc.)
```bash
# Install Bun on server
curl -fsSL https://bun.sh/install | bash

# Clone and setup
git clone https://github.com/handikatriarlan/day-your-read-api.git
cd day-your-read-api
bun install
bunx prisma migrate deploy

# Run with PM2 (recommended)
bun pm2 start src/index.ts --name day-your-read-api
```

#### Option 2: Docker Deployment
```dockerfile
# Example Dockerfile
FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --production
COPY . .
RUN bunx prisma generate
EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
```

#### Option 3: Cloud Platforms
- **Railway**: Connect GitHub repo and deploy
- **Render**: Web service with MySQL add-on
- **Fly.io**: Global edge deployment
- **AWS**: EC2, RDS, Load Balancer

### Environment Variables (Production)

```env
DATABASE_URL="mysql://user:pass@prod-db-host:3306/day_your_read"
JWT_SECRET="your-production-secret-min-32-chars"
NODE_ENV="production"
PORT=3000
CORS_ORIGIN="https://your-frontend-domain.com"
```

## 🔗 Related Repositories

- **Frontend Application**: [day-your-read](https://github.com/handikatriarlan/day-your-read) - Modern React web app
- **Backend API**: [day-your-read-api](https://github.com/handikatriarlan/day-your-read-api) - This repository

## 🔄 Roadmap & Future Enhancements

### Phase 1: Core Features ✅
- [x] User authentication & authorization
- [x] Diary CRUD operations
- [x] Tag system with colors
- [x] Mood tracking
- [x] Advanced filtering & search
- [x] Statistics dashboard

### Phase 2: Enhanced Features 🚧
- [ ] File upload for diary attachments
- [ ] Image upload with optimization
- [ ] Rich text editor support (Markdown/WYSIWYG)
- [ ] Public diary sharing with unique links
- [ ] Export diaries (PDF, JSON, Markdown)

### Phase 3: Social & Notifications 📋
- [ ] Email notifications (welcome, reminders)
- [ ] Social features (followers, likes, comments)
- [ ] User profiles with bio and avatar
- [ ] Activity feed
- [ ] Bookmark system

### Phase 4: Performance & Scale 🎯
- [ ] Rate limiting (per user/IP)
- [ ] Redis caching layer
- [ ] CDN integration for static assets
- [ ] Database read replicas
- [ ] API response compression

### Phase 5: Advanced Features 💡
- [ ] AI-powered mood analysis from text
- [ ] Writing streak tracking & gamification
- [ ] Multi-language support (i18n)
- [ ] Mobile app (React Native)
- [ ] Voice-to-text diary entries
- [ ] Automated testing suite (unit, integration, e2e)

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Guidelines
- Follow existing code style and patterns
- Write clear commit messages
- Add comments for complex logic
- Update documentation if needed
- Test your changes thoroughly

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Handika Tri Arlan**
- GitHub: [@handikatriarlan](https://github.com/handikatriarlan)
- Frontend: [day-your-read](https://github.com/handikatriarlan/day-your-read)
- Backend: [day-your-read-api](https://github.com/handikatriarlan/day-your-read-api)

## 💬 Support & Feedback

- 🐛 Found a bug? [Open an issue](https://github.com/handikatriarlan/day-your-read-api/issues)
- 💡 Have a feature idea? [Start a discussion](https://github.com/handikatriarlan/day-your-read-api/discussions)
- ⭐ Like the project? Give it a star!

## 🙏 Acknowledgments

Built with amazing open-source technologies:
- [Bun](https://bun.sh/) - Fast JavaScript runtime
- [Hono](https://hono.dev/) - Lightweight web framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Zod](https://zod.dev/) - TypeScript-first validation

---

<div align="center">

**⭐ If this project helped you, consider giving it a star! ⭐**

Made with ❤️ by [Handika Tri Arlan](https://github.com/handikatriarlan)

</div>
