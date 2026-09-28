# Saleor Dashboard

## Conventions

- Use `@saleor/macaw-ui-next` components and tokens; do not add usages of legacy
  `@saleor/macaw-ui`, Material-UI, or `makeStyles`.
- Import icons directly from `lucide-react`; Macaw icons are deprecated.
- Use CSS Modules (`.module.css`) for custom styles.
- Write new code with strict TypeScript checking; do not add `// @ts-strict-ignore`.
- Use named exports and direct imports. Do not introduce barrel exports;
  route entry points named `index.tsx` are allowed.
- Prefer destructured object parameters and typed declarations over type assertions.
  Explicitly type test fixtures.
- Internationalize user-facing text with `react-intl`. Check `src/intl.ts` and nearby
  component messages for reusable messages before defining new ones.
- Add a colocated `ComponentName.stories.tsx` for new UI components.
- In tests, use `// Arrange`, `// Act`, and `// Assert` comments. Mock GraphQL
  operations with typed fixtures.
- For lists that can contain 50+ items, keep navigation and controls usable and
  selected items discoverable. Choose scrolling, pagination, or virtualization to
  suit the component. Use skeletons for loading and handle empty states.

## Task-specific context

Read documentation when its subject is relevant to the task:

- `CONTEXT.md` for product terminology, especially modeling and navigation pins.
  Use its dashboard-facing names even when API names differ.
- Relevant decisions in `docs/adr/` when changing the behavior they govern.
  Surface conflicts with those decisions rather than silently overriding them.
- `docs/multi-schema.md` for GraphQL operations, generation, or schema selection.
- `docs/configuration.md` and `.env.template` when configuring or running the app.
- `docs/running-tests.md` when running Playwright tests.

Read current commands, dependencies, and runtime requirements from `package.json`,
including `packageManager` and `engines`; read aliases from `tsconfig.json`.

## Conditional workflows

- Install dependencies when missing or when dependency inputs change. Run
  `pnpm install` after modifying `package.json` or workspace dependency settings.
- Put dependency overrides in `pnpm-workspace.yaml` under `overrides`, never in
  `package.json` under `pnpm.overrides`.
- After changing GraphQL operations, fragments, or schemas, run `pnpm run generate`
  for both main and staging schemas. Do not hand-edit `.generated.ts` files.
- After changing `react-intl` messages, run `pnpm run extract-messages`.
- Set up a backend only when the task needs a running application or integration
  tests. Setup and code generation are not prerequisites for unrelated edits.
- Run `pnpm run dev` in the background. If background execution is unavailable,
  ask the user how to proceed. Its `predev` hook already runs code generation.

## Verification

Match verification to the affected code. Complete relevant checks before handing
back implementation work, and report any checks that could not run.

- Documentation-only changes: format the changed files with Prettier; application
  tests, type checks, and knip are unnecessary.
- Code changes: run ESLint with auto-fix and Prettier on the changed files before
  manually fixing lint errors. Run affected tests and the relevant `check-types:*`
  scripts from `package.json`.
- Use `pnpm run test:quiet <file_path>` for individual Jest files. Switch to
  `pnpm run test:debug <file_path>` when debugging requires console or DOM output.
- Add or update unit tests for changed utility behavior and complex components;
  use Playwright coverage for critical user flows.
- When changing dependencies, exports, or file organization, run `pnpm run knip`.
- For changes spanning application code, Playwright, and scripts, run
  `pnpm run check-types`. Use `pnpm run lint` for repository-wide lint, formatting,
  and changeset validation; it auto-fixes and formats files across the repository.
- Rerun affected checks after fixes. Broaden verification when shared behavior,
  configuration changes, or failures warrant it; avoid repeating successful checks
  without new changes or evidence.

## Conflict resolution and review

- Resolve source conflicts first, then regenerate derived files:
  `pnpm install` for `pnpm-lock.yaml`, and `pnpm run generate` for GraphQL outputs.
  Do not manually merge generated content.
- Resolve package-version conflicts against intended dependency constraints and
  preserve deliberate pins. Do not turn conflict resolution into an unrelated
  upgrade to the latest registry release.
- During code review, skip inspecting `.generated.ts` contents; review the source
  operations and generation configuration instead.

## Analytics

- When adding a substantial product feature, implement PostHog tracking for its key
  user interactions and outcomes, following existing analytics patterns.
- Do not add tracking for bug fixes, removals, refactors, or other maintenance-only changes.

## Contributions

- Use the changesets CLI for user-facing features, enhancements, and bug fixes.
  Explain the user-visible behavior; for fixes, describe what failed and what works
  now. Skip changesets for internal refactors, style, tests, CI/CD, and internal docs.
- PR descriptions should explain the problem and non-obvious decisions, include
  screenshots for UI changes, and reference relevant issues or discussions.
- Prefer the `gh` CLI for GitHub operations.
- No agent-driven issue tracker is configured. Return issue or triage findings in
  the conversation; see `docs/agents/issue-tracker.md` when a skill expects a tracker.
