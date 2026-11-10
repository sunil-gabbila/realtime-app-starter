# Development setup

This document describes the intended local workflow. The repository is an architecture starter; application packages and scripts need to be generated once the product scope is selected.

## Prerequisites

- Current Node.js LTS and its included package manager (pin exact versions in the project once scaffolded).
- Docker Desktop or another Docker Compose implementation.
- Git.

## Local services

Create `infra/compose.yaml` with PostgreSQL and Redis services, named volumes, and health checks. Bind service ports to localhost only. Use a local development database password and never reuse production credentials.

Example local environment values (store in an ignored `.env`, not in source control):

```dotenv
DATABASE_URL=postgresql://app:app_dev_only@localhost:5432/app
REDIS_URL=redis://localhost:6379
API_PORT=3000
WEB_ORIGIN=http://localhost:5173
```

Commit `.env.example` with placeholders and ensure `.env` is ignored. Do not commit real credentials.

## Suggested bootstrap order

1. Create a TypeScript workspace with `apps/web`, `apps/api`, and `packages/contracts`.
2. Add strict TypeScript settings, formatting/linting, and a shared runtime schema library.
3. Implement a health endpoint and a database migration before adding product features.
4. Add one authenticated socket connection and a typed ping/ack event to validate the local transport.
5. Define a real domain command, authorization rule, transaction, acknowledgement, and broadcast.
6. Add reconnect recovery with a snapshot/cursor before treating live updates as reliable.
7. Add Redis adapter configuration only when running multiple API replicas.

## Local verification checklist

- Web app and API start independently with documented commands.
- Database health check passes and migrations can run repeatedly.
- Unauthenticated socket connections are rejected.
- Invalid payloads and unauthorized room joins are rejected.
- A committed update is visible to another authorized client.
- After disconnect/reconnect, the client catches up from a snapshot or cursor.
- Shutdown closes sockets and database connections cleanly.

## Environment separation

Use separate credentials and databases for local, test, staging, and production. In deployment, inject secrets through the platform secret manager. Configure allowed web origins, connection limits, log retention, and database backups per environment. Keep schema migrations backward-compatible during rolling deployments.

