# Django -> JS Migration Plan

## Target architecture

- Frontend: Next.js App Router (`apps/web`)
- API: NestJS (`apps/api`)
- Data layer: Prisma + PostgreSQL (`packages/db`)
- Optional background jobs: BullMQ + Redis (to replace Celery)

## Why this stack

- Keeps full TypeScript across backend and frontend.
- Prisma gives typed queries and safe migrations.
- NestJS keeps a module structure similar to Django apps (`core`, `api`, `userpanel`).
- Next.js supports SSR for authenticated dashboards.

## Legacy-to-modern mapping

- Django `core.models` -> Prisma schema at `packages/db/prisma/schema.prisma`
- Django `api/views.py:GetPlayersByTeam` -> Nest endpoint:
  - `GET /api/team/:teamId/season/:seasonId/player/position/:position`
- Django `core/utils.py:get_user_match_day_points` ->
  - `ScoringService.getUserMatchDayPoints` in `apps/api/src/modules/scoring/scoring.service.ts`

## URL migration map (phase 1)

- `/` -> Next page `app/page.tsx`
- `/userpanel/competition/:id/dashboard/` -> Next route group `(app)` dashboard page (pending)
- `/userpanel/competition/:id/match-days/` -> Next route (pending)
- `/userpanel/competition/:id/match-day/:id/` -> Next route (pending)
- `/api/team/:teamId/season/:seasonId/player/position/:position` -> implemented in Nest

## Incremental migration strategy

1. Freeze Django schema changes.
2. Run JS stack in parallel against same PostgreSQL (read-first mode).
3. Migrate auth and session strategy (recommend JWT + refresh tokens).
4. Migrate user flows in this order:
   - Login/registration
   - Match-day bets
   - Scorers
   - Global bets
   - Rankings
5. Move Celery jobs to BullMQ workers.
6. Switch traffic from Django to Next/Nest behind reverse proxy.

## Data migration

- Keep existing PostgreSQL instance.
- Create SQL/ETL script to map Django table names to Prisma-managed naming.
- Validate row counts per table and scoring parity for a sample season.

## Testing strategy

- Snapshot old scoring outputs for representative historical match days.
- Run API parity tests to ensure point calculation is identical.
- Add E2E tests for betting and ranking pages before cutover.
