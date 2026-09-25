import { useApolloClient } from "@apollo/client";
import {
  type AddressInput,
  OrderProductChannelVariantIdsDocument,
  type OrderProductChannelVariantIdsQuery,
  type OrderProductChannelVariantIdsQueryVariables,
  OrderProductVariantsForAddDocument,
  type OrderProductVariantsForAddQuery,
  type OrderProductVariantsForAddQueryVariables,
} from "@dashboard/graphql";
import {
  appendOrderProductVariantsPage,
  applyChannelVariantIds,
  isOrderVariantsListTruncated,
  type OrderSearchProduct,
  type OrderSearchVariant,
} from "@dashboard/searches/mapSearchOrderVariantsForAdd";
import { ORDER_PRODUCT_ADD_VARIANTS_PAGE_SIZE } from "@dashboard/searches/useOrderVariantSearch";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { hasVariantPricing } from "./utils";

/**
 * The first search result only. A priced row or two still hides the rest of the channel
 * behind Load more; a longer list is left for the user to expand.
 */
const AUTO_LOAD_FIRST_PRODUCT_MAX_PRICED_VARIANTS = 3;

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

const variantDetails = (
  connection: OrderProductVariantsForAddQuery["productVariants"] | null | undefined,
): OrderSearchVariant[] => connection?.edges.map(edge => edge.node) ?? [];

/**
 * Keeps per-product variant pages that were loaded after the initial search.
 * Uses `client.query` with `no-cache` so Apollo does not overwrite SearchOrderVariant's
 * embedded productVariants (Apollo 3.4 lazy queries also do not return a Promise).
 *
 * Further pages are not cursors over every variant. A truncated product first loads the
 * channel-listed id set, then details for the next slice of ids still missing.
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
  const channelIdsInFlightRef = useRef(new Map<string, Promise<string[] | null>>());
  const autoRanRef = useRef(new Set<string>());

  overridesRef.current = overrides;
  productsFromSearchRef.current = productsFromSearch;

  const findProduct = useCallback(
    (productId: string) =>
      overridesRef.current[productId] ??
      productsFromSearchRef.current.find(product => product.id === productId),
    [],
  );

  useEffect(
    function clearVariantOverridesOnSearchOrOpen() {
      loadGenerationRef.current += 1;
      loadingProductIdsRef.current = new Set();
      channelIdsInFlightRef.current = new Map();
      autoRanRef.current = new Set();
      setLoadingProductIds(new Set());
      setOverrides({});
    },
    [searchQuery, channel, open],
  );

  const products = useMemo(
    () => productsFromSearch.map(product => overrides[product.id] ?? product),
    [overrides, productsFromSearch],
  );

  const storeProduct = useCallback(
    (productId: string, product: OrderSearchProduct, generation: number) => {
      if (generation !== loadGenerationRef.current) {
        return;
      }

      overridesRef.current = {
        ...overridesRef.current,
        [productId]: product,
      };
      setOverrides(overridesRef.current);
    },
    [],
  );

  const ensureChannelVariantIds = useCallback(
    async (product: OrderSearchProduct, generation: number): Promise<OrderSearchProduct | null> => {
      if (product.channelVariantIds) {
        return product;
      }

      if (!channel) {
        return null;
      }

      let pending = channelIdsInFlightRef.current.get(product.id);

      if (!pending) {
        pending = client
          .query<OrderProductChannelVariantIdsQuery, OrderProductChannelVariantIdsQueryVariables>({
            query: OrderProductChannelVariantIdsDocument,
            variables: { id: product.id, channel },
            fetchPolicy: "no-cache",
          })
          .then(result => result.data?.product?.variants?.map(variant => variant.id) ?? [])
          .catch(() => null);
        channelIdsInFlightRef.current.set(product.id, pending);
      }

      const ids = await pending;

      channelIdsInFlightRef.current.delete(product.id);

      if (ids === null || generation !== loadGenerationRef.current) {
        return null;
      }

      const latest = findProduct(product.id) ?? product;
      const next = applyChannelVariantIds(latest.channelVariantIds ? latest : product, ids);

      storeProduct(product.id, next, generation);

      return next;
    },
    [channel, client, findProduct, storeProduct],
  );

  const loadMoreVariants = useCallback(
    async (productId: string) => {
      if (!channel || loadingProductIdsRef.current.has(productId)) {
        return;
      }

      const current = findProduct(productId);

      if (!current) {
        return;
      }

      if (current.channelVariantIds && current.missingVariantIds.length === 0) {
        return;
      }

      if (!current.channelVariantIds && !current.variantsHasNextPage) {
        return;
      }

      const generation = loadGenerationRef.current;

      loadingProductIdsRef.current.add(productId);
      setLoadingProductIds(new Set(loadingProductIdsRef.current));

      try {
        const withIds = await ensureChannelVariantIds(current, generation);

        if (!withIds || generation !== loadGenerationRef.current) {
          return;
        }

        const ids = withIds.missingVariantIds.slice(0, ORDER_PRODUCT_ADD_VARIANTS_PAGE_SIZE);

        if (ids.length === 0) {
          return;
        }

        const result = await client.query<
          OrderProductVariantsForAddQuery,
          OrderProductVariantsForAddQueryVariables
        >({
          query: OrderProductVariantsForAddDocument,
          variables: {
            ids,
            first: ORDER_PRODUCT_ADD_VARIANTS_PAGE_SIZE,
            channel,
            address,
          },
          fetchPolicy: "no-cache",
        });

        if (generation !== loadGenerationRef.current) {
          return;
        }

        const base = findProduct(productId) ?? withIds;

        storeProduct(
          productId,
          appendOrderProductVariantsPage(base, {
            variants: variantDetails(result.data?.productVariants),
            requestedIds: ids,
          }),
          generation,
        );
      } catch {
        // Keep the already-loaded page; button returns to an idle state via finally.
      } finally {
        if (generation === loadGenerationRef.current) {
          loadingProductIdsRef.current.delete(productId);
          setLoadingProductIds(new Set(loadingProductIdsRef.current));
        }
      }
    },
    [address, channel, client, ensureChannelVariantIds, findProduct, storeProduct],
  );

  useEffect(
    function autoLoadTruncatedProductsWithFewPricedVariants() {
      if (!open || !channel) {
        return;
      }

      // Mirrors the dialog's visibility rule, so "first" is the first row the user sees.
      const firstVisibleIndex = products.findIndex(
        product =>
          product.variants.some(hasVariantPricing) || isOrderVariantsListTruncated(product),
      );

      products.forEach((product, index) => {
        const pricedCount = product.variants.filter(hasVariantPricing).length;
        const isShortFirstProduct =
          index === firstVisibleIndex &&
          pricedCount > 0 &&
          pricedCount <= AUTO_LOAD_FIRST_PRODUCT_MAX_PRICED_VARIANTS;

        if (
          product.variantsHasNextPage &&
          product.channelVariantIds === null &&
          !autoRanRef.current.has(product.id) &&
          (pricedCount === 0 || isShortFirstProduct)
        ) {
          autoRanRef.current.add(product.id);
          void loadMoreVariants(product.id);
        }
      });
    },
    [products, open, channel, loadMoreVariants],
  );

  return {
    products,
    loadMoreVariants,
    loadingProductIds,
  };
};
