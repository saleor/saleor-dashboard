import {
  type ListCustomersQuery,
  OrderDirection,
  useListCustomersQuery,
  UserSortField,
  type UserSortingInput,
} from "@dashboard/graphql";
import { useCallback, useEffect, useRef, useState } from "react";

import { type CustomerTypeTabCount } from "../../components/CustomerTypeTabs/CustomerTypeTabs";

const DEFAULT_TAB_SORT: UserSortingInput = {
  field: UserSortField.LAST_NAME,
  direction: OrderDirection.ASC,
};

const computeCount = (data: ListCustomersQuery | undefined): CustomerTypeTabCount | undefined => {
  if (!data?.customers) {
    return undefined;
  }

  return {
    value: data.customers.edges.length,
    hasMore: !!data.customers.pageInfo.hasNextPage,
  };
};

interface TabCountFetcherProps {
  customerTypeId: string | null;
  pageSize: number;
  onCount: (id: string, count: CustomerTypeTabCount | undefined) => void;
  tabId: string;
}

const TabCountFetcher = ({
  customerTypeId,
  pageSize,
  onCount,
  tabId,
}: TabCountFetcherProps): null => {
  const { data } = useListCustomersQuery({
    fetchPolicy: "cache-first",
    variables: {
      first: pageSize,
      where: customerTypeId ? { customerType: { eq: customerTypeId } } : undefined,
      sort: DEFAULT_TAB_SORT,
    },
  });

  const count = computeCount(data);

  useEffect(
    function reportTabCount() {
      if (count) {
        onCount(tabId, count);
      }
    },
    [tabId, count?.value, count?.hasMore, onCount],
  );

  return null;
};

interface UseCustomerTypeTabCountsArgs {
  customerTypes: Array<{ id: string }> | undefined;
  selectedCustomerTypes: string[];
  allTabId: string;
  pageSize: number;
}

interface UseCustomerTypeTabCountsResult {
  counts: Record<string, CustomerTypeTabCount | undefined>;
  setCount: (id: string, count: CustomerTypeTabCount | undefined) => void;
  fetchers: JSX.Element;
}

export const useCustomerTypeTabCounts = ({
  customerTypes,
  selectedCustomerTypes,
  allTabId,
  pageSize,
}: UseCustomerTypeTabCountsArgs): UseCustomerTypeTabCountsResult => {
  const initialPageSizeRef = useRef(pageSize);
  const [counts, setCounts] = useState<Record<string, CustomerTypeTabCount | undefined>>({});

  const setCount = useCallback((id: string, count: CustomerTypeTabCount | undefined) => {
    setCounts(prev => {
      const existing = prev[id];

      if (existing?.value === count?.value && existing?.hasMore === count?.hasMore) {
        return prev;
      }

      return { ...prev, [id]: count };
    });
  }, []);

  const isActiveAll = selectedCustomerTypes.length === 0;
  const isActiveSingleType = (typeId: string) =>
    selectedCustomerTypes.length === 1 && selectedCustomerTypes[0] === typeId;

  const fetchers = (
    <>
      {!isActiveAll && (
        <TabCountFetcher
          tabId={allTabId}
          customerTypeId={null}
          pageSize={initialPageSizeRef.current}
          onCount={setCount}
        />
      )}
      {customerTypes
        ?.filter(customerType => !isActiveSingleType(customerType.id))
        .map(customerType => (
          <TabCountFetcher
            key={customerType.id}
            tabId={customerType.id}
            customerTypeId={customerType.id}
            pageSize={initialPageSizeRef.current}
            onCount={setCount}
          />
        ))}
    </>
  );

  return { counts, setCount, fetchers };
};
