import assert from "node:assert";

import { ALLOWED_TYPES, parseBumpTypes } from "./check-changesets.ts";

// Arrange / Act / Assert

// Parses a standard patch changeset
assert.deepStrictEqual(parseBumpTypes('---\n"saleor-dashboard": patch\n---\n\nSome description'), [
  "patch",
]);

// Parses a minor changeset (disallowed type is still detected)
assert.deepStrictEqual(parseBumpTypes('---\n"saleor-dashboard": minor\n---\n\nSome feature'), [
  "minor",
]);

// Handles unquoted package names and is case-insensitive
assert.deepStrictEqual(parseBumpTypes("---\nsaleor-dashboard: MAJOR\n---\n"), ["major"]);

// Handles multiple package entries
assert.deepStrictEqual(parseBumpTypes('---\n"pkg-a": patch\n"pkg-b": minor\n---\n'), [
  "patch",
  "minor",
]);

// Handles CRLF line endings
assert.deepStrictEqual(parseBumpTypes('---\r\n"saleor-dashboard": patch\r\n---\r\n'), ["patch"]);

// Returns empty array when frontmatter is missing
assert.deepStrictEqual(parseBumpTypes("just a plain markdown file"), []);

// Only "patch" is allowed
assert.deepStrictEqual(ALLOWED_TYPES, ["patch"]);

// Verify the rule's intent: minor/major are rejected, patch is accepted
const isAllowed = (type: string): boolean => ALLOWED_TYPES.includes(type);

assert.strictEqual(isAllowed("patch"), true);
assert.strictEqual(isAllowed("minor"), false);
assert.strictEqual(isAllowed("major"), false);

console.log("✔ check-changesets tests passed");
