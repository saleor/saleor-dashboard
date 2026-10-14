export interface ZoneChannelMembership {
  id: string;
  name: string;
  channelIds: string[];
}

/** Zone channel ids from a warehouse's shipping zone connection, and whether the list is cut off. */
export const warehouseZoneMemberships = (
  shippingZones:
    | {
        totalCount?: number | null;
        edges: Array<{ node: { id: string; name: string; channels: Array<{ id: string }> } }>;
      }
    | null
    | undefined,
): { zones: ZoneChannelMembership[]; truncated: boolean } => {
  const zones = (shippingZones?.edges ?? []).map(({ node }) => ({
    id: node.id,
    name: node.name,
    channelIds: node.channels.map(channel => channel.id),
  }));

  return {
    zones,
    truncated: (shippingZones?.totalCount ?? 0) > zones.length,
  };
};

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

/**
 * Zone names to confirm before removing a warehouse channel, or null to remove at once.
 * Pass every linked zone (as `checkChannelRemoval` does), not only a loaded page.
 */
export const channelRemovalConfirmation = ({
  removedChannelId,
  remainingChannelIds,
  zones,
}: {
  removedChannelId: string;
  remainingChannelIds: string[];
  zones: ZoneChannelMembership[];
}): { zoneNames: string[] } | null => {
  const unlinked = zonesUnlinkedByRemovingWarehouseChannel({
    removedChannelId,
    remainingChannelIds,
    zones,
  });

  return unlinked.length > 0 ? { zoneNames: unlinked.map(zone => zone.name) } : null;
};

type WarehouseZonesGuidance =
  | { kind: "loading" }
  | { kind: "hidden" }
  | { kind: "direct" }
  | { kind: "legacy-unknown" }
  | { kind: "legacy-need-channel" }
  | { kind: "legacy-need-zone"; channelNames: string[] }
  | { kind: "legacy-linked" };

/**
 * The zone is linked but shares no channel with the warehouse, so its stock is not sold there.
 * The single rule for "does this zone count": list status, checklist and zone cards all use it.
 */
export const isZoneOutsideChannels = (
  zone: { channelIds: readonly string[] },
  warehouseChannelIds: ReadonlySet<string>,
): boolean => !zone.channelIds.some(channelId => warehouseChannelIds.has(channelId));

/** True when at least one linked zone shares a channel with the warehouse. */
export const warehouseSharesShippingZone = ({
  zones,
  warehouseChannelIds,
}: {
  zones: ReadonlyArray<{ channelIds: readonly string[] }>;
  warehouseChannelIds: readonly string[];
}): boolean => {
  const channelIds = new Set(warehouseChannelIds);

  return zones.some(zone => !isZoneOutsideChannels(zone, channelIds));
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

  const hasZones = zones.length > 0;
  const sharesZone = warehouseSharesShippingZone({ zones, warehouseChannelIds });

  if (!legacyStockAvailability) {
    return hasZones ? { kind: "direct" } : { kind: "hidden" };
  }

  if (membershipStatus === "error") {
    return hasZones ? { kind: "legacy-linked" } : { kind: "legacy-unknown" };
  }

  if (warehouseChannelIds.length === 0) {
    return { kind: "legacy-need-channel" };
  }

  // Outside-channel-only zones do not make stock sellable — same as an empty list.
  if (!sharesZone && !zonesTruncated) {
    return { kind: "legacy-need-zone", channelNames };
  }

  return { kind: "legacy-linked" };
};
