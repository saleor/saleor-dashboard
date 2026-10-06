import { type useApolloClient } from "@apollo/client";
import {
  useWarehousesInChannelsQuery,
  useWarehouseStockAvailabilityModeQuery,
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
import { useMemo } from "react";

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
  // Saleor rejects `first` above 100. Unchecked warehouses stay selectable.
  const checkedIds = warehouseIds.slice(0, 100);
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

export const useLegacyStockAvailability = (): boolean | undefined => {
  const query = useWarehouseStockAvailabilityModeQuery();

  if (query.loading) {
    return undefined;
  }

  return query.data?.shop?.useLegacyShippingZoneStockAvailability ?? false;
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

  const result = await client.query<WarehousesInChannelsQuery>({
    query: WarehousesInChannelsDocument,
    variables: {
      ids: linked.map(warehouse => warehouse.id),
      channels: remainingChannelIds,
      first: linked.length,
    },
    fetchPolicy: "network-only",
  });
  const stillSharingIds = new Set(
    (mapEdgesToItems(result.data?.warehouses) ?? []).map(warehouse => warehouse.id),
  );

  return warehousesUnlinkedByZoneChannelChange({
    linked,
    remainingChannelIds,
    stillSharingIds,
  });
};
