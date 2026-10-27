# Template Front UI

Angular 22 template with Clean Architecture, TailwindCSS 4, PrimeNG 21, Vitest, Husky, and pnpm.

## Quick Start

```bash
pnpm install
pnpm prepare          # install git hooks (husky)
pnpm start            # dev server at http://localhost:4200
pnpm build            # production build to dist/
pnpm test             # unit tests (Vitest)
pnpm watch            # build in watch mode
pnpm format           # format code (fix)
pnpm format:check     # check formatting (CI)
```

## Stack (with versions)

- **Angular** ^22.0.0 — standalone components, signals, `inject()`, zoneless-ready, OnPush default
- **PrimeNG** ^21.1.10 — UI component library
- **@primeuix/themes** ^3.0.1 — Theming (Nora preset)
- **PrimeIcons** ^8.0.2 — PrimeNG icons
- **FontAwesome Free** ^7.3.1 — Icon font
- **Material Symbols** ^0.48.0 — Material Design icons (outlined/rounded/sharp)
- **Chart.js** 4.4.2 — Charts (available for use)
- **TailwindCSS** ^4.1.12 — Utility-first CSS
- **tailwindcss-primeui** ^0.6.1 — Tailwind plugin for PrimeUI
- **TypeScript** ~6.0.2 — Strict mode, project references
- **Vitest** ^4.0.8 — Unit tests via Angular builder
- **Husky** ^9.1.7 — Git hooks
- **lint-staged** ^17.6.0 — Staged file linting
- **Prettier** ^3.8.1 — Formatting
- **pnpm** @11.24.0 — Enforced package manager

## Architecture

This is a **Clean Architecture** template. At project kickoff, choose **one** structural guideline and document it in `AGENTS.md`:

| Guideline                       | Best for                                       |
| ------------------------------- | ---------------------------------------------- |
| **Directriz A — Layer-first**   | Small/medium projects (1-5 features, 1-2 devs) |
| **Directriz B — Feature-first** | Large/multi-team projects, many features       |

See [Clean_Architecture_FrontEnd.md](./Clean_Architecture_FrontEnd.md) for details.

### Conventions

- No NgModules — standalone components only
- State: signals + `computed()`, no `mutate`
- Forms: prefer Signal Forms (`@angular/forms/signals`)
- Templates: native control flow (`@if`, `@for`, `@switch`)
- Services: `@Service` (v22+) or `providedIn: 'root'`, use `inject()`
- Accessibility: AXE / WCAG AA required

## Project Structure

```
src/
├── app/
│   ├── app.ts                    # Root component + ThemeService injection
│   ├── app.config.ts             # Providers: PrimeNG, Router (input binding, scroll), Locale es-MX
│   ├── app.routes.ts             # Empty (lazy-loaded feature routes)
│   └── core/
│       ├── config/
│       │   └── prime-ng.config.ts    # PrimeNG theme (Nora preset, slate surfaces, darkModeSelector, locale)
│       └── services/
│           ├── theme-service.ts      # Signal-based dark/light toggle, localStorage persistence
│           └── layout-service.ts     # Sidebar state (collapsed/mobile) — extend or remove as needed
├── shared/
│   └── utils/
│       ├── array.util.ts           # Array utilities (with tests)
│       └── type-guards.util.ts     # Type guard helpers (with tests)
├── environments/
│   ├── environment.ts              # Production placeholder (empty)
│   └── environment.development.ts  # Development placeholder (empty)
├── main.ts                         # bootstrapApplication entry point
├── styles.css                      # Tailwind + PrimeUI plugin + icons + dark variant + global styles
└── index.html                      # Inline theme init script (localStorage + prefers-color-scheme)
```

## Configuration Files

| File                                                         | Purpose                                                                            |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `AGENTS.md`                                                  | Agent guidelines, commands, architecture decisions                                 |
| `Clean_Architecture_FrontEnd.md`                             | Full Clean Architecture specification                                              |
| `.github/copilot-instructions.md`                            | Angular/TypeScript coding standards                                                |
| `.github/universal-rules.instructions.md`                    | Immutable agent execution rules                                                    |
| `tsconfig.json` / `tsconfig.app.json` / `tsconfig.spec.json` | TypeScript config (strict, project refs, path aliases)                             |
| `.prettierrc`                                                | Formatting (printWidth: 100, single quotes, angular parser for HTML)               |
| `.postcssrc.json`                                            | TailwindCSS 4 PostCSS plugin                                                       |
| `.husky/pre-commit`                                          | Runs `lint-staged` (Prettier)                                                      |
| `.husky/pre-push`                                            | Runs `pnpm format:check && pnpm build && pnpm test --no-watch`                     |
| `pnpm-workspace.yaml`                                        | Native build allowances (`@parcel/watcher`, `esbuild`, `lmdb`, `msgpackr-extract`) |
| `.editorconfig`                                              | Editor settings (UTF-8, 2-space indent, single quotes)                             |
| `.vscode/extensions.json`                                    | Recommends `angular.ng-template`                                                   |

## Git Hooks (Husky)

| Hook         | Command                                                   | Purpose                                      |
| ------------ | --------------------------------------------------------- | -------------------------------------------- |
| `pre-commit` | `pnpm exec lint-staged`                                   | Runs Prettier on staged files                |
| `pre-push`   | `pnpm format:check && pnpm build && pnpm test --no-watch` | Format check + build + test gate before push |

Install: `pnpm prepare` (runs `husky install`)

## PrimeNG & Theming

- **Config**: `src/app/core/config/prime-ng.config.ts`
  - Preset: **Nora** (from `@primeuix/themes/nora`)
  - Primary palette: Blue (50-950)
  - Surface palette: **Slate** (50-950) for both light/dark
  - `darkModeSelector: '.app-dark'` — syncs with ThemeService
  - `cssLayer: { name: 'primeng', order: 'theme, base, primeng, utilities' }`
  - **Locale**: Spanish (es-MX) — full translation config (day/month names, date format, etc.)
  - Ripple: enabled
- **Provider**: `providePrimeNG(PrimeNgConfig)` in `app.config.ts`

## Theme System

- **Service**: `src/app/core/services/theme-service.ts`
  - Signal-based (`_isDark = signal(false)`)
  - Toggles `.app-dark` class on `<html>` element
  - Persists to `localStorage` (`template-theme`)
  - Reads initial theme from localStorage or `prefers-color-scheme`
- **Index HTML**: `src/index.html` — inline script runs **before** Angular bootstrap to prevent flash
- **Tailwind dark variant**: `@custom-variant dark (&:where(.app-dark, .app-dark *))` in `styles.css`
- **PrimeNG sync**: `darkModeSelector: '.app-dark'` in prime-ng.config.ts
- **App component**: Injects `ThemeService`, renders toggle button with dynamic icon (moon/sun)

## Router & Locale

- `provideRouter` with:
  - `withComponentInputBinding()` — route params as `input()`
  - `withRouterConfig({ paramsInheritanceStrategy: 'always' })`
  - `withInMemoryScrolling({ scrollPositionRestoration: 'top' })`
- Default locale: **es-MX** (registered via `registerLocaleData` in `app.config.ts`)
- `LOCALE_ID` provider set to `es-MX`

## Build Budget

- Initial bundle **warning**: 700kB (configured in `angular.json`)
- Initial bundle **error**: 1MB
- Any component style **warning**: 4kB
- Any component style **error**: 8kB

## Available Utilities

- **Chart.js** (^4.4.2) — installed, ready for chart components
- **LayoutService** — sidebar collapsed/mobile state management
- **Array utilities** — `src/app/shared/utils/array.util.ts` (with tests)
- **Type guards** — `src/app/shared/utils/type-guards.util.ts` (with tests)

## Adding Features

1. Define routes in `src/app/app.routes.ts` using `loadComponent`/`loadChildren`
2. Add `provideHttpClient(withInterceptors([...]))` to `app.config.ts` when needed
3. Follow the chosen Clean Architecture guideline (A or B)

## References

- [AGENTS.md](./AGENTS.md) — agent instructions, commands, conventions
- [Clean Architecture spec](./Clean_Architecture_FrontEnd.md) — both structural guidelines
- [Angular 22 docs](https://angular.dev)

## Authorship

Designed and maintained by [David Cruz](https://github.com/Davidmctf) —
[portfolio](https://davidmctf.github.io/) ·
[consulting & development services](https://mjodlanding.vercel.app/).

- **Architecture standard** (`Clean_Architecture_FrontEnd.md`): an original adaptation of Clean
  Architecture to the front-end, with two structural guidelines (layer-first / feature-first)
  derived from experience on production projects.
- **Agent system** (`.github/agents/`, `universal-rules.instructions.md`): agents written in
  [SFD (Syntax Functional Declarative)](https://davidmctf.github.io/#/sfd-project) and a persistent session-context workflow backed by
  `context.sqlite`.
- The Angular conventions in `copilot-instructions.md` build on the
  [official Angular AI guidelines](https://angular.dev/ai/develop-with-ai).

## License

[MIT](./LICENSE)
