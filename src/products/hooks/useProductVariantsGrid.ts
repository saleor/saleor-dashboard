import { PRODUCT_VARIANTS_PAGINATE_BY } from "@dashboard/config";
import {
  type ProductDetailsVariantFragment,
  useProductVariantsGridQuery,
} from "@dashboard/graphql";
import useDebounce from "@dashboard/hooks/useDebounce";
import useLocalPaginator, {
  type PaginationState,
  useLocalPaginationState,
} from "@dashboard/hooks/useLocalPaginator";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UseProductVariantsGridProps {
  productId: string;
  pageSize?: number;
  skip?: boolean;
}

interface UseProductVariantsGridResult {
  variants: ProductDetailsVariantFragment[];
  totalCount: number | null;
  loading: boolean;
  refetch: () => Promise<unknown>;
  search: string;
  setSearch: (query: string) => void;
  paginationState: PaginationState;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  } | null;
  loadNextPage: () => void;
  loadPreviousPage: () => void;
  resetPagination: () => void;
  /** Label for current page, e.g. "100 of 4231" or "1–100 of 4231" on first page. */
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
  const paginate = useLocalPaginator(setPaginationState);

  const debounceSearch = useDebounce((query: string) => {
    setDebouncedSearch(query);
    setPaginationState({});
  }, 300);

  const setSearch = useCallback(
    (query: string) => {
      setSearchInput(query);
      debounceSearch(query);
    },
    [debounceSearch],
  );

  const { data, loading, refetch } = useProductVariantsGridQuery({
    displayLoader: true,
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

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    connection?.pageInfo,
    paginationState,
  );

  const resetPagination = useCallback(() => {
    setPaginationState({});
  }, [setPaginationState]);

  useEffect(() => {
    setSearchInput("");
    setDebouncedSearch("");
    setPaginationState({});
  }, [productId, setPaginationState]);

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

    const onFirstPage = !pageInfo?.hasPreviousPage;

    if (onFirstPage) {
      return `1–${pageSizeActual} of ${totalCount}`;
    }

    return `${pageSizeActual} of ${totalCount}`;
  }, [pageInfo?.hasPreviousPage, totalCount, variants.length]);

  return {
    variants,
    totalCount,
    loading,
    refetch,
    search: searchInput,
    setSearch,
    paginationState,
    pageInfo: pageInfo
      ? {
          hasNextPage: pageInfo.hasNextPage,
          hasPreviousPage: pageInfo.hasPreviousPage,
          startCursor: pageInfo.startCursor,
          endCursor: pageInfo.endCursor,
        }
      : null,
    loadNextPage,
    loadPreviousPage,
    resetPagination,
    rangeLabel,
  };
};
