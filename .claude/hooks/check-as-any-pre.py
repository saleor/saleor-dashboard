#!/usr/bin/env python3
"""
Pre-hook to prevent 'as any' type assertions from being added to TypeScript files.
Blocks the edit if 'as any' is detected in the new content.
"""

import json
import sys
import re
from pathlib import Path


def main():
    try:
        # Read JSON input from stdin
        input_data = json.load(sys.stdin)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
        sys.exit(1)

    tool_name = input_data.get("tool_name", "")
    tool_input = input_data.get("tool_input", {})

    # Only process Edit, Write, and MultiEdit tools
    if tool_name not in ["Edit", "Write", "MultiEdit"]:
        sys.exit(0)

    file_path = tool_input.get("file_path", "")

    if not file_path:
        sys.exit(0)

    # Convert to Path object for easier handling
    path = Path(file_path)

    # Only check files in src/ directory
    if not path.parts or path.parts[0] != "src":
        sys.exit(0)

    # Check if it's a TypeScript file
    if path.suffix not in [".ts", ".tsx"]:
        sys.exit(0)

    # Check if it's a test file
    is_test_file = ".test." in path.name or ".spec." in path.name

    # Get the content that will be written
    content_to_check = ""

    if tool_name == "Edit":
        content_to_check = tool_input.get("new_string", "")
    elif tool_name == "Write":
        content_to_check = tool_input.get("content", "")
    elif tool_name == "MultiEdit":
        # For MultiEdit, check all new_string values
        edits = tool_input.get("edits", [])
        content_to_check = "\n".join(edit.get("new_string", "") for edit in edits)

    # Check for 'as any' in the new content
    pattern = re.compile(r'\bas\s+any\b')

    if pattern.search(content_to_check):
        if is_test_file:
            # For test files, allow but show warning as system message
            output = {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "allow",
                    "permissionDecisionReason": (
                        f"Allowing 'as any' in test file: {path.name}"
                    ),
                },
                "systemMessage": (
                    f"⚠️ WARNING: Adding 'as any' to test file {path.name}\n"
                    "While allowed in test files, consider:\n"
                    "• Using proper TypeScript types if available\n"
                    "• Using 'as unknown' as an alternative\n"
                    "• Only use 'as any' when mocking complex objects"
                )
            }
            print(json.dumps(output))
            sys.exit(0)
        else:
            # Block for production code
            output = {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "deny",
                    "permissionDecisionReason": (
                        f"BLOCKED: Cannot add 'as any' to production file {file_path}\n"
                        "'as any' defeats TypeScript's type safety and is not allowed in production code.\n"
                        "Instead:\n"
                        "1. Find and use the proper type definition\n"
                        "2. Create an interface or type alias\n"
                        "3. Use 'as unknown' if you must bypass type checking\n"
                        "4. Use a more specific type assertion"
                    ),
                }
            }
        print(json.dumps(output))
        sys.exit(0)

    # Allow other edits to proceed
    sys.exit(0)


if __name__ == "__main__":
    main()