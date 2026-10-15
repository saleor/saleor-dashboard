import { type ApolloClient } from "@apollo/client";
import {
  WarehouseShippingZonesPageDocument,
  type WarehouseShippingZonesPageQuery,
} from "@dashboard/graphql";

import {
  channelRemovalConfirmation,
  warehouseZoneMemberships,
  type ZoneChannelMembership,
} from "./zonesUnlinkedByChannelRemoval";

/** Saleor rejects `first` above 100. */
const PAGE_SIZE = 100;

/**
 * Every zone linked to the warehouse, read fresh from the API page by page. Use it before a
 * change whose side effects depend on all links, not only the first page the details show.
 */
const fetchWarehouseZoneMemberships = async ({
  client,
  warehouseId,
}: {
  client: ApolloClient<unknown>;
  warehouseId: string;
}): Promise<ZoneChannelMembership[]> => {
  const zones: ZoneChannelMembership[] = [];
  let after: string | null = null;

  do {
    const result: { data: WarehouseShippingZonesPageQuery | undefined } =
      await client.query<WarehouseShippingZonesPageQuery>({
        query: WarehouseShippingZonesPageDocument,
        variables: { id: warehouseId, first: PAGE_SIZE, after },
        fetchPolicy: "no-cache",
      });
    const connection = result.data?.warehouse?.shippingZones;

    if (!connection) {
      throw new Error("Warehouse shipping zones could not be loaded");
    }

    zones.push(...warehouseZoneMemberships(connection).zones);
    after = connection.pageInfo.hasNextPage ? (connection.pageInfo.endCursor ?? null) : null;
  } while (after);

  return zones;
};

/**
 * What to confirm before removing a warehouse channel, from a fresh read of every linked zone.
 * Null means nothing unlinks; `zoneNames: null` means the check failed, so confirm anyway:
 * Saleor still drops links that lose their only shared channel.
 */
export const checkChannelRemoval = async ({
  client,
  warehouseId,
  removedChannelId,
  remainingChannelIds,
}: {
  client: ApolloClient<unknown>;
  warehouseId: string;
  removedChannelId: string;
  remainingChannelIds: string[];
}): Promise<{ zoneNames: string[] | null } | null> => {
  try {
    const zones = await fetchWarehouseZoneMemberships({ client, warehouseId });

    return channelRemovalConfirmation({ removedChannelId, remainingChannelIds, zones });
  } catch {
    return { zoneNames: null };
  }
};
