export interface ProductSetupChannelListingInput {
  channelId: string;
  isPublished: boolean;
  /**
   * Purchasable now — form `availableForPurchaseAt` in the past / set, or
   * explicit `isAvailableForPurchase` when drafts only carry the boolean.
   */
  isAvailableForPurchase: boolean;
}

export interface ProductSetupChannelShopInput {
  id: string;
  isActive: boolean;
  warehouseCount: number | "unknown";
  shippingZoneCount: number | "unknown";
  /** Warehouse ids linked to this channel — used for stock checks. */
  warehouseIds: string[];
}

export interface ProductSetupVariantInput {
  channelListings: Array<{
    channelId: string;
    hasPrice: boolean;
  }>;
  stocks: Array<{
    warehouseId: string;
    quantity: number;
  }>;
}

export interface ProductSetupReadinessInput {
  categoryId: string | null | undefined;
  channelListings: ProductSetupChannelListingInput[];
  channelShop: ProductSetupChannelShopInput[];
  variants: ProductSetupVariantInput[];
  /** Null when catalog size is unknown — fall back to `variants.length`. */
  variantsTotalCount: number | null;
  isShippingRequired: boolean;
  mediaCount: number;
  /** empty = none · partial = some SEO fields · complete = slug + title + description */
  seoStatus: "empty" | "partial" | "complete";
  canViewWarehouses: boolean;
  canViewShipping: boolean;
}

export interface ProductSetupReadiness {
  hasChannels: boolean;
  /** Active channel with warehouses (and shipping when required). */
  hasShopReadyChannel: boolean;
  hasCategory: boolean;
  hasVariants: boolean;
  hasOffer: boolean;
  /** Stock in a shop-ready channel warehouse, or unknown perms / skipped. */
  hasStock: boolean;
  needsStock: boolean;
  isLive: boolean;
  channelCount: number;
  mediaCount: number;
  seoStatus: "empty" | "partial" | "complete";
  /** First listed channel that still needs channel setup — for deep-links. */
  setupChannelId: string | null;
  /** True when every required-to-sell step is done. */
  coreReady: boolean;
}

const productHasVariants = (
  variants: ProductSetupVariantInput[],
  variantsTotalCount: number | null,
): boolean => {
  if (variantsTotalCount !== null) {
    return variantsTotalCount > 0;
  }

  return variants.length > 0;
};

const isChannelShopReady = ({
  shop,
  isShippingRequired,
  canViewWarehouses,
  canViewShipping,
}: {
  shop: ProductSetupChannelShopInput;
  isShippingRequired: boolean;
  canViewWarehouses: boolean;
  canViewShipping: boolean;
}): boolean => {
  if (!shop.isActive) {
    return false;
  }

  if (canViewWarehouses && shop.warehouseCount !== "unknown" && shop.warehouseCount === 0) {
    return false;
  }

  if (
    isShippingRequired &&
    canViewShipping &&
    shop.shippingZoneCount !== "unknown" &&
    shop.shippingZoneCount === 0
  ) {
    return false;
  }

  return true;
};

const isListingLive = (listing: ProductSetupChannelListingInput): boolean =>
  listing.isPublished && listing.isAvailableForPurchase;

/**
 * Pure readiness for the product setup checklist — mirrors voucher/channel
 * `get*SetupReadiness` helpers. Combines form channel drafts with Product Doctor
 * shop/variant signals.
 */
export const getProductSetupReadiness = ({
  categoryId,
  channelListings,
  channelShop,
  variants,
  variantsTotalCount,
  isShippingRequired,
  mediaCount,
  seoStatus,
  canViewWarehouses,
  canViewShipping,
}: ProductSetupReadinessInput): ProductSetupReadiness => {
  const channelCount = channelListings.length;
  const hasChannels = channelCount > 0;
  const hasCategory = Boolean(categoryId);
  const hasVariants = productHasVariants(variants, variantsTotalCount);

  const shopById = new Map(channelShop.map(shop => [shop.id, shop]));
  const listedChannelIds = channelListings.map(listing => listing.channelId);

  const shopReadyListedIds = listedChannelIds.filter(channelId => {
    const shop = shopById.get(channelId);

    if (!shop) {
      // No diagnostics yet — don't block on missing shop payload.
      return true;
    }

    return isChannelShopReady({
      shop,
      isShippingRequired,
      canViewWarehouses,
      canViewShipping,
    });
  });

  const hasShopReadyChannel = hasChannels && shopReadyListedIds.length > 0;

  const setupChannelId =
    listedChannelIds.find(channelId => {
      const shop = shopById.get(channelId);

      if (!shop) {
        return false;
      }

      return !isChannelShopReady({
        shop,
        isShippingRequired,
        canViewWarehouses,
        canViewShipping,
      });
    }) ??
    listedChannelIds[0] ??
    null;

  const hasOffer =
    hasVariants &&
    variants.some(variant =>
      variant.channelListings.some(
        listing => listedChannelIds.includes(listing.channelId) && listing.hasPrice,
      ),
    );

  const shopReadyWarehouseIds = new Set(
    shopReadyListedIds.flatMap(channelId => shopById.get(channelId)?.warehouseIds ?? []),
  );

  const needsStock = canViewWarehouses && hasShopReadyChannel;
  // Prefer warehouse∩channel stock when ids are known. ChannelSummary often
  // lacks ids — then any positive stock is enough for checklist readiness
  // (Product Doctor still flags stranded stock).
  const hasStock =
    !needsStock ||
    (shopReadyWarehouseIds.size > 0
      ? variants.some(variant =>
          variant.stocks.some(
            stock => stock.quantity > 0 && shopReadyWarehouseIds.has(stock.warehouseId),
          ),
        )
      : variants.some(variant => variant.stocks.some(stock => stock.quantity > 0)));

  const isLive = channelListings.some(isListingLive);

  const coreReady =
    hasShopReadyChannel && hasCategory && hasOffer && (!needsStock || hasStock) && isLive;

  return {
    hasChannels,
    hasShopReadyChannel,
    hasCategory,
    hasVariants,
    hasOffer,
    hasStock,
    needsStock,
    isLive,
    channelCount,
    mediaCount,
    seoStatus,
    setupChannelId,
    coreReady,
  };
};
