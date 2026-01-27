import { getAbsoluteApiUrl } from "@dashboard/config";
import { useCallback, useMemo, useState } from "react";

/**
 * Hook to verify product availability via the public API.
 *
 * This makes an UNAUTHENTICATED query to truly simulate what a public API client
 * (without dashboard permissions) would see. If a product is not published,
 * the API will return null for that product.
 */

// Query that mimics public API product fetch
// This is sent as a raw GraphQL query string (not using Apollo's gql tag)
// because we make a direct fetch without authentication
const PUBLIC_API_PRODUCT_CHECK_QUERY = `
  query PublicApiProductCheck($id: ID!, $channel: String!) {
    product(id: $id, channel: $channel) {
      id
      name
      isAvailable
      isAvailableForPurchase
      availableForPurchaseAt
      variants {
        id
        name
        quantityAvailable
      }
    }
  }
`;

interface PublicApiVariantResult {
  id: string;
  name: string;
  quantityAvailable: number | null;
}

interface PublicApiCheckResult {
  /** Whether the product was returned by the API (false = not visible/published) */
  productFound: boolean;
  isAvailable: boolean | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchaseAt: string | null;
  variantsWithStock: number;
  totalVariants: number;
  variants: PublicApiVariantResult[];
}

export interface ChannelVerificationResult {
  channelId: string;
  channelSlug: string;
  status: "pending" | "loading" | "success" | "error";
  result: PublicApiCheckResult | null;
  error: string | null;
}

interface PublicApiVerificationState {
  isVerifying: boolean;
  results: Map<string, ChannelVerificationResult>;
  lastVerified: Date | null;
}

interface QueryResult {
  data?: {
    product: {
      id: string;
      name: string;
      isAvailable: boolean | null;
      isAvailableForPurchase: boolean | null;
      availableForPurchaseAt: string | null;
      variants: Array<{
        id: string;
        name: string;
        quantityAvailable: number | null;
      }> | null;
    } | null;
  };
  errors?: Array<{ message: string }>;
}

/**
 * Make an unauthenticated GraphQL request to the Saleor API.
 * This simulates what a public API client (without dashboard permissions) would see.
 */
async function fetchUnauthenticated(
  query: string,
  variables: Record<string, unknown>,
): Promise<QueryResult> {
  const apiUrl = getAbsoluteApiUrl();

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Explicitly NOT including Authorization header
    },
    credentials: "omit", // Ensure no cookies are sent, guaranteeing unauthenticated request
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const usePublicApiVerification = (productId: string) => {
  const [state, setState] = useState<PublicApiVerificationState>({
    isVerifying: false,
    results: new Map(),
    lastVerified: null,
  });

  const verifyChannel = useCallback(
    async (channelId: string, channelSlug: string): Promise<ChannelVerificationResult> => {
      // Set loading state for this channel
      setState(prev => ({
        ...prev,
        isVerifying: true,
        results: new Map(prev.results).set(channelId, {
          channelId,
          channelSlug,
          status: "loading",
          result: null,
          error: null,
        }),
      }));

      try {
        // Make unauthenticated request - this is what a public API client would see
        const result = await fetchUnauthenticated(PUBLIC_API_PRODUCT_CHECK_QUERY, {
          id: productId,
          channel: channelSlug,
        });

        if (result.errors && result.errors.length > 0) {
          const errorResult: ChannelVerificationResult = {
            channelId,
            channelSlug,
            status: "error",
            result: null,
            error: result.errors.map(e => e.message).join(", "),
          };

          setState(prev => ({
            ...prev,
            results: new Map(prev.results).set(channelId, errorResult),
          }));

          return errorResult;
        }

        const product = result.data?.product;
        // With unauthenticated request, product will be null if not published
        const variants = product?.variants || [];
        // quantityAvailable returns null when stocks are not tracked or limitQuantityPerCheckout is not set
        // In that case, we should still consider the variant as available (null means "unlimited" or "not tracked")
        // Only variants with quantityAvailable === 0 should be considered as out of stock
        const variantsWithStock = variants.filter(
          v => v.quantityAvailable === null || v.quantityAvailable > 0,
        ).length;

        const checkResult: PublicApiCheckResult = {
          // If product is null, it means it's not visible via public API
          productFound: !!product,
          isAvailable: product?.isAvailable ?? null,
          isAvailableForPurchase: product?.isAvailableForPurchase ?? null,
          availableForPurchaseAt: product?.availableForPurchaseAt ?? null,
          variantsWithStock,
          totalVariants: variants.length,
          variants: variants.map(v => ({
            id: v.id,
            name: v.name,
            quantityAvailable: v.quantityAvailable,
          })),
        };

        const successResult: ChannelVerificationResult = {
          channelId,
          channelSlug,
          status: "success",
          result: checkResult,
          error: null,
        };

        setState(prev => ({
          ...prev,
          results: new Map(prev.results).set(channelId, successResult),
        }));

        return successResult;
      } catch (err) {
        const errorResult: ChannelVerificationResult = {
          channelId,
          channelSlug,
          status: "error",
          result: null,
          error: err instanceof Error ? err.message : "Unknown error",
        };

        setState(prev => ({
          ...prev,
          results: new Map(prev.results).set(channelId, errorResult),
        }));

        return errorResult;
      } finally {
        // Reset isVerifying when this channel completes (if called standalone)
        // Note: verifyAllChannels will also reset it, but this ensures it's reset
        // even when verifyChannel is called directly
        setState(prev => {
          // Only reset if no channels are still loading
          const hasLoadingChannels = Array.from(prev.results.values()).some(
            r => r.status === "loading",
          );

          return {
            ...prev,
            isVerifying: hasLoadingChannels,
          };
        });
      }
    },
    [productId],
  );

  const verifyAllChannels = useCallback(
    async (channels: Array<{ id: string; slug: string }>) => {
      setState(prev => ({
        ...prev,
        isVerifying: true,
      }));

      // Verify all channels in parallel
      await Promise.all(channels.map(channel => verifyChannel(channel.id, channel.slug)));

      setState(prev => ({
        ...prev,
        isVerifying: false,
        lastVerified: new Date(),
      }));
    },
    [verifyChannel],
  );

  const clearResults = useCallback(() => {
    setState({
      isVerifying: false,
      results: new Map(),
      lastVerified: null,
    });
  }, []);

  const getChannelResult = useCallback(
    (channelId: string): ChannelVerificationResult | undefined => {
      return state.results.get(channelId);
    },
    [state.results],
  );

  // Summary across all verified channels
  const summary = useMemo(() => {
    const results = Array.from(state.results.values());
    const completed = results.filter(r => r.status === "success" || r.status === "error");
    // With unauthenticated request, productFound=true means it's visible via public API
    const visible = results.filter(r => r.status === "success" && r.result?.productFound);
    // A product is purchasable if: found (visible) AND isAvailable AND has stock
    const purchasable = visible.filter(
      r => r.result?.isAvailable === true && (r.result?.variantsWithStock ?? 0) > 0,
    );

    return {
      totalChannels: results.length,
      completedChannels: completed.length,
      purchasableChannels: purchasable.length,
      hasAnyResults: results.length > 0,
    };
  }, [state.results]);

  return {
    ...state,
    verifyChannel,
    verifyAllChannels,
    clearResults,
    getChannelResult,
    summary,
  };
};
