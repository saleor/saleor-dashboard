import assert from "node:assert";

import { type CloudExtensionsState, describeCloudExtensions } from "./check-cloud-extensions.ts";

const upToDate: CloudExtensionsState = {
  trackedBranch: "main",
  pinned: "aaaaaaa1111",
  checkedOut: "aaaaaaa1111",
  localBranch: "",
  remoteBranches: ["origin/main"],
  behind: 0,
  dirty: false,
};

// Arrange / Act / Assert

// An up-to-date checkout prints only the summary line
assert.deepStrictEqual(describeCloudExtensions(upToDate), [
  "Saleor Cloud extensions: aaaaaaa (detached, in origin/main), tracking main",
]);

// A stale, re-pointed and dirty checkout warns about each problem
const warnings = describeCloudExtensions({
  ...upToDate,
  checkedOut: "bbbbbbb2222",
  localBranch: "feature",
  remoteBranches: [],
  behind: 3,
  dirty: true,
});

assert.strictEqual(
  warnings[0],
  "Saleor Cloud extensions: bbbbbbb (feature, not pushed to any remote branch), tracking main",
);
assert.match(warnings[1], /differs from the pinned commit aaaaaaa/);
assert.match(warnings[2], /Stale: 3 commit\(s\) behind origin\/main.*pnpm cloud:update/);
assert.match(warnings[3], /uncommitted changes/);
assert.strictEqual(warnings.length, 4);

// An unreadable origin/main says staleness was not checked instead of claiming the checkout is current
assert.match(
  describeCloudExtensions({ ...upToDate, behind: null })[1],
  /Could not read origin\/main/,
);
