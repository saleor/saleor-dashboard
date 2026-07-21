import { useApolloClient } from "@apollo/client";
import {
  type AddressInput,
  OrderProductVariantsForAddDocument,
  type OrderProductVariantsForAddQuery,
  type OrderProductVariantsForAddQueryVariables,
} from "@dashboard/graphql";
import {
  appendOrderProductVariantsPage,
  type OrderSearchProduct,
} from "@dashboard/searches/mapSearchOrderVariantsForAdd";
import { ORDER_PRODUCT_ADD_VARIANTS_PAGE_SIZE } from "@dashboard/searches/useOrderVariantSearch";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseOrderProductAddDialogProductsArgs {
  products: OrderSearchProduct[];
  searchQuery: string;
  channel: string | undefined;
  address: AddressInput | undefined;
  open: boolean;
}

interface UseOrderProductAddDialogProductsResult {
  products: OrderSearchProduct[];
  loadMoreVariants: (productId: string) => Promise<void>;
  loadingProductIds: ReadonlySet<string>;
}

/**
 * Keeps per-product variant pages that were loaded after the initial search.
 * Uses `client.query` with `no-cache` so Apollo does not overwrite SearchOrderVariant's
 * embedded productVariants (Apollo 3.4 lazy queries also do not return a Promise).
 */
export const useOrderProductAddDialogProducts = ({
  products: productsFromSearch,
  searchQuery,
  channel,
  address,
  open,
}: UseOrderProductAddDialogProductsArgs): UseOrderProductAddDialogProductsResult => {
  const client = useApolloClient();
  const [overrides, setOverrides] = useState<Record<string, OrderSearchProduct>>({});
  const [loadingProductIds, setLoadingProductIds] = useState<ReadonlySet<string>>(() => new Set());
  const loadingProductIdsRef = useRef(new Set<string>());
  const overridesRef = useRef(overrides);
  const productsFromSearchRef = useRef(productsFromSearch);
  const loadGenerationRef = useRef(0);

  overridesRef.current = overrides;
  productsFromSearchRef.current = productsFromSearch;

  useEffect(
    function clearVariantOverridesOnSearchOrOpen() {
      loadGenerationRef.current += 1;
      loadingProductIdsRef.current = new Set();
      setLoadingProductIds(new Set());
      setOverrides({});
    },
    [searchQuery, channel, open],
  );

  const products = useMemo(
    () => productsFromSearch.map(product => overrides[product.id] ?? product),
    [overrides, productsFromSearch],
  );

  const loadMoreVariants = useCallback(
    async (productId: string) => {
      if (!channel || loadingProductIdsRef.current.has(productId)) {
        return;
      }

      const current =
        overridesRef.current[productId] ??
        productsFromSearchRef.current.find(product => product.id === productId);

      if (!current?.variantsHasNextPage || !current.variantsEndCursor) {
        return;
      }

      const generation = loadGenerationRef.current;

      loadingProductIdsRef.current.add(productId);
      setLoadingProductIds(new Set(loadingProductIdsRef.current));

      try {
        const result = await client.query<
          OrderProductVariantsForAddQuery,
          OrderProductVariantsForAddQueryVariables
        >({
          query: OrderProductVariantsForAddDocument,
          variables: {
            id: productId,
            first: ORDER_PRODUCT_ADD_VARIANTS_PAGE_SIZE,
            after: current.variantsEndCursor,
            channel,
            address,
          },
          fetchPolicy: "no-cache",
        });

        if (generation !== loadGenerationRef.current) {
          return;
        }

        const connection = result.data?.product?.productVariants;

        if (!connection) {
          return;
        }

        setOverrides(previous => {
          if (generation !== loadGenerationRef.current) {
            return previous;
          }

          const base = previous[productId] ?? current;

          return {
            ...previous,
            [productId]: appendOrderProductVariantsPage(base, {
              variants: connection.edges.map(edge => edge.node),
              totalCount: connection.totalCount ?? null,
              hasNextPage: connection.pageInfo.hasNextPage,
              endCursor: connection.pageInfo.endCursor ?? null,
            }),
          };
        });
      } catch {
        // Keep the already-loaded page; button returns to an idle state via finally.
      } finally {
        if (generation === loadGenerationRef.current) {
          loadingProductIdsRef.current.delete(productId);
          setLoadingProductIds(new Set(loadingProductIdsRef.current));
        }
      }
    },
    [address, channel, client],
  );

  return {
    products,
    loadMoreVariants,
    loadingProductIds,
  };
};
