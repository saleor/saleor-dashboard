import {
  warehouseSharesShippingZone,
  warehouseZonesGuidance,
  zonesUnlinkedByRemovingWarehouseChannel,
} from "./zonesUnlinkedByChannelRemoval";

const europe = { id: "z-eu", name: "Europe", channelIds: ["ch-eu"] };
const shared = { id: "z-both", name: "Both", channelIds: ["ch-eu", "ch-us"] };

describe("zonesUnlinkedByRemovingWarehouseChannel", () => {
  it("lists zones that shared only the channel being removed", () => {
    // Arrange / Act
    const unlinked = zonesUnlinkedByRemovingWarehouseChannel({
      removedChannelId: "ch-eu",
      remainingChannelIds: ["ch-us"],
      zones: [europe, shared],
    });

    // Assert
    expect(unlinked.map(zone => zone.id)).toEqual(["z-eu"]);
  });

  it("lists nothing when another channel still connects the zone", () => {
    // Arrange / Act
    const unlinked = zonesUnlinkedByRemovingWarehouseChannel({
      removedChannelId: "ch-eu",
      remainingChannelIds: ["ch-us"],
      zones: [shared],
    });

    // Assert
    expect(unlinked).toEqual([]);
  });
});

describe("warehouseSharesShippingZone", () => {
  it("is true only when a zone shares a channel with the warehouse", () => {
    // Assert
    expect(
      warehouseSharesShippingZone({
        zones: [europe],
        warehouseChannelIds: ["ch-eu"],
      }),
    ).toBe(true);
    expect(
      warehouseSharesShippingZone({
        zones: [europe],
        warehouseChannelIds: ["ch-us"],
      }),
    ).toBe(false);
  });
});

describe("warehouseZonesGuidance", () => {
  it("hides the card in the default stock mode when nothing is linked", () => {
    // Arrange / Act
    const guidance = warehouseZonesGuidance({
      legacyStockAvailability: false,
      membershipStatus: "ready",
      channelNames: [],
      zones: [],
      warehouseChannelIds: [],
    });

    // Assert
    expect(guidance).toEqual({ kind: "hidden" });
  });

  it("asks for a channel before a zone in the older stock mode", () => {
    // Arrange / Act
    const guidance = warehouseZonesGuidance({
      legacyStockAvailability: true,
      membershipStatus: "ready",
      channelNames: [],
      zones: [],
      warehouseChannelIds: [],
    });

    // Assert
    expect(guidance.kind).toBe("legacy-need-channel");
  });

  it("does not claim the warehouse has no channel when membership failed to load", () => {
    // Arrange / Act
    const guidance = warehouseZonesGuidance({
      legacyStockAvailability: true,
      membershipStatus: "error",
      channelNames: [],
      zones: [],
      warehouseChannelIds: [],
    });

    // Assert
    expect(guidance.kind).toBe("legacy-unknown");
  });

  it("names the channels a zone still has to cover", () => {
    // Arrange / Act
    const guidance = warehouseZonesGuidance({
      legacyStockAvailability: true,
      membershipStatus: "ready",
      channelNames: ["Europe"],
      zones: [],
      warehouseChannelIds: ["ch-eu"],
    });

    // Assert
    expect(guidance).toEqual({ kind: "legacy-need-zone", channelNames: ["Europe"] });
  });

  it("treats outside-channel-only zones as still needing a zone to sell", () => {
    // Arrange / Act
    const guidance = warehouseZonesGuidance({
      legacyStockAvailability: true,
      membershipStatus: "ready",
      channelNames: ["United States"],
      zones: [europe],
      warehouseChannelIds: ["ch-us"],
    });

    // Assert
    expect(guidance).toEqual({ kind: "legacy-need-zone", channelNames: ["United States"] });
  });

  it("does not claim a zone is missing when the loaded list is truncated", () => {
    // Arrange / Act
    const guidance = warehouseZonesGuidance({
      legacyStockAvailability: true,
      membershipStatus: "ready",
      channelNames: ["United States"],
      zones: [europe],
      warehouseChannelIds: ["ch-us"],
      zonesTruncated: true,
    });

    // Assert
    expect(guidance).toEqual({
      kind: "legacy-linked",
      outsideChannelZoneIds: ["z-eu"],
    });
  });
});
