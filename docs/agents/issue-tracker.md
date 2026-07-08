# Issue tracker: none (not agent-tracked)

This repo does **not** track issues through agents. The maintainers deliberately
opted out during skill setup.

## What this means for skills

- Skills that would "publish to the issue tracker" (`to-issues`, `to-prd`) should
  **not** create GitHub issues, markdown files, or tickets. Instead, return their
  output inline to the user and let the user decide where it goes.
- `/triage` has no queue to process — there is no incoming-issue state machine.
- `/qa` and similar skills should surface findings in the conversation rather than
  filing them.

## Pull requests as a triage surface

**PRs as a request surface: no.**

If you later want agent-driven issue tracking, re-run `/setup-matt-pocock-skills`
and pick GitHub Issues (the repo remote is `saleor/saleor-dashboard`).
