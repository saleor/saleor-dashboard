import { type IChannelPriceArgs, type VariantChannelPriceData } from "@dashboard/channels/utils";
import {
  type ProductVariantCreateDataQuery,
  type ProductVariantFragment,
} from "@dashboard/graphql";
import { type FormsetData } from "@dashboard/hooks/useFormset";

/**
 * Counts channel listings for a variant. The result is fed into the
 * "Listed on N of M channels" subtitle on the variant pricing card.
 *
 * Despite the legacy "Availability" naming, this does NOT measure customer-facing
 * availability:
 *  - `publishedInChannelsCount`: how many of the form's selected channel
 *    listings (`listings`) the variant's parent product is currently listed in.
 *  - `availableChannelsCount`: how many channel listings the variant's parent
 *    product has in total (the denominator).
 *
 * Customer-facing availability in Saleor 3.23+ is computed server-side from the
 * stock-availability mode (legacy: shipping zones; direct: warehouse-channel
 * link), variant pricing, and channel publication — none of which are
 * inspected here. Do not use this helper to communicate purchasability to admins.
 */
export const getAvailabilityCountForVariant = (
  item: ProductVariantFragment,
  listings: FormsetData<VariantChannelPriceData, IChannelPriceArgs>,
) => {
  const allAvailableChannelsListings = item?.product?.channelListings?.map(
    ({ channel: { id } }) => id,
  );
  const selectedChannelListings = allAvailableChannelsListings?.filter(listing =>
    listings.some(lst => lst.id === listing),
  );

  return {
    publishedInChannelsCount: selectedChannelListings?.length,
    availableChannelsCount: allAvailableChannelsListings?.length,
  };
};

/**
 * Counts channel listings for a product. See `getAvailabilityCountForVariant`
 * for the semantics caveat — this helper measures channel listings, not stock
 * or customer-facing availability.
 */
export const getAvailabilityCountForProduct = (
  item: ProductVariantCreateDataQuery["product"],
  listings: FormsetData<VariantChannelPriceData, IChannelPriceArgs>,
) => {
  const listingsIds = listings.map(({ id }) => id);
  const publishedInChannelsListings = item?.channelListings?.filter(lst =>
    listingsIds.includes(lst.channel.id),
  );

  return {
    publishedInChannelsCount: publishedInChannelsListings?.length,
    availableChannelsCount: item?.channelListings?.length,
  };
};
