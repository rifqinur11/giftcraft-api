# giftcraft-api

Robust Multi-Tenant RESTful API for GiftCraft SaaS platform. Built with isolated global query tenant-scoping, pessimistic database locking for inventory safety, and automated invoice tracking.

## Tech Stack & Architecture

- **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
- **Database ORM:** [Prisma ORM](https://www.prisma.io/)
- **Database:** PostgreSQL
- **Concurrency Control:** Pessimistic Locking (`SELECT ... FOR UPDATE`)
- **Multi-Tenancy:** Automated Global Query Tenant-Scoping via `AsyncLocalStorage` and Prisma Client Extensions
- **Auth:** JWT-based authentication

## Project Setup

### 1. Environment Configuration
Duplicate the example environment file and configure your values:
```bash
cp .env.example .env
```

### 2. Run Database (Docker Compose)
Start the PostgreSQL container:
```bash
docker-compose up -d
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Migrations
Apply the Prisma schema to the database:
```bash
npx prisma db push
```

### 5. Running the Application
```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Features Deep Dive

### 1. Global Multi-Tenancy Scoping
This boilerplate uses Node's `AsyncLocalStorage` to store the tenant context for each incoming request. The custom `PrismaService` uses a Prisma Client Extension to automatically inject `where: { tenantId }` into all database operations (find, update, delete, etc.) for models that belong to a tenant. This guarantees complete, transparent data isolation across tenants without leaking tenant queries in controllers or services.

### 2. Pessimistic Concurrency Locking
For inventory safety and preventing race conditions, the `InventoryService` showcases how to execute database transactions using raw SQL pessimistic locks (`SELECT ... FOR UPDATE`). This blocks concurrent transactions from modifying the same product stock until the active transaction completes.

---

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
