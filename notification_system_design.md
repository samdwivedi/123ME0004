# Notification System - System Design Document

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Backend Architecture](#backend-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Logging Flow](#logging-flow)
5. [API Flow](#api-flow)
6. [Scalability](#scalability)
7. [Security](#security)
8. [Retry Strategy](#retry-strategy)
9. [Deployment Strategy](#deployment-strategy)
10. [Folder Structure](#folder-structure)
11. [Stage Deliverables Output](#stage-deliverables-output)

---

## Stage Deliverables Output

### Stage 1: Notification API (Backend & Logging)
- **Reusable Logging Middleware**: Developed a robust, fire-and-forget logging package in TypeScript. The package implements the `Log(stack, level, package, message)` signature, incorporates exponential backoff retries, robust validation based on specific Stack, Level, and Package constraints, and graceful failure handling.
- **Backend Application**: Built an Express.js microservice (`notification_app_be`) running on port 5000. It implements a protected GET `/api/v1/notifications` endpoint that fetches data from the external notification service. 
- **Query Parameters**: Fully supports and validates `limit`, `page`, and `notification_type` parameters.
- **Integration**: The backend seamlessly integrates the custom logging middleware to provide contextual logging across routes, controllers, and services without blocking API execution.

### Stage 2: Frontend Implementation
- **Frontend Application**: Developed a Next.js application (`notification_app_fe`) running on port 3000. It adheres strictly to the constraint of using only Material UI (no Tailwind or other frameworks) for styling.
- **Aesthetic UI**: Implemented a premium dark theme with glassmorphism effects, a responsive layout with a persistent sidebar, and a clean filter bar.
- **Functionality**: Integrates with the Stage 1 Backend to fetch and display notifications. Features include type-based filtering, unread/read state toggling persisted in `localStorage`, and error boundaries with retry mechanisms.
- **Logging Integration**: The frontend also utilizes the shared logging middleware to log user interactions, API fetches, and UI errors, mapping them correctly to frontend-specific packages (e.g., `component`, `page`).

---

## Architecture Overview

The notification system follows a **three-tier architecture** with clear separation of concerns:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   Frontend      │────▶│   Backend        │────▶│  External API       │
│   (Next.js)     │     │   (Express.js)   │     │  (Notifications)    │
│   Port: 3000    │     │   Port: 5000     │     │                     │
└────────┬────────┘     └────────┬─────────┘     └─────────────────────┘
         │                       │
         │    ┌──────────────────┤
         │    │                  │
         ▼    ▼                  │
┌─────────────────┐              │
│ Logging          │◀─────────────┘
│ Middleware       │
│ (Shared Package) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Logging API      │
│ (External)       │
└─────────────────┘
```

### Key Design Decisions

1. **No Database**: Notifications are fetched from an external API — no local storage required
2. **Shared Logging**: Reusable middleware consumed by both backend and frontend
3. **Bearer Token Auth**: Simple token-based authentication for API protection
4. **Client-Side State**: Viewed/unviewed tracking persisted in localStorage

---

## Backend Architecture

### Layered Architecture Pattern

```
Request → Middleware → Route → Controller → Service → External API
                                    ↓
                              Error Handler
```

| Layer | Responsibility |
|-------|---------------|
| **Middleware** | Auth validation, request logging, error handling |
| **Routes** | Endpoint registration, HTTP method mapping |
| **Controllers** | Request/response handling, input parsing |
| **Services** | Business logic, external API communication, validation |
| **Config** | Environment-based configuration, Swagger setup |
| **Types** | Shared TypeScript interfaces |

### Middleware Stack (Order Matters)

1. `helmet()` — Security headers
2. `cors()` — Cross-origin resource sharing
3. `rateLimit()` — Request rate limiting (100/15min)
4. `express.json()` — Body parsing
5. `requestLogger` — Request/response logging
6. Routes with `authMiddleware` on protected endpoints
7. `notFoundHandler` — 404 catch-all
8. `errorHandler` — Centralized error handler

---

## Frontend Architecture

### Component Hierarchy

```
RootLayout
  └── Providers (MUI Theme + React Query + Notistack)
       └── Navbar (Sidebar + AppBar)
            └── Page Content
                 ├── NotificationFilter
                 ├── NotificationCard[]
                 ├── NotificationSkeleton
                 ├── EmptyState
                 ├── ErrorDisplay
                 └── Pagination
```

### State Management

| State Type | Solution | Scope |
|-----------|---------|-------|
| Server State | React Query | API data caching, background refetching |
| Viewed State | useState + localStorage | Persistent across sessions |
| UI State | Component-local useState | Filters, pagination, modals |
| Notifications | Notistack | Toast notifications |

### Pages

1. **Dashboard** (`/`) — Main notification listing with filters and pagination
2. **Priority** (`/priority`) — High-priority notification filtering

---

## Logging Flow

### Architecture

```
Application Code
    │
    ▼
Log(stack, level, package, message)
    │
    ├── Validate parameters
    ├── Check minimum log level
    ├── Console output (if enabled)
    │
    ▼
Fire-and-forget API call
    │
    ├── Success → Done
    │
    └── Failure → Retry with exponential backoff
         ├── Attempt 2 (1s delay)
         ├── Attempt 3 (2s delay)
         └── All failed → Log to console, continue silently
```

### Key Principles

1. **Never crash**: Logger failures are silently handled
2. **Fire-and-forget**: Logging is async and non-blocking
3. **Validation**: All parameters validated against allowed values
4. **Retry**: 3 attempts with exponential backoff (1s, 2s, 4s)
5. **Timeout**: 5-second timeout per API call

---

## API Flow

### Notification Fetch Flow

```
Client Request
    │
    ▼
[Auth Middleware] ── Invalid Token ──▶ 401/403 Response
    │
    ▼ (Valid Token)
[Controller] ── Parse Query Params
    │
    ▼
[Service] ── Validate Params ── Invalid ──▶ 400 Response
    │
    ▼ (Valid)
[External API Call] ── Track Latency
    │
    ├── Success ──▶ 200 Response with data
    │
    └── Failure ──▶ Error Handler ──▶ 500 Response
```

### Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/health` | No | Health check |
| GET | `/api/v1/notifications` | Yes | Fetch notifications |

### Query Parameters

| Param | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `limit` | integer | 1-100 | Results per page |
| `page` | integer | ≥ 1 | Page number |
| `notification_type` | string | Event, Result, Placement | Filter by type |

---

## Scalability

### Current Design (Single Instance)

- Stateless backend (no database, no sessions)
- External API dependency
- Client-side state management

### Horizontal Scaling Strategies

1. **Load Balancing**: Stateless design allows multiple backend instances
2. **API Gateway**: Add rate limiting, caching at gateway level
3. **CDN**: Static frontend assets served via CDN
4. **Redis Cache**: Cache external API responses to reduce latency
5. **Message Queue**: Async notification processing for high throughput

### Performance Optimizations

- React Query caching (30s stale time)
- Request deduplication
- Pagination to limit payload size
- Rate limiting (100 req/15min)

---

## Security

### Implemented

| Measure | Implementation |
|---------|---------------|
| **Authentication** | Bearer token on all API routes |
| **CORS** | Restricted to allowed origins |
| **Rate Limiting** | 100 requests per 15-minute window |
| **Helmet** | Security headers (XSS, CSP, etc.) |
| **Input Validation** | All query parameters validated |
| **Error Sanitization** | Stack traces hidden in production |

### Token Management

- Tokens stored in environment variables (never committed)
- Frontend token exposed via `NEXT_PUBLIC_` prefix (acceptable for this architecture)
- Backend validates token on every protected request

---

## Retry Strategy

### Logging Middleware

| Attempt | Delay | Timeout |
|---------|-------|---------|
| 1 | 0ms | 5s |
| 2 | 1000ms | 5s |
| 3 | 2000ms | 5s |
| Exhausted | Console warning | — |

### React Query (Frontend)

| Attempt | Delay |
|---------|-------|
| 1 | 0ms |
| 2 | 1000ms |
| 3 | 2000ms |
| Exhausted | Error UI displayed |

### External API (Backend)

- Single attempt with 10s timeout
- Error propagated to client with appropriate status code

---

## Deployment Strategy

### Development

```bash
# Terminal 1: Backend
cd notification_app_be && npm run dev

# Terminal 2: Frontend
cd notification_app_fe && npm run dev
```

### Production

1. Build logging middleware: `cd logging_middleware && npm run build`
2. Build backend: `cd notification_app_be && npm run build`
3. Build frontend: `cd notification_app_fe && npm run build`
4. Start backend: `node notification_app_be/dist/server.js`
5. Start frontend: `npx next start` (in notification_app_fe)

### Docker (Optional)

Each service can be containerized independently:
- `logging_middleware` — Build artifact (npm package)
- `notification_app_be` — Node.js container, port 5000
- `notification_app_fe` — Node.js container, port 3000

---

## Folder Structure

```
├── logging_middleware/
│   ├── src/
│   │   ├── index.ts          # Package entry point
│   │   ├── logger.ts         # Core Log function with retry
│   │   ├── types.ts          # Type definitions & constants
│   │   └── validator.ts      # Parameter validation
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── notification_app_be/
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.ts      # Environment configuration
│   │   │   └── swagger.ts    # OpenAPI specification
│   │   ├── controllers/
│   │   │   └── notification.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── request-logger.middleware.ts
│   │   ├── routes/
│   │   │   └── index.ts      # Route definitions
│   │   ├── services/
│   │   │   └── notification.service.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── app.ts            # Express application setup
│   │   └── server.ts         # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── notification_app_fe/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts     # Axios instance
│   │   │   └── notifications.ts
│   │   ├── app/
│   │   │   ├── layout.tsx    # Root layout
│   │   │   ├── page.tsx      # Dashboard page
│   │   │   ├── priority/
│   │   │   │   └── page.tsx  # Priority page
│   │   │   └── providers.tsx # Client providers
│   │   ├── components/
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ErrorDisplay.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── NotificationCard.tsx
│   │   │   ├── NotificationFilter.tsx
│   │   │   └── NotificationSkeleton.tsx
│   │   ├── hooks/
│   │   │   ├── useNotifications.ts
│   │   │   └── useViewedState.ts
│   │   ├── lib/
│   │   │   └── logger.ts     # Frontend logging integration
│   │   ├── theme/
│   │   │   └── theme.ts      # MUI theme configuration
│   │   └── types/
│   │       └── index.ts
│   ├── package.json
│   └── .env.example
│
├── notification_system_design.md  # This document
├── README.md
└── .gitignore
```

### Design Rationale

- **Feature-based organization**: Each concern has its own directory
- **Barrel exports**: `index.ts` files for clean imports
- **Shared types**: Consistent interfaces across layers
- **Environment isolation**: Separate .env files per service
- **Reusable middleware**: Logging package consumed by both services
