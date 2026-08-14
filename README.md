# HybridChart — QA Agentic Solution

Automated QA framework for [HybridChart](http://hybridchart.com/) — a Playwright + TypeScript regression test suite built with the **Page Object Model (POM)** and standard **Object-Oriented Programming (OOP)** conventions.

| Field | Details |
|-------|---------|
| **Company under test** | HybridChart — rounding management platform for physicians |
| **Website** | [http://hybridchart.com/](http://hybridchart.com/) |
| **City / Founded** | Scottsdale, AZ · 2010 |

---

## Purpose

This repo tests **one** live website — whichever is configured in [`site.config.json`](./site.config.json) — end to end, without ever registering an account, logging in, or submitting a real form. It aims for full **smoke**, **navigation**, **forms** (read-only), **functional**, **visual**, and **responsive** coverage of every major discoverable feature.

It's also set up for *agentic* execution: Claude Code (and other AI coding agents) can read the config, inspect the live site, and generate or extend the test suite following the rules below.

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers (+ OS deps on Linux/CI)
npx playwright install
# on Linux/CI: npx playwright install --with-deps chromium

# 3. Copy the env template and fill in any overrides (optional — site.config.json
#    already provides the default SITE_URL)
cp .env.example .env
```

`site.config.json` is the single source of truth for what gets tested: the target `url`, `name`, viewport list, and feature flags (`hasContactForm`, `skipVisual`, `skipForms`, `auth`). Playwright's `baseURL` is derived from it in `playwright.config.ts` — never hardcode a URL in a test.

### Running tests

```bash
npm test                    # everything
npm run test:smoke          # @smoke
npm run test:navigation     # @navigation
npm run test:forms          # @forms
npm run test:functional     # @functional (business features, regression coverage)
npm run test:visual         # @visual
npm run test:responsive     # @responsive
npm run test:headed         # any of the above, headed

npm run report              # open the last HTML report
npm run baseline            # refresh visual snapshots after an intentional UI change

npm run lint                # ESLint
npm run typecheck           # tsc --noEmit
```

CI runs `typecheck` → `lint` → the full suite on every push/PR to `main` (see [`.github/workflows/playwright-ci.yml`](./.github/workflows/playwright-ci.yml)) and uploads the HTML report + trace artifacts.

---

## Architecture

- **Page Object Model** — every page/section is a class in `src/pages/`, extending `BasePage`. Locators are typed `readonly Locator` properties; methods represent user actions, never assertions.
- **OOP** — shared behavior (navigation, screenshots, responsiveness checks) lives once in `BasePage`; page classes inherit and extend it rather than duplicating logic.
- **Fixtures** — tests never construct page objects directly. Import `{ test, expect }` from `src/fixtures/site.fixture.ts`, which wires up `siteConfig` and pre-built page objects.
- **Tagging** — every test carries at least one of `@smoke @navigation @forms @functional @visual @responsive` so CI and local runs can filter by category.

```
site.config.json
playwright.config.ts
src/
  pages/        # BasePage + one class per page/section (POM)
  fixtures/      # site.fixture.ts — custom test fixture
  utils/         # link-checker, visual-helper
  types/         # SiteConfig, etc.
tests/
  smoke/         forms/        navigation/
  functional/    visual/       responsive/
.claude/
  commands/      # slash commands (skills)
  agents/        # subagents (site-analyzer, test-generator)
  hooks/         # pre-test.sh, registered in settings.json
  settings.json  # hook wiring, permissions
.github/
  workflows/     # CI (Playwright) + optional @claude PR/issue automation
  ISSUE_TEMPLATE/, PULL_REQUEST_TEMPLATE.md
```

The full rules (POM details, tagging table, "Do Not" list) live in **[`AGENTS.md`](./AGENTS.md)** so they're not duplicated across docs — read that file before writing tests.

---

## Contributing

1. Read **[`AGENTS.md`](./AGENTS.md)** first — it's the contract every test in this repo must follow (POM/OOP structure, tagging, and the hard "Do Not" rules: no form submission, no account creation, no hardcoded URLs, no `page.waitForTimeout()`).
2. Inspect the *live* site before writing selectors — don't guess from generic placeholders.
3. Add or update a page object in `src/pages/`, wire it into `src/fixtures/site.fixture.ts` if it's reused, then write the test using the fixture.
4. Run `npx tsc --noEmit` and `npm run lint` before opening a PR; the [PR template](./.github/PULL_REQUEST_TEMPLATE.md) has the full checklist.
5. If a page/feature has no coverage yet, file it with the [coverage gap issue template](./.github/ISSUE_TEMPLATE/coverage_gap.md) or fix it directly.

### Working with Claude Code / AI agents

This repo is structured for agentic contribution:

- **[`AGENTS.md`](./AGENTS.md)** — tool-agnostic rules any agent should load first.
- **[`CLAUDE.md`](./CLAUDE.md)** — Claude Code-specific config: imports `AGENTS.md`, then documents the slash commands, subagents, and hooks below.
- **[`SKILLS.md`](./SKILLS.md)** — index of every command/skill/subagent defined in `.claude/`, with a "where do I add something new" guide.
- **`.claude/commands/`** — `/analyze-site`, `/generate-full-suite`, `/run-smoke`, `/update-baseline`, `/generate-report`.
- **`.claude/agents/`** — `site-analyzer` (populates `site.config.json` from a live crawl) and `test-generator` (writes site-specific test files).
- **`.claude/hooks/` + `.claude/settings.json`** — `pre-test.sh` checks the target site is reachable before any test command runs.

---

## Do Not

- Submit any form, create an account, or log in (unless `auth.required: true` in `site.config.json`)
- Hardcode a base URL in a test
- Put `expect()` assertions inside a page object
- Use `page.waitForTimeout()` — use `waitForSelector` or Playwright's auto-waiting

(Full list with rationale: [`AGENTS.md`](./AGENTS.md).)
