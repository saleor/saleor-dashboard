import { type useApolloClient } from "@apollo/client";
import {
  useZoneWarehouseEligibilityQuery,
  WarehousesInChannelsDocument,
  type WarehousesInChannelsQuery,
} from "@dashboard/graphql";
import {
  splitWarehousesByLatestCheck,
  type WarehouseChoice,
  warehousesUnlinkedByZoneChannelChange,
} from "@dashboard/shipping/warehouseEligibility";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { chunkList } from "@dashboard/warehouses/warehouseChannelMembership";
import { useMemo } from "react";

/** Saleor rejects `first` above 100. */
const WAREHOUSES_PAGE_LIMIT = 100;

export const useZoneWarehouseEligibility = ({
  warehouses,
  channelIds,
}: {
  warehouses: WarehouseChoice[];
  channelIds: string[];
}): {
  loading: boolean;
  eligible: WarehouseChoice[];
  ineligible: WarehouseChoice[];
} => {
  const warehouseIds = useMemo(() => warehouses.map(warehouse => warehouse.id), [warehouses]);
  // Unchecked warehouses stay selectable.
  const checkedIds = warehouseIds.slice(0, WAREHOUSES_PAGE_LIMIT);
  const skip = checkedIds.length === 0 || channelIds.length === 0;
  const query = useZoneWarehouseEligibilityQuery({
    variables: {
      ids: checkedIds,
      channels: channelIds,
      first: Math.max(checkedIds.length, 1),
    },
    skip,
    fetchPolicy: "cache-and-network",
  });
  // Searching or scrolling changes the ids; keep the last answer until the new one arrives.
  const latest = query.data ?? query.previousData;
  const split = splitWarehousesByLatestCheck({
    warehouses,
    channelIds,
    checkLimit: WAREHOUSES_PAGE_LIMIT,
    answer: latest
      ? {
          checkedIds: (mapEdgesToItems(latest.checked) ?? []).map(warehouse => warehouse.id),
          inChannelIds: (mapEdgesToItems(latest.inChannels) ?? []).map(warehouse => warehouse.id),
        }
      : null,
    failed: skip || Boolean(query.error),
  });

  return {
    loading: !skip && query.loading && !latest,
    eligible: split.eligible,
    ineligible: split.ineligible,
  };
};

export const warehousesUnlinkedByRemovingZoneChannels = async ({
  client,
  linked,
  remainingChannelIds,
}: {
  client: ReturnType<typeof useApolloClient>;
  linked: WarehouseChoice[];
  remainingChannelIds: string[];
}): Promise<WarehouseChoice[]> => {
  if (linked.length === 0) {
    return [];
  }

  if (remainingChannelIds.length === 0) {
    return linked;
  }

  const results = await Promise.all(
    chunkList(
      linked.map(warehouse => warehouse.id),
      WAREHOUSES_PAGE_LIMIT,
    ).map(ids =>
      client.query<WarehousesInChannelsQuery>({
        query: WarehousesInChannelsDocument,
        variables: {
          ids,
          channels: remainingChannelIds,
          first: ids.length,
        },
        fetchPolicy: "network-only",
      }),
    ),
  );
  const stillSharingIds = new Set(
    results.flatMap(result =>
      (mapEdgesToItems(result.data?.warehouses) ?? []).map(warehouse => warehouse.id),
    ),
  );

  return warehousesUnlinkedByZoneChannelChange({
    linked,
    remainingChannelIds,
    stillSharingIds,
  });
};
