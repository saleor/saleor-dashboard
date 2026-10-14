import { type useApolloClient } from "@apollo/client";
import {
  useZoneWarehouseEligibilityQuery,
  WarehousesInChannelsDocument,
  type WarehousesInChannelsQuery,
  type ZoneWarehouseEligibilityQuery,
} from "@dashboard/graphql";
import {
  sameIds,
  splitWarehousesByLatestCheck,
  type WarehouseChoice,
  warehousesUnlinkedByZoneChannelChange,
} from "@dashboard/shipping/warehouseEligibility";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { chunkList } from "@dashboard/warehouses/warehouseChannelMembership";
import { useMemo, useState } from "react";

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
  const [previous, setPrevious] = useState<{
    data: ZoneWarehouseEligibilityQuery;
    channelIds: string[];
  } | null>(null);

  // `query.data`, when set, answers the current variables, so it belongs to these channels.
  // Remember it during render (React's pattern for keeping a value from earlier renders).
  if (query.data && previous?.data !== query.data) {
    setPrevious({ data: query.data, channelIds });
  }

  // Searching or scrolling changes the ids; keep the last answer until the new one arrives.
  // The split drops it when it was made for other channels.
  const latest = query.data ? { data: query.data, channelIds } : previous;
  const split = splitWarehousesByLatestCheck({
    warehouses,
    channelIds,
    checkLimit: WAREHOUSES_PAGE_LIMIT,
    answer: latest
      ? {
          checkedIds: (mapEdgesToItems(latest.data.checked) ?? []).map(warehouse => warehouse.id),
          inChannelIds: (mapEdgesToItems(latest.data.inChannels) ?? []).map(
            warehouse => warehouse.id,
          ),
          channelIds: latest.channelIds,
        }
      : null,
    failed: skip || Boolean(query.error),
  });

  return {
    loading: !skip && query.loading && !(latest && sameIds(latest.channelIds, channelIds)),
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
