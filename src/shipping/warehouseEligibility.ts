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

/**
 * Splits the picker's warehouses using the latest finished check. While a newer check loads,
 * warehouses it has not answered yet stay out of both lists, so earlier results keep their place
 * instead of the picker emptying on every search or scroll. Warehouses past `checkLimit` are never
 * checked and stay eligible.
 */
export const splitWarehousesByLatestCheck = ({
  warehouses,
  channelIds,
  checkLimit,
  answer,
  failed,
}: {
  warehouses: WarehouseChoice[];
  channelIds: string[];
  checkLimit: number;
  /** Null until a check finishes. */
  answer: { checkedIds: string[]; inChannelIds: string[] } | null;
  failed: boolean;
}): { eligible: WarehouseChoice[]; ineligible: WarehouseChoice[] } => {
  const checkable = new Set(warehouses.slice(0, checkLimit).map(warehouse => warehouse.id));
  const answered = new Set(answer?.checkedIds ?? []);
  const visible =
    answer && !failed
      ? warehouses.filter(warehouse => !checkable.has(warehouse.id) || answered.has(warehouse.id))
      : warehouses;
  const eligibleIds = resolveEligibleWarehouseIds({
    warehouseIds: visible.map(warehouse => warehouse.id),
    channelIds,
    checkedIds: answer?.checkedIds ?? [],
    inChannelIds: answer?.inChannelIds ?? [],
    failed: failed || answer === null,
  });

  return splitWarehousesByZoneChannels({ warehouses: visible, eligibleIds });
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
