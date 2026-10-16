# Despliegue

## Requisitos

- Node.js 20+
- npm 10+

## Local

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build
npm run preview
```

## GitHub Pages

1. En GitHub: **Settings → Pages → Build and deployment → GitHub Actions**.
2. El workflow `.github/workflows/deploy-pages.yml` publica en cada push a `main` (o manualmente) con `BASE_PATH=/siltgov-demo/`.

El workflow `.github/workflows/ci.yml` valida calidad (lint, a11y, tests, build) y debe permanecer en verde.

URL esperada: `https://andreyquicenoc.github.io/siltgov-demo/`

## Variables

| Variable | Uso |
|----------|-----|
| `BASE_PATH` | Prefijo de assets (GitHub Pages subpath) |

## Checklist pre-release

1. `npm run ci` en local
2. Revisar `CHANGELOG.md`
3. Tag anotado `vX.Y.Z` y GitHub Release
