# Test Data & Environment Issues

## ⚠️ Before Fixing Tests, Consider Data Issues!

Test failures can be caused by:

1. **Stale test data** - Fixtures not updated for new Saleor features
2. **Missing test data** - Previous test run deleted items that weren't restored
3. **Environment not restored** - CI should restore env, but sometimes fails
4. **Saleor backend changes** - API behavior changed, test expectations outdated
5. **Database state drift** - Test environment diverged from expected state

## Signs of Data/Environment Issues

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

## When Data Issues Are Suspected

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

## Investigating Saleor Backend

Sometimes the issue is in Saleor itself (not Dashboard). The backend repo is typically at `../saleor/`.

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

## Restoring the Test Environment

### Via GitHub Actions (Recommended)

The restore requires environment variables (`BACKUP_ID`, `INSTANCE_NAME`, etc.) that are configured in CI.

**Option 1: Via GitHub CLI**

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

Ask user to check if there's a restore-only workflow, or trigger and cancel after `initialize-cloud` job completes.

**Note:** The `initialize-cloud` job handles restore. It happens automatically before tests run.

**Important:** After tests run, some data gets deleted! If you need to verify data exists:

1. Check DURING the test run (after restore, before tests complete)
2. Or trigger the workflow and cancel it after the `initialize-cloud` job completes

## Direct API Verification

Once user confirms environment is ready, verify data via GraphQL:

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

### ⚠️ Security: NEVER Display Auth Token!

```bash
# ❌ NEVER do this
echo $SALEOR_API_TOKEN
cat .env

# ✅ Safe - load and use without displaying
source .env && curl ... -H "Authorization: Bearer $SALEOR_API_TOKEN"
```

## Report Findings

After querying:

- If data exists → Problem is elsewhere (timing, selector, etc.)
- If data missing → Confirm with user, may need to update fixtures or restore again
- If permission denied → Test user setup issue

**Don't assume** - If you can verify data exists/doesn't exist, do so before deciding it's a test bug vs data issue.
