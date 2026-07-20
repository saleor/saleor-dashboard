import { getAbsoluteApiUrl } from "@dashboard/config";
import { useCallback, useMemo, useState } from "react";

/**
 * Hook to verify product availability via the public API.
 *
 * This makes an UNAUTHENTICATED query to truly simulate what a public API client
 * (without dashboard permissions) would see. If a product is not published,
 * the API will return null for that product.
 */

const PUBLIC_API_VARIANT_PAGE_SIZE = 100;

export const MAX_PUBLIC_API_VARIANT_PAGES = 50;

// Paginated query — Product.variants is deprecated and unbounded.
const PUBLIC_API_PRODUCT_CHECK_QUERY = `
  query PublicApiProductCheck($id: ID!, $channel: String!, $first: Int!, $after: String) {
    product(id: $id, channel: $channel) {
      id
      name
      isAvailable
      isAvailableForPurchase
      availableForPurchaseAt
      productVariants(first: $first, after: $after) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            name
            quantityAvailable
          }
        }
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

interface PublicApiProductVariantsConnection {
  totalCount: number | null;
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  edges: Array<{
    node: {
      id: string;
      name: string;
      quantityAvailable: number | null;
    };
  }>;
}

interface PublicApiProductNode {
  id: string;
  name: string;
  isAvailable: boolean | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchaseAt: string | null;
  productVariants: PublicApiProductVariantsConnection | null;
}

interface QueryResult {
  data?: {
    product: PublicApiProductNode | null;
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

export class PublicApiVariantsFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublicApiVariantsFetchError";
  }
}

/**
 * Walks public productVariants pages for one channel until complete or the page cap.
 * Exported for unit tests.
 */
export async function fetchPublicApiProductCheck(
  productId: string,
  channelSlug: string,
  fetchPage: typeof fetchUnauthenticated = fetchUnauthenticated,
): Promise<PublicApiCheckResult> {
  const variants: PublicApiVariantResult[] = [];
  let after: string | null = null;
  let hasNextPage = true;
  let pagesFetched = 0;
  let productMeta: Omit<PublicApiProductNode, "productVariants"> | null = null;
  let totalCount: number | null = null;

  while (hasNextPage) {
    if (pagesFetched >= MAX_PUBLIC_API_VARIANT_PAGES) {
      throw new PublicApiVariantsFetchError(
        `Exceeded ${MAX_PUBLIC_API_VARIANT_PAGES} pages while verifying public API variants`,
      );
    }

    const result = await fetchPage(PUBLIC_API_PRODUCT_CHECK_QUERY, {
      id: productId,
      channel: channelSlug,
      first: PUBLIC_API_VARIANT_PAGE_SIZE,
      after,
    });

    if (result.errors && result.errors.length > 0) {
      throw new PublicApiVariantsFetchError(result.errors.map(e => e.message).join(", "));
    }

    const product = result.data?.product;

    if (!product) {
      // First page: unpublished / not visible. Later pages: fail closed — do not
      // pretend verification succeeded with a partial variant list.
      if (pagesFetched > 0) {
        throw new PublicApiVariantsFetchError(
          "Product disappeared while verifying public API variants",
        );
      }

      return {
        productFound: false,
        isAvailable: null,
        isAvailableForPurchase: null,
        availableForPurchaseAt: null,
        variantsWithStock: 0,
        totalVariants: 0,
        variants: [],
      };
    }

    if (!productMeta) {
      productMeta = {
        id: product.id,
        name: product.name,
        isAvailable: product.isAvailable,
        isAvailableForPurchase: product.isAvailableForPurchase,
        availableForPurchaseAt: product.availableForPurchaseAt,
      };
    }

    const connection = product.productVariants;
    const pageNodes = connection?.edges.map(edge => edge.node) ?? [];

    if (totalCount === null) {
      totalCount = connection?.totalCount ?? null;
    }

    variants.push(
      ...pageNodes.map(node => ({
        id: node.id,
        name: node.name,
        quantityAvailable: node.quantityAvailable,
      })),
    );

    pagesFetched += 1;
    hasNextPage = connection?.pageInfo.hasNextPage ?? false;

    const nextAfter = connection?.pageInfo.endCursor ?? null;

    if (hasNextPage) {
      if (!nextAfter || nextAfter === after) {
        throw new PublicApiVariantsFetchError(
          "Pagination cursor did not advance while verifying public API variants",
        );
      }

      if (pageNodes.length === 0) {
        throw new PublicApiVariantsFetchError(
          "Empty page returned while more public API variants were expected",
        );
      }
    }

    after = nextAfter;
  }

  // quantityAvailable returns null when stocks are not tracked — treat as available.
  // Only quantityAvailable === 0 is out of stock.
  const variantsWithStock = variants.filter(
    variant => variant.quantityAvailable === null || variant.quantityAvailable > 0,
  ).length;

  return {
    productFound: true,
    isAvailable: productMeta?.isAvailable ?? null,
    isAvailableForPurchase: productMeta?.isAvailableForPurchase ?? null,
    availableForPurchaseAt: productMeta?.availableForPurchaseAt ?? null,
    variantsWithStock,
    totalVariants: totalCount ?? variants.length,
    variants,
  };
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
        const checkResult = await fetchPublicApiProductCheck(productId, channelSlug);

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
