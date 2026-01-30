# Fixing Tests - Spawning Fixer Agents

## When to Spawn Fixer Agents

**Only spawn fixers after exploration confirms these are test bugs, NOT app bugs.**

| Agent Type       | Model  | Purpose                              | When to Use                                |
| ---------------- | ------ | ------------------------------------ | ------------------------------------------ |
| `Explore`        | haiku  | Find recent changes, understand code | FIRST - before any fixing                  |
| `e2e-test-fixer` | sonnet | Actually fix test code               | AFTER exploration confirms it's a test bug |

## Workflow

1. **FIRST**: Spawn `Explore` agents (haiku) to gather context
2. **THEN**: Analyze results - is it test bug or app bug?
3. **IF TEST BUG**: Spawn `e2e-test-fixer` agents to fix
4. **IF APP BUG**: Report to user, don't fix

## Intelligent Grouping

**Spawn ONE subagent per intelligent group** (not per script category).

The script provides HINTS (category, domain, rootCause) but **YOU must decide groupings** using semantic reasoning:

- **What is the likely root cause?** - Group failures fixed by the same change
- **Domain context matters** - Same error in different domains may have different causes
- **Error semantics matter** - "notification not shown" vs "element count wrong" are different
- **Test flow matters** - Is it failing during setup, action, or verification?

### Example Grouping

Given these failures:

```
1. attributes.spec.ts - expectSuccessBanner timeout
2. orders.spec.ts - expectSuccessBanner timeout
3. orders.spec.ts - toHaveCount(1) got 0
4. giftCards.spec.ts - clipboard assertion failed
5. attributes.spec.ts - toHaveCount(1) got 0
```

- 1 & 2: Same error pattern (`expectSuccessBanner`), different domains. **Maybe group if same UI component.**
- 3 & 5: Same error type (count), different domains. **Maybe separate if different UI flows.**
- 4: Clipboard is often a CI environment issue. **Probably isolated group.**

## Fixer Agent Prompt Template

Use the Task tool with `subagent_type: "e2e-test-fixer"`:

````
Task tool:
  subagent_type: "e2e-test-fixer"
  description: "Fix [GROUP_NAME] ([COUNT] failures)"
  prompt: |
    # Fix [GROUP_NAME] in Playwright Tests

    You are fixing [COUNT] test failures that share a common pattern: [DESCRIBE THE PATTERN].

    ## Resources Directory

    Attachments (screenshots, error-context, traces) are in:
    [RESOURCES_DIR from paths.json]

    ## Failures to Fix

    [FOR EACH FAILURE:]

    ### [N]. [TEST_TITLE]

    **Location**: `playwright/tests/[FILE]:[LINE]`

    **Error**:
    ```
    [ERROR_MESSAGE]
    ```

    **Code Snippet**:
    ```typescript
    [ERROR_SNIPPET]
    ```

    **Attachments to READ**:
    - Screenshot (READ THIS IMAGE): [SCREENSHOT_PATH]
    - Error Context (READ THIS): [ERROR_CONTEXT_PATH]

    ---

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

    ### Proper Fix Examples:

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
      page.waitForResponse(resp => resp.url().includes('/api/save')),
      saveButton.click()
    ]);

    // Wait for element to appear after action
    await expect(successBanner).toBeVisible({ timeout: 10000 });
    ```

    ## Instructions

    1. **Read ALL screenshot images** - they show the exact UI state when the test failed
    2. **Read ALL error-context markdown files** - CRITICAL! They contain the accessibility tree
    3. **Compare selector vs DOM** - If test uses `attributesRows` selector, search the error-context for matching elements
    4. **Read the test file** and understand the flow
    5. **Read relevant page objects** in `playwright/pages/` to see actual selectors
    6. **Identify the REAL root cause** - Is element missing from DOM? Or is selector wrong?
    7. **Implement a PROPER fix** - No timeout hacks!

    ## Expected Output

    For each failure:
    - Root cause (1-2 sentences) - be specific, not "timing issue"
    - Fix applied (file:line, what changed)
    - Why this is a proper fix (not a timeout hack)

    At the end:
    - Verification command: `npx playwright test [files] --grep "[pattern]"`
````

## Only as LAST RESORT

If after 2-3 fix attempts a test still times out and you've verified:

- All explicit waits are in place
- Selectors are correct
- No race conditions exist
- Network requests are waited for

THEN you may consider:

- `test.slow()` with a comment explaining WHY it's legitimately slow
- Marking test as `test.skip()` with a TODO to investigate further
