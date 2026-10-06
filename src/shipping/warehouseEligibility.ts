export interface WarehouseChoice {
  id: string;
  name: string;
}

/**
 * A warehouse can be linked to a zone only when they share a channel.
 * `eligibleIds` is null while that check is still loading, so the picker stays open.
 */
export const splitWarehousesByZoneChannels = ({
  warehouses,
  eligibleIds,
}: {
  warehouses: WarehouseChoice[];
  eligibleIds: Set<string> | null;
}): { eligible: WarehouseChoice[]; ineligible: WarehouseChoice[] } => {
  if (eligibleIds === null) {
    return { eligible: warehouses, ineligible: [] };
  }

  return {
    eligible: warehouses.filter(warehouse => eligibleIds.has(warehouse.id)),
    ineligible: warehouses.filter(warehouse => !eligibleIds.has(warehouse.id)),
  };
};

/**
 * Warehouses the zone may link.
 * `null` means the check failed, so none are marked ineligible.
 * Ids that were not checked stay eligible.
 */
export const resolveEligibleWarehouseIds = ({
  warehouseIds,
  channelIds,
  checkedIds,
  inChannelIds,
  failed,
}: {
  warehouseIds: string[];
  channelIds: string[];
  checkedIds: string[];
  inChannelIds: string[];
  failed: boolean;
}): Set<string> | null => {
  if (channelIds.length === 0) {
    return new Set();
  }

  if (failed) {
    return null;
  }

  const checked = new Set(checkedIds);
  const inChannel = new Set(inChannelIds);

  return new Set(warehouseIds.filter(id => !checked.has(id) || inChannel.has(id)));
};

/** Warehouses linked to the zone that would no longer share a channel after this save. */
export const warehousesUnlinkedByZoneChannelChange = ({
  linked,
  remainingChannelIds,
  stillSharingIds,
}: {
  linked: WarehouseChoice[];
  remainingChannelIds: string[];
  /** Warehouses that are in at least one remaining channel. Ignored when none remain. */
  stillSharingIds: Set<string>;
}): WarehouseChoice[] => {
  if (remainingChannelIds.length === 0) {
    return linked;
  }

  return linked.filter(warehouse => !stillSharingIds.has(warehouse.id));
};
