import {
  OrderDirection,
  type PageListQuery,
  PageSortField,
  type PageSortingInput,
  usePageListQuery,
} from "@dashboard/graphql";
import { useCallback, useEffect, useRef, useState } from "react";

import { type ModelTypeTabCount } from "../../components/ModelTypeTabs/ModelTypeTabs";

// Variables shape shared with the active tab's canonical query so Apollo cache entries overlap
// when the user lands on /models/ without sort/search overrides.
const DEFAULT_TAB_SORT: PageSortingInput = {
  field: PageSortField.TITLE,
  direction: OrderDirection.ASC,
};

const computeCount = (data: PageListQuery | undefined): ModelTypeTabCount | undefined => {
  if (!data?.pages) {
    return undefined;
  }

  return {
    value: data.pages.edges.length,
    hasMore: !!data.pages.pageInfo.hasNextPage,
  };
};

interface TabCountFetcherProps {
  /** Page type id, or null for the "All" tab (no filter). */
  pageTypeId: string | null;
  pageSize: number;
  onCount: (id: string, count: ModelTypeTabCount | undefined) => void;
  /** Key under which the count is reported (page type id, or the "All" tab id). */
  tabId: string;
}

/**
 * Fires a cache-first PageList query for a single tab to prefetch its count badge.
 * Variables shape matches the active tab's canonical query so Apollo cache entries overlap.
 */
const TabCountFetcher = ({ pageTypeId, pageSize, onCount, tabId }: TabCountFetcherProps) => {
  const { data } = usePageListQuery({
    fetchPolicy: "cache-first",
    variables: {
      first: pageSize,
      filter: pageTypeId ? { pageTypes: [pageTypeId] } : {},
      sort: DEFAULT_TAB_SORT,
    },
  });

  const count = computeCount(data);

  useEffect(() => {
    if (count) {
      onCount(tabId, count);
    }
  }, [tabId, count?.value, count?.hasMore, onCount]);

  return null;
};

interface UsePageTypeTabCountsArgs {
  pageTypes: Array<{ id: string }> | undefined;
  /** Active tab id — that tab is skipped (parent supplies count from active query). */
  activeTabId: string;
  /** Tab id reserved for the "All models" entry. */
  allTabId: string;
  /** Page size at first render — stable for inactive tabs so they don't refetch on resize. */
  pageSize: number;
}

export const usePageTypeTabCounts = ({
  pageTypes,
  activeTabId,
  allTabId,
  pageSize,
}: UsePageTypeTabCountsArgs) => {
  const initialPageSizeRef = useRef(pageSize);
  const [counts, setCounts] = useState<Record<string, ModelTypeTabCount | undefined>>({});

  const setCount = useCallback((id: string, count: ModelTypeTabCount | undefined) => {
    setCounts(prev => {
      const existing = prev[id];

      if (existing?.value === count?.value && existing?.hasMore === count?.hasMore) {
        return prev;
      }

      return { ...prev, [id]: count };
    });
  }, []);

  const fetchers = (
    <>
      {activeTabId !== allTabId && (
        <TabCountFetcher
          tabId={allTabId}
          pageTypeId={null}
          pageSize={initialPageSizeRef.current}
          onCount={setCount}
        />
      )}
      {pageTypes
        ?.filter(pt => pt.id !== activeTabId)
        .map(pt => (
          <TabCountFetcher
            key={pt.id}
            tabId={pt.id}
            pageTypeId={pt.id}
            pageSize={initialPageSizeRef.current}
            onCount={setCount}
          />
        ))}
    </>
  );

  return { counts, setCount, fetchers };
};
