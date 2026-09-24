import assert from "node:assert";

import { pickReleaseSchema, type Release } from "./fetch-release-schema.ts";

const release = ({
  tag,
  draft = false,
  prerelease = false,
  schema = true,
}: {
  tag: string;
  draft?: boolean;
  prerelease?: boolean;
  schema?: boolean;
}): Release => ({
  tag_name: tag,
  draft,
  prerelease,
  assets: schema
    ? [
        {
          name: "schema.graphql",
          browser_download_url: `https://example.com/${tag}/schema.graphql`,
        },
      ]
    : [],
});

// Arrange / Act / Assert

// Picks the highest patch numerically, not by publish order or string order
assert.deepStrictEqual(
  pickReleaseSchema(
    [release({ tag: "3.22.70" }), release({ tag: "3.23.9" }), release({ tag: "3.23.35" })],
    "3.23",
  ),
  { tag: "3.23.35", url: "https://example.com/3.23.35/schema.graphql" },
);

// Skips drafts and pre-releases, including the ones from the release branch
assert.strictEqual(
  pickReleaseSchema(
    [
      release({ tag: "3.23.36", draft: true }),
      release({ tag: "3.23.37", prerelease: true }),
      release({ tag: "3.23.35" }),
    ],
    "3.23",
  ).tag,
  "3.23.35",
);

// Does not treat 3.2x releases as 3.2 releases
assert.throws(
  () => pickReleaseSchema([release({ tag: "3.23.35" })], "3.2"),
  /No published Saleor release found for 3\.2\.x/,
);

// Fails when the newest release has no schema instead of falling back to an older one
assert.throws(
  () =>
    pickReleaseSchema(
      [release({ tag: "3.23.35" }), release({ tag: "3.23.36", schema: false })],
      "3.23",
    ),
  /Release 3\.23\.36 has no schema\.graphql asset/,
);
