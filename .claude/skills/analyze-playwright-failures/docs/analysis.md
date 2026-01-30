# Analyzing Test Failures

## Read Failure Reports

```
Read ./playwright-failures/summary.md
Read ./playwright-failures/failures-full.json
```

## CRITICAL - Read Screenshots AND Error-Context Files

**The error-context files are GOLD for debugging!** They contain the accessibility tree (DOM snapshot) at the moment of failure.

For each failure, READ BOTH:

1. **Screenshot** (PNG) - Shows what the user sees at moment of failure
2. **Error-context** (Markdown) - Shows what's ACTUALLY in the DOM

### Why Error-Context is Essential

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

## ⚠️ Screenshots May Miss Transient UI

**Screenshots only capture the FINAL state at failure.** Transient UI elements like:

- Success/error notifications (auto-dismiss after a few seconds)
- Loading spinners
- Tooltips
- Dropdown menus

...may have already disappeared by the time the screenshot was taken!

## Analyzing Traces (for transient UI)

If the failure involves:

- `expectSuccessBanner` or notification assertions
- "element not found" but you expected it to appear briefly
- Timing-related failures

**Use the Playwright trace to see step-by-step snapshots:**

```bash
# Open trace viewer in browser (interactive)
npx playwright show-trace [TRACE_PATH]

# Or extract trace contents for analysis
unzip [TRACE_PATH] -d ./trace-extracted
```

The trace ZIP contains:

- `0-trace.trace` - All actions with timestamps
- `0-trace.network` - Network requests and responses (NDJSON format)
- `resources/` - Screenshots at EACH STEP + response bodies (referenced by SHA1)

## Checking for API/GraphQL Errors in Traces

**Error toasts often appear because a GraphQL mutation/query failed!**

```bash
# Extract trace
unzip [TRACE_PATH] -d ./trace-extracted
cd ./trace-extracted

# List all GraphQL requests with status codes
cat 0-trace.network | jq -r 'select(.snapshot.request.method == "POST") | "\(.snapshot.response.status) \(.snapshot.request.url)"'

# Check ALL GraphQL responses for errors
for sha in $(cat 0-trace.network | jq -r 'select(.snapshot.request.method == "POST") | .snapshot.response.content._sha1' 2>/dev/null); do
  if [ -f "resources/$sha" ]; then
    result=$(cat "resources/$sha" | jq -r 'if .errors then "❌ ERRORS: " + (.errors[0].message // "unknown") else "✅ OK: " + (.data | keys | join(", ")) end' 2>/dev/null)
    echo "$result"
  fi
done
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
2. Investigate WHY the API failed

## Smart Screenshot Extraction from Traces

**DON'T extract all frames** - there can be 100+ screenshots.

**Instead, extract targeted screenshots after key actions:**

```bash
cd ./trace-extracted

# 1. Find key actions (clicks, especially on save/delete buttons)
cat 0-trace.trace | jq -r 'select(.type == "before") | "\(.startTime) - \(.apiName) \(.params.selector // "")"' 2>/dev/null

# 2. Get screenshots taken 0-3 seconds AFTER a specific action
ACTION_TIME=185821
cat 0-trace.trace | jq -r "select(.type == \"screencast-frame\") | select(.timestamp > $ACTION_TIME and .timestamp < ($ACTION_TIME + 3000)) | .sha1" | head -5

# 3. Extract only those specific screenshots
mkdir -p ./screenshots_after_action
for sha in $(cat 0-trace.trace | jq -r "select(.type == \"screencast-frame\") | select(.timestamp > $ACTION_TIME and .timestamp < ($ACTION_TIME + 3000)) | .sha1" | head -5); do
  cp "resources/$sha" ./screenshots_after_action/
done
```

## Fallback: Extract Video Frames at Specific Timestamps

```bash
# Extract single frame at specific timestamp
ffmpeg -y -i [VIDEO_PATH] -ss 00:00:10 -frames:v 1 -update 1 ./frame_at_10s.png

# Or extract 3 frames around a timestamp (every 0.5s)
mkdir -p ./frames
ffmpeg -y -i [VIDEO_PATH] -ss 00:00:09.5 -t 1.5 -vf "fps=2" ./frames/frame_%02d.png
```

## What to Check When

| Failure Type                    | Check First                         | Check if Needed |
| ------------------------------- | ----------------------------------- | --------------- |
| Element not found               | Screenshot + Error-context          | -               |
| Count assertion                 | Screenshot + Error-context          | -               |
| Notification timeout            | Error-context + **Trace snapshots** | Video frames    |
| Flaky/intermittent              | **Trace snapshots**                 | Video frames    |
| "Element was visible then gone" | **Trace snapshots**                 | Video frames    |
