# Pelotus Modern Rewrite

Modern baseline for migrating the legacy Django 1.7 app to a JavaScript/TypeScript stack.

## Stack

- `apps/web`: Next.js 15 (App Router)
- `apps/api`: NestJS 10
- `packages/db`: Prisma ORM + PostgreSQL
- Turborepo workspaces for coordinated dev/build scripts

## Quick Start

1. Install dependencies (from `modern/`):
   - `npm install`
2. Start PostgreSQL:
   - `docker compose up -d`
3. Copy env file:
   - `cp .env.example .env`
4. Generate Prisma client and run migrations:
   - `npm run db:generate`
   - `npm run db:migrate -- --name init`
5. Run all apps:
   - `npm run dev`

## Docker-Only (No local npm/node)

Run everything from Docker Compose if you do not want Node/npm installed locally.

1. Copy env file:
   - `cp .env.example .env`
2. Start PostgreSQL:
   - `docker compose up -d db`
3. Run initial Prisma migration once:
   - `docker compose --profile setup run --rm migrate`
4. Start web + api containers:
   - `docker compose up app`

App URLs:

- Web: `http://localhost:3000`
- API: `http://localhost:4000/health`

Notes:

- `docker compose up app` also starts the `api` service because `app` depends on it.
- `node_modules` are kept in a Docker volume (`pelotus-modern-node-modules`).
- If dependencies get stale, reset with:
  - `docker compose down -v`

Default admin seed:

- The API auto-creates/promotes a platform admin from `.env` values:
   - `DEFAULT_ADMIN_USERNAME`
   - `DEFAULT_ADMIN_EMAIL`
   - `DEFAULT_ADMIN_PASSWORD`
- Current defaults are `admin` / `admin@pelotus.local` / `admin1234`.

## What is migrated in this baseline

- Core data model from Django `core.models` translated to Prisma schema.
- Example API endpoint equivalent to `GET /api/team/:team_id/season/:season_id/player/position/:position`.
- Domain scoring service (`match day points`) translated from `core/utils.py`.
- Competition API module with endpoints for:
   - dashboard
   - match days and match-day bets
   - scorers
   - global bets
   - match-day ranking
   - global ranking
- Next.js pages for browsing these flows:
   - `/competitions/1/dashboard`
   - `/competitions/1/match-days`
   - `/competitions/1/match-days/:matchDayId`
   - `/competitions/1/match-days/:matchDayId/ranking`
   - `/competitions/1/global-bets`
   - `/competitions/1/global-ranking`
- Auth and onboarding pages:
   - `/join`
   - `/login`
   - `/registration/community`

## Current user flow

1. Create an account at `/join` or log in at `/login`.
2. Create or join a community at `/registration/community`.
3. Open the competition dashboard returned by onboarding.

Current limitation:

- The UI and API now use a cookie-backed bearer token for protected endpoints.
- Session cookies are currently set from client-side code (not `HttpOnly` yet). Moving to server-set `HttpOnly` cookies is the next hardening step.

## Next migration steps

See `docs/migration-plan.md` for route mapping and incremental rollout.
