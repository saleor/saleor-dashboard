import { gql, useQuery } from "@apollo/client";
import { useMemo } from "react";

interface ModelTypeCountsQueryResult {
  [aliasKey: string]: { totalCount: number | null } | null | undefined;
}

const safeAliasFor = (index: number): string =>
  // GraphQL aliases must match /^[_A-Za-z][_0-9A-Za-z]*$/. The index alone is
  // both unique-per-document and human-readable in network traces.
  `t_${index}`;

// Apollo's `useQuery` parses its document through `gql` even when `skip: true`,
// so an empty input must still yield a syntactically valid document. This
// placeholder is never sent over the wire (the call site sets `skip` whenever
// the id list is empty) but it gives gql() something parseable to chew on.
const EMPTY_COUNTS_DOCUMENT = gql("query ModelTypeCountsForEmpty { __typename }");

const buildCountsDocument = (typeIds: string[]) => {
  if (typeIds.length === 0) {
    return EMPTY_COUNTS_DOCUMENT;
  }

  // Build via plain string concat (no template literals tagged or otherwise)
  // and call `gql` as a function so the graphql-eslint plugin doesn't try to
  // statically parse this dynamic document.
  const variableDefs = typeIds.map((_, i) => "$id_" + i + ": ID!").join(", ");
  const aliasedFields = typeIds
    .map(
      (_, i) => safeAliasFor(i) + ": pages(filter: { pageTypes: [$id_" + i + "] }) { totalCount }",
    )
    .join("\n      ");
  const document =
    "query ModelTypeCountsFor(" + variableDefs + ") {\n      " + aliasedFields + "\n    }";

  return gql(document);
};

interface UseModelTypeCountsForResult {
  /** Map of typeId → entry count. `undefined` for types that haven't been requested yet. */
  counts: Record<string, number | undefined>;
  loading: boolean;
}

/**
 * Lazy per-type counts. Pass only the type ids you actually need to display
 * (typically: visible tabs + active type + overflow when its dropdown is open).
 * The hook builds a single batched GraphQL document with one aliased
 * `pages.totalCount` field per id — Apollo's normalized cache keeps results
 * for ids you've previously asked about, so growing the id set never re-fetches
 * what's already known.
 *
 * Sort the input for stable cache keys: the document string is part of Apollo's
 * cache identity, so two requests with the same ids in different order would
 * produce two cache entries.
 */
export const useModelTypeCountsFor = (typeIds: readonly string[]): UseModelTypeCountsForResult => {
  // Sort + dedupe for a deterministic document string. Without this, callers
  // would accidentally double-fetch by passing the same ids in a different order.
  const sortedTypeIds = useMemo(() => {
    const unique = Array.from(new Set(typeIds));

    return unique.sort();
  }, [typeIds]);
  const document = useMemo(() => buildCountsDocument(sortedTypeIds), [sortedTypeIds]);
  const variables = useMemo<Record<string, string>>(
    () =>
      sortedTypeIds.reduce<Record<string, string>>((acc, id, index) => {
        acc[`id_${index}`] = id;

        return acc;
      }, {}),
    [sortedTypeIds],
  );
  const skip = sortedTypeIds.length === 0;
  const { data, loading } = useQuery<ModelTypeCountsQueryResult>(document, {
    variables,
    skip,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const counts = useMemo<Record<string, number | undefined>>(() => {
    if (!data) {
      return {};
    }

    const result: Record<string, number | undefined> = {};

    sortedTypeIds.forEach((id, index) => {
      const value = data?.[safeAliasFor(index)]?.totalCount;

      result[id] = typeof value === "number" ? value : undefined;
    });

    return result;
  }, [data, sortedTypeIds]);

  return {
    counts,
    loading: !skip && loading,
  };
};
