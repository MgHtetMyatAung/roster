# Dashboard — Developer Rules

> These rules are **non-negotiable**. Every contributor — human or AI — must follow them.
> If a rule feels wrong, open a discussion first. Don't silently break convention.

---

## 1. Project Architecture

### Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React 19 + Vite (SWC) | ^19.2 |
| Language | TypeScript (strict mode) | ^5.9 |
| Routing | React Router 7 (BrowserRouter) | ^7.11 |
| State Management | Redux Toolkit + Zustand | ^2.11 / ^5.0 |
| Styling | Tailwind CSS v4 + Base UI (shadcn) | ^4.1 |
| Forms | react-hook-form + zod | ^7 / ^4.3 |
| Icons | Lucide React + Hugeicons | latest |
| Mocking | MSW (Mock Service Worker) | ^2.12 |
| i18n | i18next + react-i18next | ^25.7 / ^16.5 |
| Package Manager | pnpm | — |

### Directory Structure

```
src/
├── api/             # API interaction logic & endpoints
├── app/             # Application core (Redux store, shared logic)
├── assets/          # Static assets (images, fonts, global icons)
├── components/      # UI components
│   ├── common/      # Generic shared components (loaders, error boundaries)
│   ├── ui/          # shadcn-like primitive UI components (Base UI)
│   └── [feature]/   # Feature-specific UI components
├── constants/       # Global constants (route names, config keys)
├── features/        # Business logic & Domain-specific logic (slices, logic)
├── hooks/           # Custom React hooks
├── i18n/            # Internationalization configuration & translations
├── layouts/         # Page layout templates (RootLayout, DashboardLayout)
├── lib/             # Utility functions & pure helpers
├── mocks/           # MSW handlers & mock data providers
├── providers/       # React Context providers (theme, auth, etc.)
├── routes/          # Page components & Router definition
├── store/           # Zustand stores (client-only state)
├── types/           # Global TypeScript types & interfaces
├── index.css        # Global CSS & Tailwind design tokens
└── main.tsx         # App entry point
```

**Rules:**

- **One concern per file.** A file should do one thing well.
- **Co-locate when it makes sense.** A component's types live in the same file unless shared.
- **`lib/` must be pure.** No React imports. No hooks. Pure functions and types only.
- **`components/ui/` is primitive territory.** Don't manually edit these files for styling logic — follow shadcn patterns.
- **Features live in `features/`.** Logic shared across pages but specific to a domain goes here.

---

## 2. TypeScript

### Strictness

`tsconfig.json` has `strict: true`. This is **permanent**. Do not loosen it.

### Rules

- **No `any`.** Use `unknown` and narrow with type guards. If you must use `any`, add a `// eslint-disable-next-line` comment explaining **why**.
- **No `as` type assertions** unless absolutely necessary. Prefer type narrowing.
- **Prefer `interface` for object shapes, `type` for unions/intersections.**
- **Export types separately** using `export type { }`.
- **No `@ts-ignore`.** Use `@ts-expect-error` with a description.

### Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserCard.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Types/Interfaces | PascalCase | `UserProfile` |
| Constants | SCREAMING_SNAKE_CASE | `API_TIMEOUT` |
| CSS variables | kebab-case | `--primary-glow` |

---

## 3. React Patterns

### Component Guidelines

- **Function components only.** No classes.
- **Named exports** for components.
- **Explicit `React.ReactNode` for children types.**
- **Avoid prop drilling beyond 2 levels.** Use Redux/Zustand or Context.

### State Management

- **Local state (`useState`) first.**
- **Complex shared state goes to Redux Toolkit.**
- **Client-only UI state (sidebar toggle, table visibility) goes to Zustand.**
- **Derive state, don't sync it.** Use `useMemo`.

---

## 4. Routing (React Router 7)

### Rules

- **Centralized Route Definition.** Routes are defined in `src/routes/index.ts`.
- **Use `ROUTE_NAMES` constant.** Never hardcode path strings in `<Link>` or `navigate()`.
- **Lazy loading.** Large page components should be loaded lazily using `lazy`.
- **Loaders for data fetching.** Use `loader` functions to fetch data before the component renders.

```tsx
// Example from src/routes/index.ts
{
  path: ROUTE_NAMES.DASHBOARD,
  Component: DashboardLayout,
  loader: async () => await loader(),
  children: [ ... ]
}
```

---

## 5. Styling (Tailwind CSS v4)

### Rules

- **Design Tokens.** Tokens live in `src/index.css`.
- **Tailwind v4 features.** Use `@theme` blocks and CSS variables directly.
- **No hardcoded values.** Use Tailwind classes for spacing, colors, and layout.
- **Mobile-first.** Use `md:`, `lg:` for overrides.

---

## 6. Internationalization (i18n)

### Rules

- **No hardcoded text in components.** All user-facing strings must be in the i18n translation files.
- **Use `useTranslation` hook.**
- **Namespace properly.** Use separate translation files for different features if needed.

---

## 7. Forms

- **react-hook-form + zod.**
- **Validate at the schema level.**
- **Show inline error messages.**
- **Disable submit during `isSubmitting`.**

---

## 8. Data Fetching & Mocking

- **Custom API Wrappers.** Logic lives in `src/api/`.
- **MSW for Development.** All API calls must be mocked in `src/mocks/handlers/`.
- **Error Handling.** Always handle failed API requests with user-facing notifications.

---

## 9. Git & Code Quality

### Commits

Use **conventional commits** (`feat:`, `fix:`, `refactor:`, `chore:`).

### Before Pushing

```bash
pnpm lint
pnpm build
```

---

## 10. Import Conventions

### Path Aliases

Use the `@/` alias for all internal imports.

```tsx
// GOOD
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

// BAD
import { Button } from '../../components/ui/button';
```

---

## 11. Communication Rules (For AI Agents)

### No Deletions

- **Do not delete existing files or large blocks of code without explicit permission.** Propose deletions first.
- **Deprecate before deleting.** Mark with `@deprecated`.

### Error Handling

- **If a fix fails after 3 attempts, stop and ask.**
- **Never silently revert a change.**

### Decision Log

- **Document significant decisions in `docs/agent-log.md`.**

---

*Last updated: 2026-04-21*
*Maintained by the Dashboard core team.*
