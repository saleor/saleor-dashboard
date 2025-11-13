#!/usr/bin/env python3
"""
Hook to prevent running 'pnpm run test' or 'pnpm run test:*' commands without specific files,
which runs all tests and can freeze the system.
Allows these commands with file paths, but blocks them with only flags or no arguments.
"""

import json
import sys
import re
import shlex

try:
    input_data = json.load(sys.stdin)
except json.JSONDecodeError as e:
    print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
    sys.exit(1)

tool_name = input_data.get("tool_name", "")
tool_input = input_data.get("tool_input", {})

# Only process Bash tool calls
if tool_name != "Bash":
    sys.exit(0)

command = tool_input.get("command", "")

# Check if the command is trying to run pnpm run test or pnpm run test:* variants
npm_test_match = re.search(r"\bpnpm\s+run\s+(test(?:\:\w+)?)\b", command)
if npm_test_match:
    test_command = npm_test_match.group(1)  # Captures "test" or "test:quiet" etc.

    # Get everything after 'pnpm run test' or 'pnpm run test:*'
    after_test = command[npm_test_match.end() :].strip()

    # If there are arguments, parse them to check if any are file paths
    if after_test:
        try:
            # Parse arguments safely
            args = shlex.split(after_test)

            # Check if any argument looks like a file path (not just flags)
            has_file_path = False
            for arg in args:
                # Check if argument is not a flag (doesn't start with --)
                # and looks like a path (contains / or .test. or .spec.)
                if not arg.startswith("-") and (
                    "/" in arg
                    or ".test." in arg
                    or ".spec." in arg
                    or arg.endswith(".ts")
                    or arg.endswith(".tsx")
                    or arg.endswith(".js")
                    or arg.endswith(".jsx")
                    or
                    # Also allow patterns like 'ProductList' that Jest can match
                    (
                        arg[0].isalpha()
                        and not arg in ["--verbose", "--coverage", "--watch"]
                    )
                ):
                    has_file_path = True
                    break

            # If there are only flags but no file paths, block it
            if not has_file_path:
                output = {
                    "hookSpecificOutput": {
                        "hookEventName": "PreToolUse",
                        "permissionDecision": "deny",
                        "permissionDecisionReason": (
                            f"BLOCKED: 'pnpm run {test_command}' with only flags (no file paths) runs ALL tests and can freeze your system! "
                            "You must specify test files or patterns.\n"
                            "Use one of these commands:\n"
                            f"• pnpm run {test_command} <file_path> [flags] - Run specific test files\n"
                            "• pnpm run test:quiet <file_path> - Run with minimal output\n"
                            "• pnpm run test:debug <file_path> - Run with increased debug output\n"
                            f"Example: pnpm run {test_command} src/products/components/ProductList.test.tsx --verbose"
                        ),
                    }
                }
                print(json.dumps(output))
                sys.exit(0)
            # If there are file paths, allow it to proceed

        except ValueError:
            # If shlex.split fails, be conservative and block
            pass
    else:
        # No arguments at all - block it
        output = {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": (
                    f"BLOCKED: 'pnpm run {test_command}' without specific files runs ALL tests and can freeze your system! "
                    "Instead use one of these commands:\n"
                    f"• pnpm run {test_command} <file_path> - Run specific test files\n"
                    "• pnpm run test:quiet <file_path> - Run with minimal output\n"
                    "• pnpm run test:debug <file_path> - Run with increased debug output\n"
                    f"Example: pnpm run {test_command} src/products/components/ProductList.test.tsx"
                ),
            }
        }
        print(json.dumps(output))
        sys.exit(0)

# Allow other commands to proceed
sys.exit(0)
