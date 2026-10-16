# SILTGOV Demo

[![CI](https://github.com/AndreyQuicenoC/siltgov-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/AndreyQuicenoC/siltgov-demo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-0347A6)](CHANGELOG.md)
[![WCAG oriented](https://img.shields.io/badge/WCAG-2.1%20AA%20oriented-green)](docs/implementation-report.md)

Demostración **frontend** del **Sistema Integrado de Liquidaciones Transparente del Gobierno Colombiano (SILTGOV)** — plataforma orientada a la gestión de sentencias judiciales, liquidación de intereses, pagos y trazabilidad en entidades públicas.

**Autor del diseño de experiencia, accesibilidad y empaquetado profesional:** [Andrey Quiceno C.](https://github.com/AndreyQuicenoC) — criterios alineados a **WCAG 2.1 AA**, **ISO/IEC 25010** y buenas prácticas **OWASP** para el sistema objetivo.

**Demo en vivo:** [GitHub Pages](https://andreyquicenoc.github.io/siltgov-demo/) (tras habilitar Pages en el repositorio)

> Prototipo visual basado en export Figma Make. Esta versión **no incluye backend**; los datos son simulados para exhibir flujos de negocio.

---

## Qué demuestra este proyecto

| Área | Contenido |
|------|-----------|
| **Modelo de negocio** | Roles Superusuario, Administrador, Liquidador y Pagador; ciclo sentencia → liquidación → pago |
| **Procesos críticos** | Cálculo de liquidación, aprobaciones, registro de soporte de pago, auditoría |
| **Calidad** | Pipeline CI, pruebas unitarias, verificación de nombres accesibles en botones |
| **Accesibilidad** | Skip link, tooltips operables (Radix), idioma `es-CO` |
| **Arquitectura futura** | [Visión backend, seguridad y eventos](docs/architecture/overview.md) |

---

## Stack (implementado)

- React 18, React Router 7, TypeScript
- Vite 6, Tailwind CSS 4
- Radix UI / componentes shadcn-style, Lucide, Recharts, Sonner

## Stack previsto (sistema integral)

Detalle en [docs/architecture/overview.md](docs/architecture/overview.md):

- API REST (NestJS/Spring), PostgreSQL, cola de eventos
- IdP OIDC + MFA, WAF, auditoría inmutable
- OpenTelemetry, despliegue en contenedores

---

## Inicio rápido

```bash
git clone https://github.com/AndreyQuicenoC/siltgov-demo.git
cd siltgov-demo
npm install
npm run dev
```

Calidad local (mismo gate que CI):

```bash
npm run ci
```

---

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [Estructura de código](docs/code-structure.md) | Módulos, rutas, componentes |
| [Reporte de implementación](docs/implementation-report.md) | HU portfolio, validación V1/V2 |
| [Reporte de integración](docs/integration-report.md) | Flujos demo y criterios |
| [Arquitectura objetivo](docs/architecture/overview.md) | Backend, OWASP, ISO 25010 |
| [Despliegue](docs/deployment.md) | Local y GitHub Pages |
| [Historias de usuario](docs/user-stories.md) | HU de referencia |

---

## Aprendizajes de portfolio

1. **Dominio público colombiano:** traducir normativa y roles institucionales a journeys claros por actor.
2. **Calidad verificable:** automatizar accesibilidad mínima (nombres de control) además del lint.
3. **Separación demo/producción:** frontend desplegable hoy, contratos API documentados para evolución full-stack.
4. **Gobernanza:** exclusión de frameworks internos (`.ai/`) del repositorio público.

---

## Licencia

MIT — ver [LICENSE](LICENSE).

## Créditos

- UI base: export [Figma Make — SILGOV](https://www.figma.com/design/HODNx3U7YDXuSNyUqLjthF/SILGOV---Sistema-Integrado-de-Liquidaciones-Transparente--del-Gobierno-Colombiano)
- Empaquetado, a11y, CI/CD y documentación: **Andrey Quiceno C.**
