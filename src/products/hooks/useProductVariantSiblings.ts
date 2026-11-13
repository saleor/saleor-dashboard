import { PRODUCT_VARIANT_SIBLINGS_PAGINATE_BY } from "@dashboard/config";
import {
  type ProductVariantSiblingFragment,
  ProductVariantSiblingsDocument,
  type ProductVariantSiblingsQuery,
  type ProductVariantSiblingsQueryVariables,
  useProductVariantSiblingsQuery,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { orderByIds } from "./orderByIds";

export type ProductVariantSibling = ProductVariantSiblingFragment;

/** How long typing has to pause before a search is sent. */
const SEARCH_DEBOUNCE_MS = 300;

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
  /**
   * Asks for the next page. False when no request was started: there is no next page,
   * one is already on its way, or the rows on screen belong to an earlier search.
   */
  loadMore: () => boolean;
  refetch: () => Promise<unknown>;
  /**
   * Puts the loaded variants in the given order, without asking the API. For an order the
   * API has already saved: every loaded page stays, where a refetch would keep only the first.
   */
  reorder: (orderedIds: string[]) => void;
  /** Reorder is only safe when not filtering by search. */
  canReorder: boolean;
  /**
   * True while `variants` may be search results instead of the product's own order: a search
   * is typed, waiting to apply, or its results are still shown while the full list loads.
   */
  filtered: boolean;
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
  /** Product whose whole list the API has answered for since this list was mounted. */
  const [wholeListLoadedFor, setWholeListLoadedFor] = useState<string | null>(null);
  const loadMoreInFlightRef = useRef(false);
  /** Timer of a typed search that waits for typing to pause. */
  const pendingSearchRef = useRef<number | undefined>(undefined);

  // Only treat a real product change as a reset. A brief empty productId while
  // variant details load must not clear search or skip the siblings query.
  if (productId && productId !== prevProductId) {
    setPrevProductId(productId);
    setSearchInput("");
    setDebouncedSearch("");
  }

  const queryProductId = productId || prevProductId;

  useEffect(
    function dropPendingSearchWithItsProduct() {
      // A search typed for one product must not apply to the next one, or after unmount.
      return () => window.clearTimeout(pendingSearchRef.current);
    },
    [queryProductId],
  );

  const setSearch = useCallback((query: string) => {
    // Whatever was waiting is out of date now: replaced by this text, or cleared by it
    // (Esc, closing the list), in which case it must not apply later.
    window.clearTimeout(pendingSearchRef.current);
    setSearchInput(query);

    // Clear immediately so Esc / explicit reset doesn't wait on debounce.
    if (!query.trim()) {
      setDebouncedSearch("");

      return;
    }

    pendingSearchRef.current = window.setTimeout(() => {
      setDebouncedSearch(query);
    }, SEARCH_DEBOUNCE_MS);
  }, []);

  const searching = Boolean(debouncedSearch);
  const { data, previousData, loading, fetchMore, refetch, client } =
    useProductVariantSiblingsQuery({
      displayLoader: false,
      // The product's whole list is asked of the API once. After that it is shown as it
      // was left: asking again answers with the first page only, which drops the pages
      // loaded after it. So coming back from a search, or loading a further page, reads
      // what is there. A search, and another product, always ask the API.
      fetchPolicy:
        !searching && wholeListLoadedFor === queryProductId ? "cache-first" : "cache-and-network",
      nextFetchPolicy: "cache-first",
      skip: skip || !queryProductId,
      variables: {
        id: queryProductId,
        first: pageSize,
        search: debouncedSearch || undefined,
      },
    });

  // Only once the API has answered: switching earlier would abandon the request that is
  // still bringing the list up to date.
  if (
    !searching &&
    !loading &&
    data?.product?.id === queryProductId &&
    wholeListLoadedFor !== queryProductId
  ) {
    setWholeListLoadedFor(queryProductId);
  }

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

  // While a new search (or its clearing) loads, the previous rows stay on screen.
  const showsPreviousResult = resolvedData !== data;
  const filtered = Boolean(searchInput.trim() || debouncedSearch.trim() || showsPreviousResult);
  // A move is sent as a number of places, which only means the same to the API when the
  // rows on screen are the product's own order.
  const canReorder = !filtered;

  const loadMore = useCallback(() => {
    // The cursor of the rows on screen only continues the list those rows came from.
    if (!endCursor || loadMoreInFlightRef.current || !hasNextPage || showsPreviousResult) {
      return false;
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

    return true;
  }, [
    debouncedSearch,
    endCursor,
    fetchMore,
    hasNextPage,
    pageSize,
    queryProductId,
    showsPreviousResult,
  ]);

  const reorder = useCallback(
    (orderedIds: string[]) => {
      // Always the product's whole list, not what is on screen: a search may have been
      // typed while the move was being saved, and the order was made in the whole list.
      const wholeList = {
        query: ProductVariantSiblingsDocument,
        variables: { id: queryProductId, first: pageSize },
      };
      const cached = client.readQuery<
        ProductVariantSiblingsQuery,
        ProductVariantSiblingsQueryVariables
      >(wholeList);
      const cachedConnection = cached?.product?.productVariants;

      if (!cached?.product || !cachedConnection) {
        return;
      }

      client.writeQuery<ProductVariantSiblingsQuery, ProductVariantSiblingsQueryVariables>({
        ...wholeList,
        data: {
          ...cached,
          product: {
            ...cached.product,
            productVariants: {
              ...cachedConnection,
              edges: orderByIds(cachedConnection.edges, edge => edge.node.id, orderedIds),
            },
          },
        },
      });
    },
    [client, pageSize, queryProductId],
  );

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
    reorder,
    canReorder,
    filtered,
  };
};
