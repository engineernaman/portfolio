---
name: portfolio-3d-immersive
description: Builds and maintains the immersive Three.js portfolio for Soumy Naman Srivastava. Covers React Three Fiber scenes, scroll-driven camera, Framer Motion sections, GSAP/Lenis smooth scroll, and cyberpunk 3D aesthetics. Use when working on 3D scenes, portfolio animations, immersive interactions, or upgrading the portfolio site.
---

# Portfolio 3D Immersive Experience

## Stack

| Layer | Library | Purpose |
|-------|---------|---------|
| 3D | `three`, `@react-three/fiber`, `@react-three/drei` | WebGL scenes, scroll camera, interactive nodes |
| Motion | `framer-motion` | Section reveals, hero choreography, scroll progress bar |
| Scroll | `lenis`, `gsap` + ScrollTrigger | Smooth scroll driving 3D camera |
| UI | React 18, Vite, Tailwind | Content sections over fixed 3D canvas |

## Architecture

```
ImmersiveCanvas (fixed, z-index -10)
  └── CyberWorld
        ├── ScrollCamera — lerps camera with window scroll
        ├── DataTunnel — animated torus rings
        ├── InteractiveNode × 5 — drag/push security lifecycle stages
        └── Grid + Stars + Sparkles

App content (z-index 10)
  └── AnimatedSection wraps each portfolio section
```

## Key Files

- `src/components/three/ImmersiveCanvas.tsx` — Canvas wrapper, WebGL fallback
- `src/components/three/CyberWorld.tsx` — Main scene, scroll-driven journey
- `src/components/three/InteractiveNode.tsx` — Draggable distorted meshes
- `src/hooks/useScrollProgress.ts` — Normalized 0–1 scroll for 3D
- `src/hooks/useSmoothScroll.ts` — Lenis + GSAP integration

## Patterns

### Scroll-driven camera
Read `useScrollProgress()` in `useFrame` to lerp camera position. Stages reveal based on `progress * stages.length`.

### Interactive nodes
`InteractiveNode` uses pointer capture for drag-to-push physics. Hero section uses `pointer-events-none` with `pointer-events-auto` on CTAs so 3D receives input.

### Performance
- `dpr={1}` on mobile, max 2 on desktop
- `performance={{ min: 0.5 }}` on Canvas
- WebGL fallback to gradient when unsupported
- Remove duplicate canvas backgrounds (old ParticleBackground removed)

### Adding a new lifecycle stage
1. Add entry to `JOURNEY_STAGES` in `CyberWorld.tsx`
2. Match label to security narrative (Recon → Secure)
3. Tune `offset` z-depth for scroll reveal timing

## Deploy

Docker + nginx on IONOS. See [docs/DEPLOY.md](docs/DEPLOY.md).

## References

- Global 3D patterns: `~/.claude/skills/3d-web-experience/`
- Framer Motion: `~/.claude/skills/framer-motion-animator/`
- GSAP React: `~/.claude/skills/gsap-react/`
