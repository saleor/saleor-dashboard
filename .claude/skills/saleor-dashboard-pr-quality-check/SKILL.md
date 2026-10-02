---
name: saleor-dashboard-pr-quality-check
description: Check a PR (or local branch when no PR is open) against the repo's PR rules — one significant change per PR, a title and description that explain the whole scope, before/after screenshots for UI. Proposes a title and description, offers screenshots and a `gh pr edit` update, and plans a split into smaller PRs with hand-off prompts for other agents. Use when planning work, after each commit, before opening or updating a PR, or when asked to "check the PR", "PR quality", "review PR description", or "should I split this PR".
---

# PR quality check

The rules live in `.github/CONTRIBUTING.md` under **Pull Request**. Read that
section first; it is the source of truth for everything below.

This skill only reads and proposes. Every outward action (editing the PR,
running the app for screenshots, creating branches) needs the user's explicit
confirmation. Never push.

## 1. Gather the change

Find an open PR for the current branch:

```bash
gh pr view --json number,url,title,body,baseRefName,files,commits 2>/dev/null
```

If there is no PR (or `gh` is unavailable), use what exists locally:

```bash
git log --format='%h %s' origin/main..HEAD
git diff --stat origin/main...HEAD
git status --short
```

Include uncommitted changes. During planning, when nothing is written yet, check
the plan itself: its goal and the list of changes it intends to make.

Read `.changeset/*.md` files added on the branch; they state the intended
user-visible change.

## 2. Check scope

Classify every change into one kind: **bug fix**, **refactor**, **feature /
behavior change**, **dependencies**, **tooling / CI**, **tests only**, **docs**,
**generated** (GraphQL types, lockfile, messages — these follow their source and
do not count on their own).

Count significant changes. A change is significant when a reviewer would have to
evaluate it on its own merits. Supporting edits that exist only to make the main
change work do not count.

When there is more than one significant change, decide how they relate:

- **Unrelated** changes, or a change hidden inside another (for example a
  functional change in a refactor commit) → **blocker**. They must be split. Go
  to step 6.
- **Connected** changes (for example a refactor that enables the fix) →
  **strongly recommend splitting** and go to step 6. Say it is acceptable to keep
  them together only if each commit holds just its own change.

Put the scope finding first in your report, not in a footnote.

## 3. Check title and description

Against the CONTRIBUTING rules, report each as pass / missing / weak:

- Title says what changes; user-facing wording for product changes, conventional
  prefix for internal ones.
- Problem, change (covering every area in the diff), non-obvious decisions,
  screenshots for UI, testing, links.
- The description mentions everything the diff touches. Flag any changed area the
  description does not mention — that is the most common gap.
- The PR template checkboxes are addressed.

Locally (no PR), check the commit messages and changesets the same way; they will
become the PR text.

## 4. Propose title and description

Write a ready-to-paste title and description that pass step 3. Base it on the
diff, not on the existing text. Use this shape:

```markdown
## Problem

## Change

## Decisions

## Screenshots

| Before | After |
| ------ | ----- |

## Testing
```

Drop sections that do not apply (for example, Screenshots for non-UI changes).
Keep the PR template checkboxes at the end. Leave a clear `TODO` for anything
you could not determine instead of inventing it.

## 5. Offer screenshots and a PR update

**Screenshots** — when the diff touches UI (`src/**/*.tsx`, `*.module.css`,
messages), propose taking before and after screenshots of the affected screens.
Name the screens and the state to capture. **Ask for confirmation** before
starting the app; it needs a backend and memory. Take "before" on `origin/main`
and "after" on the branch, save them under `.context/`, and show them to the user.

**Update the PR** — when a PR exists, offer to apply the proposed title and
description with `gh pr edit <number> --title ... --body-file <file>`. Show the
exact text first and **ask for confirmation**. Do not update without it. When no
PR is open, offer the text for `gh pr create` instead, and do not create it
unless asked.

## 6. Split plan and agent hand-off

When step 2 found more than one significant change, propose a split:

1. One entry per future PR: title, kind, the files or hunks it takes, and which
   commits map to it.
2. Order: prerequisites (refactors, dependency bumps) first; state which PR
   stacks on which, and whether each can merge independently.
3. For each PR, a self-contained hand-off prompt another agent can run in its
   own workspace: base branch, what to take from this branch
   (`git checkout <branch> -- <paths>` or specific commits), what to leave out, required checks
   from `AGENTS.md` → Verification, changeset yes/no, and the proposed PR title
   and description.

Write the plan to `.context/pr-split-plan.md` when that directory exists;
otherwise return it in the conversation. **Ask for confirmation** before
creating any branch or starting agents.

## Report format

Keep it short, most important first:

1. **Scope**: single change ✅, ⚠️ split recommended (connected), or ⛔ split required (unrelated or hidden) — list the changes found.
2. **Title / description**: failing items only.
3. **Proposed title and description**.
4. **Questions**: screenshots? update the PR? create the split plan?
