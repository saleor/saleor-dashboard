#!/bin/bash
# Parse Playwright JSON report and extract failures with full context
# Usage: ./parse-failures.sh <merged-report.json> <output-dir>
#
# This script provides SEMANTIC categorization of failures, grouping by:
# 1. Domain (test file/folder)
# 2. Error type (notification-assertion, count-assertion, visibility-assertion, etc.)
# 3. Root cause pattern (clipboard, timing, missing-element, etc.)

set -e

REPORT_FILE="${1:-merged-report.json}"
OUTPUT_DIR="${2:-playwright-failures}"

if [ ! -f "$REPORT_FILE" ]; then
    echo "Error: Report file not found: $REPORT_FILE" >&2
    exit 1
fi

mkdir -p "$OUTPUT_DIR"

# Extract failures with all relevant data
jq '
# Strip ANSI codes
def strip_ansi: if . then gsub("\u001b\\[[0-9;]*m"; "") else null end;

# Extract domain from file path (e.g., "orders.spec.ts" -> "orders")
def extract_domain:
  if . then
    . | split("/") | last | split(".") | first
  else "unknown"
  end;

# Determine semantic error category based on error message content
# This provides much more useful grouping than just "assertion" vs "timeout"
def categorize_error_semantic:
  if .error.message then
    # Timeout errors - distinguish navigation vs element timeouts
    if (.error.message | test("Test timeout.*exceeded"; "i")) then "test-timeout"
    elif (.error.message | test("Navigation timeout"; "i")) then "navigation-timeout"
    elif (.error.message | test("Timeout.*waiting for"; "i")) then "element-timeout"
    elif (.error.message | test("timeout|exceeded"; "i")) then "timeout"

    # Notification/Banner assertions - common pattern in this codebase
    elif (.error.message | test("successBanner|errorBanner|Banner|notification"; "i")) then "notification-assertion"
    elif (.error.snippet // "" | test("expectSuccessBanner|expectErrorBanner"; "i")) then "notification-assertion"

    # Count assertions - element count mismatches
    elif (.error.message | test("toHaveCount|count\\(\\).*toEqual|Expected.*\\d+.*Received.*\\d+"; "i")) then "count-assertion"

    # Content/Text assertions
    elif (.error.message | test("toContainText|toHaveText"; "i")) then "content-assertion"
    elif (.error.message | test("Expected.*to contain|Expected.*string"; "i")) then "content-assertion"

    # Visibility assertions
    elif (.error.message | test("toBeVisible|toBeHidden|not.*visible"; "i")) then "visibility-assertion"

    # State assertions (enabled/disabled/checked)
    elif (.error.message | test("toBeEnabled|toBeDisabled|toBeChecked"; "i")) then "state-assertion"

    # Value assertions (input values)
    elif (.error.message | test("toHaveValue|toHaveAttribute"; "i")) then "value-assertion"

    # Clipboard assertions
    elif (.error.message | test("clipboard|copied"; "i")) then "clipboard-assertion"

    # Element not found / selector issues
    elif (.error.message | test("not found|no element|locator resolved|strict mode violation"; "i")) then "element-not-found"
    elif (.error.message | test("locator|selector"; "i")) then "selector-issue"

    # Network/API errors
    elif (.error.message | test("network|fetch|request|API|GraphQL|500|502|503|504"; "i")) then "api-error"

    # Generic assertions (fallback)
    elif (.error.message | test("expect.*toEqual|toContain|toBe|toHave"; "i")) then "generic-assertion"

    else "other"
    end
  else "unknown"
  end;

# Infer root cause pattern from error context
def infer_root_cause:
  if .error.message then
    if (.error.message | test("clipboard|copied"; "i")) then "clipboard-api"
    elif (.error.message | test("Expected.*0.*Received|count.*0"; "i")) then "element-missing"
    elif (.error.message | test("Expected.*1.*Received.*0|count.*expected.*1"; "i")) then "element-not-created"
    elif (.error.message | test("still visible|not.*hidden"; "i")) then "element-not-dismissed"
    elif (.error.message | test("not.*visible"; "i")) then "element-not-shown"
    elif (.error.message | test("timeout.*30000|timeout.*35000"; "i")) then "slow-operation"
    elif (.error.message | test("strict mode violation"; "i")) then "ambiguous-selector"
    elif (.error.message | test("detached|removed"; "i")) then "stale-element"
    elif (.error.message | test("intercepted|covered"; "i")) then "element-covered"
    elif (.error.message | test("500|502|503|504"; "i")) then "server-error"
    else null
    end
  else null
  end;

{
  metadata: {
    ci: .config.metadata.ci,
    generatedAt: now | strftime("%Y-%m-%dT%H:%M:%SZ")
  },
  summary: {
    totalFailures: [.. | objects | select(has("specs")) | .specs[] | select(.tests | any(.status == "unexpected" or .status == "flaky"))] | length
  },
  failures: [
    .. | objects | select(has("specs")) | .specs[] |
    select(.tests | any(.status == "unexpected" or .status == "flaky")) |
    {
      title: .title,
      file: .file,
      line: .line,
      id: .id,
      domain: (.file | extract_domain),
      tests: [.tests[] | select(.status == "unexpected" or .status == "flaky") | {
        status: .status,
        projectName: .projectName,
        retries: .retries,
        results: [.results[] | select(.status == "failed" or .status == "timedOut") | {
          status: .status,
          duration: .duration,
          error: {
            message: (.error.message | strip_ansi),
            stack: (.error.stack | strip_ansi),
            snippet: (.error.snippet | strip_ansi),
            location: .error.location
          },
          category: categorize_error_semantic,
          rootCause: infer_root_cause,
          attachments: [.attachments[]? | {
            type: .name,
            path: .path,
            contentType: .contentType
          }]
        }]
      }]
    }
  ]
}
' "$REPORT_FILE" > "$OUTPUT_DIR/failures-full.json"

# Create category grouping with enriched data for LLM analysis
jq '
.failures | group_by(.tests[0].results[0].category) |
map({
  category: .[0].tests[0].results[0].category,
  count: length,
  domains: ([.[].domain] | unique),
  rootCauses: ([.[].tests[0].results[0].rootCause | select(. != null)] | unique),
  tests: [.[] | {
    title: .title,
    file: .file,
    line: .line,
    domain: .domain,
    error: .tests[0].results[0].error.message,
    errorFirstLine: (.tests[0].results[0].error.message | split("\n")[0] | .[0:150]),
    rootCause: .tests[0].results[0].rootCause,
    screenshot: ([.tests[0].results[0].attachments[] | select(.type == "screenshot") | .path] | first),
    errorContext: ([.tests[0].results[0].attachments[] | select(.type == "error-context") | .path] | first)
  }]
})
' "$OUTPUT_DIR/failures-full.json" > "$OUTPUT_DIR/failures-by-category.json"

# Create human-readable summary optimized for LLM intelligent grouping
jq -r '
"# Playwright Failure Report\n",
"Generated: \(.metadata.generatedAt)\n",
(if .metadata.ci then
  "PR: \(.metadata.ci.prTitle // "N/A")\n",
  "Build: \(.metadata.ci.buildHref // "N/A")\n"
else "" end),
"Total Failures: \(.summary.totalFailures)\n",
"\n## Failures for LLM Analysis\n",
"\n**NOTE**: Categories below are HINTS from pattern matching. The main agent should use LLM reasoning to create intelligent groupings based on likely root cause.\n",
(.failures |
  group_by(.tests[0].results[0].category) |
  sort_by(-length) |
  .[] |
  "\n### Category Hint: \(.[0].tests[0].results[0].category) (\(length) failures)\n",
  "Domains: \([.[].domain] | unique | join(", "))\n",
  "Root cause hints: \([.[].tests[0].results[0].rootCause | select(. != null)] | unique | if length > 0 then join(", ") else "unknown" end)\n",
  (.[] | "- [\(.domain)] \(.file):\(.line) - \(.tests[0].results[0].error.message | split("\n")[0] | .[0:80])...")
)
' "$OUTPUT_DIR/failures-full.json" > "$OUTPUT_DIR/summary.md"

echo "Parsed failures saved to $OUTPUT_DIR/"
echo "  - failures-full.json: Complete failure data (domain, category, rootCause hints)"
echo "  - failures-by-category.json: Category hints with enriched data for LLM analysis"
echo "  - summary.md: Human-readable summary for LLM intelligent grouping"
