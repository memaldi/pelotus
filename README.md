# Pelotus (Nuxt.js rewrite)

This repository contains the Pelotus fantasy sports application. The
original Django implementation has been rewritten as a full-stack
JavaScript application using **Nuxt.js (Vue 3)** with a PostgreSQL
backend and Redis for caching and background jobs.

## Deployment (Docker Compose)

A `docker-compose.yml` file is provided at the repository root. Use it
for local development or production deployment.

```bash
# build all services
docker-compose build

# start the stack (web, postgres, redis)
docker-compose up -d
```

Environment variables are loaded from `nuxt-app/.env` (copy
`.env.example` as a starting point).

### Services

- **web** – Nuxt.js application serving both frontend and API
- **postgres** – PostgreSQL 15 for primary data storage
- **redis** – Redis 7 used for caching and background task queue

## Development

1. Install Node.js (>=20) and npm/yarn/pnpm on your host machine.
2. `cd nuxt-app && npm install` to install frontend dependencies.
3. `npm run dev` to launch the development server at `http://localhost:3000`.

4. `npm run test` to execute unit tests (Vitest).

### Authentication API

The server exposes REST endpoints under `/api/auth`:

- `POST /api/auth/register` – create new user with JSON body `{ email, password, username? }`
- `POST /api/auth/login` – obtain JWT token with `{ email, password }`

Use the token to authenticate further requests via `Authorization: Bearer <token>` header.

### Core API

- `GET /api/communities` – list communities
- `GET /api/communities/{slug}` – community details and competitions
- `POST /api/communities/{slug}` – join community (requires auth)
- `GET /api/matchdays` – list match days
- `GET /api/matchdays/{id}` – match day with matches
- `GET /api/match/{id}` – match details including teams and day
- `POST /api/bets` – create/update bet (requires auth, body `{ matchId, matchDayId, homeGoals, awayGoals }`)
- `GET /api/bets/match/{id}` – bets for a match (user only or all)

Additional endpoints are available for goals bets, global bets, rankings, and related data management.

Core API updates:

- `GET /api/players`, `/api/teams`, `/api/seasons`, `/api/competitions` (season filter via query)
- Goals bets:
  - `POST /api/goals-bets` (body `{ matchDayId, forwardId?, midfieldId?, defenseId? }`)
  - `GET /api/goals-bets/matchday/{id}`
- Global bets:
  - `POST /api/global-bets` (body with competitionId + predictions)
  - `GET /api/global-bets/competition/{id}`
- Global results (admin use):
  - `POST /api/global-results` to create results
  - `GET /api/global-results/{id}`

Rankings:
- `GET /api/rankings/matchday/{id}`
- `GET /api/rankings/global/{id}`

```
## Database

The Prisma schema lives in `nuxt-app/prisma/schema.prisma` and defines
the data model migrated from the original Django project. If you're
continuing from an existing PostgreSQL database created by the legacy
Django app, you can introspect it to generate an initial schema:

```bash
cd nuxt-app
npx prisma db pull          # introspects an existing database
npx prisma generate         # generate client
```

For new projects or after editing the schema, create migrations and
apply them:

```bash
npx prisma migrate dev      # creates and runs a new migration
```


## Legacy Django

The legacy Django code and templates remain in the repository for
reference during the rewrite. The new Nuxt.js application lives under
`nuxt-app/`.

---

*Older OpenShift-specific instructions have been removed.*

