---
name: scan-prs
description: Assess external Saleor Dashboard pull requests through classification, code review, verification, and recommendations. Use for recent batches or specified items.
---

# Scan dashboard pull requests

Models/tools/delegation: caller choices or defaults. Smaller model suitable for classification.

## Intake

Default: ≤10 open PRs, updated within seven days, oldest-updated first. Caller may override or name items.
Authors: CONTRIBUTOR, FIRST_TIME_CONTRIBUTOR, FIRST_TIMER, NONE. Exclude bots, OWNER, MEMBER, COLLABORATOR.
Read fresh GitHub discussions, status, labels, label definitions each run.

## Workflow

Each step: propose exact comment and label additions/removals. Publish only with explicit caller approval.
Before writing: recheck discussion, labels, revision; reassess stale proposals.
Use `gh`, comments via `--body-file`. Read back writes; report links/failures. Check uncertain writes before retrying.
Preserve unrelated labels. Skip redundant comments and empty updates.
Missing milestone label: propose definition. Stale evidence: propose label removal.
Milestones require revision-specific evidence comment first. They mark completed work, including failures, not passing results or approval.

1. **Classify.** Check `.github/CONTRIBUTING.md`, PR template: completeness, scope, feature approval, contribution requirements. Find related issues/duplicates.

   Update: Propose existing category/duplicate labels. Comment: missing information, feature approval, or needed scope split.

   Next: Reviewable: Review. Otherwise: Recommend.

2. **Review.** Check diff, relevant code/tests, CI, existing feedback: correctness, regressions, impact.

   Update: Comment: file/line, failure/regression, impact, correction. No review milestone label. Scan completion alone never warrants approval review.

   Next: Applicable checks: Verify. Blocked: Recommend.

3. **Verify.** Run relevant checks. Compare current `main`/PR head in isolated checkouts.
   Match scenarios, configuration, backend, test data, failure conditions. Fixes: prove main fails, PR fixes it.
   Applicable UI/browser behavior: real browser, both versions, capture evidence.

   Update: Evidence comment: both SHAs, setup, checks/scenarios, expected/observed results per version, differences, links, blockers.
   Identify real/mocked backend; distinguish controlled outage/race tests from ordinary integration. Propose sharing method for local evidence.
   `reproduced`: bug reproduced on main. `verified`: affected browser scenarios complete on both main and PR head.
   Both require evidence comment. Partial/blocked browser checks: propose `verify`, never `verified`; comment names prerequisite and next check.
   Remove `verify` only after investigation/reproduction need resolves. Routine checks earn no milestone.

   Next: Recommend, including partial/blocked results. Stop checks dependent on blockers.

4. **Recommend.** State result and next action from completed work.

   Update: Conclusion, contributor/maintainer action, applicable existing labels.
   Rejection: reason and closing comment; close only with explicit approval.

   Next: Report work, proposed/published updates, blockers.

Implementation: separate task. Caller requests per-item processes: keep each actionable item's remaining stages in one process.

## Report

State window/count. One row per item; link number/title. Separate issue/PR tables.

| PR  | Category | Classify | Review | Checks | Browser | Recommendation | Next action | Commentary |
| --- | -------- | -------- | ------ | ------ | ------- | -------------- | ----------- | ---------- |

Fixed values; categories describe changes:

- Category: Bug fix, Feature, Refactor, Dependencies, Tooling / CI, Tests, Docs, Other.
- Stages: Not run, Pass, Fail, Needs info, Blocked, Partial, N/A.
- Recommendation: Ready, Needs info, Request changes, Reject.
- Next action: `<Owner>: <Action>`. Owners: Contributor, Agent, Maintainer, None.
  Actions: Provide information, Provide environment, Provide visual evidence, Split scope, Fix code, Approve feature, Approve execution, Run checks, Verify in browser, Reproduce issue, Review for acceptance, Resolve duplicate, None.

Commentary: findings, reasons, evidence links.
Stages: Not run = unattempted; Blocked = missing prerequisites; Partial = incomplete verification; N/A = inapplicable.
Ready = review/checks complete, ready for maintainer acceptance. Needs info = missing information/approval/verification evidence.
Request changes = submission needs changes. Reject = recommend declining; explain why.
Empty: "No eligible PRs".
