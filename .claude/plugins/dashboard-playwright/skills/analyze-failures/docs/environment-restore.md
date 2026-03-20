# Environment Restoration & API Verification

Use when you suspect test data or environment issues - not test bugs.

## Signs of Data/Environment Issues

| Error Pattern                        | Likely Data Issue              |
| ------------------------------------ | ------------------------------ |
| "No items found" when list expected  | Test data missing/deleted      |
| "404 Not Found" on API call          | Entity doesn't exist in DB     |
| "Permission denied"                  | User/permissions not set up    |
| Empty dropdown when options expected | Reference data missing         |
| "Invalid ID" errors                  | Test fixtures have wrong IDs   |
| Count is 0 when expecting N          | Data was deleted, not restored |
| GraphQL `NOT_FOUND` in trace         | Entity deleted/missing         |
| GraphQL `PERMISSION_DENIED` in trace | Test user lacks permissions    |

## Restore Environment via GitHub Actions

The restore requires CI environment variables (`BACKUP_ID`, `INSTANCE_NAME`). Trigger the workflow directly:

### Option 1: Via GitHub CLI (recommended)

```bash
# Trigger the manual test workflow (restores snapshot first)
gh workflow run run-test-manual.yml

# Check the run status
gh run list --workflow=run-test-manual.yml --limit 1

# Watch a specific run
gh run watch [RUN_ID]
```

### Option 2: Via GitHub UI

1. Go to: https://github.com/saleor/saleor-dashboard/actions/workflows/run-test-manual.yml
2. Click "Run workflow" button
3. Select branch and click "Run workflow"

### Option 3: Restore Only (no tests)

If you only need restore without running tests:

1. Trigger the workflow
2. Cancel it after the `initialize-cloud` job completes

**Note:** The `initialize-cloud` job handles restore. After tests run, some data gets deleted!

## Re-run Tests After Fixes

After user pushes fixes:

```bash
# Trigger the test workflow on the current branch
gh workflow run run-test-manual.yml --ref $(git branch --show-current)

# Or add label to PR to trigger tests
gh pr edit [PR_NUMBER] --add-label "run pw-e2e"

# Watch the run
gh run watch
```

## Direct API Verification

Once environment is restored, verify data exists via GraphQL:

```bash
# Load token from .env (secure - don't echo/display it)
source .env

# Query to check if entity exists
curl -s -X POST "$SALEOR_API_URL/graphql/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SALEOR_API_TOKEN" \
  -d '{"query": "{ [QUERY_HERE] }"}' | jq '.data'
```

### Example Verification Queries

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

### ⚠️ Security: NEVER display auth token!

```bash
# ❌ NEVER do this
echo $SALEOR_API_TOKEN
cat .env

# ✅ Safe - load and use without displaying
source .env && curl ... -H "Authorization: Bearer $SALEOR_API_TOKEN"
```

## Report Findings

After querying:

- **Data exists** → Problem is elsewhere (timing, selector, etc.)
- **Data missing** → Confirm with user, may need to update fixtures or restore again
- **Permission denied** → Test user setup issue

## Ask User Template

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

I can:
- Trigger `gh workflow run run-test-manual.yml` to restore environment
- Query the Saleor API to verify data (if auth token is in .env)
- Investigate Saleor backend code (at ../saleor/)
```
