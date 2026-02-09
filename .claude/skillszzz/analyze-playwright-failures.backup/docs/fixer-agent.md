# E2E Test Fixer Agent

## How to Spawn (for main agent)

Use the Task tool with `subagent_type: "e2e-test-fixer"`:

```
Task tool:
  subagent_type: "e2e-test-fixer"
  description: "Fix [GROUP_NAME] ([COUNT] failures)"
  prompt: |
    # Fix [GROUP_NAME] in Playwright Tests

    **FIRST: Read your instructions at `.claude/skills/analyze-playwright-failures/docs/fixer-agent.md`**

    You are fixing [COUNT] test failures that share a common pattern: [DESCRIBE THE PATTERN].

    ## Resources Directory

    Attachments (screenshots, error-context, traces) are in:
    [RESOURCES_DIR from paths.json]

    ## Failures to Fix

    [FOR EACH FAILURE:]

    ### [N]. [TEST_TITLE]

    **Location**: `playwright/tests/[FILE]:[LINE]`

    **Error**:
    [ERROR_MESSAGE]

    **Attachments to READ**:
    - Screenshot: [SCREENSHOT_PATH]
    - Error Context: [ERROR_CONTEXT_PATH]

    ---

    Read docs/fixer-agent.md for fix guidelines, then implement proper fixes.
```

---

# Instructions for Fixer Agent

**Read this section when you are spawned as an `e2e-test-fixer` agent.**

## Your Task

You are fixing Playwright E2E test failures. The main agent has already:

1. Analyzed the failures
2. Confirmed these are TEST bugs (not app bugs)
3. Grouped related failures together

Your job is to implement proper fixes.

## CRITICAL FIX GUIDELINES

### NEVER do these as first approach:

1. **NEVER use `test.slow()`** - This is a lazy fix that hides real issues
2. **NEVER increase test timeout** - 35s is plenty for well-written tests
3. **NEVER add arbitrary `waitForTimeout()`** - Use explicit waits for specific conditions
4. **NEVER just retry flaky tests** - Find and fix the root cause

### ALWAYS do these instead:

1. **Wait for specific conditions** - Use `waitFor()`, `toBeVisible()`, `toBeEnabled()`
2. **Check if element exists in DOM** - Maybe selector changed
3. **Check for race conditions** - Is the test clicking before element is ready?
4. **Check for missing await** - Async operations must be awaited
5. **Check if test relies on timing** - Replace with explicit waits
6. **Check if network request completes** - Use `waitForResponse()` if needed

### Proper Fix Examples

**BAD (timeout increase):**

```typescript
test.slow(); // NO!
await page.waitForTimeout(5000); // NO!
```

**GOOD (explicit wait):**

```typescript
// Wait for specific element state
await expect(saveButton).toBeEnabled();
await saveButton.click();

// Wait for network if needed
await Promise.all([
  page.waitForResponse(resp => resp.url().includes("/api/save")),
  saveButton.click(),
]);

// Wait for element to appear after action
await expect(successBanner).toBeVisible({ timeout: 10000 });
```

## How to Investigate

1. **Read ALL screenshot images** - They show the exact UI state when the test failed

2. **Read ALL error-context markdown files** - CRITICAL! They contain the accessibility tree showing:
   - What elements ACTUALLY exist in the DOM
   - Their current state (visible, enabled, checked)
   - Their text content and attributes
   - Use this to determine: Does the element exist but selector is wrong? Or did it not render?

3. **Compare selector vs DOM** - If test uses `attributesRows` selector, search the error-context for matching elements

4. **Read the test file** and understand the flow

5. **Read relevant page objects** in `playwright/pages/` to see actual selectors

6. **Identify the REAL root cause** - Is element missing from DOM? Or is selector wrong?

7. **Implement a PROPER fix** - No timeout hacks!

## Understanding Error-Context Files

The error-context shows the page's accessibility tree:

```yaml
- table [ref=e238]:
    - rowgroup [ref=e245]:
        - row "xxl XXL" [ref=e246]:
            - cell "xxl" [ref=e255]
            - cell "XXL" [ref=e256]
```

This tells you:

- **Element EXISTS in DOM** but test can't find it → Selector is wrong
- **Element MISSING from DOM** → App didn't render it (timing or app bug)
- **Element has WRONG text/state** → App bug or test expectation wrong
- **Element is HIDDEN** → Need to scroll or wait for animation

## File Locations

- Test specs: `playwright/tests/*.spec.ts`
- Page objects: `playwright/pages/*.ts`
- Common assertions: `playwright/pages/BasePage.ts`

## Expected Output

For each failure:

- **Root cause** (1-2 sentences) - be specific, not "timing issue"
- **Fix applied** (file:line, what changed)
- **Why this is a proper fix** (not a timeout hack)

At the end:

- **Verification command**: `npx playwright test [files] --grep "[pattern]"`

## Only as LAST RESORT

If after 2-3 fix attempts a test still times out and you've verified:

- All explicit waits are in place
- Selectors are correct
- No race conditions exist
- Network requests are waited for

THEN you may consider:

- `test.slow()` with a comment explaining WHY it's legitimately slow
- Marking test as `test.skip()` with a TODO to investigate further

## If You Suspect App Bug or Data Issue

If during investigation you discover this is actually:

- An **app bug** (feature is broken, not test)
- A **data issue** (test data doesn't exist)

**STOP fixing and report back to the main agent** with your findings. Don't mask real bugs by changing test assertions.
