---
name: scan-issues
description: Assess external Saleor Dashboard issues through classification, verification, and recommendations. Use for recent batches or specified items.
---

# Scan dashboard issues

Models/tools/delegation: caller choices or defaults. Smaller model suitable for classification.

## Intake

Default: ≤10 open issues, updated within seven days, oldest-updated first. Caller may override or name items.
Authors: CONTRIBUTOR, FIRST_TIME_CONTRIBUTOR, FIRST_TIMER, NONE. Exclude bots, OWNER, MEMBER, COLLABORATOR.
Read fresh GitHub discussions, status, labels, label definitions each run.

## Workflow

Each step: propose exact comment and label additions/removals. Publish only with explicit caller approval.
Before writing: recheck discussion, labels, revision; reassess stale proposals.
Use `gh`, comments via `--body-file`. Read back writes; report links/failures. Check uncertain writes before retrying.
Preserve unrelated labels. Skip redundant comments and empty updates.
Missing milestone label: propose definition. Stale evidence: propose label removal.
Milestones require revision-specific evidence comment first. They mark completed work, including failures, not passing results or approval.

1. **Classify.** Check `.github/CONTRIBUTING.md`, matching issue form: completeness, category, duplicates.

   Update: Propose existing category/duplicate labels. Comment: missing specifics, duplicate link, or Discord support redirect.

   Next: Actionable and complete: Verify. Otherwise: Recommend.

2. **Verify.** Bugs: reproduce on current `main`. Features: assess problem and acceptance criteria.
   Fixes: compare main/reviewed branch in isolated checkouts; same scenarios, configuration, backend, test data, failure conditions.
   UI/browser behavior: real browser, capture evidence.

   Update: Evidence comment: SHAs, setup, steps/checks, expected/observed results and differences, links, blockers.
   Identify real/mocked backend; distinguish controlled outage/race tests from ordinary integration. Propose sharing method for local evidence.
   `reproduced`: bug reproduced on current main. `verified`: applicable browser scenarios complete; fixes require branch comparison.
   Both require evidence comment. Partial/blocked browser checks: propose `verify`, never `verified`; comment names prerequisite and next check.
   Remove `verify` only after investigation/reproduction need resolves. Routine checks earn no milestone.

   Next: Recommend, including partial/blocked results. Stop checks dependent on blockers.

3. **Recommend.** State result and next action. Complete feature request does not mean approved.

   Update: Conclusion, contributor/maintainer action, needed product decision, applicable existing labels.
   Closure: reason and closing comment; close only with explicit approval.

   Next: Report work, proposed/published updates, blockers.

Implementation: separate task. Caller requests per-item processes: keep each actionable item's remaining stages in one process.

## Report

State window/count. One row per item; link number/title. Separate issue/PR tables.

| Issue | Category | Classify | Checks | Browser | Recommendation | Next action | Commentary |
| ----- | -------- | -------- | ------ | ------- | -------------- | ----------- | ---------- |

Fixed values; categories describe problems/requests:

- Category: Bug, Feature request, Other.
- Stages: Not run, Pass, Fail, Needs info, Blocked, Partial, N/A.
- Recommendation: Ready for work, Needs info, Close, Pending verification.
- Next action: `<Owner>: <Action>`. Owners: Contributor, Agent, Maintainer, None.
  Actions: Provide information, Provide environment, Provide visual evidence, Approve feature, Approve execution, Run checks, Verify in browser, Reproduce issue, Plan implementation, Redirect support, Resolve duplicate, Close issue, None.

Commentary: findings, reasons, evidence links.
Stages: Not run = unattempted; Blocked = missing prerequisites; Partial = incomplete verification; N/A = inapplicable.
Ready for work = verified bug or complete request with required product approval.
Needs info = missing information/maintainer decision. Close = recommend closure; explain why.
Pending verification = checks remain before decision. Empty: "No eligible issues".
