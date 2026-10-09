import { WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";

import {
  channelsByWarehouseFromMatrix,
  type WarehouseListChannel,
  warehouseListPlace,
  warehouseListRowStatus,
  warehouseOffersPickup,
} from "./warehouseListStatus";

type RowStatusInput = Parameters<typeof warehouseListRowStatus>[0];
type MatrixInput = Parameters<typeof channelsByWarehouseFromMatrix>[0];
type PlaceAddress = Parameters<typeof warehouseListPlace>[0];

const brazil: WarehouseListChannel = { id: "brazil", name: "Brazil" };
const europe: WarehouseListChannel = { id: "europe", name: "Europe" };

describe("warehouseListRowStatus", () => {
  it("stays unknown until membership is known", () => {
    // Arrange
    const base: Omit<RowStatusInput, "membership"> = {
      channels: [],
      legacyStockAvailability: false,
      zones: [],
      zonesTruncated: false,
    };

    // Act
    const loading = warehouseListRowStatus({ ...base, membership: "loading" });
    const unavailable = warehouseListRowStatus({ ...base, membership: "unavailable" });

    // Assert
    expect(loading.kind).toBe("unknown");
    expect(unavailable.kind).toBe("unknown");
  });

  it("says the location is not in a channel before it mentions shipping zones", () => {
    // Arrange
    const input: RowStatusInput = {
      membership: "ready",
      channels: [],
      legacyStockAvailability: true,
      zones: [],
      zonesTruncated: false,
    };

    // Act
    const status = warehouseListRowStatus(input);

    // Assert
    expect(status).toEqual({ kind: "not-in-channel" });
  });

  it("names the only channel and counts the rest", () => {
    // Arrange
    const base: Omit<RowStatusInput, "channels"> = {
      membership: "ready",
      legacyStockAvailability: false,
      zones: [],
      zonesTruncated: false,
    };

    // Act
    const oneChannel = warehouseListRowStatus({ ...base, channels: [brazil] });
    const twoChannels = warehouseListRowStatus({ ...base, channels: [brazil, europe] });

    // Assert
    expect(oneChannel).toEqual({ kind: "channel", name: "Brazil" });
    expect(twoChannels).toEqual({ kind: "channels", count: 2 });
  });

  it("says there is no shipping zone only in the older stock mode", () => {
    // Arrange
    const inBrazil: Omit<RowStatusInput, "legacyStockAvailability"> = {
      membership: "ready",
      channels: [brazil],
      zones: [{ channelIds: ["europe"] }],
      zonesTruncated: false,
    };

    // Act
    const legacy = warehouseListRowStatus({ ...inBrazil, legacyStockAvailability: true });
    const direct = warehouseListRowStatus({ ...inBrazil, legacyStockAvailability: false });

    // Assert
    expect(legacy).toEqual({ kind: "no-shipping-zone" });
    expect(direct).toEqual({ kind: "channel", name: "Brazil" });
  });

  it("does not claim there is no zone when the zone list is truncated", () => {
    // Arrange
    const input: RowStatusInput = {
      membership: "ready",
      channels: [brazil],
      legacyStockAvailability: true,
      zones: [{ channelIds: ["europe"] }],
      zonesTruncated: true,
    };

    // Act
    const status = warehouseListRowStatus(input);

    // Assert
    expect(status).toEqual({ kind: "channel", name: "Brazil" });
  });
});

describe("channelsByWarehouseFromMatrix", () => {
  it("groups channel names by warehouse", () => {
    // Arrange
    const input: MatrixInput = {
      channels: [
        { id: "brazil", warehouses: [{ id: "wh-1" }] },
        { id: "europe", warehouses: [{ id: "wh-1" }, { id: "wh-2" }] },
      ],
      names: new Map([
        ["brazil", "Brazil"],
        ["europe", "Europe"],
      ]),
    };

    // Act
    const grouped = channelsByWarehouseFromMatrix(input);

    // Assert
    expect(grouped["wh-1"]).toEqual([brazil, europe]);
    expect(grouped["wh-2"]).toEqual([europe]);
  });
});

describe("warehouseListPlace", () => {
  it("puts the city before the country", () => {
    // Arrange
    const address: PlaceAddress = { city: " Warsaw ", country: "Poland" };

    // Act
    const place = warehouseListPlace(address);

    // Assert
    expect(place).toEqual({ city: "Warsaw", country: "Poland" });
  });

  it("uses the same capital case for cities stored in uppercase", () => {
    // Arrange
    const wroclaw: PlaceAddress = { city: "WROCŁAW", country: "Poland" };
    const davidborough: PlaceAddress = {
      city: "EAST DAVIDBOROUGH",
      country: "United States of America",
    };

    // Act
    const wroclawPlace = warehouseListPlace(wroclaw);
    const davidboroughPlace = warehouseListPlace(davidborough);

    // Assert
    expect(wroclawPlace).toEqual({
      city: "Wrocław",
      country: "Poland",
    });
    expect(davidboroughPlace).toEqual({
      city: "East Davidborough",
      country: "United States of America",
    });
  });

  it("keeps a single part when the other is missing", () => {
    // Arrange
    const cityOnly: PlaceAddress = { city: "Warsaw", country: "" };
    const blank: PlaceAddress = { city: "  ", country: "  " };

    // Act
    const cityOnlyPlace = warehouseListPlace(cityOnly);
    const blankPlace = warehouseListPlace(blank);

    // Assert
    expect(cityOnlyPlace).toEqual({
      city: "Warsaw",
      country: "",
    });
    expect(blankPlace).toBeNull();
  });
});

describe("warehouseOffersPickup", () => {
  it("is on for either pickup choice", () => {
    // Arrange
    const options: WarehouseClickAndCollectOptionEnum[] = [
      WarehouseClickAndCollectOptionEnum.DISABLED,
      WarehouseClickAndCollectOptionEnum.LOCAL,
      WarehouseClickAndCollectOptionEnum.ALL,
    ];

    // Act
    const offersPickup = options.map(warehouseOffersPickup);

    // Assert
    expect(offersPickup).toEqual([false, true, true]);
  });
});
