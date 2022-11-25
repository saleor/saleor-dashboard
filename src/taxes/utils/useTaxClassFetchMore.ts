import { TaxClassBaseFragment, useTaxClassAssignQuery } from "@saleor/graphql";
import { FetchMoreProps } from "@saleor/types";
import { mapEdgesToItems } from "@saleor/utils/maps";

interface UseTaxClassFetchMoreHookResult {
  taxClasses: TaxClassBaseFragment[];
  fetchMoreTaxClasses: FetchMoreProps;
}

/**
 * Hook used in views where tax class can be assigned to an entity.
 * It can be replaced with a top-level search when search feature
 * is implemented in the API.
 * @returns taxClasses - list of tax classes
 * @returns fetchMore - props for paginated components, e.g. dropdowns
 */
export function useTaxClassFetchMore(): UseTaxClassFetchMoreHookResult {
  const { data, loading, fetchMore } = useTaxClassAssignQuery({
    variables: {
      first: 20,
    },
  });
  const taxClasses = mapEdgesToItems(data?.taxClasses);
  const fetchMoreTaxClasses = {
    hasMore: data?.taxClasses?.pageInfo?.hasNextPage,
    loading,
    onFetchMore: () => {
      fetchMore({
        variables: {
          after: data?.taxClasses?.pageInfo?.endCursor,
        },
      });
    },
  };

  return { taxClasses, fetchMoreTaxClasses };
}
