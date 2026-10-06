import { type ApolloClient } from "@apollo/client";
import {
  WarehouseSharesChannelsDocument,
  type WarehouseSharesChannelsQuery,
} from "@dashboard/graphql";
import { runPool } from "@dashboard/warehouses/warehouseChannelMembership";

import {
  candidateLinksForChannelEdit,
  type ChannelEditZone,
  type ChannelZoneLink,
  linksDroppedByChannelEdit,
} from "./channelEditUnlinks";

interface ChannelEditUnlink {
  warehouseName: string;
  zoneName: string;
}

const shareKey = (link: ChannelZoneLink): string =>
  `${link.warehouseId}:${[...link.otherChannelIds].sort().join(",")}`;

export const previewChannelEditUnlinks = async ({
  client,
  channelId,
  channelWarehouseIds,
  zones,
  removeWarehouseIds,
  removeZoneIds,
}: {
  client: ApolloClient<unknown>;
  channelId: string;
  channelWarehouseIds: string[];
  zones: ChannelEditZone[];
  removeWarehouseIds: string[];
  removeZoneIds: string[];
}): Promise<ChannelEditUnlink[]> => {
  const candidates = candidateLinksForChannelEdit({
    channelId,
    channelWarehouseIds,
    zones,
    removeWarehouseIds,
    removeZoneIds,
  });
  const sharesAnother = new Map<string, boolean>();
  const toProbe = candidates.filter(link => link.otherChannelIds.length > 0);

  await runPool(toProbe, 4, async link => {
    const key = shareKey(link);

    if (sharesAnother.has(key)) {
      return;
    }

    const result = await client.query<WarehouseSharesChannelsQuery>({
      query: WarehouseSharesChannelsDocument,
      variables: { warehouseId: link.warehouseId, channelIds: link.otherChannelIds },
      fetchPolicy: "network-only",
    });

    sharesAnother.set(key, (result.data?.warehouses?.totalCount ?? 0) > 0);
  });

  return linksDroppedByChannelEdit({
    candidates,
    sharesAnotherChannel: link => sharesAnother.get(shareKey(link)) ?? false,
  }).map(link => ({
    warehouseName: link.warehouseName,
    zoneName: link.zoneName,
  }));
};
