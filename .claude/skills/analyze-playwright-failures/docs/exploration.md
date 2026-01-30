# Exploration - Spawning Agents

## ⚠️ MANDATORY - Spawn Exploration Agents First

**STOP! DO NOT proceed without spawning exploration agents!**

**You (the main agent) MUST NOT:**

- Run `git log` directly
- Run `git diff` directly
- Read test files directly
- Read source code directly
- Make any assumptions about what changed

**You MUST use the Task tool** to spawn lightweight Explore agents (haiku model) that will do the investigation for you. This saves context and uses cheaper models for exploration.

---

## REQUIRED: Spawn Agent 1 - Recent Changes Explorer

**You MUST call the Task tool like this:**

````
Task tool call:
  subagent_type: "Explore"
  model: "haiku"
  description: "Find recent changes in [DOMAIN]"
  prompt: |
    # Find Recent Changes Related to Failing Tests

    Check git history for recent changes in these areas:

    1. **App code**: `src/**/[domain]/**`
    2. **Test code**: `playwright/tests/[domain].spec.ts`
    3. **Page objects**: `playwright/pages/[Domain]Page.ts`

    Run these commands:
    ```bash
    git log --oneline -10 -- "playwright/tests/[file]"
    git log --oneline -10 -- "src/**/[domain]*"
    git diff HEAD~5 -- src/[domain]/
    ```

    Report back:
    - What changed recently?
    - Any commits that might have broken tests?
    - Evidence of intentional behavior changes?
````

---

## REQUIRED: Spawn Agent 2 - Code Understanding Explorer

**You MUST call the Task tool like this:**

```
Task tool call:
  subagent_type: "Explore"
  model: "haiku"
  description: "Understand [SELECTOR/COMPONENT] code"
  prompt: |
    # Understand the Code Structure

    The test fails checking: [WHAT IT CHECKS]
    Error shows: [WHAT ERROR SHOWS]

    Find and read:
    1. `playwright/pages/[Page].ts` - find the selector definition
    2. `src/[component]` - understand the app component

    Questions to answer:
    - What is the exact selector?
    - Does it match what's in the DOM (from error-context)?
    - Is this a selector mismatch, timing issue, or real bug?
```

---

**After spawning both agents, WAIT for their results before proceeding.**

## Analyze Exploration Results

**Only after receiving results from both Explore agents**, determine:

1. **Recent app changes + test failure** → Likely APP BUG, ask user
2. **No app changes + selector mismatch** → TEST BUG, fix selector
3. **No app changes + timing issue** → TEST BUG, fix timing
4. **App change was intentional** → TEST needs update to match new behavior

## Is This a Test Bug or an App Bug?

**Before fixing anything, determine if the failure indicates a REAL BUG in the application!**

E2E test failures can mean:

1. **Test is broken** - selector changed, timing issue, flaky test → fix the test
2. **App has a bug** - feature actually broken, regression introduced → **REPORT TO USER, DON'T FIX THE TEST**

## If You Suspect an APP BUG

**DO NOT "fix" the test** - this masks real bugs!

**Stop and report to user:**

```
⚠️ POSSIBLE APP BUG DETECTED

Test: [test name]
Expected: [what should happen]
Actual: [what screenshot shows]

This looks like a real application issue, not a test problem:
- [Evidence 1]
- [Evidence 2]

Recent changes in this area:
- [commit hash] [commit message]

Questions:
- When did this feature last work correctly?
- Were there intentional changes to this behavior?
```

## Decision Matrix

| Screenshot shows               | Recent app changes? | Error type        | Likely cause        | Action                |
| ------------------------------ | ------------------- | ----------------- | ------------------- | --------------------- |
| Error toast/message            | Any                 | Any               | App bug             | Report to user        |
| Form fields missing            | Yes                 | Any               | App bug             | Report to user        |
| API error in console           | Any                 | Any               | App/backend bug     | Report to user        |
| "Not found" / empty list       | No                  | API/data error    | **Data issue**      | Ask user to check env |
| "Permission denied"            | No                  | Auth error        | **Data issue**      | Ask user to check env |
| Correct UI, wrong count        | No                  | Count assertion   | Test bug (timing)   | Fix test              |
| Element exists, not found      | No                  | Element not found | Test bug (selector) | Fix test              |
| Success shown, assertion fails | Yes                 | Assertion         | Maybe intentional   | Ask user              |
| Success shown, assertion fails | No                  | Assertion         | Test bug            | Investigate selector  |

## ⚠️ Anti-patterns

```
❌ Main agent runs: git log --oneline -10 -- playwright/tests/
❌ Main agent runs: grep -r "selector" playwright/pages/
❌ Main agent reads: playwright/tests/attributes.spec.ts
```

## ✅ Correct Pattern

```
✅ Main agent spawns: Task tool with subagent_type="Explore", model="haiku"
   → Agent runs git log, reads files, reports back
✅ Main agent waits for agent results
✅ Main agent analyzes results and decides next steps
```
