# Estructura del código

## Frontend (demo `siltgov-demo`)

### Stack

- **Runtime:** React 18.3, React Router 7
- **Build:** Vite 6, TypeScript 5.9
- **UI:** Tailwind CSS 4, Radix UI, shadcn-style components, Lucide icons
- **Calidad:** ESLint 9, Vitest, script `verify:a11y-buttons`

### Páginas públicas

- `/` — Landing (`Home.tsx`)
- `/login`, `/forgot-password`, `/two-factor-auth` — Autenticación (demo)
- `/faq`, `/about` — Información institucional

### Módulos por rol (layout `AdminLayout`)

| Prefijo | Actor | Vistas principales |
|---------|--------|-------------------|
| `/superuser` | Superusuario | Departamentos, sectores, entidades, oficinas, administradores, auditoría |
| `/admin` | Administrador | Sentencias, liquidadores, pagadores, solicitudes de edición, estadísticas |
| `/liquidator` | Liquidador | Pendientes, liquidaciones, cálculo y procesamiento |
| `/payer` | Pagador | Pendientes, pagadas, historial, registro de pago |

### Componentes transversales

- `Navbar`, `Sidebar`, `Footer`, `HomeNavbar`, `HomeFooter`
- `Modal`, `ConfirmDialog`, `Pagination`, `StatCard`
- **Accesibilidad:** `SkipToContent`, `ActionTooltip`, `IconActionButton`, `InfoTooltip`
- **UI base:** `src/app/components/ui/*` (Radix + CVA)

### Rutas

- Definición central: `src/app/routes.tsx`
- Entrada: `src/main.tsx` → `src/app/App.tsx` (`TooltipProvider`, toasts Sonner)

### Datos demo

- Fixtures locales en `src/app/pages/**/` (`payerData.ts`, `paymentModel.ts`, etc.)
- Sin backend en esta versión (frontend-only)

## Estructuras críticas

| Ruta | Motivo | Cambios permitidos |
|------|--------|-------------------|
| `src/app/routes.tsx` | Mapa de navegación y roles | Añadir rutas; no romper paths existentes |
| `vite.config.ts` | Alias `@`, assets Figma, `base` para GitHub Pages | Solo `base` y plugins documentados |
| `.ai/` | Framework multiagente local | **No publicar** — listado en `.gitignore` |
| `.github/workflows/ci.yml` | Pipeline de calidad y despliegue | Mantener verde en main |

## Backend previsto (referencia arquitectónica — no implementado en demo)

- API REST/GraphQL bajo `/api/v1`
- Servicios: liquidaciones, sentencias, pagos, auditoría, identidad
- Ver `docs/architecture/overview.md`
