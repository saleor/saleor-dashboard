import {
  type AttributeListQuery,
  type AttributeTypeEnum,
  useAttributeListQuery,
} from "@dashboard/graphql";
import { type ModelTypeTabCount } from "@dashboard/modeling/components/ModelTypeTabs/ModelTypeTabs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const computeAttributeListCount = (
  data: AttributeListQuery | undefined,
): ModelTypeTabCount | undefined => {
  if (!data?.attributes) {
    return undefined;
  }

  return {
    value: data.attributes.edges.length,
    hasMore: !!data.attributes.pageInfo.hasNextPage,
  };
};

interface AllTypedAttributesCountFetcherProps {
  attributeType: AttributeTypeEnum.PRODUCT_TYPE | AttributeTypeEnum.PAGE_TYPE;
  pageSize: number;
  tabId: string;
  onCount: (id: string, count: ModelTypeTabCount | undefined) => void;
}

const AllTypedAttributesCountFetcher = ({
  attributeType,
  pageSize,
  tabId,
  onCount,
}: AllTypedAttributesCountFetcherProps) => {
  const { data } = useAttributeListQuery({
    fetchPolicy: "cache-first",
    variables: {
      first: pageSize,
      filter: { type: attributeType },
    },
  });

  const count = computeAttributeListCount(data);

  useEffect(() => {
    if (count !== undefined) {
      onCount(tabId, count);
    }
  }, [count?.hasMore, count?.value, onCount, tabId, count]);

  return null;
};

interface UseAttributeTypeTabCountsArgs {
  preloadedCounts: Record<string, ModelTypeTabCount | undefined>;
  attributeType: AttributeTypeEnum.PRODUCT_TYPE | AttributeTypeEnum.PAGE_TYPE;
  selectedTypeIds: string[];
  allTabId: string;
  pageSize: number;
}

export const useAttributeTypeTabCounts = ({
  preloadedCounts,
  attributeType,
  selectedTypeIds,
  allTabId,
  pageSize,
}: UseAttributeTypeTabCountsArgs) => {
  const initialPageSizeRef = useRef(pageSize);
  const [overrides, setOverrides] = useState<Record<string, ModelTypeTabCount | undefined>>({});

  const setCount = useCallback((id: string, count: ModelTypeTabCount | undefined) => {
    setOverrides(prev => {
      const existing = prev[id];

      if (existing?.value === count?.value && existing?.hasMore === count?.hasMore) {
        return prev;
      }

      return { ...prev, [id]: count };
    });
  }, []);

  const resetCounts = useCallback(() => {
    setOverrides({});
  }, []);

  useEffect(() => {
    setOverrides({});
  }, [attributeType]);

  const counts = useMemo(
    () => ({ ...preloadedCounts, ...overrides }),
    [preloadedCounts, overrides],
  );

  const isActiveAll = selectedTypeIds.length === 0;

  const fetchers = !isActiveAll ? (
    <AllTypedAttributesCountFetcher
      attributeType={attributeType}
      tabId={allTabId}
      pageSize={initialPageSizeRef.current}
      onCount={setCount}
    />
  ) : null;

  return { counts, setCount, resetCounts, fetchers };
};
