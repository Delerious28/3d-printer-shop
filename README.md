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
1. Copy `.env.example` to `.env.local` and fill values (the docker defaults point at `db`, `redis`, `mailhog`, `minio`).
2. Install dependencies: `npm install` (registry must be reachable).
3. Run docker services: `docker compose up -d` (PostgreSQL, Redis, MailHog at :8025, MinIO at :9000/:9001, plus the `web` dev container on :3000).
   - To run the app in your host shell instead, stop the `web` service and run `npm run dev` locally with the same env vars.
4. Apply migrations: `npx prisma migrate dev --name init`.
5. Seed data: `npm run db:seed` (creates admin user + pricing/material seed). Default admin credentials: `admin@gmail.com` / `admin123!`.
6. Start dev server: `npm run dev` and open `http://localhost:3000` (or rely on the docker `web` service already running on that port).
7. Stripe webhooks: run `stripe listen --forward-to localhost:3000/api/webhooks` with `STRIPE_WEBHOOK_SECRET` set.

## Scripts
- `npm run dev` - start Next.js
- `npm run build` / `start`
- `npm run db:migrate` / `db:seed`
- `npm run queue:worker` - run BullMQ worker (placeholder for processing uploads)
- `npm test` - runs vitest (pricing engine tests)

## Docker Compose
PostgreSQL, Redis, MailHog, MinIO, and a hot-reloadable Next.js dev container are provided. Local uploads default to `public/uploads`; set `MINIO_*` env vars to switch to an S3-compatible bucket. The `web` container mounts the repository so code changes are reflected without rebuilds.

## Email
Configure SMTP host/user/pass in env to send verification, status updates, and notifications. In dev, you can point to Mailhog at `localhost:1025`.

New accounts require email verification before login. The register flow sends a verification email; the included admin user is pre-verified in the seed data.

## Limitations
- File analysis (dimensions/volume) is simplified and should be enhanced in production.
- Payments use Stripe checkout; remember to set webhook secret.
