export interface ZoneChannelMembership {
  id: string;
  name: string;
  channelIds: string[];
}

/**
 * Zones that would lose their only shared channel with this warehouse.
 * Saleor deletes that link with no error when the channel is removed.
 */
export const zonesUnlinkedByRemovingWarehouseChannel = ({
  removedChannelId,
  remainingChannelIds,
  zones,
}: {
  removedChannelId: string;
  remainingChannelIds: string[];
  zones: ZoneChannelMembership[];
}): ZoneChannelMembership[] => {
  const remaining = new Set(remainingChannelIds);

  return zones.filter(zone => {
    const sharesRemoved = zone.channelIds.includes(removedChannelId);
    const sharesRemaining = zone.channelIds.some(channelId => remaining.has(channelId));

    return sharesRemoved && !sharesRemaining;
  });
};

type WarehouseZonesGuidance =
  | { kind: "loading" }
  | { kind: "hidden" }
  | { kind: "direct"; outsideChannelZoneIds: string[] }
  | { kind: "legacy-unknown" }
  | { kind: "legacy-need-channel" }
  | { kind: "legacy-need-zone"; channelNames: string[] }
  | { kind: "legacy-linked"; outsideChannelZoneIds: string[] };

export const warehouseZonesGuidance = ({
  legacyStockAvailability,
  hasZones,
  membershipStatus,
  channelNames,
  zones,
  warehouseChannelIds,
}: {
  /** Undefined while the shop stock mode is still loading. */
  legacyStockAvailability: boolean | undefined;
  hasZones: boolean;
  membershipStatus: "loading" | "error" | "ready";
  channelNames: string[];
  zones: ZoneChannelMembership[];
  warehouseChannelIds: string[];
}): WarehouseZonesGuidance => {
  if (legacyStockAvailability === undefined || membershipStatus === "loading") {
    return { kind: "loading" };
  }

  const outsideChannelZoneIds = zones
    .filter(zone => !zone.channelIds.some(channelId => warehouseChannelIds.includes(channelId)))
    .map(zone => zone.id);

  if (!legacyStockAvailability) {
    return hasZones ? { kind: "direct", outsideChannelZoneIds: [] } : { kind: "hidden" };
  }

  if (membershipStatus === "error") {
    return hasZones
      ? { kind: "legacy-linked", outsideChannelZoneIds: [] }
      : { kind: "legacy-unknown" };
  }

  if (warehouseChannelIds.length === 0) {
    return { kind: "legacy-need-channel" };
  }

  if (!hasZones) {
    return { kind: "legacy-need-zone", channelNames };
  }

  return { kind: "legacy-linked", outsideChannelZoneIds };
};
