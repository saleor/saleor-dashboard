import {
  type DatagridChange,
  type DatagridChangeOpts,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import {
  type ChannelListingUpdateInput,
  type ProductDetailsVariantFragment,
  type ProductVariantChannelListingAddInput,
  type ProductVariantChannelListingUpdateInput,
} from "@dashboard/graphql";
import { getColumnChannel, getColumnChannelAvailability } from "@dashboard/products/utils/datagrid";

interface ChannelChange {
  price?: number;
  isAvailableForPurchase?: boolean;
}

/**
 * Availability toggles `isAvailableForPurchase` on the listing; it never removes
 * the listing, so prices survive. Listing removal lives on the variant page.
 */
export function getUpdateVariantChannelInputs(
  data: DatagridChangeOpts,
  index: number,
  variant: Pick<ProductDetailsVariantFragment, "channelListings">,
): Required<Pick<ProductVariantChannelListingUpdateInput, "create" | "update" | "remove">> {
  const create: ProductVariantChannelListingAddInput[] = [];
  const update: ChannelListingUpdateInput[] = [];
  const changesByChannel = data.updates
    .filter(change => change.row === index)
    .reduce(collectChannelChange, new Map<string, ChannelChange>());

  changesByChannel.forEach(({ price, isAvailableForPurchase }, channelId) => {
    const listing = variant.channelListings?.find(c => c.channel.id === channelId);

    if (listing) {
      if (price !== undefined || isAvailableForPurchase !== undefined) {
        update.push({ channelListing: listing.id, price, isAvailableForPurchase });
      }

      return;
    }

    if (price !== undefined || isAvailableForPurchase === true) {
      create.push({
        channelId,
        price: price ?? 0,
        isAvailableForPurchase: isAvailableForPurchase ?? true,
      });
    }
  });

  return { create, update, remove: [] };
}

function collectChannelChange(
  acc: Map<string, ChannelChange>,
  change: DatagridChange,
): Map<string, ChannelChange> {
  const availabilityChannelId = getColumnChannelAvailability(change.column);

  if (availabilityChannelId) {
    acc.set(availabilityChannelId, {
      ...acc.get(availabilityChannelId),
      isAvailableForPurchase: !!change.data,
    });

    return acc;
  }

  const priceChannelId = getColumnChannel(change.column);
  const price = change.data?.value;

  // Clearing the price cell is ignored: listings are removed on the variant page only.
  if (priceChannelId && typeof price === "number") {
    acc.set(priceChannelId, { ...acc.get(priceChannelId), price });
  }

  return acc;
}
