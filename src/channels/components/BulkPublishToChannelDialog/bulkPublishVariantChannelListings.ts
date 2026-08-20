import { type ProductVariantBulkUpdateInput } from "@dashboard/graphql";

export type BulkPublishVariantChannelListingSource = {
  channelListings?: Array<{
    id: string;
    channel: { id: string };
  }> | null;
};

/**
 * Decides what a run does to one variant's price in the target channel.
 *
 * An undefined price means "leave it alone": on an existing listing we omit the field so the
 * current price survives, and on a variant with no listing there is nothing to update — Saleor
 * requires a price to create one, so the variant stays unlisted rather than being published at an
 * invented price.
 */
export const buildBulkPublishVariantChannelListingsInput = ({
  variant,
  channelId,
  price,
  costPrice,
}: {
  variant: BulkPublishVariantChannelListingSource;
  channelId: string;
  price?: string;
  costPrice?: string;
}): ProductVariantBulkUpdateInput["channelListings"] => {
  const existingListing = variant.channelListings?.find(
    listing => listing.channel.id === channelId,
  );

  if (existingListing) {
    if (price === undefined && costPrice === undefined) {
      return undefined;
    }

    return {
      update: [
        {
          channelListing: existingListing.id,
          ...(price !== undefined ? { price } : {}),
          ...(costPrice !== undefined ? { costPrice } : {}),
        },
      ],
    };
  }

  if (price === undefined) {
    return undefined;
  }

  return {
    create: [
      {
        channelId,
        price,
        ...(costPrice !== undefined ? { costPrice } : {}),
      },
    ],
  };
};
