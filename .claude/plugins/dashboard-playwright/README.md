# Dashboard Playwright Plugin

A Claude Code plugin for analyzing and fixing Playwright E2E test failures in the Saleor Dashboard project.

## Overview

This plugin provides intelligent analysis of Playwright test failures from CI runs, groups similar errors, and delegates fixes to specialized subagents. It enforces best practices by blocking direct test edits and requiring delegation to specialized fixing agents.

## Features

- **Automatic Failure Analysis**: Parses Playwright blob reports and identifies failure patterns
- **Smart Grouping**: Groups related failures using semantic analysis, not just error types
- **Multi-format Input**: Supports GitHub URLs, local files, ZIP archives, and pre-merged reports
- **Screenshot & DOM Analysis**: Reads both visual screenshots and accessibility tree snapshots
- **Trace Investigation**: Analyzes Playwright traces including network requests and GraphQL responses
- **Test vs App Bug Detection**: Distinguishes between test issues and real application bugs
- **Delegation Enforcement**: Hooks prevent direct edits, requiring proper subagent delegation
- **Fix History Tracking**: Records previous fix attempts to avoid repeating failed approaches

## Installation

The plugin is already installed in the Saleor Dashboard project. To enable it in another project:

1. Copy the plugin directory to `.claude/plugins/dashboard-playwright/`
2. Update `.claude/plugins/.claude-plugin/marketplace.json`:
   ```json
   {
     "plugins": [
       {
         "name": "dashboard-playwright",
         "description": "Analyze Playwright E2E test failures from CI",
         "source": "./dashboard-playwright"
       }
     ]
   }
   ```
3. Enable in `.claude/settings.json`:
   ```json
   {
     "enabledPlugins": {
       "dashboard-playwright@saleor-dashboard-plugins": true
     }
   }
   ```

## Usage

### Basic Command

```bash
/dashboard-playwright:analyze-failures <report-location>
```

### Input Formats

#### 1. GitHub Actions Run URL (Recommended)

```bash
/dashboard-playwright:analyze-failures https://github.com/saleor/saleor-dashboard/actions/runs/21513974962
```

- Automatically downloads `merged-blob-reports` artifact
- Extracts and processes the report
- No manual download needed

#### 2. GitHub PR URL

```bash
/dashboard-playwright:analyze-failures https://github.com/saleor/saleor-dashboard/pull/6292
```

- Finds the latest CI run for the PR's branch
- Downloads the test artifact
- Can trigger tests if no runs exist (asks for confirmation)

#### 3. Local ZIP File

```bash
/dashboard-playwright:analyze-failures ~/Downloads/merged-blob-reports.zip
```

- Extracts the ZIP archive
- Merges shards if needed
- Parses the report

#### 4. Local Folder

```bash
/dashboard-playwright:analyze-failures ./playwright-failures/downloaded
```

- Processes folder containing `report-e2e-*.zip` shard files
- Runs `npx playwright merge-reports` automatically

#### 5. Pre-merged JSON

```bash
/dashboard-playwright:analyze-failures ./merged-report.json
```

- Uses the report directly
- No merging needed

## Workflow

### Phase 0: Check Previous Attempts

The plugin automatically checks `./playwright-failures/previous-attempts.json` for:

- Tests that were fixed before but are failing again
- Previous diagnoses and fixes that didn't work
- Commit hashes of previous fix attempts

This prevents repeating failed approaches.

### Phase 1: Prepare & Analyze

1. **Download/Prepare Report**
   - Handles all input formats automatically
   - Checks for existing `./playwright-failures/` directory
   - Asks user whether to keep, delete, or use existing reports

2. **Parse Failures**
   - Extracts error messages, stack traces, and attachments
   - Creates `summary.md` and `failures-full.json`
   - Identifies semantic hints (categories, domains, root causes)

3. **Read Attachments**
   - **Screenshots** (PNG): Visual state at failure
   - **Error-context** (Markdown): DOM accessibility tree showing actual page structure
   - **Traces** (ZIP): Full Playwright trace with network requests and step-by-step snapshots

4. **Spawn Exploration Agents** ⚠️ MANDATORY
   - Uses `Task` tool with `subagent_type: "Explore"` and `model: "haiku"`
   - Agent 1: Checks recent git history for relevant changes
   - Agent 2: Understands component/selector code
   - Main agent MUST NOT run git/grep/read directly

5. **Determine Root Cause**
   - Test bug (selector, timing, assertions) → Fix test
   - App bug (feature broken, API error) → Report to user, DON'T fix test
   - Data issue (missing fixtures, environment) → Ask user to restore environment

### Phase 2: Delegate to Subagents

If failures are confirmed as test bugs:

1. **Group Intelligently**: Group failures by likely fix, not just error type
2. **Spawn Fixer Agents**: One agent per group using `dashboard-playwright:e2e-test-fixer`
3. **Wait for Results**: Each agent investigates and fixes its group

Example delegation:

```
Task tool:
  subagent_type: "dashboard-playwright:e2e-test-fixer"
  description: "Fix notification timeout failures (3 tests)"
  prompt: |
    Fix these 3 test failures that all timeout waiting for success notifications.

    Resources: ./playwright-failures/

    Failures:
    1. attributes.spec.ts:123 - expectSuccessBanner timeout
       Screenshot: ./playwright-failures/attachments/screenshot-123.png
       Error-context: ./playwright-failures/attachments/error-context-123.md

    CRITICAL: NO test.slow() or arbitrary timeouts. Use explicit waits.
```

### Phase 3: Verify & Track

1. **Save Fix Attempts**: Updates `previous-attempts.json` with diagnosis, fix, and commit
2. **Verify Locally**: Runs tests if environment is set up
3. **Verify in CI**: Triggers GitHub workflow or adds PR label to run tests
4. **Update Results**: Marks attempts as success/failed based on test results

### Phase 4: Report Results

Synthesizes final report with:

- Summary of fixes by group
- Root causes identified
- Verification commands
- Remaining issues requiring manual review

## Troubleshooting

### Plugin Not Showing in `/` Commands

The skill uses namespacing:

```bash
/dashboard-playwright:analyze-failures
```

Not just `/analyze-failures`.

### "No CI runs found for this PR"

The PR branch may not have any CI runs yet. The plugin will ask if you want to:

1. Add `run pw-e2e` label to trigger tests
2. Add `test deployment` label for full deployment + tests
3. Wait for existing run to complete

### Downloaded Artifact Folder Already Exists

The plugin checks for existing `./playwright-failures/` and asks:

1. Delete old and download fresh
2. Keep old (rename with timestamp) and download fresh
3. Use existing report (skip download)

### "Error-context file missing"

Some test failures may not have all attachments. The plugin gracefully handles missing files and uses available data.

### Fix Didn't Work (Test Still Failing)

Check `previous-attempts.json` to see:

- What was tried before
- Whether the same approach was used
- If the failure changed after the fix

The plugin supports iterative fixing - spawn another fixer agent with context about what was already tried.

## Example Session

```bash
# Start analysis with GitHub PR URL
/dashboard-playwright:analyze-failures https://github.com/saleor/saleor-dashboard/pull/6292

# Plugin will:
# 1. Download latest CI run artifact
# 2. Extract and parse reports
# 3. Read screenshots and error-context files
# 4. Spawn Explore agents to check git history and code
# 5. Determine if failures are test bugs or app bugs
# 6. Group related failures intelligently
# 7. Spawn e2e-test-fixer agents to fix test bugs
# 8. Save fix attempts to history
# 9. Report results with verification commands

# Verify fixes locally
npx playwright test playwright/tests/attributes.spec.ts

# Or trigger CI run
gh workflow run run-test-manual.yml --ref my-branch
```
