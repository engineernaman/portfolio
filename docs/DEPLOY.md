# Deploy Guide

## Target

IONOS VPS via GitHub Actions → Docker → nginx on port 8080.

## Server Requirements

| Requirement | Details |
|-------------|---------|
| Docker | 20+ with Compose v2 |
| RAM | 512MB minimum (1GB recommended for builds) |
| Disk | ~500MB for image + node_modules during build |
| Port | 8080 exposed (mapped in `docker-compose.yml`) |
| SSH | Key-based auth for CI |

## GitHub Secrets

Configure in repo Settings → Secrets:

| Secret | Purpose |
|--------|---------|
| `SSH_PRIVATE_KEY` | Deploy key for server |
| `USER` | SSH username |
| `HOST` | Server hostname/IP |
| `TARGET_DIR` | Remote project path |

## Manual Deploy

```bash
docker compose build --no-cache
docker compose up -d
```

Site serves at `http://<host>:8080`

## CI Pipeline

On push to `main`:
1. `rsync` repo to server
2. `docker compose build --no-cache`
3. `docker compose up -d`
4. `docker system prune -f`

## Build Notes

- Vite bundles Three.js (~1MB+). First load may be slower; use `Preload` in scene.
- WebGL required for 3D; static gradient fallback otherwise.
- nginx SPA config rewrites 404 → `index.html`.

## Staging

```bash
docker compose -f docker-compose.staging.yml up -d
```
