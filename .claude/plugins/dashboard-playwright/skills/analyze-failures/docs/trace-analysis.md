# Advanced Trace Analysis

Use these techniques when screenshots don't show the full picture - especially for transient UI like notifications.

## When to Use This

- `expectSuccessBanner` or notification assertions fail
- "element not found" but you expected it to appear briefly
- Timing-related failures
- Flaky/intermittent tests

## Extract Trace Contents

```bash
# Open trace viewer in browser (interactive - best option)
npx playwright show-trace [TRACE_PATH]

# Or extract for programmatic analysis
unzip [TRACE_PATH] -d ./trace-extracted
cd ./trace-extracted
```

The trace ZIP contains:

- `0-trace.trace` - All actions with timestamps
- `0-trace.network` - Network requests/responses (NDJSON format)
- `resources/` - Screenshots at each step + response bodies (by SHA1)

## Check for GraphQL Errors

**Error toasts often appear because a GraphQL mutation/query failed!**

```bash
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

### Common GraphQL Error Patterns

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
2. Investigate WHY the API failed (data issue, permission, backend bug)

## Smart Screenshot Extraction

**DON'T extract all frames** - there can be 100+ screenshots.

**Extract targeted screenshots after key actions:**

```bash
cd ./trace-extracted

# 1. Find key actions (clicks on save/delete buttons)
cat 0-trace.trace | jq -r 'select(.type == "before") | "\(.startTime) - \(.apiName) \(.params.selector // "")"' 2>/dev/null

# 2. Get screenshots 0-3 seconds AFTER a specific action
ACTION_TIME=185821  # timestamp from step 1
cat 0-trace.trace | jq -r "select(.type == \"screencast-frame\") | select(.timestamp > $ACTION_TIME and .timestamp < ($ACTION_TIME + 3000)) | .sha1" | head -5

# 3. Copy those specific screenshots
mkdir -p ./screenshots_after_action
for sha in $(cat 0-trace.trace | jq -r "select(.type == \"screencast-frame\") | select(.timestamp > $ACTION_TIME and .timestamp < ($ACTION_TIME + 3000)) | .sha1" | head -5); do
  cp "resources/$sha" ./screenshots_after_action/
done
```

### Get Screenshots After Each Click

```bash
# Get all click actions and their timestamps
CLICKS=$(cat 0-trace.trace | jq -r 'select(.type == "before" and .apiName == "click") | .startTime')

# For each click, get 2-3 screenshots taken right after
for click_time in $CLICKS; do
  echo "=== Screenshots after click at $click_time ==="
  cat 0-trace.trace | jq -r "select(.type == \"screencast-frame\") | select(.timestamp > $click_time and .timestamp < ($click_time + 2000)) | .sha1" | head -3
done
```

## Extract Video Frames (Fallback)

If you know approximately when something happened:

```bash
# Extract single frame at specific timestamp
ffmpeg -y -i [VIDEO_PATH] -ss 00:00:10 -frames:v 1 -update 1 ./frame_at_10s.png

# Extract 3 frames around a timestamp (every 0.5s)
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
