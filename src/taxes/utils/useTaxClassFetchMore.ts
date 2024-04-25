// @ts-strict-ignore
import { TaxClassBaseFragment, useTaxClassAssignQuery } from "@dashboard/graphql";
import { FetchMoreProps } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";

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
  const { data, loading, loadMore, variables } = useTaxClassAssignQuery({
    variables: {
      first: 20,
    },
  });
  const taxClasses = mapEdgesToItems(data?.taxClasses);
  const fetchMoreTaxClasses = {
    hasMore: data?.taxClasses?.pageInfo?.hasNextPage,
    loading,
    onFetchMore: () => {
      loadMore(
        (prev, next) => {
          if (prev.taxClasses.pageInfo.endCursor === next.taxClasses.pageInfo.endCursor) {
            return prev;
          }

          return {
            ...prev,
            taxClasses: {
              ...prev.taxClasses,
              edges: [...prev.taxClasses.edges, ...next.taxClasses.edges],
              pageInfo: next.taxClasses.pageInfo,
            },
          };
        },
        {
          ...variables,
          after: data?.taxClasses?.pageInfo?.endCursor,
        },
      );
    },
  };

  return { taxClasses, fetchMoreTaxClasses };
}
