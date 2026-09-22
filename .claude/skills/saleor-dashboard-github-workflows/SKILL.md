---
name: saleor-dashboard-github-workflows
description: Rules for writing and editing GitHub Actions workflows and composite actions in this repository - runner images, action pinning, shell quoting, untrusted interpolation, permissions, and the actionlint gate. Use when creating or changing anything under .github/workflows/ or .github/actions/, when a workflow review comment needs applying, or when a CI job needs adding to the repo.
---

# GitHub Actions in saleor-dashboard

Workflows are the one place where a mistake runs with repository credentials
against every pull request. The rules below are what review asks for here, so
apply them while writing rather than after the comment arrives.

## Non-negotiable: actionlint must pass

`actionlint` runs shellcheck over every `run:` block, type-checks `${{ }}`
expressions, validates `runs-on` labels, and catches `needs`/`matrix` references
that do not resolve. **Run it before handing work back.**

```bash
actionlint .github/workflows/your-file.yml   # one file
actionlint                                   # every workflow
```

Not installed: `brew install actionlint` (macOS) or see
<https://github.com/rhysd/actionlint>.

`lint-workflows.yml` enforces this in CI, but only on the workflow files a pull
request **touches** — the repository predates the check and its older workflows
still carry findings. Editing a workflow means inheriting whatever it already
reports. Budget for that; do not silence it with `# actionlint-disable`.

One gotcha: a `run:` comment whose first word is `shellcheck` is parsed as a
shellcheck directive and fails the lint. Reword the comment.

## Never interpolate `${{ }}` into a `run:` block

`${{ }}` is substituted textually _before_ the shell starts, so anything an
outside contributor controls — a branch name, a PR title, a `workflow_dispatch`
input — becomes shell source. Pass it through `env:` instead, where it is only
ever a variable value.

```yaml
# Wrong - the value is spliced into the script
- run: node e2e/run.ts --target=${{ matrix.target }}

# Right
- env:
    E2E_TARGET: ${{ matrix.target }}
  run: node e2e/run.ts --target="$E2E_TARGET"
```

`${{ }}` is fine in `with:`, `if:`, `env:` and `name:` — those are not shell.

## Quote every expansion, and build optional arguments as an array

Unquoted `$VAR` word-splits, so a value containing a space silently becomes two
arguments. `${VAR:+--flag "$VAR"}` does _not_ solve this: the quotes inside the
expansion are not re-evaluated.

```yaml
# Wrong - a grep value with a space becomes two arguments
run: playwright test ${GREP:+--grep "$GREP"}

# Right
run: |
  args=()
  if [[ -n "$GREP" ]]; then
    args+=( --grep "$GREP" )
  fi
  playwright test "${args[@]}"
```

## Pin actions by commit SHA, with the version in a trailing comment

```yaml
- uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
```

A tag can be moved; a SHA cannot. Resolve one with:

```bash
gh api repos/actions/checkout/releases/latest -q .tag_name
gh api repos/actions/checkout/git/ref/tags/v7.0.1 -q .object.sha
```

If `.object.type` comes back `tag` rather than `commit` (an annotated tag, as
`pnpm/action-setup` uses), dereference it:

```bash
gh api repos/pnpm/action-setup/git/tags/<sha> -q .object.sha
```

**Start new workflows on current versions.** Parts of this repository still pin
older majors; copying an existing step forward carries the staleness with it,
and review flags it. Check the latest release rather than grepping a neighbour.

When a tool has no action, download a **pinned release** and verify its digest
rather than piping a script from a branch:

```yaml
env:
  TOOL_VERSION: 1.7.12
  TOOL_SHA256: 8aca8db9...
run: |
  curl -fsSL -o tool.tar.gz "https://github.com/owner/tool/releases/download/v${TOOL_VERSION}/..."
  echo "${TOOL_SHA256}  tool.tar.gz" | sha256sum --check --strict
```

## Runner images

Use `ubuntu-24.04`. `ubuntu-22.04` is deprecated and being retired; much of this
repository still names it, which is drift rather than a pattern to copy. Pin the
version instead of `ubuntu-latest` so a runner rollout cannot change a run's
behaviour without a commit.

## Permissions

Declare `permissions: {}` at the top level and grant each job only what it
needs. A job that just reads code wants `contents: read`. Add
`persist-credentials: false` to `actions/checkout` unless a later step actually
pushes.

## Prefer an expression to a job

A job costs a runner allocation. Expanding an input into a matrix, or picking
between two constants, belongs in an expression:

```yaml
# Instead of a `resolve-targets` job that echoes to $GITHUB_OUTPUT
matrix:
  target: ${{ fromJSON((inputs.target == 'stable' || inputs.target == 'main') &&
    format('["{0}"]', inputs.target) || '["stable","main"]') }}
```

GitHub's `&&` and `||` return operand values, not booleans, which is what makes
the ternary-style form work.

## Checklist before handing back

- [ ] `actionlint` clean on every file touched
- [ ] `pnpm exec prettier --write` on the YAML
- [ ] No `${{ }}` inside any `run:` block
- [ ] Every shell expansion quoted; optional arguments built as an array
- [ ] Actions pinned by SHA, on the current release, version in a comment
- [ ] `runs-on: ubuntu-24.04`
- [ ] Top-level `permissions: {}` plus a per-job grant
- [ ] `concurrency` group set, so superseded pushes cancel
- [ ] `timeout-minutes` set, so a hung job does not burn an hour

## Repository specifics

- Reusable composite actions live in `.github/actions/<name>/action.yml`.
- Node and pnpm versions come from `package.json` (`engines`, `packageManager`);
  use `node-version-file: "package.json"` and let `pnpm/action-setup` read
  `packageManager` rather than naming versions in the workflow.
- The E2E suites are `e2e/` (local Docker stack, `e2e-local.yml`) and the frozen
  `e2e-legacy/` (Saleor Cloud). See `e2e/README.md`.
