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

/** True when at least one linked zone shares a channel with the warehouse. */
export const warehouseSharesShippingZone = ({
  zones,
  warehouseChannelIds,
}: {
  zones: ReadonlyArray<{ channelIds: readonly string[] }>;
  warehouseChannelIds: readonly string[];
}): boolean => {
  const channelIds = new Set(warehouseChannelIds);

  return zones.some(zone => zone.channelIds.some(channelId => channelIds.has(channelId)));
};

export const warehouseZonesGuidance = ({
  legacyStockAvailability,
  membershipStatus,
  channelNames,
  zones,
  warehouseChannelIds,
  zonesTruncated = false,
}: {
  /** Undefined while the shop stock mode is still loading. */
  legacyStockAvailability: boolean | undefined;
  membershipStatus: "loading" | "error" | "ready";
  channelNames: string[];
  zones: ZoneChannelMembership[];
  warehouseChannelIds: string[];
  /**
   * When the loaded page is incomplete, do not claim “need a zone” — a usable
   * zone may exist on a later page (same rule as the warehouse list).
   */
  zonesTruncated?: boolean;
}): WarehouseZonesGuidance => {
  if (legacyStockAvailability === undefined || membershipStatus === "loading") {
    return { kind: "loading" };
  }

  const outsideChannelZoneIds = zones
    .filter(zone => !zone.channelIds.some(channelId => warehouseChannelIds.includes(channelId)))
    .map(zone => zone.id);
  const hasZones = zones.length > 0;
  const sharesZone = warehouseSharesShippingZone({ zones, warehouseChannelIds });

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

  // Outside-channel-only zones do not make stock sellable — same as an empty list.
  if (!sharesZone && !zonesTruncated) {
    return { kind: "legacy-need-zone", channelNames };
  }

  return { kind: "legacy-linked", outsideChannelZoneIds };
};
