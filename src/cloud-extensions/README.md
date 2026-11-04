# Saleor Cloud extensions

Saleor Cloud features live in the private `saleor/dashboard-cloud-extensions` repository, checked
out as a git submodule at `./src`. Only the Saleor team has access.

`index.ts` is the contract: `CloudExtensions` lists what `./src/index.ts` must export, and each
export here is a lazy component that loads it. Without the submodule they render nothing, so the
Dashboard builds and runs the same without access.

Saleor team members fetch the submodule with `pnpm cloud:setup`. `pnpm dev` then reports whether
it is stale. The workflow is in `.claude/skills/saleor-dashboard-cloud-extensions/SKILL.md`, and
the decision in `docs/adr/0002-cloud-features-in-dashboard.md`.
