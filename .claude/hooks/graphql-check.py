#!/usr/bin/env python3
"""
This script runs GraphQL codegen once agent modfiied any graphql related files
"""

import json
import sys
import os
from pathlib import Path

try:
    data = json.load(sys.stdin)
    tool_name = data.get("tool_name", "")
    tool_input = data.get("tool_input", {})

    # Handle different tool types
    files_to_check = []

    if tool_name in ["Edit", "Write"]:
        # Single file operations
        file_path = tool_input.get("file_path", "")
        if file_path:
            files_to_check.append(file_path)

    elif tool_name == "MultiEdit":
        # Multiple file operations
        edits = tool_input.get("edits", [])
        for edit in edits:
            file_path = edit.get("file_path", "")
            if file_path:
                files_to_check.append(file_path)

    # Only proceed if files are in src/ directory
    src_files = [f for f in files_to_check if Path(f).parts and Path(f).parts[0] == "src"]
    if not src_files:
        sys.exit(0)

    # Check if any of the files are GraphQL query/mutation files
    graphql_files_modified = any(
        file_path.endswith("mutations.ts") or file_path.endswith("queries.ts")
        for file_path in src_files
    )

    if graphql_files_modified:
        # First, show a message that generation is starting
        output = {
            "systemMessage": "🔄 GraphQL files changed, regenerating types..."
        }
        print(json.dumps(output))
        sys.stdout.flush()

        # Run codegen and capture stderr to check for syntax errors
        import subprocess
        process = subprocess.Popen(
            "pnpm run generate 2>&1",
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        stdout, _ = process.communicate()
        result = process.returncode

        # Check for GraphQL syntax errors in output
        # GraphQL Codegen silently skips invalid documents, so we need to detect them
        if "Syntax Error:" in stdout or "Failed to load" in stdout:
            # Extract error message
            error_lines = [line for line in stdout.split('\n') if 'Syntax Error' in line or 'Failed to load' in line]
            error_msg = '\n'.join(error_lines[:3])  # Show first 3 error lines

            error_output = {
                "decision": "block",
                "reason": f"❌ GraphQL syntax error detected!\n{error_msg}\n\nPlease fix the GraphQL syntax errors before continuing.",
                "hookSpecificOutput": {
                    "hookEventName": "PostToolUse",
                    "additionalContext": "GraphQL document contains syntax errors that prevent code generation."
                }
            }
            print(json.dumps(error_output))
            sys.exit(0)

        if result != 0:
            # Use decision: block to prompt Claude about the error
            error_output = {
                "decision": "block",
                "reason": "❌ GraphQL codegen failed! Please run 'pnpm run generate' manually to fix the issue.",
                "hookSpecificOutput": {
                    "hookEventName": "PostToolUse",
                    "additionalContext": "GraphQL code generation failed. This may cause type errors in the code."
                }
            }
            print(json.dumps(error_output))
            sys.exit(0)
        else:
            # Success - provide feedback via additionalContext
            success_output = {
                "hookSpecificOutput": {
                    "hookEventName": "PostToolUse",
                    "additionalContext": "✅ GraphQL types regenerated successfully"
                },
                "systemMessage": "✅ GraphQL types regenerated successfully"
            }
            print(json.dumps(success_output))
            sys.exit(0)

except Exception as e:
    print(f"Hook error: {e}", file=sys.stderr)
    # Continue silently on errors
    pass
