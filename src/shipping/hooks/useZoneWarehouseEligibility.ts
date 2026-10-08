import { type useApolloClient } from "@apollo/client";
import {
  useWarehousesInChannelsQuery,
  WarehousesInChannelsDocument,
  type WarehousesInChannelsQuery,
} from "@dashboard/graphql";
import {
  resolveEligibleWarehouseIds,
  splitWarehousesByZoneChannels,
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
  const query = useWarehousesInChannelsQuery({
    variables: {
      ids: checkedIds,
      channels: channelIds,
      first: Math.max(checkedIds.length, 1),
    },
    skip,
    fetchPolicy: "cache-and-network",
  });
  const eligibleIds = resolveEligibleWarehouseIds({
    warehouseIds,
    channelIds,
    checkedIds,
    inChannelIds: (mapEdgesToItems(query.data?.warehouses) ?? []).map(warehouse => warehouse.id),
    failed: skip || Boolean(query.error) || (query.loading && !query.data),
  });
  const split = splitWarehousesByZoneChannels({ warehouses, eligibleIds });

  return {
    loading: !skip && query.loading && !query.data,
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
