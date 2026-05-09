# Notification System

A production-grade notification management system built with modern web technologies, featuring a reusable logging middleware, a backend microservice, and a premium frontend dashboard.

## Architecture

```
├── logging_middleware/     # Reusable logging package (TypeScript)
├── notification_app_be/    # Backend microservice (Express + TypeScript)
├── notification_app_fe/    # Frontend dashboard (Next.js + Material UI)
├── notification_system_design.md  # System design documentation
└── README.md
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, TypeScript, Material UI, React Query |
| **Backend** | Express.js, TypeScript, Axios |
| **Logging** | Custom middleware with retry logic |
| **Docs** | Swagger/OpenAPI |

## Quick Start

### 1. Logging Middleware

```bash
cd logging_middleware
npm install
npm run build
```

### 2. Backend

```bash
cd notification_app_be
npm install
cp .env.example .env   # Configure environment variables
npm run dev             # Starts on http://localhost:5000
```

**API Endpoints:**
- `GET /api/v1/health` — Health check (public)
- `GET /api/v1/notifications` — Fetch notifications (protected)
- `GET /api-docs` — Swagger documentation

### 3. Frontend

```bash
cd notification_app_fe
npm install
npm run dev             # Starts on http://localhost:3000
```

## Authentication

All API routes (except health) require Bearer token authentication:

```
Authorization: Bearer <token>
```

Set the token in environment variables:
- Backend: `AUTH_TOKEN` in `.env`
- Frontend: `NEXT_PUBLIC_AUTH_TOKEN` in `.env.local`

## Features

### Backend
- External notification API integration
- Pagination & filtering support
- Bearer token authentication
- Rate limiting
- Centralized error handling
- Swagger documentation
- Graceful shutdown
- Request/response logging

### Frontend
- Premium dark theme with glassmorphism
- Notification listing with type indicators
- Pagination controls
- Filter by notification type (Event, Result, Placement)
- Priority notifications page
- Viewed/unviewed state (localStorage persistence)
- Loading skeletons
- Error boundaries
- Toast notifications
- Mobile responsive design
- React Query caching

### Logging Middleware
- Reusable `Log(stack, level, package, message)` function
- Retry with exponential backoff
- Timeout handling
- Input validation
- Console + remote API output
- Never crashes the app on failure

## Logging Format

```typescript
Log(stack, level, package, message)
```

**Valid stacks:** `backend`, `frontend`

**Valid levels:** `debug`, `info`, `warn`, `error`, `fatal`

**Backend packages:** `cache`, `controller`, `cron_job`, `db`, `domain`, `handler`, `repository`, `route`, `service`

**Frontend packages:** `api`, `component`, `hook`, `page`, `state`, `style`

**Common packages:** `auth`, `config`, `middleware`, `utils`

## Environment Variables

### Backend (`.env`)
```env
PORT=5000
NODE_ENV=development
NOTIFICATION_API_URL=http://4.224.186.213/evaluation-service/notifications
LOGGING_API_URL=http://4.224.186.213/evaluation-service/logs
AUTH_TOKEN=your_token_here
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_AUTH_TOKEN=your_token_here
NEXT_PUBLIC_LOGGING_API_URL=http://4.224.186.213/evaluation-service/logs
```

## License

MIT