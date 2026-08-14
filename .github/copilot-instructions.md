# GitHub Copilot instructions

This file is GitHub Copilot's convention for repo-wide custom instructions (`.github/copilot-instructions.md`), read automatically in Copilot Chat and Copilot code review. It intentionally does not repeat the rules — it points at the single source of truth so Copilot and every other agent follow the same rules.

Read and follow, in order:

1. **[`AGENTS.md`](../AGENTS.md)** (repo root) — project purpose, Page Object Model / OOP architecture rules, test tagging reference, the "Do Not" list (never submit forms, never hardcode URLs, never use `page.waitForTimeout()`, etc.), and available npm scripts. This is the tool-agnostic contract every agent in this repo must follow.
2. **[`CLAUDE.md`](../CLAUDE.md)** (repo root) — Claude Code-specific additions (slash commands, subagents, hooks). Skim for context; the parts that matter to Copilot are already folded into `AGENTS.md`.
3. **[`SKILLS.md`](../SKILLS.md)** (repo root) — index of the repeatable procedures (`/generate-full-suite`, `/analyze-site`, etc.) already automated for this repo, in case a request duplicates one of them.

When suggesting or generating code in this repo:
- Follow the Page Object Model: put locators/actions in `src/pages/*.page.ts` extending `BasePage`, keep `expect()` calls in test files only.
- Never write a test that submits a form, creates an account, or logs in.
- Never hardcode `http://hybridchart.com` (or any URL) in a test — read it from `siteConfig`/`baseURL`.
- Tag every test with at least one of `@smoke @navigation @forms @functional @visual @responsive`.
