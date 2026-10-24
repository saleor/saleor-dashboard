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

/** The same ids, in any order. */
export const sameIds = (left: readonly string[], right: readonly string[]): boolean => {
  const rightIds = new Set(right);

  return left.length === right.length && left.every(id => rightIds.has(id));
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
  /** Null until a check finishes. `channelIds` are the channels that check was made for. */
  answer: { checkedIds: string[]; inChannelIds: string[]; channelIds: string[] } | null;
  failed: boolean;
}): { eligible: WarehouseChoice[]; ineligible: WarehouseChoice[] } => {
  // An answer for other channels says nothing about these ones; wait for the new check.
  const current = answer && sameIds(answer.channelIds, channelIds) ? answer : null;
  const checkable = new Set(warehouses.slice(0, checkLimit).map(warehouse => warehouse.id));
  const currented = new Set(current?.checkedIds ?? []);
  const visible =
    current && !failed
      ? warehouses.filter(warehouse => !checkable.has(warehouse.id) || currented.has(warehouse.id))
      : warehouses;
  const eligibleIds = resolveEligibleWarehouseIds({
    warehouseIds: visible.map(warehouse => warehouse.id),
    channelIds,
    checkedIds: current?.checkedIds ?? [],
    inChannelIds: current?.inChannelIds ?? [],
    failed: failed || current === null,
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

/** Saved zone warehouses the form still has selected, so this save keeps their link. */
export const warehousesKeptByForm = ({
  saved,
  selectedIds,
}: {
  saved: WarehouseChoice[];
  selectedIds: string[];
}): WarehouseChoice[] => {
  const selected = new Set(selectedIds);

  return saved
    .filter(warehouse => selected.has(warehouse.id))
    .map(warehouse => ({ id: warehouse.id, name: warehouse.name }));
};
