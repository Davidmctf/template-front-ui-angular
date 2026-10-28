# AGENTS.md

This file contains guidelines for agentic coding agents working in this repository. It standardizes build, lint, test workflows, and code‑quality expectations for **Angular 22** projects in this repo. (FRONT-END ONLY, CLEAN ARCHITECTURE, TEMPLATE BASE FRONT END PROJECT)

## Referenced Files

- **universal-rules.instructions.md**: [path](.github/universal-rules.instructions.md) — immutable execution workflow, database operations
- **copilot-instructions.md**: [path](.github/copilot-instructions.md) — Angular 22 / TypeScript best practices (signals, standalone, inject(), etc.)
- **Clean_Architecture_FrontEnd.md**: [path](./Clean_Architecture_FrontEnd.md) — two structural guidelines (layer-first A, feature-first B); **pick one at kickoff**

## Project-Specific Decisions (REQUIRED AT KICKOFF)

**Clean Architecture guideline:** Not yet chosen. Choose **Directriz A (layer-first)** for small/medium projects (1-5 features, 1-2 devs) or **Directriz B (feature-first)** for large/multi-team projects. Document the choice here once decided.

## Commands

| Task              | Command                                           |
| ----------------- | ------------------------------------------------- |
| Dev server        | `pnpm start` (or `ng serve`)                      |
| Build (prod)      | `pnpm build` (or `ng build`)                      |
| Build (watch)     | `pnpm watch`                                      |
| Unit tests        | `pnpm test` (Vitest via Angular builder)          |
| Type check        | `ng build` (compiles with strict TS config)       |
| Format (fix)      | `pnpm format` (or `npx prettier --write .`)       |
| Format (check)    | `pnpm format:check` (or `npx prettier --check .`) |
| Git hooks install | `pnpm prepare` (runs husky install)               |

**Package manager:** `pnpm@11.24.0` (enforced via `packageManager` in package.json)

## Stack Summary (with versions)

| Category       | Package              | Version              |
| -------------- | -------------------- | -------------------- |
| **Core**       | Angular              | ^22.0.0              |
| **UI Library** | PrimeNG              | ^21.1.10             |
| **Theming**    | @primeuix/themes     | ^3.0.1 (Nora preset) |
| **Icons**      | PrimeIcons           | ^8.0.2               |
|                | FontAwesome Free     | ^7.3.1               |
|                | Material Symbols     | ^0.48.0              |
| **Styling**    | TailwindCSS          | ^4.1.12              |
|                | @tailwindcss/postcss | ^4.1.12              |
|                | tailwindcss-primeui  | ^0.6.1               |
| **Charts**     | Chart.js             | 4.4.2                |
| **Testing**    | Vitest               | ^4.0.8               |
| **Formatting** | Prettier             | ^3.8.1               |
| **Git Hooks**  | Husky                | ^9.1.7               |
|                | lint-staged          | ^17.6.0              |
| **Language**   | TypeScript           | ~6.0.2               |

## Architecture Notes

- Entry point: `src/main.ts` → `bootstrapApplication(App, appConfig)`
- App config: `src/app/app.config.ts` (providers: router, PrimeNG, global error listeners, locale)
- Routes: `src/app/app.routes.ts` (empty — add lazy-loaded feature routes)
- **No NgModules** — use standalone components, `inject()`, `input()`, `output()`, signals
- **HttpClient**: add `provideHttpClient(withInterceptors([...]))` in app.config when needed
- **Lazy loading**: define feature routes in `app.routes.ts` with `loadComponent`/`loadChildren`

### PrimeNG Integration

- Config: `src/app/core/config/prime-ng.config.ts`
  - Preset: **Nora** (from `@primeuix/themes/nora`)
  - Primary palette: Blue (50-950)
  - Surface palette: **Slate** (50-950) for both light/dark
  - `darkModeSelector: '.app-dark'` — syncs with ThemeService
  - `cssLayer: { name: 'primeng', order: 'theme, base, primeng, utilities' }`
  - **Locale**: Spanish (es-MX) — full translation config (day/month names, date format, etc.)
  - Ripple: enabled
- Provider: `providePrimeNG(PrimeNgConfig)` in `app.config.ts`

### Icon Libraries

All imported in `src/styles.css`:

- **PrimeIcons** — `@import 'primeicons/primeicons.css'` (used in theme toggle button)
- **FontAwesome Free** — `@import '@fortawesome/fontawesome-free/css/all.min.css'`
- **Material Symbols** — outlined, rounded, sharp variants

### Theme System

- **Service**: `src/app/core/services/theme-service.ts`
  - Signal-based (`_isDark = signal(false)`)
  - Toggles `.app-dark` class on `<html>` element
  - Persists to `localStorage` (`template-theme`)
  - Reads initial theme from localStorage or `prefers-color-scheme`
- **Index HTML**: `src/index.html` — inline script runs **before** Angular bootstrap to prevent flash:
  ```js
  var theme = localStorage.getItem('template-theme');
  if (theme === 'dark' || (!theme && matchMedia('(prefers-color-scheme:dark)').matches)) {
    document.documentElement.classList.add('app-dark');
  }
  ```
- **Tailwind dark variant**: `@custom-variant dark (&:where(.app-dark, .app-dark *))` in `styles.css`
- **PrimeNG sync**: `darkModeSelector: '.app-dark'` in prime-ng.config.ts
- **App component**: Injects `ThemeService`, renders toggle button with dynamic icon (moon/sun)

### Router & Locale

- `provideRouter` with:
  - `withComponentInputBinding()` — route params as `input()`
  - `withRouterConfig({ paramsInheritanceStrategy: 'always' })`
  - `withInMemoryScrolling({ scrollPositionRestoration: 'top' })`
- Default locale: **es-MX** (registered via `registerLocaleData` in `app.config.ts`)
- `LOCALE_ID` provider set to `es-MX`

### Git Hooks (Husky)

| Hook         | Command                                                   | Purpose                                      |
| ------------ | --------------------------------------------------------- | -------------------------------------------- |
| `pre-commit` | `pnpm exec lint-staged`                                   | Runs Prettier on staged files                |
| `pre-push`   | `pnpm format:check && pnpm build && pnpm test --no-watch` | Format check + build + test gate before push |

- `pnpm-workspace.yaml`: Allows native builds for `@parcel/watcher`, `esbuild`, `lmdb`, `msgpackr-extract`
- Install: `pnpm prepare` (runs `husky`)

### Project Structure

```
src/
├── app/
│   ├── app.ts                    # Root component + ThemeService injection + ButtonModule
│   ├── app.config.ts             # Providers: PrimeNG, Router (input binding, scroll), Locale es-MX
│   ├── app.routes.ts             # Empty (lazy-loaded features)
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

### Configuration Files

| File                                                         | Purpose                                                              |
| ------------------------------------------------------------ | -------------------------------------------------------------------- |
| `AGENTS.md`                                                  | Agent guidelines, commands, architecture decisions                   |
| `Clean_Architecture_FrontEnd.md`                             | Full Clean Architecture specification                                |
| `.github/copilot-instructions.md`                            | Angular/TypeScript coding standards                                  |
| `.github/universal-rules.instructions.md`                    | Immutable agent execution rules                                      |
| `.claude/agents/*.md`                                        | SFD v3.1 agents for Claude Code                                      |
| `.github/agents/*.agent.md`                                  | Same agents for GitHub Copilot (same body, Copilot frontmatter)      |
| `tsconfig.json` / `tsconfig.app.json` / `tsconfig.spec.json` | TypeScript config (strict, project refs, path aliases)               |
| `.prettierrc`                                                | Formatting (printWidth: 100, single quotes, angular parser for HTML) |
| `.postcssrc.json`                                            | TailwindCSS 4 PostCSS plugin                                         |
| `.husky/pre-commit`                                          | Runs `lint-staged` (Prettier)                                        |
| `.husky/pre-push`                                            | Runs `pnpm build && pnpm test --no-watch`                            |
| `pnpm-workspace.yaml`                                        | Native build allowances                                              |
| `.editorconfig`                                              | Editor settings (UTF-8, 2-space indent, single quotes)               |
| `.vscode/extensions.json`                                    | Recommends `angular.ng-template`                                     |

### Build Budget

- Initial bundle **warning**: 700kB (configured in `angular.json`)
- Initial bundle **error**: 1MB
- Any component style **warning**: 4kB
- Any component style **error**: 8kB

### Available Utilities

- **Chart.js** (^4.4.2) — installed, ready for chart components
- **LayoutService** — sidebar collapsed/mobile state management
- **Array utilities** — `src/app/shared/utils/array.util.ts` (with tests)
- **Type guards** — `src/app/shared/utils/type-guards.util.ts` (with tests)

## Conventions (from copilot-instructions.md)

- Components: small, single responsibility, inline templates for small ones
- State: signals + `computed()`, no `mutate`, use `update`/`set`
- Forms: prefer Signal Forms (`@angular/forms/signals`), else Reactive forms
- Templates: native control flow (`@if`, `@for`, `@switch`), async pipe for observables
- Services: `@Service` (v22+) or `providedIn: 'root'`, use `inject()` not constructor DI
- Accessibility: must pass AXE, WCAG AA minimums

## Context Persistence

- **context.sqlite**: [path](.github/context.sqlite) — session state (session_context, session_notes tables)
- Use `sqlite3` CLI to read/write context between sessions per universal-rules.md

## NOTE (IMPORTANT): The content after this marker is project-specific and should be stored in the database, not in markdown format

...
