---
name: analyze-failures
description: Analyze Playwright E2E test failure reports from CI. Parses merged blob reports, groups similar errors, and delegates to specialized subagents for investigation and fixes. Use when CI tests fail or when asked to fix E2E test failures.
argument-hint: "[github-run-url | pr-url | zip-file | folder-path]"
allowed-tools: Read, Grep, Glob, Bash, Task, Write, Edit, AskUserQuestion
---

# Playwright E2E Test Failure Analysis

Analyze Playwright test failures and delegate fixes to specialized subagents.

## Input

Report location: `$ARGUMENTS`

**Supported input formats:**

1. **GitHub Actions run URL** (easiest)
   - Example: `https://github.com/saleor/saleor-dashboard/actions/runs/21513974962`
   - Will download `merged-blob-reports` artifact automatically

2. **GitHub PR URL**
   - Example: `https://github.com/saleor/saleor-dashboard/pull/6292`
   - Will find the latest failed CI run and download artifact

3. **ZIP file** - Downloaded artifact from CI
   - Example: `~/Downloads/merged-blob-reports.zip`
   - Will extract, merge shards, and parse automatically

4. **Folder with blob reports** - Already extracted CI artifact
   - Contains: `report-e2e-*.zip` shard files
   - Will run `npx playwright merge-reports` and parse

5. **Pre-merged JSON file** - Already merged report
   - Example: `./merged-report.json`
   - Uses directly

### Handling GitHub URLs

If the input is a GitHub URL, download the artifact first:

**For Actions run URL:**

```bash
# Extract run ID from URL
RUN_ID="21513974962"  # from https://github.com/.../actions/runs/21513974962

# List artifacts to find merged-blob-reports
gh run view $RUN_ID --json artifacts

# Download the artifact
gh run download $RUN_ID -n merged-blob-reports -D ./playwright-failures/downloaded
```

**For PR URL:**

```bash
# Get the PR number
PR_NUM="6292"  # from https://github.com/.../pull/6292

# Get the LATEST run (most recent) for this PR's branch
# Use --limit 1 to get only the latest
RUN_INFO=$(gh run list --branch $(gh pr view $PR_NUM --json headRefName -q .headRefName) --limit 1 --json databaseId,status,conclusion,name)

# Check if any runs exist
if [ "$(echo $RUN_INFO | jq 'length')" -eq 0 ]; then
    echo "No CI runs found for this PR"
    # Ask user if they want to trigger tests (see below)
fi

# Get the run ID from the latest run
RUN_ID=$(echo $RUN_INFO | jq -r '.[0].databaseId')

# Download from the latest run
gh run download $RUN_ID -n merged-blob-reports -D ./playwright-failures/downloaded
```

**If no runs exist on the PR:**

Use `AskUserQuestion` to ask the user:

```
No CI runs found for PR #[NUMBER].

Would you like to trigger E2E tests? I can add a label to the PR:
- "run pw-e2e" - Triggers Playwright E2E tests
- "test deployment" - Triggers deployment + tests

Or you can wait for an existing run to complete.
```

If user agrees, add the label:

```bash
gh pr edit $PR_NUM --add-label "run pw-e2e"
```

Then stop and ask user to come back after test ends run.

--

After downloading, the artifact folder becomes the input for the prepare script.

## Phase 0: Check Previous Attempts (Main Agent)

Before analyzing new failures, check if we've tried to fix these tests before.

### Check Git History for Recent Test Fixes

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

### Save New Attempts

After making fixes, update the file:

```bash
# The skill should append new attempts to the JSON file
```

## Phase 1: Prepare Report (Main Agent)

### ⚠️ MANDATORY WORKFLOW - READ THIS FIRST

**The main agent (you) MUST follow this workflow:**

1. ✅ Download/prepare report files (Step 1.1)
2. ✅ Read summary.md and failures-full.json (Step 1.2)
3. ✅ Read screenshots AND error-context files (Step 1.2.1)
4. ⚠️ **SPAWN Explore agents using Task tool** (Step 1.3) - **DO NOT skip this!**
5. ✅ Wait for agents to return with results
6. ✅ Analyze results to determine test bug vs app bug (Step 1.4-1.6)
7. ✅ Only THEN proceed to fix tests if needed (Phase 2)

**YOU MUST NOT:**

- Run `git log`, `git diff`, or explore code directly
- Skip spawning Explore agents
- Proceed to fixing before exploration completes

---

### Step 1.1: Handle Input & Download if Needed

#### Check for Existing Report Directory

Before downloading, check if `./playwright-failures/` already exists:

```bash
if [ -d "./playwright-failures" ]; then
    # Directory exists - ask user what to do
fi
```

**If directory exists, use `AskUserQuestion`:**

```
A previous playwright-failures directory exists.

How would you like to proceed?
1. Delete the old report and download fresh
2. Keep the old report (rename to playwright-failures-[timestamp]) and download fresh
3. Use the existing report (skip download)
```

**Based on user choice:**

```bash
# Option 1: Delete old
rm -rf ./playwright-failures

# Option 2: Keep old with timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
mv ./playwright-failures ./playwright-failures-$TIMESTAMP
echo "Previous report moved to: ./playwright-failures-$TIMESTAMP"

# Option 3: Skip download, use existing
# Just proceed to Step 1.2
```

---

**If input is a GitHub URL**, download the artifact first:

```bash
# For GitHub Actions run URL (e.g., https://github.com/saleor/saleor-dashboard/actions/runs/21513974962)
RUN_ID="[extracted-from-url]"
gh run download $RUN_ID -n merged-blob-reports -D ./playwright-failures/downloaded

# For PR URL (e.g., https://github.com/saleor/saleor-dashboard/pull/6292)
PR_NUM="[extracted-from-url]"

# Get LATEST run (always use most recent, not just failed)
RUN_ID=$(gh run list --branch $(gh pr view $PR_NUM --json headRefName -q .headRefName) --limit 1 --json databaseId -q '.[0].databaseId')

# If no runs found, ask user if they want to trigger tests
if [ -z "$RUN_ID" ]; then
    # Use AskUserQuestion: "No runs found. Add label 'run pw-e2e' to trigger tests?"
    # If yes: gh pr edit $PR_NUM --add-label "run pw-e2e"
fi

gh run download $RUN_ID -n merged-blob-reports -D ./playwright-failures/downloaded
```

**Then run the prepare script:**

```bash
# Use downloaded folder if from GitHub, or original $ARGUMENTS if local file/folder
INPUT_PATH="./playwright-failures/downloaded"  # or "$ARGUMENTS" for local
bash scripts/prepare-report.sh "$INPUT_PATH" ./playwright-failures
```

This script:

1. Detects if reports need merging (runs `npx playwright merge-reports` if needed)
2. Parses the JSON/JSONL report
3. Extracts failures with full error details and attachment paths
4. Provides semantic hints (categories, domains) to assist grouping
5. Creates summary files

### Step 1.2: Read and Analyze Failures

```
Read ./playwright-failures/summary.md
Read ./playwright-failures/failures-full.json
```

### Step 1.2.1: CRITICAL - Read Screenshots AND Error-Context Files

**The error-context files are GOLD for debugging!** They contain the accessibility tree (DOM snapshot) at the moment of failure.

For each failure, READ BOTH:

1. **Screenshot** (PNG) - Shows what the user sees at moment of failure
2. **Error-context** (Markdown) - Shows what's ACTUALLY in the DOM

#### ⚠️ LIMITATION: Screenshots May Miss Transient UI

**Screenshots only capture the FINAL state at failure.** Transient UI elements like:

- Success/error notifications (auto-dismiss after a few seconds)
- Loading spinners
- Tooltips
- Dropdown menus

...may have already disappeared by the time the screenshot was taken!

#### When to Analyze Traces (for transient UI)

If the failure involves:

- `expectSuccessBanner` or notification assertions
- "element not found" but you expected it to appear briefly
- Timing-related failures

**Use the Playwright trace to see step-by-step snapshots:**

```bash
# Open trace viewer in browser (interactive)
npx playwright show-trace [TRACE_PATH]

# Or extract trace contents for analysis
unzip -l [TRACE_PATH]  # List contents
unzip [TRACE_PATH] -d ./trace-contents  # Extract
```

The trace ZIP contains:

- `0-trace.trace` - All actions with timestamps
- `0-trace.network` - **Network requests and responses (NDJSON format)**
- `resources/` - Screenshots at EACH STEP + response bodies (referenced by SHA1)

#### Checking for API/GraphQL Errors in Traces

**Error toasts often appear because a GraphQL mutation/query failed!**

To check network requests:

```bash
# Extract trace
unzip [TRACE_PATH] -d ./.trace-extracted
cd ./.trace-extracted

# List all GraphQL requests with status codes
cat 0-trace.network | jq -r 'select(.snapshot.request.method == "POST") | "\(.snapshot.response.status) \(.snapshot.request.url)"'

# Check ALL GraphQL responses for errors (response bodies are in resources/)
for sha in $(cat 0-trace.network | jq -r 'select(.snapshot.request.method == "POST") | .snapshot.response.content._sha1' 2>/dev/null); do
  if [ -f "resources/$sha" ]; then
    result=$(cat "resources/$sha" | jq -r 'if .errors then "❌ ERRORS: " + (.errors[0].message // "unknown") else "✅ OK: " + (.data | keys | join(", ")) end' 2>/dev/null)
    echo "$result"
  fi
done

# Or use trace viewer (interactive, shows Network tab)
npx playwright show-trace [TRACE_PATH]
```

**Common GraphQL error patterns:**

| Error in Response                | Likely Cause                      |
| -------------------------------- | --------------------------------- |
| `"errors": [{"message": "..."}]` | GraphQL mutation/query failed     |
| `"PERMISSION_DENIED"`            | User lacks permission             |
| `"NOT_FOUND"`                    | Entity doesn't exist (data issue) |
| `"INVALID"`                      | Validation failed                 |
| `"REQUIRED"`                     | Missing required field            |
| HTTP 500                         | Backend crashed                   |
| HTTP 401/403                     | Auth issue                        |

**When you see API errors:**

1. The toast showing "error" is CORRECT behavior - don't fix the test
2. Investigate WHY the API failed:
   - Data issue? → Ask user to check environment
   - Permission issue? → Check test user setup
   - Backend bug? → Check Saleor repo
   - Invalid test data? → Fix the test data, not assertions

**To analyze trace snapshots:**

1. Extract the trace: `unzip [TRACE_PATH] -d ./.trace-extracted`
2. Look at `trace.json` for the action timeline
3. Read the PNG snapshots in `resources/` to see UI at each step
4. This shows if notification appeared THEN disappeared before assertion

#### Smart Screenshot Extraction from Traces

**DON'T extract all frames** - there can be 100+ screenshots which is too many to analyze.

**Instead, extract targeted screenshots after key actions:**

```bash
# Extract trace
unzip [TRACE_PATH] -d ./.trace-extracted
cd ./.trace-extracted

# 1. Find key actions (clicks, especially on save/delete buttons)
cat 0-trace.trace | jq -r 'select(.type == "before") | "\(.startTime) - \(.apiName) \(.params.selector // "")"' 2>/dev/null

# 2. Get screenshots taken 0-3 seconds AFTER a specific action
# Example: action was at timestamp 185821, get next few screenshots
ACTION_TIME=185821
cat 0-trace.trace | jq -r "select(.type == \"screencast-frame\") | select(.timestamp > $ACTION_TIME and .timestamp < ($ACTION_TIME + 3000)) | .sha1" | head -5

# 3. Extract only those specific screenshots
for sha in $(cat 0-trace.trace | jq -r "select(.type == \"screencast-frame\") | select(.timestamp > $ACTION_TIME and .timestamp < ($ACTION_TIME + 3000)) | .sha1" | head -5); do
  cp "resources/$sha" ./screenshots_after_action/
done
```

**Quick script to get screenshots after each click:**

```bash
# Get all click actions and their timestamps
CLICKS=$(cat 0-trace.trace | jq -r 'select(.type == "before" and .apiName == "click") | .startTime')

# For each click, get 2-3 screenshots taken right after
for click_time in $CLICKS; do
  echo "=== Screenshots after click at $click_time ==="
  cat 0-trace.trace | jq -r "select(.type == \"screencast-frame\") | select(.timestamp > $click_time and .timestamp < ($click_time + 2000)) | .sha1" | head -3
done
```

**This gives you targeted screenshots where notifications would appear** (right after save/delete actions) instead of overwhelming the model with 100+ images.

#### Fallback: Extract Video Frames at Specific Timestamps

If you know approximately when something happened (e.g., "around 10 seconds into the test"):

```bash
# Extract single frame at specific timestamp (use -update 1 for single images)
ffmpeg -y -i [VIDEO_PATH] -ss 00:00:10 -frames:v 1 -update 1 ./frame_at_10s.png

# Or extract 3 frames around a timestamp (every 0.5s)
mkdir -p ./frames
ffmpeg -y -i [VIDEO_PATH] -ss 00:00:09.5 -t 1.5 -vf "fps=2" ./frames/frame_%02d.png
```

#### Summary: What to Check When

| Failure Type                    | Check First                         | Check if Needed |
| ------------------------------- | ----------------------------------- | --------------- |
| Element not found               | Screenshot + Error-context          | -               |
| Count assertion                 | Screenshot + Error-context          | -               |
| Notification timeout            | Error-context + **Trace snapshots** | Video frames    |
| Flaky/intermittent              | **Trace snapshots**                 | Video frames    |
| "Element was visible then gone" | **Trace snapshots**                 | Video frames    |

**Why error-context is essential:**

The error-context file shows the page's accessibility tree like:

```yaml
- table [ref=e238]:
    - rowgroup [ref=e245]:
        - row "xxl XXL" [ref=e246]:
            - cell "xxl" [ref=e255]
            - cell "XXL" [ref=e256]
```

This tells you:

- **Element EXISTS in DOM** but test can't find it → Selector is wrong
- **Element MISSING from DOM** → App didn't render it (app bug or timing)
- **Element has WRONG text/state** → App bug or test expectation wrong
- **Element is HIDDEN** → Need to scroll or wait for animation

**Example analysis:**

Test fails: `expect(attributesRows).toHaveCount(1)` - Expected 1, got 0

Check error-context:

- If you SEE `row "xxl XXL"` in the tree → Element exists, selector `attributesRows` is wrong
- If you DON'T see any rows → Element wasn't rendered (timing or app bug)

**Always read error-context before deciding if it's test bug or app bug!**

### Step 1.3: MANDATORY - Spawn Exploration Agents First

⚠️ **STOP! DO NOT proceed without spawning exploration agents!**

**You (the main agent) MUST NOT:**

- Run `git log` directly
- Run `git diff` directly
- Read test files directly
- Read source code directly
- Make any assumptions about what changed

**You MUST use the Task tool** to spawn lightweight Explore agents (haiku model) that will do the investigation for you. This saves context and uses cheaper models for exploration.

---

#### REQUIRED: Spawn Agent 1 - Recent Changes Explorer

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

#### REQUIRED: Spawn Agent 2 - Code Understanding Explorer

**You MUST call the Task tool like this:**

for each suspected component that has a failure

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

### Step 1.4: Analyze Exploration Results (After Agents Return)

**Only after receiving results from both Explore agents**, determine:

1. **Recent app changes + test failure** → Likely APP BUG, ask user
2. **No app changes + selector mismatch** → TEST BUG, fix selector
3. **No app changes + timing issue** → TEST BUG, fix timing
4. **App change was intentional** → TEST needs update to match new behavior

### Step 1.5: Is This a Test Bug or an App Bug?

**Before fixing anything, determine if the failure indicates a REAL BUG in the application!**

E2E test failures can mean:

1. **Test is broken** - selector changed, timing issue, flaky test → fix the test
2. **App has a bug** - feature actually broken, regression introduced → **REPORT TO USER, DON'T FIX THE TEST**

### Step 1.6: If You Suspect an APP BUG

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

### Step 1.7: Check for Test Data / Environment Issues

⚠️ **Before fixing tests, consider if the problem is TEST DATA or ENVIRONMENT STATE!**

Test failures can be caused by:

1. **Stale test data** - Fixtures not updated for new Saleor features
2. **Missing test data** - Previous test run deleted items that weren't restored
3. **Environment not restored** - CI should restore env, but sometimes fails
4. **Saleor backend changes** - API behavior changed, test expectations outdated - might be a bug in Saleor Dashboard as well
5. **Database state drift** - Test environment diverged from expected state

#### Signs of Data/Environment Issues

| Error Pattern                        | Likely Data Issue                   |
| ------------------------------------ | ----------------------------------- |
| "No items found" when list expected  | Test data missing/deleted           |
| "404 Not Found" on API call          | Entity doesn't exist in DB          |
| "Permission denied"                  | User/permissions not set up         |
| Empty dropdown when options expected | Reference data missing              |
| "Invalid ID" errors                  | Test fixtures have wrong IDs        |
| Count is 0 when expecting N          | Data was deleted, not restored      |
| Error toast instead of success       | **Check trace for GraphQL errors!** |
| GraphQL `NOT_FOUND` in trace         | Entity deleted/missing              |
| GraphQL `PERMISSION_DENIED` in trace | Test user lacks permissions         |
| GraphQL `INVALID` in trace           | Test sending bad data               |

#### When Data Issues Are Suspected

**DO NOT "fix" the test by changing assertions!** This masks real problems.

**Instead, ask the user:**

```
⚠️ POSSIBLE TEST DATA/ENVIRONMENT ISSUE

Test: [test name]
Expected: [what test expects - e.g., "3 products in list"]
Actual: [what happened - e.g., "0 products found"]

This looks like a test data issue, not a test bug:
- The test expects data that doesn't exist in the environment
- Previous test runs may have deleted this data
- Environment may not have been properly restored

Questions:
1. Has the test environment been restored recently?
2. Can you verify this data exists in the test DB?
3. Should we check if Saleor backend behavior changed?

I can investigate Saleor backend code if needed (separate repo at ../saleor/).
```

#### Investigating Saleor Backend

Sometimes the issue is in Saleor itself (not Dashboard). The backend repo is typically at `../saleor/` or can be specified by user.

**Spawn an Explore agent to check Saleor:**

```
Task tool call:
  subagent_type: "Explore"
  model: "haiku"
  description: "Check Saleor backend for [FEATURE]"
  prompt: |
    # Investigate Saleor Backend

    The Dashboard test expects: [BEHAVIOR]
    But the API returns: [ACTUAL]

    Check the Saleor backend code:
    1. Find the relevant GraphQL resolver/mutation
    2. Check for recent changes to this endpoint
    3. Verify expected behavior matches test expectations

    Path: ../saleor/ (or ask user for correct path)

    Look at:
    - saleor/graphql/[domain]/mutations.py
    - saleor/graphql/[domain]/resolvers.py
    - Recent commits: git log --oneline -10 -- saleor/graphql/[domain]/
```

#### Test Data Restoration & Direct Verification

CI should restore the test environment before each run, but if restoration failed or you suspect data issues:

**Step 1: Ask user to restore environment**

```
The test expects data that may not exist. Before I investigate further:

1. Can you restore the test environment?
2. Once restored, I can query the Saleor API directly to verify the data exists.

To enable API queries, please ensure:
- Test environment is running and accessible
- Auth token is set in .env file (I will load it but NOT read/display it)
  Example: SALEOR_API_TOKEN=your_token_here

Let me know when the environment is restored.
```

**How to restore the test environment via GitHub Actions:**

The restore requires environment variables (`BACKUP_ID`, `INSTANCE_NAME`, etc.) that are configured in CI. The easiest way is to trigger the workflow directly:

**Option 1: Via GitHub CLI (recommended)**

```bash
# Trigger the manual test workflow which restores snapshot first
gh workflow run run-test-manual.yml

# Check the run status
gh run list --workflow=run-test-manual.yml --limit 1
```

**Option 2: Via GitHub UI**

1. Go to: https://github.com/saleor/saleor-dashboard/actions/workflows/run-test-manual.yml
2. Click "Run workflow" button
3. Select branch and click "Run workflow"

**Option 3: If you only need restore (no tests)**

Ask user to check if there's a restore-only workflow, or create one based on:

- `.github/actions/prepare-instance/action.yml` - Contains the restore logic
- The key step is `saleor backup restore` with the right BACKUP_ID

**Note:** The `initialize-cloud` job in the workflow handles restore. The restore happens automatically before tests run. If you need to verify data manually, trigger the workflow and check the environment while it's running (before tests delete data).

**Important:** After tests run, some data gets deleted! If you need to verify data exists, either:

1. Check DURING the test run (after restore, before tests complete)
2. Or trigger the workflow and cancel it after the `initialize-cloud` job completes

**Step 2: Query Saleor API to verify data**

Once user confirms environment is ready, use the GraphQL MCP or curl to verify data:

```bash
# Load token from .env (secure - don't echo/display it)
source .env

# Query to check if entity exists
curl -s -X POST "$SALEOR_API_URL/graphql/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SALEOR_API_TOKEN" \
  -d '{"query": "{ [QUERY_HERE] }"}' | jq '.data'
```

**Example verification queries:**

```graphql
# Check if product exists
query {
  product(id: "PRODUCT_ID") {
    id
    name
  }
}

# Check if order exists
query {
  order(id: "ORDER_ID") {
    id
    number
  }
}

# Check if user has permissions
query {
  me {
    permissions {
      code
    }
  }
}

# List available channels
query {
  channels {
    id
    name
  }
}

# Check specific promotion
query {
  promotion(id: "PROMO_ID") {
    id
    name
  }
}
```

**⚠️ Security: NEVER display or log the auth token!**

```bash
# ❌ NEVER do this
echo $SALEOR_API_TOKEN
cat .env

# ✅ Safe - load and use without displaying
source .env && curl ... -H "Authorization: Bearer $SALEOR_API_TOKEN"
```

**Step 3: Report findings**

After querying:

- If data exists → Problem is elsewhere (timing, selector, etc.)
- If data missing → Confirm with user, may need to update fixtures or restore again
- If permission denied → Test user setup issue

**Don't assume** - If you can verify data exists/doesn't exist, do so before deciding it's a test bug vs data issue.

### Decision Matrix

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

### Step 1.4: Intelligently GROUP Test Failures

**Only proceed here after ruling out app bugs!**

The script provides hints (category, domain, rootCause) but YOU must:

1. **Read each failure's error message** - understand WHAT actually failed
2. **Identify semantic patterns** - same root cause, not just same error type
3. **Group by likely fix** - failures that will be fixed together

### Intelligent Grouping - YOUR Judgment Required

The script provides HINTS (category, domain, rootCause) but **YOU must decide groupings** using semantic reasoning. Consider:

1. **What is the likely root cause?** - Group failures that will be fixed by the same change
2. **Domain context matters** - Same error in different domains may have different causes
3. **Error semantics matter** - "notification not shown" vs "element count wrong" are different problems
4. **Test flow matters** - Is it failing during setup, action, or verification?

**Questions to ask yourself when grouping:**

- Will fixing one of these likely fix the others?
- Do they fail at the same point in the test flow?
- Are they testing the same feature/component?
- Is the underlying cause the same (timing, selector, API, etc.)?

### Example: How to Think About Grouping

Given these failures:

```
1. attributes.spec.ts - expectSuccessBanner timeout
2. orders.spec.ts - expectSuccessBanner timeout
3. orders.spec.ts - toHaveCount(1) got 0
4. giftCards.spec.ts - clipboard assertion failed
5. attributes.spec.ts - toHaveCount(1) got 0
```

**Think through each:**

- 1 & 2: Same error pattern (`expectSuccessBanner`), different domains. Are they the same banner component? Same timing issue? **Maybe group if same UI component.**
- 3 & 5: Same error type (count), different domains. Is it the same selector pattern? Different forms? **Maybe separate if different UI flows.**
- 4: Clipboard is often a CI environment issue. **Probably isolated group.**

**Your grouping depends on what you discover** when you read the errors and understand the codebase. Don't mechanically group by script category.

## Phase 2: Delegate to Subagents

### Agent Types and When to Use Them

| Agent Type                            | Model  | Purpose                              | When to Use                                |
| ------------------------------------- | ------ | ------------------------------------ | ------------------------------------------ |
| `Explore`                             | haiku  | Find recent changes, understand code | FIRST - before any fixing                  |
| `Explore`                             | haiku  | Understand selectors/components      | When selector issues suspected             |
| `dashboard-playwright:e2e-test-fixer` | sonnet | Actually fix test code               | AFTER exploration confirms it's a test bug |

### Workflow

1. **FIRST**: Spawn `Explore` agents (haiku) to gather context
2. **THEN**: Analyze results - is it test bug or app bug?
3. **IF TEST BUG**: Spawn `dashboard-playwright:e2e-test-fixer` agents to fix
4. **IF APP BUG**: Report to user, don't fix

### Spawning Fixer Agents

**Only spawn fixers after exploration confirms these are test bugs.**

**Spawn ONE subagent per intelligent group** (not per script category).

### Subagent Prompt Template

Use the Task tool with `subagent_type: "dashboard-playwright:e2e-test-fixer"`:

````
Task tool:
  subagent_type: "dashboard-playwright:e2e-test-fixer"
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

    ## Expected Output

    For each failure:
    - Root cause (1-2 sentences) - be specific, not "timing issue"
    - Fix applied (file:line, what changed)
    - Why this is a proper fix (not a timeout hack)

    At the end:
    - Verification command: `npx playwright test [files] --grep "[pattern]"`
````

## Phase 3: Save Attempts & Verify Fixes

### Save Fix Attempts to History

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

### Verify Fixes Work

**Option 1: Run locally (if environment is set up)**

```bash
npx playwright test [affected-files] --reporter=list
```

**Option 2: Run in CI (recommended for accurate results)**

After user pushes the fixes:

```bash
# Trigger the test workflow on the current branch
gh workflow run run-test-manual.yml --ref $(git branch --show-current)

# Or add label to PR to trigger tests
gh pr edit [PR_NUMBER] --add-label "run pw-e2e"

# Watch the run
gh run watch
```

**Ask user to push and re-run:**

```
I've made the fixes. To verify they work in CI:

1. Please commit and push these changes
2. Then I can trigger the test workflow:
   - `gh workflow run run-test-manual.yml --ref [BRANCH]`
   - Or add "run pw-e2e" label to the PR

Would you like me to trigger the tests after you push?
```

### Update Attempt Results

After verification:

- If tests pass: update `"result": "success"`
- If tests fail: update `"result": "failed"` with new error

### If Tests Still Fail:

1. **Read the NEW error** - Did the failure change?
2. **Spawn another subagent** for remaining failures
3. **Provide context** - "Previous fix attempted X but still failing because Y"

This is an iterative process. Don't stop at first attempt.

### Only as LAST RESORT:

If after 2-3 fix attempts a test still times out and you've verified:

- All explicit waits are in place
- Selectors are correct
- No race conditions exist
- Network requests are waited for

THEN you may consider:

- `test.slow()` with a comment explaining WHY it's legitimately slow
- Marking test as `test.skip()` with a TODO to investigate further

## Phase 4: Synthesize Results (Main Agent)

After all iterations, compile the final report.

### When All Tests Pass - Cleanup Reminder

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

### [Next Group]...

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

## Quick Reference

### File Locations
- Test specs: `playwright/tests/*.spec.ts`
- Page objects: `playwright/pages/*.ts`
- Skill scripts: `scripts/` (relative to skill base directory)

### Semantic Categories (hints from script)

The script provides these categories as HINTS - use your judgment:

| Category | What it means | Common fixes |
|----------|--------------|--------------|
| notification-assertion | Banner/toast check failed | Wait for banner visibility |
| count-assertion | Element count wrong | Check selector, wait for render |
| content-assertion | Text content wrong | Check for loading states |
| visibility-assertion | Element not visible | Scroll into view, wait for animation |
| state-assertion | Enabled/disabled wrong | Wait for form state |
| element-timeout | Waiting for element | Fix selector or add proper wait |
| test-timeout | Entire test slow | Find the slow operation, optimize |
| clipboard-assertion | Clipboard API issue | Mock clipboard or skip in CI |
| api-error | Network/GraphQL error | Check test data, backend state |

### Attachment Types

| Type | Format | Contains |
|------|--------|----------|
| screenshot | PNG | Visual state at failure |
| error-context | Markdown | Accessibility tree (what elements exist) |
| trace | ZIP | Full Playwright trace (can view with `npx playwright show-trace`) |
| video | WebM | Recording of the test run |

## Key Principles

1. **Check history first** - Look at previous attempts file before trying new fixes
2. **⚠️ MUST SPAWN Explore agents** - Use Task tool with `subagent_type: "Explore"` and `model: "haiku"` - DO NOT run git/grep/read directly yourself
3. **Test bug vs App bug** - Before fixing, determine if the app itself is broken. Don't mask real bugs!
4. **LLM-based grouping** - You decide groups, script just provides hints
5. **Error-context files are gold** - Read them to see actual DOM state, not just screenshots
6. **No timeout hacks** - Find real issues, not lazy fixes
7. **Iterative fixing** - Verify and retry if needed
8. **Report uncertainties** - When unsure if it's a test or app issue, ask the user
9. **Use cheap models for exploration** - Haiku for git history and code reading, Sonnet for actual fixes
10. **Track attempts** - Save what was tried to `previous-attempts.json` so we don't repeat failed fixes

### ⚠️ NEVER DO THIS (Anti-patterns)

```

❌ Main agent runs: git log --oneline -10 -- playwright/tests/
❌ Main agent runs: grep -r "selector" playwright/pages/
❌ Main agent reads: playwright/tests/attributes.spec.ts

```

### ✅ ALWAYS DO THIS

```

✅ Main agent spawns: Task tool with subagent_type="Explore", model="haiku"
→ Agent runs git log, reads files, reports back
✅ Main agent waits for agent results
✅ Main agent analyzes results and decides next steps

```

```
