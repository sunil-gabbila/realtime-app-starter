# Real-time application starter

A practical baseline for a browser application that sends updates to connected users with low latency. This repository currently contains architecture and setup guidance; it does not yet implement a product-specific feature.

## Baseline stack

- **Web:** React + TypeScript, built with Vite
- **API and realtime gateway:** Node.js + TypeScript, HTTP REST plus Socket.IO over WebSocket (with polling fallback)
- **Persistence:** PostgreSQL as the source of truth
- **Realtime scale-out:** Redis adapter and Redis-backed ephemeral coordination when multiple API instances are needed
- **Local services:** Docker Compose for PostgreSQL and Redis

Keep the first deployment as a modular monolith: one API process owns HTTP routes, authentication, domain services, and socket event handlers. Split services only when load or team boundaries require it.

## Repository layout

```text
apps/
  web/                 Browser client
  api/                 HTTP API and realtime gateway
packages/
  contracts/           Shared event names and request/response types
  config/              Shared lint, TypeScript, and formatting config
infra/
  compose.yaml         Local PostgreSQL and Redis
docs/
  architecture.md
  development-setup.md
```

## Start here

Read [the architecture](docs/architecture.md) and [development setup](docs/development-setup.md). Before implementation, define the product domain, identity provider, authorization rules, expected concurrent connections, and deployment target. Those decisions affect event contracts, data retention, and production topology.

## Core design rules

1. PostgreSQL is authoritative. A successful socket emit is not a durable write.
2. Authenticate the socket handshake and authorize each room join and command on the server.
3. Validate every event payload at runtime; TypeScript types alone do not validate network input.
4. Persist state changes before acknowledging them. Include an event ID or idempotency key for retryable commands.
5. Treat presence and typing as ephemeral, expiring data; do not store them as durable domain state.
6. Add Redis pub/sub fan-out only when running more than one API instance.
7. Reconnect with backoff, then fetch a snapshot or replay from a cursor to recover missed updates.

