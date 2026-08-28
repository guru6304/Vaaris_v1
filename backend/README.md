# VAARIS — Backend Foundation
**Family Financial Continuity Platform**

This is the production-grade NestJS + Prisma + PostgreSQL backend foundation for the VAARIS platform.

---

## 1. Core Architectural Principle

```
Family
   ↓
is the primary security and data boundary
   ↓
Users receive access to a Family
   ↓
Resources belong to a Family
   ↓
Authorization is strictly enforced server-side
```

---

## 2. Technology Stack

- **Framework**: NestJS 11 (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma ORM v6
- **Validation**: `class-validator` + `class-transformer` (Strict Whitelist & Type Transformation)
- **API Standard**: REST API under `/api/v1`
- **Documentation**: Swagger / OpenAPI at `/api/docs`
- **Tracing**: UUIDv4 Request-ID tracking on all requests and response headers

---

## 3. Directory Structure

```
backend/
├── prisma/
│   └── schema.prisma              # Foundational domain schema & family security boundaries
├── src/
│   ├── common/
│   │   ├── dto/                   # Common response & pagination DTOs
│   │   ├── filters/               # Centralized HttpExceptionFilter (masks internal errors)
│   │   ├── interceptors/          # Standard TransformInterceptor & LoggingInterceptor
│   │   ├── interfaces/            # ApiSuccessResponse, ApiErrorResponse, RequestWithId
│   │   └── middleware/            # RequestIdMiddleware (x-request-id traceability)
│   ├── config/
│   │   ├── configuration.ts       # Typed configuration factory
│   │   └── validation.ts          # Environment schema validation
│   ├── health/
│   │   ├── dto/                   # Health response DTOs
│   │   ├── health.controller.ts   # GET /api/v1/health
│   │   ├── health.service.ts      # Live PostgreSQL connectivity check
│   │   └── health.module.ts
│   ├── modules/                   # Scaffolding for future domain modules
│   │   ├── auth/
│   │   ├── users/
│   │   ├── families/
│   │   ├── family-members/
│   │   ├── family-access/
│   │   ├── financial-records/
│   │   ├── documents/
│   │   ├── continuity/
│   │   ├── readiness/
│   │   ├── attention-items/
│   │   ├── respond/
│   │   ├── dashboard/
│   │   ├── notifications/
│   │   └── audit/
│   ├── prisma/
│   │   ├── prisma.service.ts      # Lifecycle-managed PrismaClient
│   │   └── prisma.module.ts       # Global Prisma module
│   ├── app.module.ts              # Root application module
│   └── main.ts                    # Bootstrap with global pipes, filters, interceptors, Swagger
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 4. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### Key Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment mode (`development`, `production`, `test`) | `development` |
| `PORT` | HTTP Server port | `3001` |
| `API_PREFIX` | Global API route prefix | `api/v1` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/vaaris_db` |
| `CORS_ORIGIN` | Allowed comma-separated origins | `http://localhost:5173,http://localhost:3000` |

---

## 5. Database Migration & Prisma Workflow

### Generate Prisma Client
```bash
npm run prisma:generate
```

### Development Database Migration
```bash
npm run prisma:migrate:dev --name init
```

### Production Migration Deployment
```bash
npm run prisma:migrate:deploy
```

### Open Prisma Studio (Database GUI)
```bash
npm run prisma:studio
```

---

## 6. Running the Application

### Development Mode (with hot-reload)
```bash
npm run start:dev
```

### Production Build & Run
```bash
npm run build
npm run start:prod
```

---

## 7. API Endpoints & Verification

- **Health Check**: `GET /api/v1/health`
  - Verifies application runtime and live PostgreSQL connection.
- **Swagger Documentation**: `http://localhost:3001/api/docs`
  - Interactive OpenAPI UI for exploring and testing API endpoints.

---

## 8. Standard API Response Structure

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "timestamp": "2026-08-28T00:45:00.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Request validation failed",
    "details": [
      {
        "message": "email must be an email address"
      }
    ]
  },
  "meta": {
    "requestId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "timestamp": "2026-08-28T00:45:00.000Z"
  }
}
```
