#!/usr/bin/env python3
"""
Hook to check for 'as any' type assertions in TypeScript files.
Provides different warnings for test files vs production code.
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
        # Provide helpful error message for debugging
        print(f"⚠️  Hook Error: Failed to parse JSON input", file=sys.stderr)
        print(f"Details: {str(e)}", file=sys.stderr)
        print("Check the hook logs with: claude --debug", file=sys.stderr)
        sys.exit(0)

    # Extract file path from tool_input
    tool_input = input_data.get('tool_input', {})
    file_path = tool_input.get('file_path', '')

    if not file_path:
        # Debug info if file_path is missing
        if input_data.get('tool_name'):
            print(f"⚠️  Hook Debug: No file_path found for tool {input_data.get('tool_name')}", file=sys.stderr)
            print("Available tool_input keys:", list(tool_input.keys()), file=sys.stderr)
        sys.exit(0)

    # Convert to Path object for easier handling
    path = Path(file_path)

    # Check if it's a TypeScript file
    if path.suffix not in ['.ts', '.tsx']:
        sys.exit(0)

    # Check if it's a test file
    is_test_file = '.test.' in path.name or '.spec.' in path.name

    # Check if file exists
    if not path.exists():
        print(f"⚠️  Hook Warning: File does not exist: {file_path}", file=sys.stderr)
        print("This might be expected for newly created files", file=sys.stderr)
        sys.exit(0)

    try:
        # Read file and check for 'as any'
        with open(path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        # Find lines containing 'as any'
        as_any_lines = []
        pattern = re.compile(r'\bas\s+any\b')

        for line_num, line in enumerate(lines, 1):
            if pattern.search(line):
                # Strip whitespace and limit line length for display
                line_content = line.strip()
                if len(line_content) > 80:
                    line_content = line_content[:77] + '...'
                as_any_lines.append((line_num, line_content))

        # If 'as any' found, output appropriate warning
        if as_any_lines:
            if is_test_file:
                # Different message for test files
                print(f"⚠️  WARNING: Found 'as any' type assertion in test file {file_path}", file=sys.stderr)
                print("", file=sys.stderr)
                print("Lines containing 'as any':", file=sys.stderr)

                # Show up to 5 lines
                for line_num, content in as_any_lines[:5]:
                    print(f"  Line {line_num}: {content}", file=sys.stderr)

                if len(as_any_lines) > 5:
                    print(f"  ... and {len(as_any_lines) - 5} more occurrences", file=sys.stderr)

                print("", file=sys.stderr)
                print("Instructions for test files:", file=sys.stderr)
                print("1. First, try to use the correct TypeScript types", file=sys.stderr)
                print("2. If correct types are not available, use 'as unknown' instead", file=sys.stderr)
                print("3. Ask user to review: 'Please think if we can use proper types here'", file=sys.stderr)
                print("4. Only use 'as any' as an absolute last resort when mocking complex objects", file=sys.stderr)
            else:
                # Production code - stricter message
                print(f"⚠️  WARNING: Found 'as any' type assertion in {file_path}", file=sys.stderr)
                print("Please use proper TypeScript types instead of 'as any'.", file=sys.stderr)
                print("", file=sys.stderr)
                print("Lines containing 'as any':", file=sys.stderr)

                # Show up to 5 lines
                for line_num, content in as_any_lines[:5]:
                    print(f"  Line {line_num}: {content}", file=sys.stderr)

                if len(as_any_lines) > 5:
                    print(f"  ... and {len(as_any_lines) - 5} more occurrences", file=sys.stderr)

                print("", file=sys.stderr)
                print("Suggestion: Find the proper type definition or create an interface/type alias.", file=sys.stderr)
                print("Note: 'as any' is NEVER acceptable in production code.", file=sys.stderr)

    except Exception as e:
        # Provide error details for debugging
        print(f"⚠️  Hook Error: Failed to read or process file {file_path}", file=sys.stderr)
        print(f"Error type: {type(e).__name__}", file=sys.stderr)
        print(f"Details: {str(e)}", file=sys.stderr)
        print("Run 'claude --debug' for more details", file=sys.stderr)

    # Always exit successfully (warnings don't block)
    sys.exit(0)


if __name__ == '__main__':
    main()