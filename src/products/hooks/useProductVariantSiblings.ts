import { PRODUCT_VARIANT_SIBLINGS_PAGINATE_BY } from "@dashboard/config";
import {
  type ProductVariantSiblingFragment,
  useProductVariantSiblingsQuery,
} from "@dashboard/graphql";
import useDebounce from "@dashboard/hooks/useDebounce";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useCallback, useMemo, useState } from "react";

export type ProductVariantSibling = ProductVariantSiblingFragment;

interface UseProductVariantSiblingsProps {
  productId: string;
  /** Current variant on the detail page — pinned when not in the loaded pages. */
  currentVariant?: ProductVariantSibling | null;
  pageSize?: number;
  skip?: boolean;
}

interface UseProductVariantSiblingsResult {
  variants: ProductVariantSibling[];
  /** Count from the server connection (excludes a locally pinned current variant). */
  loadedCount: number;
  totalCount: number | null;
  loading: boolean;
  loadingMore: boolean;
  search: string;
  setSearch: (query: string) => void;
  hasNextPage: boolean;
  loadMore: () => void;
  refetch: () => Promise<unknown>;
  /** True when the current variant was prepended because it isn't in loaded results. */
  isCurrentPinned: boolean;
  /** Reorder is only safe on a contiguous unfiltered page slice. */
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

  if (productId !== prevProductId) {
    setPrevProductId(productId);
    setSearchInput("");
    setDebouncedSearch("");
  }

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

  const { data, loading, fetchMore, refetch } = useProductVariantSiblingsQuery({
    displayLoader: false,
    skip: skip || !productId,
    variables: {
      id: productId,
      first: pageSize,
      search: debouncedSearch || undefined,
    },
  });

  const connection = data?.product?.productVariants;
  const loadedVariants = useMemo(() => mapEdgesToItems(connection) ?? [], [connection]);
  const totalCount = connection?.totalCount ?? null;
  const hasNextPage = Boolean(connection?.pageInfo?.hasNextPage);
  const endCursor = connection?.pageInfo?.endCursor ?? null;

  const isCurrentPinned = Boolean(
    currentVariant &&
      !debouncedSearch.trim() &&
      !loadedVariants.some(variant => variant.id === currentVariant.id),
  );

  const variants = useMemo(() => {
    if (!isCurrentPinned || !currentVariant) {
      return loadedVariants;
    }

    return [currentVariant, ...loadedVariants];
  }, [currentVariant, isCurrentPinned, loadedVariants]);

  const canReorder = !searchInput.trim() && !isCurrentPinned;

  const loadMore = useCallback(() => {
    if (!endCursor || loadingMore || !hasNextPage) {
      return;
    }

    setLoadingMore(true);
    fetchMore({
      variables: {
        after: endCursor,
      },
      updateQuery: (previous, { fetchMoreResult }) => {
        const previousConnection = previous.product?.productVariants;
        const nextConnection = fetchMoreResult.product?.productVariants;

        if (!previous.product || !previousConnection || !nextConnection) {
          return previous;
        }

        return {
          ...previous,
          product: {
            ...previous.product,
            productVariants: {
              ...nextConnection,
              edges: [...previousConnection.edges, ...nextConnection.edges],
            },
          },
        };
      },
    }).finally(() => {
      setLoadingMore(false);
    });
  }, [endCursor, fetchMore, hasNextPage, loadingMore]);

  return {
    variants,
    loadedCount: loadedVariants.length,
    totalCount,
    loading: loading && !loadingMore,
    loadingMore,
    search: searchInput,
    setSearch,
    hasNextPage,
    loadMore,
    refetch,
    isCurrentPinned,
    canReorder,
  };
};
