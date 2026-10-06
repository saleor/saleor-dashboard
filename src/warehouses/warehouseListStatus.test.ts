import { WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";

import {
  channelsByWarehouseFromMatrix,
  warehouseListPlace,
  warehouseListRowStatus,
  warehouseOffersPickup,
} from "./warehouseListStatus";

const brazil = { id: "brazil", name: "Brazil" };
const europe = { id: "europe", name: "Europe" };

describe("warehouseListRowStatus", () => {
  it("stays blank until membership is known", () => {
    // Arrange
    const base = {
      channels: [],
      legacyStockAvailability: false as const,
      zones: [],
      zonesTruncated: false,
    };

    // Assert
    expect(warehouseListRowStatus({ ...base, membership: "loading" }).kind).toBe("unknown");
    expect(warehouseListRowStatus({ ...base, membership: "unavailable" }).kind).toBe("unknown");
  });

  it("says the location is not in a channel before it mentions shipping zones", () => {
    // Act
    const status = warehouseListRowStatus({
      membership: "ready",
      channels: [],
      legacyStockAvailability: true,
      zones: [],
      zonesTruncated: false,
    });

    // Assert
    expect(status).toEqual({ kind: "not-in-channel" });
  });

  it("names the only channel and counts the rest", () => {
    // Assert
    expect(
      warehouseListRowStatus({
        membership: "ready",
        channels: [brazil],
        legacyStockAvailability: false,
        zones: [],
        zonesTruncated: false,
      }),
    ).toEqual({ kind: "channel", name: "Brazil" });
    expect(
      warehouseListRowStatus({
        membership: "ready",
        channels: [brazil, europe],
        legacyStockAvailability: false,
        zones: [],
        zonesTruncated: false,
      }),
    ).toEqual({ kind: "channels", count: 2 });
  });

  it("says there is no shipping zone only in the older stock mode", () => {
    // Arrange
    const inBrazil = {
      membership: "ready" as const,
      channels: [brazil],
      zones: [{ channelIds: ["europe"] }],
      zonesTruncated: false,
    };

    // Assert
    expect(warehouseListRowStatus({ ...inBrazil, legacyStockAvailability: true })).toEqual({
      kind: "no-shipping-zone",
    });
    expect(warehouseListRowStatus({ ...inBrazil, legacyStockAvailability: false })).toEqual({
      kind: "channel",
      name: "Brazil",
    });
  });

  it("does not claim there is no zone when the zone list is truncated", () => {
    // Act
    const status = warehouseListRowStatus({
      membership: "ready",
      channels: [brazil],
      legacyStockAvailability: true,
      zones: [{ channelIds: ["europe"] }],
      zonesTruncated: true,
    });

    // Assert
    expect(status).toEqual({ kind: "channel", name: "Brazil" });
  });
});

describe("channelsByWarehouseFromMatrix", () => {
  it("groups channel names by warehouse", () => {
    // Act
    const grouped = channelsByWarehouseFromMatrix({
      channels: [
        { id: "brazil", warehouses: [{ id: "wh-1" }] },
        { id: "europe", warehouses: [{ id: "wh-1" }, { id: "wh-2" }] },
      ],
      names: new Map([
        ["brazil", "Brazil"],
        ["europe", "Europe"],
      ]),
    });

    // Assert
    expect(grouped["wh-1"]).toEqual([brazil, europe]);
    expect(grouped["wh-2"]).toEqual([europe]);
  });
});

describe("warehouseListPlace", () => {
  it("puts the city before the country", () => {
    // Act
    const place = warehouseListPlace({ city: " Warsaw ", country: "Poland" });

    // Assert
    expect(place).toEqual({ city: "Warsaw", country: "Poland" });
  });

  it("uses the same capital case for cities stored in uppercase", () => {
    // Assert
    expect(warehouseListPlace({ city: "WROCŁAW", country: "Poland" })).toEqual({
      city: "Wrocław",
      country: "Poland",
    });
    expect(
      warehouseListPlace({ city: "EAST DAVIDBOROUGH", country: "United States of America" }),
    ).toEqual({
      city: "East Davidborough",
      country: "United States of America",
    });
  });

  it("keeps a single part when the other is missing", () => {
    // Assert
    expect(warehouseListPlace({ city: "Warsaw", country: "" })).toEqual({
      city: "Warsaw",
      country: "",
    });
    expect(warehouseListPlace({ city: "  ", country: "  " })).toBeNull();
  });
});

describe("warehouseOffersPickup", () => {
  it("is on for either pickup choice", () => {
    // Assert
    expect(warehouseOffersPickup(WarehouseClickAndCollectOptionEnum.DISABLED)).toBe(false);
    expect(warehouseOffersPickup(WarehouseClickAndCollectOptionEnum.LOCAL)).toBe(true);
    expect(warehouseOffersPickup(WarehouseClickAndCollectOptionEnum.ALL)).toBe(true);
  });
});
