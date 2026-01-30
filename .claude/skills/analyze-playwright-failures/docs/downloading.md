# Downloading Test Reports

## Handling GitHub URLs

If the input is a GitHub URL, download the artifact first.

### For Actions run URL

```bash
# Extract run ID from URL
RUN_ID="21513974962"  # from https://github.com/.../actions/runs/21513974962

# List artifacts to find merged-blob-reports
gh run view $RUN_ID --json artifacts

# Download the artifact
gh run download $RUN_ID -n merged-blob-reports -D ./playwright-failures/downloaded
```

### For PR URL

```bash
# Get the PR number
PR_NUM="6292"  # from https://github.com/.../pull/6292

# Get the LATEST run (most recent) for this PR's branch
RUN_INFO=$(gh run list --branch $(gh pr view $PR_NUM --json headRefName -q .headRefName) --limit 1 --json databaseId,status,conclusion,name)

# Check if any runs exist
if [ "$(echo $RUN_INFO | jq 'length')" -eq 0 ]; then
    echo "No CI runs found for this PR"
fi

# Get the run ID from the latest run
RUN_ID=$(echo $RUN_INFO | jq -r '.[0].databaseId')

# Download from the latest run
gh run download $RUN_ID -n merged-blob-reports -D ./playwright-failures/downloaded
```

### If No Runs Exist on the PR

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

Then wait and check for the run:

```bash
sleep 30
gh run list --branch $(gh pr view $PR_NUM --json headRefName -q .headRefName) --limit 1 --json databaseId,status
```

## Check for Existing Report Directory

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
# Just proceed to analysis
```

## Run the Prepare Script

```bash
INPUT_PATH="./playwright-failures/downloaded"  # or "$ARGUMENTS" for local
bash .claude/skills/analyze-playwright-failures/scripts/prepare-report.sh "$INPUT_PATH" ./playwright-failures
```

This script:

1. Detects if reports need merging (runs `npx playwright merge-reports` if needed)
2. Parses the JSON/JSONL report
3. Extracts failures with full error details and attachment paths
4. Provides semantic hints (categories, domains) to assist grouping
5. Creates summary files
