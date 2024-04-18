// @ts-strict-ignore
import {
  DatagridChange,
  DatagridChangeOpts,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import {
  ProductFragment,
  ProductVariantChannelListingAddInput,
  ProductVariantChannelListingUpdateInput,
} from "@dashboard/graphql";
import { getColumnChannel, getColumnChannelAvailability } from "@dashboard/products/utils/datagrid";

export function getUpdateVariantChannelInputs(
  data: DatagridChangeOpts,
  index: number,
  variant: ProductFragment["variants"][number],
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
    .filter(byNotNullPrice);
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
    return {
      data: {
        value: change.data ? 0 : null,
      },
      column: `channel:${availabilityChannelId}`,
    };
  }
  return change;
}

function byColumn(prev: DatagridChange[], change: DatagridChange) {
  const index = prev.findIndex(p => p.column === change.column);

  if (index > -1) {
    prev[index] = change;
    return prev;
  }

  return prev.concat(change);
}

function dataGridChangeToFlatChannel(change: DatagridChange) {
  return {
    channelId: getColumnChannel(change.column),
    price: change.data.value,
  };
}

function byNotNullPrice(change: ReturnType<typeof dataGridChangeToFlatChannel>) {
  return change.price !== null;
}

function toUpdateChannelData(variant: ProductFragment["variants"][number]) {
  return (
    acc: ProductVariantChannelListingUpdateInput,
    channel: ReturnType<typeof dataGridChangeToFlatChannel>,
  ) => {
    const variantChannel = variant.channelListings.find(c => c.channel.id === channel.channelId);

    if (channel.price === null) {
      if (variantChannel) {
        acc.remove.push(variantChannel.id);
      }

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
