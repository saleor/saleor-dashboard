// @ts-strict-ignore
import {
  type DatagridChange,
  type DatagridChangeOpts,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import {
  type ProductDetailsVariantFragment,
  type ProductVariantChannelListingAddInput,
  type ProductVariantChannelListingUpdateInput,
} from "@dashboard/graphql";
import { getColumnChannel, getColumnChannelAvailability } from "@dashboard/products/utils/datagrid";

/**
 * Availability toggles are mapped onto the channel column pipeline.
 * - `price: null` → remove channel listing
 * - `price: number` → create/update listing price
 * - `price: undefined` + `ensureListed: true` → list in channel without overwriting
 *   existing price/costPrice (re-enable after untick)
 */
type FlatChannelChange = {
  channelId: string;
  price: number | null | undefined;
  ensureListed?: boolean;
};

export function getUpdateVariantChannelInputs(
  data: DatagridChangeOpts,
  index: number,
  variant: ProductDetailsVariantFragment,
): ProductVariantChannelListingUpdateInput {
  return data.updates
    .filter(byCurrentRowByIndex(index))
    .map(availabilityToChannelColumn)
    .filter(byChannelColumn)
    .reduce(byColumn, [])
    .map(dataGridChangeToFlatChannel)
    .reduce<ProductVariantChannelListingUpdateInput>(toUpdateChannelData(variant), {
      create: [],
      remove: [],
      update: [],
    });
}

export function getVariantChannelsInputs(
  data: DatagridChangeOpts,
  index: number,
): ProductVariantChannelListingAddInput[] {
  return data.updates
    .filter(byCurrentRowByIndex(index))
    .map(availabilityToChannelColumn)
    .filter(byChannelColumn)
    .reduce(byColumn, [])
    .map(dataGridChangeToFlatChannel)
    .filter(byListedChannel)
    .map(flatChannelToCreateInput);
}

function byCurrentRowByIndex(index: number) {
  return (change: DatagridChange) => {
    return change.row === index;
  };
}

function byChannelColumn(change: DatagridChange) {
  return getColumnChannel(change.column);
}

function availabilityToChannelColumn(change: DatagridChange) {
  const availabilityChannelId = getColumnChannelAvailability(change.column);

  if (availabilityChannelId) {
    if (change.data) {
      // Re-enable / list in channel — do not force price to 0
      return {
        data: {
          ensureListed: true,
        },
        column: `channel:${availabilityChannelId}`,
      };
    }

    return {
      data: {
        value: null,
      },
      column: `channel:${availabilityChannelId}`,
    };
  }

  return change;
}

function byColumn(prev: DatagridChange[], change: DatagridChange) {
  const index = prev.findIndex(p => p.column === change.column);

  if (index > -1) {
    // Availability and price both map to `channel:{id}`. Prefer an explicit
    // price edit over ensureListed so toggling Available after editing price
    // does not drop the new amount.
    prev[index] = mergeChannelColumnChanges(prev[index], change);

    return prev;
  }

  return prev.concat(change);
}

function mergeChannelColumnChanges(
  existing: DatagridChange,
  incoming: DatagridChange,
): DatagridChange {
  const existingEnsuresListed = !!existing.data?.ensureListed;
  const incomingEnsuresListed = !!incoming.data?.ensureListed;
  const existingPrice = existing.data?.value;
  const incomingPrice = incoming.data?.value;

  // Explicit unlist always wins when it is the latest intent
  if (incomingPrice === null && !incomingEnsuresListed) {
    return incoming;
  }

  // ensureListed after a price edit → keep the edited price (create/update)
  if (incomingEnsuresListed && typeof existingPrice === "number") {
    return existing;
  }

  // price edit after ensureListed → keep the price edit
  if (existingEnsuresListed && typeof incomingPrice === "number") {
    return incoming;
  }

  return incoming;
}

function dataGridChangeToFlatChannel(change: DatagridChange): FlatChannelChange {
  if (change.data?.ensureListed) {
    return {
      channelId: getColumnChannel(change.column),
      price: undefined,
      ensureListed: true,
    };
  }

  return {
    channelId: getColumnChannel(change.column),
    price: change.data.value,
  };
}

function byListedChannel(change: FlatChannelChange) {
  return change.price !== null;
}

function flatChannelToCreateInput(change: FlatChannelChange): ProductVariantChannelListingAddInput {
  return {
    channelId: change.channelId,
    // New listings require a price; default to 0 when only availability was toggled on
    price: change.price ?? 0,
  };
}

function toUpdateChannelData(variant: ProductDetailsVariantFragment) {
  return (acc: ProductVariantChannelListingUpdateInput, channel: FlatChannelChange) => {
    const variantChannel = variant.channelListings.find(c => c.channel.id === channel.channelId);

    if (channel.price === null) {
      if (variantChannel) {
        acc.remove.push(variantChannel.id);
      }

      return acc;
    }

    if (channel.ensureListed) {
      if (!variantChannel) {
        acc.create.push({
          channelId: channel.channelId,
          price: 0,
        });
      }
      // Listing already exists → no-op so price and costPrice are preserved

      return acc;
    }

    if (variantChannel) {
      acc.update.push({
        channelListing: variantChannel.id,
        price: channel.price,
      });
    } else {
      acc.create.push({
        channelId: channel.channelId,
        price: channel.price,
      });
    }

    return acc;
  };
}
