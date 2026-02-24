# AGENTS.md

## Rule Priority

- In case of conflict, apply rules in this order: system/developer instructions > `AGENTS.md` > user prompt.

## Requirement Levels

- `MUST`: mandatory requirement.
- `SHOULD`: strong recommendation; deviations must be justified in the summary.

## Purpose

This repo is a static Astro site (`mohammedhammoud.com`) with i18n (`en`, `sv`), content-driven pages (MD/MDX), unit tests (Vitest), and E2E tests (Playwright).
The agent MUST make small, safe, verifiable changes with high CI parity.

## Environment and Tools

- Node: `22.14.0` (see `.nvmrc`)
- Package manager: `yarn` (Yarn 1, lockfile: `yarn.lock`)
- MUST always use `yarn`, not `npm`/`pnpm`.

## Scripts

- Source of truth: `package.json` scripts.
- SHOULD use scripts relevant to the change and avoid unrelated commands.
- MUST follow the commands in the **CI Parity (Must Be Followed)** section below.

## CI Parity (Must Be Followed)

MUST follow this order for code changes:

1. `yarn install --frozen-lockfile`
2. `yarn lint`
3. `yarn astro sync`
4. `yarn typecheck`
5. `yarn test --reporter=verbose`

MUST use this flow for E2E-related changes:

1. `yarn build`
2. `npx playwright install --with-deps` (when needed locally)
3. `yarn e2e`

## Repo Structure and Entrypoints

- `src/pages/`: routing/entrypoints for Astro pages and API routes
- `src/pages/[...locale]/...`: localized pages
- `src/pages/rss[...locale].xml.ts`: RSS endpoint
- `src/pages/robots.txt.ts`: robots endpoint
- `src/shared/layouts/Main.astro`: main layout
- `src/features/`: domain features (`about`, `blog`, `experience`)
- `src/i18n/`: locale logic, translations, and segment mapping
- `src/content.config.ts`: content collections
- `src/site.config.ts`: site constants, locales, tabs, social links
- `public/`: static assets (favicon, fonts, manifest)
- `.github/workflows/`: CI, E2E, release/deploy

## Code Conventions

- MUST keep TypeScript strict mode intact; do not break type contracts.
- MUST NOT use `any`. Use explicit types, generics, unions, or `unknown` with narrowing.
- SHOULD use established path aliases: `@`, `@features`, `@shared`, `@i18n`, `@styles`.
- MUST follow existing test naming patterns:
  - unit tests: `*.test.ts`
  - e2e tests: `*.e2e.test.ts`
- MUST follow ESLint rules:
  - no unused imports
  - allow `_` prefix for intentionally unused variables
  - keep Playwright rules in e2e files
- SHOULD format via Prettier + plugin for Astro/Tailwind.
- MUST keep i18n structure consistent:
  - locales: `en`, `sv`
  - route segments via central mapping, not hardcoded special cases
  - new slugs/segments MUST be added in central mapping, never hardcoded per page
- SHOULD make the smallest possible change that solves the problem; avoid unrelated refactoring.
- MUST avoid hacky solutions. Favor maintainable, reusable code and DRY principles where reasonable.
- SHOULD keep each task small; avoid touching more than 3 files unless explicitly requested.

## Prohibited / Security / Privacy

- MUST NEVER commit secrets (tokens, keys, credentials, `.env*`, private certificates).
- MUST NOT add secrets to code, tests, fixtures, or GitHub workflows.
- MUST rotate/remove sensitive values if they end up in history or files.
- MUST NOT change license terms.
- MUST respect license boundaries:
  - Code is licensed separately (`LICENSE`).
  - Content/design/media is covered by a separate license (`src/features/LICENSE`) and may not be freely reused.
- MUST NOT commit generated artifacts unless explicitly required (`dist/`, `coverage/`, `.astro/`, `CHANGELOG.md` via release flow).
- MAY clean generated artifacts locally when useful, but MUST NOT include those cleanup changes in a commit unless requested.

## Commit and Release Conventions

- MUST use Conventional Commits (commitlint + husky `commit-msg` hook).
- MUST use semantic-release flow; avoid manual release hacks.
- MUST update `CHANGELOG.md` via release process, not manually under normal circumstances.
- MUST NOT commit directly.
- MUST ask for explicit user approval before any commit.
- MUST allow the user to review exactly what will be committed before creating a commit.

## Agent Workflow (Mandatory)

1. Plan:
   - MUST briefly describe what will change, which files are affected, and the risks.
2. Diff:
   - MUST make small, focused changes with clear rationale.
3. Tests:
   - MUST run relevant checks using this matrix:
     - TS/logic changes: `yarn lint` + `yarn astro sync` + `yarn typecheck` + impacted unit tests.
     - Routing/i18n/rendering changes: all of the above + impacted E2E flows.
   - If any test/check is skipped, MUST report:
     - exact skipped command/check
     - reason
     - risk introduced
     - what remains unverified
4. Summary:
   - MUST use this output format:
     - Plan
     - Changed files
     - Commands run + results
     - Remaining risks

## Agent Decision Rules

- MUST prioritize green CI status over "smart" but risky optimization.
- SHOULD preserve existing patterns in layout, routing, and test structure.
- If requirements are unclear: MUST choose the most conservative option and document assumptions.
- SHOULD split larger changes into small steps that can be reviewed separately.
