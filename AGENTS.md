# AGENTS.md

This file guides coding agents working in the `roster-dashboard` repository.

It should be treated as a strong default, not a rigid law. If project requirements change, agents may adjust structure and patterns deliberately as long as they keep the codebase coherent and explain the reason for the deviation.

## Project Summary

- App type: internal roster and HR dashboard
- Stack: Vite, React 19, TypeScript, React Router 7, Tailwind CSS v4, shadcn-style UI, Redux Toolkit Query, React Hook Form, Zod, i18next, MSW
- Package manager: `pnpm`
- Main app shell: dashboard layout with sidebar, header, route-based pages, and feature modules

## Core Commands

- Install deps: `pnpm install`
- Start dev server: `pnpm dev`
- Build for production: `pnpm build`
- Lint: `pnpm lint`
- Preview production build: `pnpm preview`

## Architecture Overview

The app is a client-side React SPA.

- Entry point: `src/main.tsx`
- App root: `src/App.tsx`
- Router setup: `src/routes/index.ts`
- Root layout: `src/layouts/root-layout.tsx`
- Dashboard shell: `src/layouts/dashboard-layout.tsx`
- Query provider: `src/providers/query-provider.tsx`

The route tree is centered around a dashboard area:

- `/auth/*` for login/register/forgot password
- `/dashboard` for the main landing page
- nested dashboard sections for employees, leave, payroll, and departments

The router already uses a mix of eager routes and lazy route loading. Preserve that pattern unless there is a good reason to change it.

The current architecture reflects the present state of the project. Agents should prefer these patterns by default, but they may reorganize or extend the structure when a new requirement clearly benefits from it.

## Folder Map

### `src/routes`

Route modules live here. Most route folders follow a small route-module pattern:

- `index.ts` exports page/loader references
- `page.tsx` contains the actual page component
- optional `loader.ts` contains route loader logic

Examples:

- `src/routes/dashboard`
- `src/routes/employee`
- `src/routes/departments`
- `src/routes/auth`

When adding a new page, prefer matching the existing route-module structure instead of creating one-off page files elsewhere.

If a new route area needs a different module shape for maintainability, use it consistently within that area and document the reason in the change summary.

### `src/features`

Feature-specific UI and logic live here.

Current feature areas:

- `auth`
- `department`
- `employee`
- `notification`
- `payroll`
- `setting`

Use `src/features/<feature>` for domain-specific components, validation, mock data, and local helpers. Keep feature code close to its route/page when possible.

This folder map is the default organization, not a permanent limitation. New feature boundaries can be introduced if the current grouping stops fitting the product.

### `src/components`

Shared components live here.

- `src/components/ui`: reusable primitive UI building blocks
- `src/components/charts`: shared chart components
- `src/components/common`: shared app-level helpers and small reusable widgets

If a component is generic and reused across features, it belongs here. If it is tied to one business domain, prefer `src/features/...`.

### `src/api`

RTK Query APIs live here.

- `src/api/base-api.ts` defines the shared `createApi` instance
- feature APIs extend that base pattern

Prefer adding new endpoints through the RTK Query layer instead of scattering `fetch()` calls across components.

If a future requirement introduces a different data access pattern, keep it isolated, intentional, and consistent rather than mixing patterns casually.

### `src/layouts`

App shell components live here.

- header
- sidebar
- route shell wrappers

Changes here affect many pages, so be conservative and verify layout regressions.

### `src/mocks`

MSW handlers and mock data for local API simulation.

- `src/mocks/browser.ts`
- `src/mocks/handlers/*`
- `public/mockServiceWorker.js`

Mocking is enabled from `src/main.tsx` only when `VITE_MOCK_API === "true"`.

If you add a new API endpoint and the app uses mocked mode, also update the relevant MSW handlers.

### `src/i18n`

Localization config and translation files.

- config: `src/i18n/config.ts`
- locales: `src/i18n/locales/en`, `src/i18n/locales/mm`

Current namespaces include `common` and `auth`. If you introduce new user-facing strings at scale, consider whether they should be localized instead of hard-coded.

### `src/styles`

Global styles live here.

- `src/styles/index.css` is the main stylesheet entry
- `src/styles/customize.css` contains extra styling rules

Prefer Tailwind utility classes for component-level styling. Use global CSS only for app-wide theming, shared utility classes, or cases utilities do not handle well.

## State and Data Flow

### Routing

The app uses `createBrowserRouter` from React Router 7.

- Route constants live in `src/constants/route.names.ts` and `src/constants/route.links.ts`
- Prefer using route constants instead of hard-coded path strings
- Route loaders are already used for some pages such as dashboard, employee, leave, and product

If adding a new route:

1. add or reuse route constants
2. create the route module under `src/routes`
3. register it in `src/routes/index.ts`
4. wire sidebar/navigation if needed

### API Layer

RTK Query is configured through `src/api/base-api.ts`.

- base URL comes from `VITE_API_URL`, falling back to `/api`
- current tag types include `User`, `Payrolls`, and `Employee`

When adding new API slices or endpoints:

- use the shared `baseApi`
- add or reuse tag types for invalidation
- keep endpoint naming consistent with existing files

### Forms

Forms are built with:

- `react-hook-form`
- `zod`
- `@hookform/resolvers/zod`

Validation commonly lives in feature folders, for example `src/features/employee/validation`.

When building forms:

- define a typed schema first
- connect it with `zodResolver`
- keep default values explicit
- surface validation errors through shared field components in `src/components/ui/field.tsx`

### Local and Shared State

- RTK Query handles server-style data fetching and cache state
- Zustand exists in the repo for local UI state (`src/store/use-column-visibility-store.ts`)
- local component state is used heavily for UI interactions

Prefer the smallest state tool that fits the problem:

- component state for local interactions
- Zustand for local cross-component UI state
- RTK Query for remote data and cache lifecycle

## UI Conventions

- Use the existing `src/components/ui` primitives before creating a new visual pattern
- Follow the current visual language: rounded cards, subtle borders, muted backgrounds, compact dashboard spacing
- Use `cn()` from `src/lib/utils.ts` for conditional classes
- Keep components responsive; most pages should work from mobile widths through desktop
- Avoid introducing a brand-new design system unless explicitly requested

For interactive surfaces:

- support loading and empty states where relevant
- avoid blocking pointer interactions with overlay layers
- use accessible button labels for icon-only controls
- preserve keyboard usability

## File Placement Rules

Use these defaults:

- New page: `src/routes/<section>/page.tsx`
- New loader: `src/routes/<section>/loader.ts`
- Domain-specific component: `src/features/<feature>/components/...`
- Shared primitive or reusable UI: `src/components/ui/...`
- API endpoint definitions: `src/api/...`
- Mock handler updates: `src/mocks/handlers/...`
- Translation strings: `src/i18n/locales/...`

Do not put feature-specific business logic into `src/components/ui`.

If the project evolves and a new structure is genuinely better, update the structure consistently instead of forcing an old pattern onto a new requirement.

## Working Style for Agents

### Before Editing

- Read the surrounding module first
- Check whether a shared primitive already exists
- Search for related route constants, types, loaders, and mock handlers
- Look for existing patterns in the same feature before inventing a new one

### When Making Changes

- Keep changes small and local when possible
- Preserve the repository's naming and folder conventions
- Prefer extending existing feature modules over creating parallel patterns
- Avoid broad refactors unless the task clearly needs one
- If requirements justify a structural change, make it intentionally and keep the new pattern internally consistent

### After Making Changes

Always run the most relevant verification command when possible:

- `pnpm build` for compile confidence
- `pnpm lint` if the change touches broader TypeScript/JS patterns or shared files

If a change adds or updates data flow, also sanity-check the related route, UI state, and mocked behavior.

## Project-Specific Notes

### Mock API Behavior

The app can run against mocked APIs using MSW.

- Do not remove mocking hooks from `src/main.tsx`
- If a new API-backed screen is added, update both API definitions and mock handlers when appropriate
- Keep mock data realistic enough for dashboard UI states

### Internationalization

Not every screen is fully localized yet, but the app already has i18n infrastructure.

- Reuse existing translation namespaces when possible
- If you add a lot of visible text in auth or common flows, update locale files
- Avoid silently mixing translated and non-translated text in the same refined UX area without a reason

### Dashboard Shell

The dashboard layout controls:

- sidebar behavior
- page frame and spacing
- top header

If editing shell components, verify multiple routes because regressions can spread quickly.

### Department Org Chart

The org chart is a custom interactive canvas-like UI in:

- `src/features/department/components/department-org-chart.tsx`

When editing it:

- protect drag/pan interactions from accidental text selection
- ensure overlay controls do not block canvas gestures
- keep zoom and pan state predictable
- verify both mouse drag and button controls

## Recommended Agent Workflow

For a typical feature task:

1. Identify the route entry point and feature folder
2. Inspect related API, loader, and constants files
3. Reuse shared UI primitives where possible
4. Implement the change in the smallest correct layer
5. Update mocks and translations if the feature depends on them
6. Run `pnpm build`
7. Summarize changed files and any remaining risks

## Feature Cookbook

Use these playbooks when adding common features to this repository.

### Add a New Dashboard Page

1. Decide which route group it belongs to, usually under `src/routes/<section>`
2. Add or reuse route constants from `src/constants/route.names.ts` and `src/constants/route.links.ts`
3. Create `page.tsx` in the matching route folder
4. Add `loader.ts` only if the page needs route-time data loading
5. Register the route in `src/routes/index.ts`
6. Add sidebar or navigation links if the page should be discoverable from the shell
7. Build and verify the page inside the dashboard layout

Preferred shape:

- route entry in `src/routes/...`
- page-specific business UI in `src/features/<feature>/components/...`
- route file stays thin and mostly composes feature components

### Add a New API-Driven Feature

1. Check whether an existing API file already owns that domain
2. Add endpoints through the RTK Query layer in `src/api/...`
3. Reuse `baseApi` and add tag invalidation rules when needed
4. Use generated hooks inside route pages or feature components
5. Update mock handlers in `src/mocks/handlers/...` if mocked mode should support the new feature
6. Verify loading, success, empty, and error states

Preferred rule:

- network behavior belongs in RTK Query, not scattered component-level `fetch()` calls

### Add a New Form

1. Create or extend a validation schema in the relevant feature folder
2. Type the form values from the schema
3. Build the form with `react-hook-form` and `zodResolver`
4. Use shared field primitives from `src/components/ui`
5. Keep default values explicit and realistic
6. Show validation errors inline
7. Handle submit success and failure states clearly

Preferred locations:

- validation: `src/features/<feature>/validation`
- form component: `src/features/<feature>/components`

### Add a New Table or Data View

1. Check whether an existing shared table helper already solves most of the need
2. Keep column definitions close to the feature
3. Use shared table primitives from `src/components/table` or `src/components/ui/table.tsx`
4. Handle long content with truncation or responsive wrapping
5. Avoid breaking the dashboard width on smaller screens

### Add a New Chart or Analytics Card

1. Check `src/components/charts` before adding a new chart pattern
2. Keep chart wrappers generic if they may be reused
3. Keep feature-specific labels, filters, and summaries in the feature folder
4. Verify readability in both dense dashboard layouts and narrower screens

### Add Localization for a New UI Area

1. Decide whether the strings belong in `common` or a new namespace
2. Add matching keys in `src/i18n/locales/en` and `src/i18n/locales/mm`
3. Use `react-i18next` in the component instead of hard-coding repeated copy
4. Keep translation keys descriptive and stable

### Add a New Mocked Endpoint

1. Update the relevant RTK Query endpoint definition
2. Add or extend an MSW handler in `src/mocks/handlers`
3. Use realistic response shapes matching the API contract
4. Keep mock data consistent with the screen’s UI expectations
5. Sanity-check the app with `VITE_MOCK_API=true` if the feature depends on mock mode

### Add a New Reusable UI Primitive

Only do this when existing primitives are not enough.

1. Check `src/components/ui` for a close match
2. Prefer composition over inventing a brand-new base component
3. Follow existing naming, class composition, and variant patterns
4. Keep domain-specific assumptions out of the primitive
5. Verify that the primitive still fits the dashboard design language

## Things To Avoid

- Do not hard-code routes if a route constant already exists
- Do not bypass RTK Query with ad hoc network calls unless there is a clear reason
- Do not put domain logic into generic UI primitive folders
- Do not break the dashboard shell to solve a page-local issue
- Do not add large new dependencies for small UI tasks
- Do not remove mock support just because real APIs exist
- Do not preserve an old structure blindly when the product requirement has clearly outgrown it

## Review Checklist

Before finishing work, agents should quickly review the change against this checklist.

### Architecture

- Is the code placed in the correct folder for this repo?
- If not, is there a clear project-driven reason for the new structure?
- Does the route stay thin while feature logic lives in `src/features/...`?
- Did the change reuse existing primitives and patterns where possible?
- Was RTK Query used for API work instead of ad hoc fetch logic?

### UI and UX

- Does the page still work inside the dashboard shell?
- Is the layout responsive and free of horizontal overflow unless intentionally scrollable?
- Are loading, empty, and error states handled where relevant?
- Are buttons, forms, and icon controls accessible and understandable?
- Did any overlay, sheet, dialog, or floating control accidentally block pointer interaction?

### Data and State

- Are route constants used instead of hard-coded navigation paths?
- Are form schemas, default values, and submission states correct?
- Are tag invalidation and cache behaviors correct for mutations?
- If mocked mode matters, were MSW handlers updated too?

### Localization

- Did the change introduce user-facing text that should be localized?
- If yes, were both `en` and `mm` locale files updated consistently?

### Quality

- Did the agent remove debug logging unless it is intentionally useful?
- Did the change avoid unrelated refactors?
- Are names and types clear and consistent with nearby code?
- Was the simplest state management approach used?

### Verification

- Was `pnpm build` executed when feasible?
- Was `pnpm lint` run when shared logic or broader patterns changed?
- Were high-risk flows manually sanity-checked in the relevant screen?
- Are any skipped checks or known follow-ups explicitly mentioned in the final summary?

## Coding Conventions

These are repo-level preferences agents should follow unless the user asks otherwise.

They are defaults, not hard bans. When a project requirement conflicts with them, agents should choose the clearer long-term design and explain why.

### General

- Prefer TypeScript-first, explicitly typed code over loose inference in shared logic
- Keep route files lightweight and composition-focused
- Prefer small focused components over one very large page component
- Reuse `cn()` for conditional class names
- Avoid adding comments unless they explain non-obvious logic

### React

- Prefer deriving simple values during render instead of adding extra state
- Use local state for local interaction concerns
- Keep event logic inside handlers rather than effects when possible
- Avoid adding `useMemo` or `useCallback` unless they solve a real render or dependency problem
- Use `startTransition` only for non-urgent UI updates where it genuinely helps

### Styling

- Prefer Tailwind utilities over new custom CSS for component-local styling
- Use global CSS for true app-wide behavior, theme tokens, or utility gaps
- Match the existing dashboard tone: clean cards, subtle borders, restrained shadows, practical spacing
- Be careful with `absolute` overlays and pointer events in interactive UIs

### Forms

- Keep schemas close to the feature
- Keep submit buttons, success states, and error states explicit
- Do not hide validation behavior inside custom abstractions unless reused broadly

### API and Mocking

- Keep API contracts and mock contracts aligned
- If adding a mutation, consider cache invalidation at the same time
- Prefer one clearly owned API file per domain area

## Useful Starting Points

- App bootstrap: `src/main.tsx`
- Router tree: `src/routes/index.ts`
- Dashboard shell: `src/layouts/dashboard-layout.tsx`
- Base API: `src/api/base-api.ts`
- Department detail and org chart: `src/features/department/components/department-detail.tsx`
- Example form with validation: `src/features/employee/components/employee-create-form.tsx`
- i18n config: `src/i18n/config.ts`

## Definition of Done

A change is usually complete when:

- it follows the existing folder and architecture patterns
- or intentionally improves them for a clear project requirement
- the UI works at the route where the feature lives
- related data flow is updated consistently
- mocks are updated if mocked mode would otherwise break
- the project builds successfully
- the change summary names any skipped verification or known follow-up work
