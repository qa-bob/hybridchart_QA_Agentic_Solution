# SKILLS.md

A contributor-facing index of every Claude Code command, skill, and subagent defined in this repository. This file is documentation for humans browsing the repo — the files it links to are what Claude Code actually loads. If you add or change a command, skill, or subagent, update this index in the same PR.

For the underlying mechanics, see Claude Code's docs: [Skills](https://code.claude.com/docs/en/skills) and [Subagents](https://code.claude.com/docs/en/sub-agents).

---

## Slash commands — `.claude/commands/`

Custom commands live as one Markdown file per command and are invoked as `/<filename>`. (Claude Code's newer convention is a directory-per-skill at `.claude/skills/<name>/SKILL.md` with YAML frontmatter — functionally identical, `.claude/commands/*.md` files keep working. This repo currently uses the flat `commands/` form; migrate a command to `.claude/skills/` only if it needs supporting files or invocation-control frontmatter.)

| Command | File | What it does |
|---------|------|---------------|
| `/analyze-site` | `.claude/commands/analyze-site.md` | Inspects the live site from `site.config.json` and reports pages, forms, nav structure, and interactive elements. |
| `/generate-full-suite` | `.claude/commands/generate-full-suite.md` | Full pipeline: discover the site via `WebFetch`, plan and write page objects, write smoke/navigation/forms/functional/visual/responsive tests, update `site.config.json`, verify with `tsc --noEmit`. |
| `/run-smoke` | `.claude/commands/run-smoke.md` | Runs `@smoke`-tagged tests and reports pass/fail results. |
| `/update-baseline` | `.claude/commands/update-baseline.md` | Refreshes visual regression snapshots (`npm run baseline`). |
| `/generate-report` | `.claude/commands/generate-report.md` | Summarizes the latest test run into a readable report. |

## Subagents — `.claude/agents/`

Subagents are delegated to automatically by Claude Code when a task matches their `description`, or explicitly via the `Agent` tool. Each requires YAML frontmatter (`name`, `description`, `tools`, `model`).

| Agent | File | When Claude delegates to it |
|-------|------|------------------------------|
| `site-analyzer` | `.claude/agents/site-analyzer.md` | Crawling a live site to produce/refresh a fully-populated `site.config.json`. Backs `/analyze-site`. |
| `test-generator` | `.claude/agents/test-generator.md` | Generating site-specific Playwright test files beyond the shared generic suites (unique functionality, regression tests for a discovered bug). Backs `/generate-full-suite`. |

## Hooks — `.claude/hooks/`

Hooks are shell scripts that only run if registered in `.claude/settings.json` — an unregistered script never fires.

| Hook script | Registered event | Purpose |
|-------------|-------------------|---------|
| `.claude/hooks/pre-test.sh` | `PreToolUse` on `Bash` commands matching `*test*` (see `.claude/settings.json`) | Pings the target site before a test run and prints a reachability warning; never blocks the run. |

## Memory — `CLAUDE.md` / `AGENTS.md`

- `AGENTS.md` (root) — tool-agnostic project rules (POM/OOP architecture, tagging reference, "Do Not" list, npm scripts). Read by any AI coding agent, including Claude Code via the `@AGENTS.md` import.
- `CLAUDE.md` (root) — imports `AGENTS.md`, then adds Claude Code-specific notes: the command/agent/hook tables above and the project directory structure.

## Where to add something new

| I want to... | Put it in... |
|---------------|--------------|
| Add a repeatable multi-step procedure invoked with `/name` | New file in `.claude/commands/`, or a directory in `.claude/skills/<name>/SKILL.md` if it needs supporting files |
| Add a specialized worker Claude delegates to automatically | New file in `.claude/agents/` with full YAML frontmatter |
| Run something automatically at a fixed lifecycle point (before a commit, before a test, after a file edit) | New script in `.claude/hooks/`, registered under the matching event in `.claude/settings.json` |
| Add a project-wide rule or fact every agent should always know | `AGENTS.md` (or a Claude-only note in `CLAUDE.md`) |
