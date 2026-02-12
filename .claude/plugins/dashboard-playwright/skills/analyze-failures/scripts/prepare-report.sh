#!/bin/bash
# Prepare Playwright report for analysis
#
# Handles multiple input formats:
#   1. Single zip file (e.g., merged-blob-reports.zip from CI artifact download)
#      → Extracts it, then runs playwright merge-reports
#   2. Folder with shard zips (report-e2e-*.zip files)
#      → Runs playwright merge-reports on the folder
#   3. Folder already merged (has resources/ and report.jsonl)
#      → Runs playwright merge-reports to get JSON format
#   4. Pre-merged JSON file
#      → Uses directly
#
# Usage: ./prepare-report.sh <input-path> [output-dir]
#
# The script must be run from a directory with @playwright/test installed,
# or have it globally available.

set -e

INPUT_PATH="${1:-.}"
OUTPUT_DIR="${2:-./playwright-failures}"

# Get the directory where this script lives (for reference)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"

mkdir -p "$OUTPUT_DIR"

echo "=== Preparing Playwright Report ==="
echo "Input: $INPUT_PATH"
echo "Output: $OUTPUT_DIR"
echo ""

# Function to run playwright merge-reports
run_merge() {
    local BLOB_DIR="$1"
    local OUTPUT_JSON="$2"

    echo "Running: npx playwright merge-reports --reporter=json $BLOB_DIR"

    # Try to run from current directory first (should have playwright installed)
    if npx playwright merge-reports --reporter=json "$BLOB_DIR" > "$OUTPUT_JSON" 2>/dev/null; then
        echo "Merge successful!"
        return 0
    fi

    echo "Merge failed from current directory, trying from project root..."

    # Try from the saleor-dashboard project root
    local PROJECT_ROOT
    PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo "")

    if [ -n "$PROJECT_ROOT" ] && [ -f "$PROJECT_ROOT/package.json" ]; then
        (cd "$PROJECT_ROOT" && npx playwright merge-reports --reporter=json "$BLOB_DIR" > "$OUTPUT_JSON" 2>/dev/null) && {
            echo "Merge successful from project root!"
            return 0
        }
    fi

    echo "Error: Failed to run playwright merge-reports" >&2
    echo "Make sure @playwright/test is installed: pnpm add -D @playwright/test" >&2
    return 1
}

# Function to parse standard JSON report format
parse_json_report() {
    local REPORT_FILE="$1"
    local RESOURCES_DIR="$2"
    local OUTPUT="$3"

    jq '
    def strip_ansi: if . then gsub("\u001b\\[[0-9;]*m"; "") else null end;

    # Extract domain from file path (e.g., "orders.spec.ts" -> "orders")
    def extract_domain:
      if . then
        . | split("/") | last | split(".") | first
      else "unknown"
      end;

    # Semantic error categorization - groups failures by what they test, not just error type
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

    # Infer likely root cause from error context
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
        resourcesDir: "'"$RESOURCES_DIR"'"
      },
      failures: [
        .. | objects | select(has("specs")) | .specs[] |
        select(.tests | any(.status == "unexpected" or .status == "flaky")) |
        {
          title: .title,
          file: .file,
          line: .line,
          domain: (.file | extract_domain),
          tests: [.tests[] | select(.status == "unexpected" or .status == "flaky") | {
            status: .status,
            projectName: .projectName,
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
    ' "$REPORT_FILE" > "$OUTPUT"
}

# Function to fix attachment paths to point to correct resources dir
fix_attachment_paths() {
    local JSON_FILE="$1"
    local NEW_RESOURCES_DIR="$2"

    jq --arg newDir "$NEW_RESOURCES_DIR" '
    def fix_path:
      if . then
        (. | split("/") | last) as $filename |
        "\($newDir)/\($filename)"
      else null end;

    .metadata.resourcesDir = $newDir |
    .failures = [.failures[] |
      .tests = [.tests[] |
        .results = [.results[] |
          .attachments = [.attachments[] | .path = (.path | fix_path)]
        ]
      ]
    ]
    ' "$JSON_FILE" > "$JSON_FILE.tmp" && mv "$JSON_FILE.tmp" "$JSON_FILE"
}

# Determine what we're working with
BLOB_DIR=""
REPORT_FILE=""
RESOURCES_DIR=""
NEED_MERGE=false

if [ -f "$INPUT_PATH" ]; then
    case "$INPUT_PATH" in
        *.zip)
            echo "Step 1: Extracting zip file..."
            EXTRACT_DIR="$OUTPUT_DIR/extracted"
            mkdir -p "$EXTRACT_DIR"
            unzip -q -o "$INPUT_PATH" -d "$EXTRACT_DIR"
            echo "Extracted to: $EXTRACT_DIR"

            # The extracted content becomes our blob directory
            BLOB_DIR="$EXTRACT_DIR"

            # Check what's inside
            echo ""
            echo "Extracted contents:"
            ls -la "$EXTRACT_DIR" | head -15

            # If extraction created a single subdirectory, use that
            SUBDIR_COUNT=$(find "$EXTRACT_DIR" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
            if [ "$SUBDIR_COUNT" = "1" ]; then
                SINGLE_SUBDIR=$(find "$EXTRACT_DIR" -mindepth 1 -maxdepth 1 -type d)
                echo ""
                echo "Found single subdirectory: $(basename "$SINGLE_SUBDIR")"
                BLOB_DIR="$SINGLE_SUBDIR"
            fi

            # If there are more zips inside, those are the shard reports
            if ls "$BLOB_DIR"/*.zip 1>/dev/null 2>&1; then
                echo ""
                echo "Found shard zip files - will merge these"
                NEED_MERGE=true
            elif [ -f "$BLOB_DIR/report.jsonl" ]; then
                echo ""
                echo "Found report.jsonl - will merge to JSON"
                NEED_MERGE=true
            elif [ -f "$BLOB_DIR/report.json" ]; then
                REPORT_FILE="$BLOB_DIR/report.json"
                RESOURCES_DIR="$BLOB_DIR/resources"
            fi
            ;;
        *.json)
            echo "Using JSON file directly"
            REPORT_FILE="$INPUT_PATH"
            # Try to find resources
            PARENT_DIR="$(dirname "$INPUT_PATH")"
            for try_dir in "$PARENT_DIR/resources" "$PARENT_DIR/../resources" "$PARENT_DIR/merged-blob-reports/resources"; do
                if [ -d "$try_dir" ]; then
                    RESOURCES_DIR="$try_dir"
                    break
                fi
            done
            ;;
        *)
            echo "Error: Unsupported file type. Expected .zip or .json" >&2
            exit 1
            ;;
    esac
elif [ -d "$INPUT_PATH" ]; then
    BLOB_DIR="$INPUT_PATH"

    # Check if already has merged JSON
    if [ -f "$BLOB_DIR/merged-report.json" ]; then
        REPORT_FILE="$BLOB_DIR/merged-report.json"
        RESOURCES_DIR="$BLOB_DIR/resources"
    elif [ -f "$BLOB_DIR/report.json" ]; then
        REPORT_FILE="$BLOB_DIR/report.json"
        RESOURCES_DIR="$BLOB_DIR/resources"
    else
        # Need to merge
        NEED_MERGE=true
        echo "Blob reports folder detected"
    fi
else
    echo "Error: Input path does not exist: $INPUT_PATH" >&2
    exit 1
fi

# Run merge if needed
if [ "$NEED_MERGE" = true ] && [ -n "$BLOB_DIR" ]; then
    echo ""
    echo "Step 2: Merging blob reports..."

    MERGED_JSON="$OUTPUT_DIR/merged-report.json"
    if run_merge "$BLOB_DIR" "$MERGED_JSON"; then
        REPORT_FILE="$MERGED_JSON"
        # After merge, resources should be in the blob directory
        RESOURCES_DIR="$BLOB_DIR/resources"
    else
        echo ""
        echo "Merge failed. Looking for alternative..."

        # Maybe there's already a usable JSON
        REPORT_FILE=$(find "$BLOB_DIR" -name "*.json" -not -name "*.tmp" 2>/dev/null | head -1)
        if [ -z "$REPORT_FILE" ]; then
            echo "Error: Could not merge or find existing report" >&2
            exit 1
        fi
        echo "Found existing JSON: $REPORT_FILE"
        RESOURCES_DIR="$BLOB_DIR/resources"
    fi
fi

# Validate we have what we need
if [ -z "$REPORT_FILE" ] || [ ! -f "$REPORT_FILE" ]; then
    echo "Error: No report file found" >&2
    exit 1
fi

# Make paths absolute
REPORT_FILE="$(cd "$(dirname "$REPORT_FILE")" && pwd)/$(basename "$REPORT_FILE")"
if [ -n "$RESOURCES_DIR" ] && [ -d "$RESOURCES_DIR" ]; then
    RESOURCES_DIR="$(cd "$RESOURCES_DIR" && pwd)"
else
    RESOURCES_DIR=""
fi

echo ""
echo "Report file: $REPORT_FILE"
echo "Resources dir: ${RESOURCES_DIR:-"Not found (screenshots won't be available)"}"

# Save configuration
cat > "$OUTPUT_DIR/paths.json" << EOF
{
    "reportFile": "$REPORT_FILE",
    "resourcesDir": "$RESOURCES_DIR",
    "outputDir": "$(cd "$OUTPUT_DIR" && pwd)"
}
EOF

echo ""
echo "Step 3: Parsing failures..."

# Parse the report
parse_json_report "$REPORT_FILE" "$RESOURCES_DIR" "$OUTPUT_DIR/failures-full.json"

# Fix paths if resources dir changed
if [ -n "$RESOURCES_DIR" ]; then
    # Check if paths in JSON point to the right place
    FIRST_PATH=$(jq -r '.failures[0].tests[0].results[0].attachments[0].path // empty' "$OUTPUT_DIR/failures-full.json" 2>/dev/null)
    if [ -n "$FIRST_PATH" ] && [ ! -f "$FIRST_PATH" ]; then
        echo "Fixing attachment paths..."
        fix_attachment_paths "$OUTPUT_DIR/failures-full.json" "$RESOURCES_DIR"
    fi
fi

# Count failures
FAILURE_COUNT=$(jq '.failures | length' "$OUTPUT_DIR/failures-full.json" 2>/dev/null || echo "0")

# Create summary by category (with enriched data for LLM grouping)
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
"**Resources Directory**: `\(.metadata.resourcesDir // "N/A")`\n",
(if .metadata.ci then
  "**PR**: \(.metadata.ci.prTitle // "N/A")\n",
  "**Build**: [\(.metadata.ci.buildHref // "N/A")](\(.metadata.ci.buildHref // ""))\n",
  "**Commit**: `\(.metadata.ci.commitHash // "N/A" | .[0:8])`\n"
else "" end),
"**Total Failures**: \(.failures | length)\n",
"\n## Failures for LLM Analysis\n",
"\n**NOTE**: The categories below are HINTS from pattern matching. YOU (the main agent) should use LLM reasoning to create intelligent groupings based on likely root cause, not just error type.\n",
(if (.failures | length) > 0 then
  ([.failures | group_by(.tests[0].results[0].category) | .[] |
    "\n### Category Hint: \(.[0].tests[0].results[0].category // "unknown") (\(length) failures)\n" +
    "Domains: \([.[].domain] | unique | join(", "))\n" +
    "Root cause hints: \([.[].tests[0].results[0].rootCause | select(. != null)] | unique | if length > 0 then join(", ") else "unknown" end)\n\n" +
    ([.[] |
      "**[\(.domain)] \(.file):\(.line)**\n" +
      "Title: \(.title | .[0:80])...\n" +
      "Error: `\(.tests[0].results[0].error.message | split("\n")[0] | .[0:120])`\n" +
      "Root cause hint: \(.tests[0].results[0].rootCause // "unknown")\n" +
      "Screenshot: `\(.tests[0].results[0].attachments | map(select(.type == "screenshot")) | .[0].path // "N/A")`\n"
    ] | join("\n"))
  ] | join("\n"))
else
  "\nNo failures found! All tests passed.\n"
end)
' "$OUTPUT_DIR/failures-full.json" > "$OUTPUT_DIR/summary.md"

echo ""
echo "=== Report Prepared ==="
echo ""
echo "Output directory: $OUTPUT_DIR"
echo ""
echo "Files created:"
echo "  failures-full.json        - Complete failure data (domain, category, rootCause hints)"
echo "  failures-by-category.json - Grouped by error type with enriched data"
echo "  summary.md                - Human-readable summary for LLM analysis"
echo "  paths.json                - Path configuration"
echo ""
echo "Total failures: $FAILURE_COUNT"

if [ "$FAILURE_COUNT" -gt 0 ]; then
    echo ""
    echo "Categories (HINTS - use LLM reasoning for actual grouping):"
    jq -r '.failures | group_by(.tests[0].results[0].category) | .[] | "  \(.[0].tests[0].results[0].category): \(length) (domains: \([.[].domain] | unique | join(", ")))"' "$OUTPUT_DIR/failures-full.json" 2>/dev/null
fi

# Verify screenshots are accessible
if [ -n "$RESOURCES_DIR" ] && [ "$FAILURE_COUNT" -gt 0 ]; then
    FIRST_SCREENSHOT=$(jq -r '.failures[0].tests[0].results[0].attachments[] | select(.type == "screenshot") | .path' "$OUTPUT_DIR/failures-full.json" 2>/dev/null | head -1)
    if [ -n "$FIRST_SCREENSHOT" ]; then
        if [ -f "$FIRST_SCREENSHOT" ]; then
            echo ""
            echo "Screenshots accessible: YES"
        else
            echo ""
            echo "Warning: Screenshots not accessible at expected paths"
            echo "Expected: $FIRST_SCREENSHOT"
        fi
    fi
fi
