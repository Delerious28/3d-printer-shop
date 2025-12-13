# Remoof 3D Printing Shop

A monorepo-style Next.js application for Dutch 3D printing orders with uploads, configuration, Stripe iDEAL payments, and admin pipeline.

## Stack
- Next.js App Router + TypeScript + Tailwind
- Prisma + PostgreSQL
- NextAuth (credentials + email verification)
- Stripe (iDEAL) for payments
- Redis + BullMQ for background jobs (optional worker script)
- three.js viewer via react-three-fiber

## Getting started
1. Copy `.env.example` to `.env.local` and fill values.
2. Install dependencies: `npm install` (registry must be reachable).
3. Run docker services: `docker compose up -d` (postgres, redis, mailhog optional).
4. Apply migrations: `npx prisma migrate dev --name init`.
5. Seed data: `npm run db:seed`.
6. Start dev server: `npm run dev` and open `http://localhost:3000`.

## Scripts
- `npm run dev` - start Next.js
- `npm run build` / `start`
- `npm run db:migrate` / `db:seed`
- `npm run queue:worker` - run BullMQ worker (placeholder for processing uploads)
- `npm test` - runs vitest (pricing engine tests)

## Docker Compose
PostgreSQL and Redis are provided. MinIO can be added by extending the compose file; local uploads default to `public/uploads`.

## Email
Configure SMTP host/user/pass in env to send verification, status updates, and notifications. In dev, you can point to Mailhog at `localhost:1025`.

## Limitations
- File analysis (dimensions/volume) is simplified and should be enhanced in production.
- Payments use Stripe checkout; remember to set webhook secret.
