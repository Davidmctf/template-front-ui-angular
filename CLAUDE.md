# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

`AGENTS.md` (imported above) is the source of truth for commands, stack versions, and project structure. This file only adds what AGENTS.md is missing, plus corrections where it's wrong.

## Agent workflow rules

`.github/universal-rules.instructions.md` claims top precedence and must be followed:

- Before working: read `AGENTS.md` and load the last session from `.github/context.sqlite` (tables `session_context`, `session_notes`). Use the `session-context` skill, or `sqlite3` directly.
- After working: write a `session_context` row (summary, tasks_completed, files_modified, pending_tasks) and `session_notes` entries.
- Project-specific decisions and state go into `context.sqlite`, not into markdown. Don't create temporary or ad-hoc markdown files unless the user asks for them.
- `context.sqlite` is git-ignored (`.github/*` is ignored except `agents/` and the two instruction files), so session state exists only on this machine.
- Agents exist twice with the same body: `.claude/agents/*.md` (Claude Code) and `.github/agents/*.agent.md` (Copilot frontmatter). Change both together.

Coding rules from `.github/copilot-instructions.md` that are easy to get wrong:

- Never write `standalone: true` or `changeDetection: OnPush` explicitly. Both are defaults in Angular 22.
- Use the `host: {}` metadata, not `@HostBinding`/`@HostListener`.
- Use `[class.x]`/`[style.x]` bindings, not `ngClass`/`ngStyle`.
- Use `@Service()` for new singletons.
- Use `NgOptimizedImage` for static images.

## Commands not covered in AGENTS.md

```bash
pnpm test --no-watch                                                  # run all tests once (Vitest + jsdom)
pnpm test --no-watch --include src/app/shared/utils/array.util.spec.ts  # single spec file
pnpm build                                                            # also the type check (strict + strictTemplates)
```

There is no ESLint and no CI workflow. The only gates are lint-staged Prettier on commit, and `format:check && build && test` on pre-push.

## Architecture: what spans multiple files

### Theme contract

Dark mode works only if these four pieces stay in sync. They share the `.app-dark` class on `<html>` and the localStorage key `template-theme`:

1. `src/index.html`: an inline script applies the class before bootstrap, to avoid a flash of the wrong theme.
2. `src/app/core/services/theme-service.ts`: a signal plus an `effect` that writes the class and localStorage. `afterNextRender` reads the initial value.
3. `src/app/core/config/prime-ng.config.ts`: `darkModeSelector: '.app-dark'`.
4. `src/styles.css`: `@custom-variant dark (&:where(.app-dark, .app-dark *))` for Tailwind `dark:`.

If you rename the class or the key, change all four places plus `theme-service.spec.ts`.

### Clean Architecture (`Clean_Architecture_FrontEnd.md`)

The structural guideline is **not chosen yet**. Ask the user before creating the first feature, then record the decision in `context.sqlite` (or in AGENTS.md, as its kickoff section requests).

- **A, layer-first:** `core/` (models, interfaces, usecases, repository ports), `data/` (concrete repositories, mappers), `infrastructure/` (auth, guards, interceptors), `presentation/` (pages, components, `store/`), `shared/`.
- **B, feature-first:** `modules/<feature>/{domain,application,infrastructure,presentation}`, plus a `feature.providers.ts` that exports `provideXFeature()` (built with `makeEnvironmentProviders`, binding port → adapter). That function is registered in `app.config.ts` or on a lazy route. The `@modules/*` tsconfig alias already exists for this.
- Dependencies always point inward: presentation → application/usecases → domain. Infrastructure implements the domain ports, which are abstract classes used as DI tokens.
- State rules:
  - Stores hold signals and expose them via `asReadonly()`.
  - Only use cases write to stores.
  - Observables are used only for the HTTP round trip (`tap` into the store).
  - Components read signals from facades and never subscribe to state.
  - `effect()` is only for syncing with the outside world (DOM, localStorage).

Path aliases (in `tsconfig.json`): `@app/*`, `@core/*`, `@shared/*` (all under `src/app/`), `@modules/*`, `@env/*`.

## Corrections and gotchas

- Shared utilities live in `src/app/shared/utils/`, not `src/shared/` as the AGENTS.md tree shows.
- `src/app/app.html` is the Angular welcome placeholder. `src/app/app.spec.ts` asserts its `Hello, template-front-ui` heading, so update that spec when you replace the placeholder.
- `src/styles.css` sets `overflow: hidden` on `html, body`. Any layout must provide its own scroll container.
- `src/index.html` has `lang="en"` while the app locale is `es-MX`.
- `HttpClient` is not provided yet, and both environment files export `{}`.
- Chart.js is installed but not used anywhere.
