# Portfolio — Quick Start

Cybersecurity portfolio with immersive Three.js scroll journey.

## Requirements

- Node.js 20+
- npm 9+

## Setup

```bash
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:5173

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

## 3D Interaction

- **Scroll** — Camera walks through the security lifecycle (Recon → Secure)
- **Drag nodes** — Push/pull 3D objects in the hero viewport
- **Themes** — Use the theme switcher (top-right)

## Project Structure

```
src/
  components/three/   # R3F immersive scene
  components/         # Portfolio sections
  hooks/              # Scroll + smooth scroll
```

See `.cursor/skills/portfolio-3d-immersive/SKILL.md` for 3D development guide.
