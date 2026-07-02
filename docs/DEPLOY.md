# Deploy Guide

## Target

IONOS VPS via GitHub Actions → pre-built `dist/` → Docker runtime → nginx on port 8004.

## Why CI builds (not the VPS)

Vite + Three.js builds can exceed 10+ minutes and OOM small VPS instances. The SSH session was dropping with `client_loop: send disconnect: Broken pipe`. **The frontend is built in GitHub Actions**; the server only runs a lightweight Node image that serves `dist/`.

## Server Requirements

| Requirement | Details |
|-------------|---------|
| Docker | Compose v1 (`docker-compose`) |
| RAM | 256MB+ for runtime (no build step on server) |
| Port | 8004 prod / 8081 staging |
| SSH | Key-based auth for CI |

## GitHub Secrets

| Secret | Purpose |
|--------|---------|
| `SSH_PRIVATE_KEY` | Deploy key |
| `USER` | SSH username |
| `HOST` | Server hostname/IP |
| `TARGET_DIR` | Remote project path |

## CI Pipeline

On push to `main` or `dev`:

1. `npm ci` + `npm run build` on GitHub Actions (ubuntu-latest)
2. `rsync` `dist/`, `server/`, `Dockerfile`, compose files to VPS
3. `docker-compose build` (runtime only — copies pre-built `dist/`)
4. `docker-compose up -d --force-recreate`

Concurrent deploys on the same branch are cancelled via `concurrency`.

## Manual Deploy

```bash
npm ci --legacy-peer-deps
npm run build
docker-compose -p portfolio-prod build
docker-compose -p portfolio-prod up -d --force-recreate
```

Production: `https://sn.zbsol.com` (nginx → `127.0.0.1:8004`)

## Staging

```bash
docker-compose -p portfolio-staging -f docker-compose.staging.yml up -d --build
```
