import {
  useWarehouseChannelMembershipCountsQuery,
  useWarehouseChannelMembershipMatrixQuery,
} from "@dashboard/graphql";

import { membershipQueryPlan } from "../warehouseChannelMembership";
import {
  channelsByWarehouseFromMatrix,
  type WarehouseListChannel,
  type WarehouseListMembership,
} from "../warehouseListStatus";

const emptyChannels: Record<string, WarehouseListChannel[]> = {};

/** One matrix for the list when the shop is small enough. Otherwise the status cell stays blank. */
export const useWarehouseListMembership = (): {
  status: WarehouseListMembership;
  channelsByWarehouseId: Record<string, WarehouseListChannel[]>;
} => {
  const counts = useWarehouseChannelMembershipCountsQuery({ errorPolicy: "all" });
  const channels = counts.data?.channels;
  const warehouseCount = counts.data ? (counts.data.warehouses?.totalCount ?? null) : undefined;
  const plan =
    channels === undefined || warehouseCount === undefined
      ? undefined
      : membershipQueryPlan({ channelCount: channels.length, warehouseCount });
  const matrix = useWarehouseChannelMembershipMatrixQuery({
    skip: plan !== "fast",
    errorPolicy: "all",
  });

  if (plan === "probe") {
    return { status: "unavailable", channelsByWarehouseId: emptyChannels };
  }

  if (!channels || plan === undefined) {
    if (counts.error && !counts.data?.channels) {
      return { status: "unavailable", channelsByWarehouseId: emptyChannels };
    }

    return { status: "loading", channelsByWarehouseId: emptyChannels };
  }

  if (matrix.error || !matrix.data?.channels) {
    if (matrix.loading && !matrix.error) {
      return { status: "loading", channelsByWarehouseId: emptyChannels };
    }

    return { status: "unavailable", channelsByWarehouseId: emptyChannels };
  }

  return {
    status: "ready",
    channelsByWarehouseId: channelsByWarehouseFromMatrix({
      channels: matrix.data.channels,
      names: new Map(channels.map(channel => [channel.id, channel.name])),
    }),
  };
};
