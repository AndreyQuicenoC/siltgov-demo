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

El workflow `.github/workflows/ci.yml` publica automáticamente en cada push a `main` con `BASE_PATH=/siltgov-demo/`.

URL esperada: `https://andreyquicenoc.github.io/siltgov-demo/`

## Variables

| Variable | Uso |
|----------|-----|
| `BASE_PATH` | Prefijo de assets (GitHub Pages subpath) |

## Checklist pre-release

1. `npm run ci` en local
2. Revisar `CHANGELOG.md`
3. Tag anotado `vX.Y.Z` y GitHub Release
