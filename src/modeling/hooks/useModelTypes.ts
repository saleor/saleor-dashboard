import { usePageCountQuery, usePageTypeListQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useEffect, useMemo } from "react";

// Hard cap. Going above ~100 would also balloon the batched per-type counts
// query body, so this is intentionally kept as a single page rather than
// introducing pagination. If a real-world instance approaches this, switch
// to a dedicated counts endpoint instead of raising the cap.
const PAGE_TYPES_PAGE_SIZE = 100;

interface ModelTypeInfo {
  id: string;
  name: string;
}

interface UseModelTypesResult {
  /** Up to {@link PAGE_TYPES_PAGE_SIZE} Model Types from the backend, in backend order. */
  types: ModelTypeInfo[];
  /** Grand total of pages across all types (the "All" tab badge). */
  totalCount: number | undefined;
  /** True while either query is in flight. */
  loading: boolean;
}

/**
 * Cheap, always-on data for the Model Type tab strip:
 *  - the list of types (label + id), and
 *  - the unfiltered total page count.
 *
 * Per-type counts are intentionally NOT fetched here — see
 * {@link useModelTypeCountsFor} for the lazy variant that only counts the
 * types currently visible (or about to become visible).
 */
export const useModelTypes = (): UseModelTypesResult => {
  const typesQuery = usePageTypeListQuery({
    variables: { first: PAGE_TYPES_PAGE_SIZE },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const totalQuery = usePageCountQuery({
    variables: { filter: {} },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const types = useMemo<ModelTypeInfo[]>(() => {
    const items = mapEdgesToItems(typesQuery.data?.pageTypes) ?? [];

    return items.map(t => ({ id: t.id, name: t.name }));
  }, [typesQuery.data?.pageTypes]);
  const hasNextPage = typesQuery.data?.pageTypes?.pageInfo?.hasNextPage ?? false;

  useEffect(
    function warnWhenTypesAreTruncated() {
      if (process.env.NODE_ENV !== "production" && hasNextPage) {
        console.warn(
          "[useModelTypes] Reached the model-type cap of " +
            PAGE_TYPES_PAGE_SIZE +
            ". Additional Model Types exist on the backend but won't appear as tabs.",
        );
      }
    },
    [hasNextPage],
  );

  return {
    types,
    totalCount: totalQuery.data?.pages?.totalCount ?? undefined,
    loading: typesQuery.loading || totalQuery.loading,
  };
};
