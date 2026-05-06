import { gql, useQuery } from "@apollo/client";
import { usePageTypeListQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useMemo } from "react";

const PAGE_TYPES_PAGE_SIZE = 100;

interface ModelTypeInfo {
  id: string;
  name: string;
}

interface ModelTypeCountsQueryResult {
  total?: { totalCount: number | null } | null;
  [aliasKey: string]: { totalCount: number | null } | null | undefined;
}

const safeAliasFor = (typeId: string, index: number): string =>
  // GraphQL aliases must match /^[_A-Za-z][_0-9A-Za-z]*$/ — type IDs are usually opaque strings,
  // so we derive a stable alphanumeric alias from the index and a sanitized id fragment.
  `t_${index}_${typeId.replace(/[^A-Za-z0-9]/g, "_")}`;

const buildCountsDocument = (types: ModelTypeInfo[]) => {
  // We compose the query body via plain string concat (no template literals tagged or otherwise)
  // and call `gql` as a function so the graphql-eslint plugin doesn't try to statically parse
  // a dynamic document that legitimately has a runtime-built variable list.
  if (types.length === 0) {
    const empty = "query ModelTypeCountsTotalOnly { total: pages { totalCount } }";

    return gql(empty);
  }

  const variableDefs = types.map((_, i) => "$id_" + i + ": ID!").join(", ");
  const aliasedFields = types
    .map(
      (type, i) =>
        safeAliasFor(type.id, i) + ": pages(filter: { pageTypes: [$id_" + i + "] }) { totalCount }",
    )
    .join("\n      ");
  const document =
    "query ModelTypeCounts(" +
    variableDefs +
    ") {\n      total: pages { totalCount }\n      " +
    aliasedFields +
    "\n    }";

  return gql(document);
};

interface UseModelTypeCountsResult {
  types: ModelTypeInfo[];
  counts: Record<string, number | undefined>;
  totalCount: number | undefined;
  loading: boolean;
}

/**
 * Fetches all Model Types and their entry counts in one batched GraphQL request
 * (a single document with one aliased `pages.totalCount` field per type).
 *
 * Returns:
 *  - `types`: every Model Type (up to {@link PAGE_TYPES_PAGE_SIZE}) regardless of how many entries it has.
 *  - `counts`: lookup of entry count per type id. `undefined` while loading.
 *  - `totalCount`: total entries across all types (the "All" tab badge).
 *  - `loading`: true while either query is in flight.
 */
export const useModelTypeCounts = (): UseModelTypeCountsResult => {
  const typesQuery = usePageTypeListQuery({
    variables: { first: PAGE_TYPES_PAGE_SIZE },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const types = useMemo<ModelTypeInfo[]>(() => {
    const items = mapEdgesToItems(typesQuery.data?.pageTypes) ?? [];

    return items.map(t => ({ id: t.id, name: t.name }));
  }, [typesQuery.data?.pageTypes]);

  const countsDocument = useMemo(() => buildCountsDocument(types), [types]);

  const countsVariables = useMemo<Record<string, string>>(() => {
    return types.reduce<Record<string, string>>((acc, type, index) => {
      acc[`id_${index}`] = type.id;

      return acc;
    }, {});
  }, [types]);

  const countsQuery = useQuery<ModelTypeCountsQueryResult>(countsDocument, {
    variables: countsVariables,
    skip: typesQuery.loading,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const counts = useMemo<Record<string, number | undefined>>(() => {
    if (!countsQuery.data) {
      return {};
    }

    const result: Record<string, number | undefined> = {};

    types.forEach((type, index) => {
      const alias = safeAliasFor(type.id, index);
      const value = countsQuery.data?.[alias]?.totalCount;

      result[type.id] = typeof value === "number" ? value : undefined;
    });

    return result;
  }, [countsQuery.data, types]);

  return {
    types,
    counts,
    totalCount: countsQuery.data?.total?.totalCount ?? undefined,
    loading: typesQuery.loading || countsQuery.loading,
  };
};
