# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-15

### Added

- Professional portfolio packaging for the SILTGOV Figma Make frontend demo.
- Accessibility layer: skip link, global tooltips, `ActionTooltip` / `IconActionButton`, automated button name verification.
- Documentation under `docs/` (architecture reference, implementation and integration reports).
- CI pipeline: ESLint, Vitest, production build, GitHub Pages deployment.
- MIT License and project metadata (`siltgov-demo` v1.0.0).

### Changed

- HTML language `es-CO`, meta tags and project branding for public demo.
- `vite.config.ts` supports `BASE_PATH` for GitHub Pages.

### Security

- Local `.ai/` multi-agent framework excluded from version control.

[1.0.0]: https://github.com/AndreyQuicenoC/siltgov-demo/releases/tag/v1.0.0
