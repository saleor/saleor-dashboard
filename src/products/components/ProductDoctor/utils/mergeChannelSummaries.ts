import { ChannelFragment, ProductChannelListingAddInput } from "@dashboard/graphql";

import { ChannelSummary } from "./types";

/**
 * Merges form data with diagnostic channel summaries to reflect pending (unsaved) changes.
 * Also creates summaries for newly added channels that aren't in diagnostics yet.
 *
 * @param channelSummaries - Original channel summaries from diagnostics
 * @param formChannelData - Current form state for channel listings
 * @param channels - All available channels (needed for new channel metadata)
 * @returns Merged summaries reflecting current form state
 */
export function mergeFormDataWithChannelSummaries(
  channelSummaries: ChannelSummary[],
  formChannelData: ProductChannelListingAddInput[] | undefined,
  channels: ChannelFragment[] | undefined,
): ChannelSummary[] {
  if (!formChannelData) {
    return channelSummaries;
  }

  const existingChannelIds = new Set(channelSummaries.map(s => s.id));

  // Update existing summaries with form data
  const summariesWithFormData = channelSummaries.map(summary => {
    const formData = formChannelData.find(fc => fc.channelId === summary.id);

    if (!formData) {
      return summary;
    }

    return mergeChannelWithFormData(summary, formData);
  });

  // Create summaries for newly added channels
  const newChannelSummaries = createNewChannelSummaries(
    formChannelData,
    existingChannelIds,
    channels,
  );

  return [...summariesWithFormData, ...newChannelSummaries];
}

/**
 * Merges a single channel summary with form data.
 * Form data takes precedence over original summary for non-null values.
 */
function mergeChannelWithFormData(
  summary: ChannelSummary,
  formData: ProductChannelListingAddInput,
): ChannelSummary {
  return {
    ...summary,
    isPublished:
      formData.isPublished !== undefined && formData.isPublished !== null
        ? formData.isPublished
        : summary.isPublished,
    publishedAt: formData.publishedAt !== undefined ? formData.publishedAt : summary.publishedAt,
    isAvailableForPurchase:
      formData.isAvailableForPurchase !== undefined && formData.isAvailableForPurchase !== null
        ? formData.isAvailableForPurchase
        : summary.isAvailableForPurchase,
    availableForPurchaseAt:
      formData.availableForPurchaseAt !== undefined
        ? formData.availableForPurchaseAt
        : summary.availableForPurchaseAt,
    visibleInListings:
      formData.visibleInListings !== undefined && formData.visibleInListings !== null
        ? formData.visibleInListings
        : summary.visibleInListings,
  };
}

/**
 * Creates channel summaries for newly added channels that don't exist in diagnostics yet.
 */
function createNewChannelSummaries(
  formChannelData: ProductChannelListingAddInput[],
  existingChannelIds: Set<string>,
  channels: ChannelFragment[] | undefined,
): ChannelSummary[] {
  if (!channels) {
    return [];
  }

  return formChannelData
    .filter(formData => !existingChannelIds.has(formData.channelId))
    .map(formData => {
      const channel = channels.find(c => c.id === formData.channelId);

      if (!channel) {
        return null;
      }

      return createSummaryFromFormData(channel, formData);
    })
    .filter((summary): summary is ChannelSummary => summary !== null);
}

/**
 * Creates a new channel summary from form data and channel metadata.
 * Used for channels that were just added to the product.
 */
function createSummaryFromFormData(
  channel: ChannelFragment,
  formData: ProductChannelListingAddInput,
): ChannelSummary {
  return {
    id: channel.id,
    name: channel.name,
    slug: channel.slug,
    currencyCode: channel.currencyCode,
    isActive: channel.isActive,
    isPublished: formData.isPublished ?? false,
    publishedAt: formData.publishedAt ?? null,
    isAvailableForPurchase: formData.isAvailableForPurchase ?? false,
    availableForPurchaseAt: formData.availableForPurchaseAt ?? null,
    visibleInListings: formData.visibleInListings ?? false,
    // New channels don't have warehouse/shipping data yet
    warehouseCount: "unknown",
    warehouseNames: [],
    shippingZoneCount: "unknown",
    shippingZoneNames: [],
    countryCount: "unknown",
  };
}
