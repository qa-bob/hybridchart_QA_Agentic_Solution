@AGENTS.md

# QA Agentic Solution — Claude Code Instructions

The instructions imported above from [`AGENTS.md`](./AGENTS.md) are the tool-agnostic source of truth for this repo: project purpose, architecture rules (POM/OOP), tagging reference, the "Do Not" list, and npm scripts. Every AI agent working in this repo (Claude Code, Copilot, Cursor, Codex) reads that same file so the rules never drift between tools. **Everything below this point is Claude Code-specific** — commands, subagents, hooks, and settings that only apply when Claude Code is the one driving.

See also [`SKILLS.md`](./SKILLS.md) for a contributor-facing index of every command/skill/subagent below, and [`README.md`](./README.md) for environment setup.

---

## Slash Commands (`.claude/commands/`)

Custom commands are skills — see [skills docs](https://code.claude.com/docs/en/skills). `.claude/commands/*.md` files keep working the same as `.claude/skills/<name>/SKILL.md` directories.

| Command | Description |
|---------|-------------|
| `/generate-full-suite` | Analyze the website and generate complete POM + tests |
| `/analyze-site` | Inspect site structure and report pages, forms, and elements |
| `/run-smoke` | Run smoke tests and report results |
| `/update-baseline` | Refresh visual regression baselines |
| `/generate-report` | Generate a test results summary |

---

## Subagents (`.claude/agents/`)

| Agent | Purpose |
|-------|---------|
| `site-analyzer` | Crawls a live site and produces a populated `site.config.json`. Invoked by `/analyze-site` or when onboarding a new site. |
| `test-generator` | Reads `site.config.json` and generates site-specific test files beyond the shared generic suites. Invoked by `/generate-full-suite` or when a site needs bespoke coverage. |

Each file needs YAML frontmatter (`name`, `description`, `tools`, `model`) to be recognized — see [sub-agents docs](https://code.claude.com/docs/en/sub-agents).

---

## Hooks and Settings (`.claude/hooks/`, `.claude/settings.json`)

- `.claude/hooks/pre-test.sh` — checks the target site's reachability before test commands run; always exits `0` so a flaky/down site produces a warning, not a blocked run.
- Wired up in `.claude/settings.json` as a `PreToolUse` hook matching `Bash` calls whose command contains `test` (covers `npm test`, `npm run test:*`, `npx playwright test`).
- If you add more hooks, register them in `.claude/settings.json` — an unregistered script in `.claude/hooks/` never runs.

---

## Project Structure

```
site.config.json
playwright.config.ts
src/
  pages/
    base.page.ts          # BasePage base class
    home.page.ts          # HomePage
    navigation.page.ts    # NavigationPage
    contact.page.ts       # ContactFormPage
    <discovered>.page.ts  # One class per additional page
  fixtures/
    site.fixture.ts       # Custom test fixtures
  utils/
    link-checker.ts
    visual-helper.ts
  types/
    site-config.types.ts
tests/
  smoke/
    site-availability.spec.ts
  navigation/
    nav-links.spec.ts
  forms/
    contact-form.spec.ts
  functional/
    <feature>.spec.ts     # One file per business feature area
  visual/
    visual-regression.spec.ts
  responsive/
    layout.spec.ts
```

The full "Do Not" list, tagging reference, and npm scripts live in [`AGENTS.md`](./AGENTS.md) (imported at the top of this file) — this section only covers Claude Code-specific structure.
