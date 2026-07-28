import { useApolloClient } from "@apollo/client";
import { ASSIGN_VARIANT_LOAD_MORE_PAGE_SIZE } from "@dashboard/fragments/products";
import {
  SearchProductVariantsForAssignDocument,
  type SearchProductVariantsForAssignQuery,
  type SearchProductVariantsForAssignQueryVariables,
} from "@dashboard/graphql";
import {
  appendSearchProductVariantsPage,
  type AssignableSearchProduct,
} from "@dashboard/searches/mapSearchProductsForVariantAssign";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseAssignVariantDialogProductsArgs {
  products: AssignableSearchProduct[];
  searchQuery: string;
  channel: string | undefined;
  open: boolean;
}

interface UseAssignVariantDialogProductsResult {
  products: AssignableSearchProduct[];
  loadMoreVariants: (productId: string) => Promise<void>;
  loadingProductIds: ReadonlySet<string>;
}

/**
 * Keeps per-product variant pages loaded after AssignVariant search.
 * Uses client.query + no-cache so Apollo does not overwrite SearchProducts'
 * embedded productVariants (Apollo 3.4 lazy queries do not return a Promise).
 */
export const useAssignVariantDialogProducts = ({
  products: productsFromSearch,
  searchQuery,
  channel,
  open,
}: UseAssignVariantDialogProductsArgs): UseAssignVariantDialogProductsResult => {
  const client = useApolloClient();
  const [overrides, setOverrides] = useState<Record<string, AssignableSearchProduct>>({});
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
      if (loadingProductIdsRef.current.has(productId)) {
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
          SearchProductVariantsForAssignQuery,
          SearchProductVariantsForAssignQueryVariables
        >({
          query: SearchProductVariantsForAssignDocument,
          variables: {
            id: productId,
            first: ASSIGN_VARIANT_LOAD_MORE_PAGE_SIZE,
            after: current.variantsEndCursor,
            channel,
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
            [productId]: appendSearchProductVariantsPage(base, {
              variants: connection.edges.map(edge => edge.node),
              totalCount: connection.totalCount ?? null,
              hasNextPage: connection.pageInfo.hasNextPage,
              endCursor: connection.pageInfo.endCursor ?? null,
            }),
          };
        });
      } catch {
        // Keep the already-loaded page; button returns to idle via finally.
      } finally {
        if (generation === loadGenerationRef.current) {
          loadingProductIdsRef.current.delete(productId);
          setLoadingProductIds(new Set(loadingProductIdsRef.current));
        }
      }
    },
    [channel, client],
  );

  return {
    products,
    loadMoreVariants,
    loadingProductIds,
  };
};
