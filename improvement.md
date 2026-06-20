# Improvement Backlog

> Reviewed by platform expert and security audit agents. Implemented items marked ✅.

## Completed This Sprint

- [x] **Three.js immersive scroll journey** — R3F scene with lifecycle nodes, scroll camera, drag interaction
- [x] **Framer Motion + GSAP + Lenis** — Section animations, smooth scroll, progress bar
- [x] **Lazy-load 3D bundle** — `React.lazy` for ImmersiveCanvas
- [x] **Remove window globals** — AppContext replaces `triggerMatrix`, `playTypingSound`, `showNotification`
- [x] **nginx security headers + gzip** — CSP, XFO, nosniff, referrer policy
- [x] **SSH host key verification** — `ssh-keyscan` in deploy workflow
- [x] **Docker legacy-peer-deps** — Aligns with npm install
- [x] **Skip intro + reduced motion** — Loading screen skip, sessionStorage, `prefers-reduced-motion`
- [x] **Contact form honesty** — mailto: instead of fake alert; removed placeholder phone
- [x] **Cleanup** — Removed ParticleBackground, EnhancedParticleBackground, `.bolt/` scaffold files
- [x] **Guides** — `docs/SETUP.md`, `docs/DEPLOY.md`, `.cursor/skills/portfolio-3d-immersive/`

---

## P0 — Critical (Next)

- [ ] **Wire contact to real backend** — Formspree, Resend, or Web3Forms for server-side delivery
- [ ] **Replace placeholder project stats/URLs** — Verify GitHub stars, demo links, company URLs
- [ ] **Add HTTPS termination** — Caddy/Traefik in front of port 8080; enable HSTS after TLS works
- [ ] **Add Credly/ISC² badge embeds** — Verifiable certification proof

## P1 — High Value

- [ ] **Link 3D journey stages to DOM sections** — Highlight active node when Experience/Projects enter viewport
- [ ] **Connect theme switcher to 3D palette** — Pass CSS variables into CyberWorld lights/materials
- [ ] **Complete navbar IA** — Add Publications, Training, Achievements or "More" dropdown
- [ ] **Implement vCard download + PGP public key** — Real `.vcf` and ASCII-armored key block
- [ ] **Add og:image + JSON-LD** — Social preview and `Person` schema
- [ ] **WebGL fallback banner** — ✅ Partial: message shown; add retry/interaction trigger
- [ ] **Self-host gallery images** — Replace Pexels hotlinks for CSP simplicity
- [ ] **Docker hardening** — Non-root nginx, `127.0.0.1` bind, read-only FS, compose limits
- [ ] **Staging compose completion** — `docker-compose.staging.yml` needs `build: .`
- [ ] **Container healthcheck** — `curl -f http://localhost/` in compose

## P2 — Nice to Have

- [ ] **Post-processing** — Bloom + chromatic aberration via drei EffectComposer
- [ ] **Section pinning** — GSAP ScrollTrigger pinned case-study for flagship project
- [ ] **Instanced data tunnel** — Replace individual torus meshes with InstancedMesh
- [ ] **robots.txt + sitemap.xml** — Build-time generation from section anchors
- [ ] **Lighthouse CI gate** — LCP < 2.5s budget on mid-tier mobile
- [ ] **Bundle analyzer** — `rollup-plugin-visualizer` in CI
- [ ] **Privacy/Terms pages** — Or remove footer links to `/privacy`, `/terms`
- [ ] **Easter egg discoverability** — Subtle `?` hint for terminal commands

---

## Deploy Checklist

| Item | Status |
|------|--------|
| Dockerfile multi-stage | ✅ |
| `npm ci --legacy-peer-deps` | ✅ |
| nginx SPA fallback | ✅ |
| Security headers + gzip | ✅ |
| GitHub Actions + secrets | ✅ (needs secrets on repo) |
| SSH host verification | ✅ |
| HTTPS / TLS | ❌ Configure on server |
| Contact backend | ❌ mailto only |
| `robots.txt` / sitemap | ❌ |
| `og:image` | ❌ |

---

*Last updated: platform + security agent review, post-3D upgrade.*
