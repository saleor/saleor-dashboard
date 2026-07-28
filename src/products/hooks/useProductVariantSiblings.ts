import { PRODUCT_VARIANT_SIBLINGS_PAGINATE_BY } from "@dashboard/config";
import {
  type ProductVariantSiblingFragment,
  useProductVariantSiblingsQuery,
} from "@dashboard/graphql";
import useDebounce from "@dashboard/hooks/useDebounce";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useCallback, useMemo, useRef, useState } from "react";

export type ProductVariantSibling = ProductVariantSiblingFragment;

interface UseProductVariantSiblingsProps {
  productId: string;
  /** Current variant on the detail page — pinned when not in the loaded pages. */
  currentVariant?: ProductVariantSibling | null;
  pageSize?: number;
  skip?: boolean;
}

interface UseProductVariantSiblingsResult {
  /** Loaded sibling pages in catalog order (never includes an off-page current prepend). */
  variants: ProductVariantSibling[];
  /**
   * Current variant when it is not in `variants` yet — render outside the scroll
   * list so pinning does not fight scroll order.
   */
  offPageCurrent: ProductVariantSibling | null;
  /** Count from the server connection. */
  loadedCount: number;
  totalCount: number | null;
  /** True only before the first usable result for this product (skeletons). */
  initialLoading: boolean;
  loadingMore: boolean;
  search: string;
  setSearch: (query: string) => void;
  hasNextPage: boolean;
  loadMore: () => void;
  refetch: () => Promise<unknown>;
  /** Reorder is only safe when not filtering by search. */
  canReorder: boolean;
}

export const useProductVariantSiblings = ({
  productId,
  currentVariant = null,
  pageSize = PRODUCT_VARIANT_SIBLINGS_PAGINATE_BY,
  skip = false,
}: UseProductVariantSiblingsProps): UseProductVariantSiblingsResult => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [prevProductId, setPrevProductId] = useState(productId);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreInFlightRef = useRef(false);

  // Only treat a real product change as a reset. A brief empty productId while
  // variant details load must not clear search or skip the siblings query.
  if (productId && productId !== prevProductId) {
    setPrevProductId(productId);
    setSearchInput("");
    setDebouncedSearch("");
  }

  const queryProductId = productId || prevProductId;

  const debounceSearch = useDebounce((query: string) => {
    setDebouncedSearch(query);
  }, 300);

  const setSearch = useCallback(
    (query: string) => {
      setSearchInput(query);

      // Clear immediately so Esc / explicit reset doesn't wait on debounce.
      if (!query.trim()) {
        setDebouncedSearch("");

        return;
      }

      debounceSearch(query);
    },
    [debounceSearch],
  );

  const { data, previousData, loading, fetchMore, refetch } = useProductVariantSiblingsQuery({
    displayLoader: false,
    skip: skip || !queryProductId,
    variables: {
      id: queryProductId,
      first: pageSize,
      search: debouncedSearch || undefined,
    },
  });

  // Prefer the current result; while a search/refetch is in flight keep the last
  // result for *this* product so the list updates in place instead of flashing.
  const resolvedData =
    data?.product?.id === queryProductId
      ? data
      : previousData?.product?.id === queryProductId
        ? previousData
        : (data ?? previousData);

  const connection = resolvedData?.product?.productVariants;
  const loadedVariants = useMemo(() => mapEdgesToItems(connection) ?? [], [connection]);
  const totalCount = connection?.totalCount ?? null;
  const hasNextPage = Boolean(connection?.pageInfo?.hasNextPage);
  const endCursor = connection?.pageInfo?.endCursor ?? null;
  const initialLoading = loading && !loadingMore && loadedVariants.length === 0 && !connection;

  const offPageCurrent =
    currentVariant &&
    !debouncedSearch.trim() &&
    !loadedVariants.some(variant => variant.id === currentVariant.id)
      ? currentVariant
      : null;

  const canReorder = !searchInput.trim();

  const loadMore = useCallback(() => {
    if (!endCursor || loadMoreInFlightRef.current || !hasNextPage) {
      return;
    }

    loadMoreInFlightRef.current = true;
    setLoadingMore(true);
    fetchMore({
      variables: {
        id: queryProductId,
        first: pageSize,
        after: endCursor,
        search: debouncedSearch || undefined,
      },
      updateQuery: (previous, { fetchMoreResult }) => {
        const previousConnection = previous.product?.productVariants;
        const nextConnection = fetchMoreResult?.product?.productVariants;

        if (!previous.product || !previousConnection || !nextConnection) {
          return previous;
        }

        const seen = new Set(previousConnection.edges.map(edge => edge.node.id));
        const appendedEdges = nextConnection.edges.filter(edge => !seen.has(edge.node.id));

        return {
          ...previous,
          product: {
            ...previous.product,
            productVariants: {
              ...nextConnection,
              edges: [...previousConnection.edges, ...appendedEdges],
            },
          },
        };
      },
    }).finally(() => {
      loadMoreInFlightRef.current = false;
      setLoadingMore(false);
    });
  }, [debouncedSearch, endCursor, fetchMore, hasNextPage, pageSize, queryProductId]);

  return {
    variants: loadedVariants,
    offPageCurrent,
    loadedCount: loadedVariants.length,
    totalCount,
    initialLoading,
    loadingMore,
    search: searchInput,
    setSearch,
    hasNextPage,
    loadMore,
    refetch,
    canReorder,
  };
};
