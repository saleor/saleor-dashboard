import { type ChannelOpts } from "@dashboard/components/ChannelsAvailabilityCard/types";
import { isSeoFormComplete } from "@dashboard/components/SeoForm/SeoForm";
import { type ProductChannelListingAddInput } from "@dashboard/graphql";

import { isPurchasable } from "../ProductDoctor/utils/availabilityStatus";
import {
  type ChannelSummary,
  type DiagnosticsResult,
  type ProductDiagnosticData,
} from "../ProductDoctor/utils/types";
import {
  getProductSetupReadiness,
  type ProductSetupReadiness,
  type ProductSetupReadinessInput,
} from "./getProductSetupReadiness";

const CLOCK_TOLERANCE_MS = 2000;

export type ProductSetupSeoStatus = ProductSetupReadinessInput["seoStatus"];

/** Aligns with SeoForm complete/incomplete — Partial when only some fields are set. */
export const getProductSetupSeoStatus = ({
  slug,
  seoTitle,
  seoDescription,
}: {
  slug: string | null | undefined;
  seoTitle: string | null | undefined;
  seoDescription: string | null | undefined;
}): ProductSetupSeoStatus => {
  if (isSeoFormComplete(slug, seoTitle, seoDescription)) {
    return "complete";
  }

  if (slug?.trim() || seoTitle?.trim() || seoDescription?.trim()) {
    return "partial";
  }

  return "empty";
};

const isListingAvailableForPurchase = ({
  availableForPurchaseAt,
  isAvailableForPurchase,
  dateNow,
}: {
  availableForPurchaseAt: string | null | undefined;
  isAvailableForPurchase: boolean | null | undefined;
  dateNow: number;
}): boolean => {
  if (availableForPurchaseAt) {
    return isPurchasable({ availableForPurchaseAt }, dateNow);
  }

  return Boolean(isAvailableForPurchase);
};

export const buildProductSetupReadinessInput = ({
  categoryId,
  formChannelListings,
  removeChannelIds,
  channelSummaries,
  diagnostics,
  productDiagnostic,
  mediaCount,
  slug,
  seoTitle,
  seoDescription,
  dateNow = Date.now(),
}: {
  categoryId: string | null | undefined;
  formChannelListings: ProductChannelListingAddInput[] | undefined;
  removeChannelIds: string[] | undefined;
  channelSummaries: ChannelSummary[];
  diagnostics: Pick<DiagnosticsResult, "permissions" | "isShippingRequired">;
  productDiagnostic: ProductDiagnosticData | null;
  mediaCount: number;
  slug: string | null | undefined;
  seoTitle: string | null | undefined;
  seoDescription: string | null | undefined;
  dateNow?: number;
}): ProductSetupReadinessInput => {
  const removed = new Set(removeChannelIds ?? []);
  const listings = (formChannelListings ?? [])
    .filter(listing => !removed.has(listing.channelId))
    .map(listing => ({
      channelId: listing.channelId,
      isPublished: Boolean(listing.isPublished),
      isAvailableForPurchase: isListingAvailableForPurchase({
        availableForPurchaseAt: listing.availableForPurchaseAt,
        isAvailableForPurchase: listing.isAvailableForPurchase,
        dateNow,
      }),
    }));

  const listingIds = new Set(listings.map(listing => listing.channelId));
  const summariesForShop = channelSummaries.filter(
    summary => !removed.has(summary.id) && (listingIds.size === 0 || listingIds.has(summary.id)),
  );

  const channelShop = summariesForShop.map(summary => ({
    id: summary.id,
    isActive: summary.isActive,
    warehouseCount: summary.warehouseCount,
    shippingZoneCount: summary.shippingZoneCount,
    // ChannelSummary does not expose warehouse ids; stock uses quantity fallback
    // when this list is empty (see getProductSetupReadiness).
    warehouseIds: [] as string[],
  }));

  // Newly assigned channels may not be in diagnostics yet — don't block on them.
  listings.forEach(listing => {
    if (channelShop.some(shop => shop.id === listing.channelId)) {
      return;
    }

    channelShop.push({
      id: listing.channelId,
      isActive: true,
      warehouseCount: "unknown",
      shippingZoneCount: "unknown",
      warehouseIds: [],
    });
  });

  const variants =
    productDiagnostic?.variants.map(variant => ({
      channelListings:
        variant.channelListings?.map(listing => ({
          channelId: listing.channel.id,
          hasPrice: listing.price !== null,
        })) ?? [],
      stocks:
        variant.stocks?.map(stock => ({
          warehouseId: stock.warehouse.id,
          quantity: stock.quantity,
        })) ?? [],
    })) ?? [];

  return {
    categoryId,
    channelListings: listings,
    channelShop,
    variants,
    variantsTotalCount: productDiagnostic?.variantsTotalCount ?? null,
    isShippingRequired:
      diagnostics.isShippingRequired ?? productDiagnostic?.isShippingRequired ?? true,
    mediaCount,
    seoStatus: getProductSetupSeoStatus({ slug, seoTitle, seoDescription }),
    canViewWarehouses: diagnostics.permissions.canViewChannelWarehouses,
    canViewShipping: diagnostics.permissions.canViewShippingZones,
  };
};

export const getProductSetupReadinessFromPage = (
  args: Parameters<typeof buildProductSetupReadinessInput>[0],
): ProductSetupReadiness => getProductSetupReadiness(buildProductSetupReadinessInput(args));

/** ChannelOpts payload that publishes, lists, and opens purchase for a listing. */
export const getMakeAvailableChannelOpts = (dateNow: number = Date.now()): ChannelOpts => ({
  isPublished: true,
  // Slightly in the past avoids "scheduled" flash from clock skew.
  publishedAt: new Date(dateNow - CLOCK_TOLERANCE_MS).toISOString(),
  isAvailableForPurchase: true,
  availableForPurchase: new Date(dateNow).toISOString(),
  // Unlisted-but-purchasable is a valid later choice; go-live should be findable.
  visibleInListings: true,
});
