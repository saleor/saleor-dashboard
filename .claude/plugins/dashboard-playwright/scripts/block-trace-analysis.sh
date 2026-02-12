#!/bin/bash
# Block direct trace analysis commands

COMMAND="${CLAUDE_BASH_COMMAND:-}"

if [[ "$COMMAND" =~ unzip.*trace.*\.zip ]] || \
   [[ "$COMMAND" =~ cat.*0-trace\. ]] || \
   [[ "$COMMAND" =~ jq.*trace ]] || \
   [[ "$COMMAND" =~ ffmpeg.*-i.*video ]]; then
    echo "🚫 BLOCKED: Direct trace analysis" >&2
    echo "" >&2
    echo "Delegate trace analysis to Explore subagent:" >&2
    echo "  Task tool:" >&2
    echo "    subagent_type: \"Explore\"" >&2
    echo "    model: \"haiku\"" >&2
    exit 2
fi

exit 0
