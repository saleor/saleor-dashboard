import { PRODUCT_VARIANTS_PAGINATE_BY } from "@dashboard/config";
import {
  type ProductDetailsVariantFragment,
  useProductVariantsGridQuery,
} from "@dashboard/graphql";
import useDebounce from "@dashboard/hooks/useDebounce";
import { type PaginationState, useLocalPaginationState } from "@dashboard/hooks/useLocalPaginator";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useCallback, useMemo, useRef, useState } from "react";

interface UseProductVariantsGridProps {
  productId: string;
  pageSize?: number;
  skip?: boolean;
}

interface VariantsGridPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

interface UseProductVariantsGridResult {
  variants: ProductDetailsVariantFragment[];
  totalCount: number | null;
  loading: boolean;
  refetch: () => Promise<unknown>;
  search: string;
  setSearch: (query: string) => void;
  paginationState: PaginationState;
  pageInfo: VariantsGridPageInfo | null;
  loadNextPage: () => void;
  loadPreviousPage: () => void;
  resetPagination: () => void;
  /** Label for current page, e.g. "1–5 of 16" or "6–10 of 16". */
  rangeLabel: string | null;
}

export const useProductVariantsGrid = ({
  productId,
  pageSize = PRODUCT_VARIANTS_PAGINATE_BY,
  skip = false,
}: UseProductVariantsGridProps): UseProductVariantsGridResult => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [paginationState, setPaginationState] = useLocalPaginationState(pageSize);
  const [prevProductId, setPrevProductId] = useState(productId);
  /** 0-based index of the first row on the current page within the full result set. */
  const [rangeStart, setRangeStart] = useState(0);
  const rangeStartStackRef = useRef<number[]>([]);

  const resetRangeTracking = useCallback(() => {
    rangeStartStackRef.current = [];
    setRangeStart(0);
  }, []);

  // Reset grid filters when navigating to a different product (render-time adjust,
  // not an effect — avoids a setState cascade and pairs with stable setPaginationState).
  if (productId !== prevProductId) {
    setPrevProductId(productId);
    setSearchInput("");
    setDebouncedSearch("");
    setPaginationState({});
    rangeStartStackRef.current = [];
    setRangeStart(0);
  }

  const debounceSearch = useDebounce((query: string) => {
    setDebouncedSearch(query);
    setPaginationState({});
    resetRangeTracking();
  }, 300);

  const setSearch = useCallback(
    (query: string) => {
      setSearchInput(query);

      // Clear immediately so Esc / explicit reset doesn't wait on debounce.
      if (!query.trim()) {
        setDebouncedSearch("");
        setPaginationState({});
        resetRangeTracking();

        return;
      }

      debounceSearch(query);
    },
    [debounceSearch, resetRangeTracking, setPaginationState],
  );

  const { data, loading, refetch } = useProductVariantsGridQuery({
    displayLoader: false,
    skip: skip || !productId,
    variables: {
      id: productId,
      search: debouncedSearch || undefined,
      ...paginationState,
    },
  });

  const connection = data?.product?.productVariants;
  const variants = useMemo(() => mapEdgesToItems(connection) ?? [], [connection]);
  const totalCount = connection?.totalCount ?? null;

  const connectionPageInfo = connection?.pageInfo;
  const endCursor = connectionPageInfo?.endCursor ?? null;
  const startCursor = connectionPageInfo?.startCursor ?? null;

  // Mirror useLocalPaginator pageInfo flags so "after/before in flight" still enables buttons.
  const pageInfo = useMemo((): VariantsGridPageInfo | null => {
    if (!connectionPageInfo) {
      return null;
    }

    return {
      hasNextPage: Boolean(paginationState.before) || connectionPageInfo.hasNextPage,
      hasPreviousPage: Boolean(paginationState.after) || connectionPageInfo.hasPreviousPage,
      startCursor,
      endCursor,
    };
  }, [connectionPageInfo, endCursor, paginationState.after, paginationState.before, startCursor]);

  const loadNextPage = useCallback(() => {
    if (!endCursor) {
      return;
    }

    rangeStartStackRef.current.push(rangeStart);
    setRangeStart(rangeStart + variants.length);
    setPaginationState({
      after: endCursor,
      before: undefined,
    });
  }, [endCursor, rangeStart, setPaginationState, variants.length]);

  const loadPreviousPage = useCallback(() => {
    if (!startCursor) {
      return;
    }

    const previousStart = rangeStartStackRef.current.pop() ?? 0;

    setRangeStart(previousStart);
    setPaginationState({
      after: undefined,
      before: startCursor,
    });
  }, [setPaginationState, startCursor]);

  const resetPagination = useCallback(() => {
    resetRangeTracking();
    setPaginationState({});
  }, [resetRangeTracking, setPaginationState]);

  const rangeLabel = useMemo(() => {
    if (totalCount === null) {
      return null;
    }

    if (totalCount === 0) {
      return "0 of 0";
    }

    const pageSizeActual = variants.length;

    if (pageSizeActual === 0) {
      return `0 of ${totalCount}`;
    }

    // Cursor pagination can land on the first page without us knowing; force start to 1.
    const start = (!pageInfo?.hasPreviousPage ? 0 : rangeStart) + 1;
    const end = start + pageSizeActual - 1;

    return `${start}–${end} of ${totalCount}`;
  }, [pageInfo?.hasPreviousPage, rangeStart, totalCount, variants.length]);

  return {
    variants,
    totalCount,
    loading,
    refetch,
    search: searchInput,
    setSearch,
    paginationState,
    pageInfo,
    loadNextPage,
    loadPreviousPage,
    resetPagination,
    rangeLabel,
  };
};
