import {
  warehouseSharesShippingZone,
  warehouseZonesGuidance,
  type ZoneChannelMembership,
  zonesUnlinkedByRemovingWarehouseChannel,
} from "./zonesUnlinkedByChannelRemoval";

type UnlinkInput = Parameters<typeof zonesUnlinkedByRemovingWarehouseChannel>[0];
type GuidanceInput = Parameters<typeof warehouseZonesGuidance>[0];

const europe: ZoneChannelMembership = { id: "z-eu", name: "Europe", channelIds: ["ch-eu"] };
const shared: ZoneChannelMembership = {
  id: "z-both",
  name: "Both",
  channelIds: ["ch-eu", "ch-us"],
};

describe("zonesUnlinkedByRemovingWarehouseChannel", () => {
  it("lists zones that shared only the channel being removed", () => {
    // Arrange
    const input: UnlinkInput = {
      removedChannelId: "ch-eu",
      remainingChannelIds: ["ch-us"],
      zones: [europe, shared],
    };

    // Act
    const unlinked = zonesUnlinkedByRemovingWarehouseChannel(input);

    // Assert
    expect(unlinked.map(zone => zone.id)).toEqual(["z-eu"]);
  });

  it("lists nothing when another channel still connects the zone", () => {
    // Arrange
    const input: UnlinkInput = {
      removedChannelId: "ch-eu",
      remainingChannelIds: ["ch-us"],
      zones: [shared],
    };

    // Act
    const unlinked = zonesUnlinkedByRemovingWarehouseChannel(input);

    // Assert
    expect(unlinked).toEqual([]);
  });
});

describe("warehouseSharesShippingZone", () => {
  it("is true only when a zone shares a channel with the warehouse", () => {
    // Arrange
    const zones: ZoneChannelMembership[] = [europe];

    // Act
    const inZoneChannel = warehouseSharesShippingZone({ zones, warehouseChannelIds: ["ch-eu"] });
    const outsideZoneChannel = warehouseSharesShippingZone({
      zones,
      warehouseChannelIds: ["ch-us"],
    });

    // Assert
    expect(inZoneChannel).toBe(true);
    expect(outsideZoneChannel).toBe(false);
  });
});

describe("warehouseZonesGuidance", () => {
  it("hides the card in the default stock mode when nothing is linked", () => {
    // Arrange
    const input: GuidanceInput = {
      legacyStockAvailability: false,
      membershipStatus: "ready",
      channelNames: [],
      zones: [],
      warehouseChannelIds: [],
    };

    // Act
    const guidance = warehouseZonesGuidance(input);

    // Assert
    expect(guidance).toEqual({ kind: "hidden" });
  });

  it("asks for a channel before a zone in the older stock mode", () => {
    // Arrange
    const input: GuidanceInput = {
      legacyStockAvailability: true,
      membershipStatus: "ready",
      channelNames: [],
      zones: [],
      warehouseChannelIds: [],
    };

    // Act
    const guidance = warehouseZonesGuidance(input);

    // Assert
    expect(guidance.kind).toBe("legacy-need-channel");
  });

  it("does not claim the warehouse has no channel when membership failed to load", () => {
    // Arrange
    const input: GuidanceInput = {
      legacyStockAvailability: true,
      membershipStatus: "error",
      channelNames: [],
      zones: [],
      warehouseChannelIds: [],
    };

    // Act
    const guidance = warehouseZonesGuidance(input);

    // Assert
    expect(guidance.kind).toBe("legacy-unknown");
  });

  it("names the channels a zone still has to cover", () => {
    // Arrange
    const input: GuidanceInput = {
      legacyStockAvailability: true,
      membershipStatus: "ready",
      channelNames: ["Europe"],
      zones: [],
      warehouseChannelIds: ["ch-eu"],
    };

    // Act
    const guidance = warehouseZonesGuidance(input);

    // Assert
    expect(guidance).toEqual({ kind: "legacy-need-zone", channelNames: ["Europe"] });
  });

  it("treats outside-channel-only zones as still needing a zone to sell", () => {
    // Arrange
    const input: GuidanceInput = {
      legacyStockAvailability: true,
      membershipStatus: "ready",
      channelNames: ["United States"],
      zones: [europe],
      warehouseChannelIds: ["ch-us"],
    };

    // Act
    const guidance = warehouseZonesGuidance(input);

    // Assert
    expect(guidance).toEqual({ kind: "legacy-need-zone", channelNames: ["United States"] });
  });

  it("does not claim a zone is missing when the loaded list is truncated", () => {
    // Arrange
    const input: GuidanceInput = {
      legacyStockAvailability: true,
      membershipStatus: "ready",
      channelNames: ["United States"],
      zones: [europe],
      warehouseChannelIds: ["ch-us"],
      zonesTruncated: true,
    };

    // Act
    const guidance = warehouseZonesGuidance(input);

    // Assert
    expect(guidance).toEqual({ kind: "legacy-linked" });
  });
});
