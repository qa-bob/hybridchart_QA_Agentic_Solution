# AGENTS.md

Tool-agnostic instructions for any AI coding agent (Claude Code, GitHub Copilot, Cursor, Codex, etc.) working in this repository. This file follows the open [AGENTS.md](https://agents.md) convention so every agent reads the same rules instead of duplicated, drifting copies. Claude Code loads it automatically via the `@AGENTS.md` import at the top of `CLAUDE.md`; tool-specific instructions (subagents, skills, hooks) live in `CLAUDE.md` itself.

---

## Project Purpose

This repository is a **Playwright + TypeScript regression test suite** for the single B2B SaaS website defined in `site.config.json` (currently [HybridChart](http://hybridchart.com/), a physician rounding-management platform). It follows the **Page Object Model (POM)** design pattern and standard **Object-Oriented Programming (OOP)** conventions (one class per page/section, inheritance from a shared base class, encapsulated locators and actions).

Coverage must include **smoke**, **functional**, and **regression** tests for every major discoverable feature of the site — without creating an account, signing up, logging in, or submitting any real form.

---

## Key Files

| File | Purpose |
|------|---------|
| `site.config.json` | Site URL, name, flags (`hasContactForm`, `skipVisual`, `expectedNavItems`, `auth`, etc.) |
| `playwright.config.ts` | Playwright projects: desktop, mobile, tablet — reads `baseURL` from `site.config.json` |
| `src/pages/` | Page Object Model classes, one per page or major section, all extending `base.page.ts` |
| `src/fixtures/site.fixture.ts` | Custom Playwright fixtures exposing `siteConfig` and pre-constructed page objects |
| `src/utils/` | Helpers: link-checker, visual-helper |
| `src/types/` | TypeScript interfaces (`SiteConfig`, etc.) |
| `tests/smoke/` | `@smoke` — availability and basic load tests |
| `tests/navigation/` | `@navigation` — nav links, routing, menus |
| `tests/forms/` | `@forms` — form fields, validation (no submission) |
| `tests/functional/` | `@functional` — business logic, user flows, feature-level and regression coverage |
| `tests/visual/` | `@visual` — screenshot regression |
| `tests/responsive/` | `@responsive` — layout at mobile/tablet/desktop |

---

## Architecture Rules

### Page Object Model
- Every page or major section has its own class in `src/pages/`.
- Page classes extend `BasePage` from `src/pages/base.page.ts`.
- Locators are `readonly Locator` properties set in the constructor.
- Methods represent user actions (`clickPrimaryNav()`, `fillForm()`), not assertions.
- No `expect()` calls inside page objects — assertions belong in tests only.

### Tests
- Import page objects via the custom fixture in `src/fixtures/site.fixture.ts` — do not instantiate page objects or use raw `page.locator()` calls directly in test bodies.
- Tag every test with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`.
- Never hardcode the base URL — always use `baseURL` / `siteConfig.url` (which reads `site.config.json`).
- Never submit forms — test field interactions and validation only.
- Never create accounts, log in, or enter real credentials (unless `auth.required: true` in `site.config.json` and credentials were explicitly provided for that purpose).

### TypeScript
- Strict mode is enabled (`tsconfig.json`) — all page object properties must be typed.
- Avoid `any` without an explicit justification comment.
- Run `npx tsc --noEmit` before considering any change finished.

---

## Test Tagging Reference

| Tag | When to use |
|-----|-------------|
| `@smoke` | Site loads, title present, no console errors |
| `@navigation` | Nav links, routing, menus, breadcrumbs |
| `@forms` | Form fields, validation, accessibility |
| `@functional` | Business features: pricing, search, video, accordion, feature-level and regression coverage |
| `@visual` | Screenshot regression with `toHaveScreenshot()` |
| `@responsive` | Viewport-specific layout checks |

---

## When Asked to Write or Update Tests

1. Read `site.config.json` first to get the URL and all flags.
2. Inspect the **live** site before writing any selectors — never guess selectors from generic placeholders.
3. Create or update the relevant page object class in `src/pages/`.
4. Write tests that use the page object via the fixture, not raw locators in the test body.
5. Run `npx tsc --noEmit` to verify the change compiles cleanly.

---

## Do Not

- Submit any form.
- Create accounts or log in (unless `auth.required: true` in `site.config.json`).
- Hardcode the base URL in tests.
- Put assertions inside page object methods.
- Use `page.waitForTimeout()` — use `waitForSelector` or Playwright's built-in auto-waiting instead.
- Use `any` type without explicit justification.

---

## Available npm Scripts

```bash
npm test                    # Run all tests
npm run test:smoke          # @smoke tests only
npm run test:navigation     # @navigation tests only
npm run test:forms          # @forms tests only
npm run test:visual         # @visual tests only
npm run test:responsive     # @responsive tests only
npm run baseline            # Update visual snapshots
npm run lint                # ESLint
npm run typecheck           # TypeScript check
```
