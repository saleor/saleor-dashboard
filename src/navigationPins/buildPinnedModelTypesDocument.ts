import { type DocumentNode, parse } from "graphql";

import { pinnedModelTypeFragment } from "./fragments/pinnedModelType";

const ALIAS_PREFIX = "pin";

const aliasAt = (index: number) => `${ALIAS_PREFIX}${index}`;

/**
 * `PageTypeFilterInput` exposes only `search` and `slugs`, so pinned types cannot be fetched
 * by id in one static operation. Slugs are editable and would orphan pins, so we alias one
 * `pageType(id:)` lookup per pin instead and assemble the document at runtime. Ids travel as
 * variables rather than interpolated literals.
 *
 * Uses `parse` rather than a `gql` tag on purpose: the tag would be handed to graphql-eslint,
 * which cannot statically parse an interpolated operation.
 *
 * Returns a document with no pin selections when there is nothing to fetch — callers must skip it.
 */
export const buildPinnedModelTypesDocument = (ids: readonly string[]): DocumentNode => {
  if (ids.length === 0) {
    return parse(`query PinnedModelTypes { __typename }`);
  }

  const params = ids.map((_, index) => `$${aliasAt(index)}: ID!`).join(", ");
  const selections = ids
    .map((_, index) => `${aliasAt(index)}: pageType(id: $${aliasAt(index)}) { ...PinnedModelType }`)
    .join("\n");

  const operation = parse(`query PinnedModelTypes(${params}) {\n${selections}\n}`);

  return {
    ...operation,
    definitions: [...operation.definitions, ...pinnedModelTypeFragment.definitions],
  };
};

export const buildPinnedModelTypesVariables = (ids: readonly string[]): Record<string, string> =>
  Object.fromEntries(ids.map((id, index) => [aliasAt(index), id]));

export const getAliasForIndex = aliasAt;
