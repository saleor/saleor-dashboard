export interface ChannelZoneLink {
  zoneId: string;
  zoneName: string;
  warehouseId: string;
  warehouseName: string;
  /** Channels the zone stays in, not counting the channel being edited. */
  otherChannelIds: string[];
}

export interface ChannelEditZone {
  id: string;
  name: string;
  channelIds: string[];
  warehouses: Array<{ id: string; name: string }>;
}

/**
 * Existing warehouse–zone links that lose this channel on one side.
 * Whether they survive depends on another shared channel.
 */
export const candidateLinksForChannelEdit = ({
  channelId,
  channelWarehouseIds,
  zones,
  removeWarehouseIds,
  removeZoneIds,
}: {
  channelId: string;
  channelWarehouseIds: string[];
  zones: ChannelEditZone[];
  removeWarehouseIds: string[];
  removeZoneIds: string[];
}): ChannelZoneLink[] => {
  const onChannel = new Set(channelWarehouseIds);
  const removedWarehouses = new Set(removeWarehouseIds);
  const removedZones = new Set(removeZoneIds);
  const links: ChannelZoneLink[] = [];

  zones.forEach(zone => {
    zone.warehouses.forEach(warehouse => {
      const losesThisChannel = removedWarehouses.has(warehouse.id) || removedZones.has(zone.id);

      if (!onChannel.has(warehouse.id) || !losesThisChannel) {
        return;
      }

      links.push({
        zoneId: zone.id,
        zoneName: zone.name,
        warehouseId: warehouse.id,
        warehouseName: warehouse.name,
        otherChannelIds: zone.channelIds.filter(id => id !== channelId),
      });
    });
  });

  return links;
};

export const linksDroppedByChannelEdit = ({
  candidates,
  sharesAnotherChannel,
}: {
  candidates: ChannelZoneLink[];
  /** True when the warehouse is in at least one of the zone's other channels. */
  sharesAnotherChannel: (link: ChannelZoneLink) => boolean;
}): ChannelZoneLink[] =>
  candidates.filter(link => link.otherChannelIds.length === 0 || !sharesAnotherChannel(link));
