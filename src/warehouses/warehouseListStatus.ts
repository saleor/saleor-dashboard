import { WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";

export interface WarehouseListChannel {
  id: string;
  name: string;
}

export type WarehouseListMembership = "loading" | "unavailable" | "ready";

export type WarehouseListRowStatus =
  | { kind: "unknown" }
  | { kind: "not-in-channel" }
  | { kind: "channel"; name: string }
  | { kind: "channels"; count: number }
  | { kind: "no-shipping-zone" };

/** One place style for the list: each city word starts with a capital, the rest is lowercase. */
const toTitleCase = (value: string): string =>
  value
    .split(/(\s+|-)/)
    .map(part => {
      if (!part || /^\s+$/.test(part) || part === "-") {
        return part;
      }

      const lower = part.toLocaleLowerCase();

      return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
    })
    .join("");

/** City then country, so a list of locations can be told apart. */
export const warehouseListPlace = (
  address: { city: string; country: string } | null | undefined,
): { city: string; country: string } | null => {
  const city = toTitleCase(address?.city.trim() ?? "");
  const country = address?.country.trim() ?? "";

  if (!city && !country) {
    return null;
  }

  return { city, country };
};

/** Customers can collect an order at this location. Where the items come from stays on the warehouse page. */
export const warehouseOffersPickup = (option: WarehouseClickAndCollectOptionEnum): boolean =>
  option === WarehouseClickAndCollectOptionEnum.LOCAL ||
  option === WarehouseClickAndCollectOptionEnum.ALL;

export const channelsByWarehouseFromMatrix = ({
  channels,
  names,
}: {
  channels: Array<{ id: string; warehouses: Array<{ id: string }> }>;
  names: ReadonlyMap<string, string>;
}): Record<string, WarehouseListChannel[]> => {
  const byWarehouse: Record<string, WarehouseListChannel[]> = {};

  channels.forEach(channel => {
    const name = names.get(channel.id) ?? channel.id;

    channel.warehouses.forEach(warehouse => {
      const current = byWarehouse[warehouse.id] ?? [];

      current.push({ id: channel.id, name });
      byWarehouse[warehouse.id] = current;
    });
  });

  return byWarehouse;
};

/**
 * Whether stock at this location can be sold.
 * An unknown membership stays blank. A truncated zone list is not treated as "no zone".
 */
export const warehouseListRowStatus = ({
  membership,
  channels,
  legacyStockAvailability,
  zones,
  zonesTruncated,
}: {
  membership: WarehouseListMembership;
  channels: readonly WarehouseListChannel[];
  /** Undefined while the shop stock mode is still loading. */
  legacyStockAvailability: boolean | undefined;
  zones: ReadonlyArray<{ channelIds: readonly string[] }>;
  zonesTruncated: boolean;
}): WarehouseListRowStatus => {
  if (membership !== "ready") {
    return { kind: "unknown" };
  }

  if (channels.length === 0) {
    return { kind: "not-in-channel" };
  }

  if (legacyStockAvailability === true && !zonesTruncated) {
    const channelIds = new Set(channels.map(channel => channel.id));
    const sharesZone = zones.some(zone => zone.channelIds.some(id => channelIds.has(id)));

    if (!sharesZone) {
      return { kind: "no-shipping-zone" };
    }
  }

  if (channels.length === 1) {
    return { kind: "channel", name: channels[0].name };
  }

  return { kind: "channels", count: channels.length };
};
