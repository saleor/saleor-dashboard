# Verification & Tracking

## Save Fix Attempts to History

After subagents report their fixes, save the attempt:

```bash
# Create/update previous-attempts.json
cat ./playwright-failures/previous-attempts.json 2>/dev/null || echo '{"attempts":[]}'
```

Add entry for each fix:

```json
{
  "date": "[ISO timestamp]",
  "runId": "[CI run ID]",
  "testId": "[SALEOR_XXX]",
  "file": "[test file]",
  "diagnosis": "[root cause found]",
  "fix": "[what was changed]",
  "result": "pending",
  "commits": []
}
```

After committing fixes:

```bash
# Get the commit hash
COMMIT=$(git rev-parse HEAD)
# Update the attempts file with the commit
```

## Verify Fixes Work

### Option 1: Run Locally (if environment is set up)

```bash
npx playwright test [affected-files] --reporter=list
```

### Option 2: Run in CI (recommended for accurate results)

After user pushes the fixes:

```bash
# Trigger the test workflow on the current branch
gh workflow run run-test-manual.yml --ref $(git branch --show-current)

# Or add label to PR to trigger tests
gh pr edit [PR_NUMBER] --add-label "run pw-e2e"

# Watch the run
gh run watch
```

### Ask User to Push and Re-run

```
I've made the fixes. To verify they work in CI:

1. Please commit and push these changes
2. Then I can trigger the test workflow:
   - `gh workflow run run-test-manual.yml --ref [BRANCH]`
   - Or add "run pw-e2e" label to the PR

Would you like me to trigger the tests after you push?
```

## Update Attempt Results

After verification:

- If tests pass: update `"result": "success"`
- If tests fail: update `"result": "failed"` with new error

## If Tests Still Fail

1. **Read the NEW error** - Did the failure change?
2. **Spawn another subagent** for remaining failures
3. **Provide context** - "Previous fix attempted X but still failing because Y"

This is an iterative process. Don't stop at first attempt.

## Check Previous Attempts (Phase 0)

Before analyzing new failures, check if we've tried to fix these tests before.

### Check Git History

```bash
# Look for recent commits that modified Playwright tests
git log --oneline -20 --all -- "playwright/tests/*.spec.ts" "playwright/pages/*.ts"

# Check if any commits mention the failing test IDs (e.g., SALEOR_124)
git log --oneline -10 --grep="SALEOR_124" --grep="fix" --all-match
```

### Check Previous Attempts File

The skill stores previous fix attempts in `./playwright-failures/previous-attempts.json`:

```json
{
  "attempts": [
    {
      "date": "2024-01-30T10:00:00Z",
      "runId": "21513974962",
      "testId": "SALEOR_124",
      "file": "attributes.spec.ts",
      "diagnosis": "Selector timing issue - attributesRows not waiting",
      "fix": "Changed .count().toEqual() to .toHaveCount()",
      "result": "unknown",
      "commits": ["abc1234"]
    }
  ]
}
```

### If Previous Attempts Exist

1. **Read the file** to see what was tried
2. **Check if same tests are failing again** - if yes, previous fix didn't work
3. **Inform subagents** about what was already tried so they don't repeat it
4. **Update the result** field if we now know the outcome

Example prompt addition for subagents:

```
## Previous Attempts (DON'T REPEAT THESE)

This test was fixed before but is failing again:
- Previous diagnosis: [from file]
- Previous fix: [from file]
- Commit: [hash]

The previous fix didn't work. Try a DIFFERENT approach.
```

## Final Report

After all iterations, compile the final report:

````markdown
# Playwright Failure Analysis Complete

## Summary

- Total failures: X
- Fixed: Y
- Needs manual review: Z

## Fixes by Group

### [Group Name] (N fixed)

**Pattern**: [What these failures had in common]
**Root Cause**: [The actual issue]
**Fix Applied**: [What was changed]

## Verification

All fixes verified with:

```bash
npx playwright test [files] --reporter=list
```
````

## Remaining Issues (if any)

Tests that couldn't be fixed automatically:

- [Test name]: [Why it needs manual review]

```

## Cleanup Reminder

**IMPORTANT**: When analysis is complete and all tests are passing, remind the user:

```

✅ All tests are now passing!

You may want to clean up the analysis files:

- ./playwright-failures/previous-attempts.json
- ./playwright-failures/

These files track fix attempts and can be deleted now that tests pass.
Run: rm -rf ./playwright-failures/

Or keep them if you want history for future reference.

```

```
