import {
  resolveEligibleWarehouseIds,
  splitWarehousesByZoneChannels,
  type WarehouseChoice,
  warehousesUnlinkedByZoneChannelChange,
} from "./warehouseEligibility";

type SplitInput = Parameters<typeof splitWarehousesByZoneChannels>[0];
type ResolveInput = Parameters<typeof resolveEligibleWarehouseIds>[0];
type UnlinkInput = Parameters<typeof warehousesUnlinkedByZoneChannelChange>[0];

const warsaw: WarehouseChoice = { id: "w-warsaw", name: "Warsaw" };
const berlin: WarehouseChoice = { id: "w-berlin", name: "Berlin" };

describe("splitWarehousesByZoneChannels", () => {
  it("keeps every warehouse selectable while eligibility is loading", () => {
    // Arrange
    const input: SplitInput = {
      warehouses: [warsaw, berlin],
      eligibleIds: null,
    };

    // Act
    const split = splitWarehousesByZoneChannels(input);

    // Assert
    expect(split.eligible).toEqual([warsaw, berlin]);
    expect(split.ineligible).toEqual([]);
  });

  it("separates warehouses that share no channel with the zone", () => {
    // Arrange
    const input: SplitInput = {
      warehouses: [warsaw, berlin],
      eligibleIds: new Set(["w-warsaw"]),
    };

    // Act
    const split = splitWarehousesByZoneChannels(input);

    // Assert
    expect(split.eligible).toEqual([warsaw]);
    expect(split.ineligible).toEqual([berlin]);
  });
});

describe("resolveEligibleWarehouseIds", () => {
  it("marks every warehouse ineligible when the zone has no channels", () => {
    // Arrange
    const input: ResolveInput = {
      warehouseIds: ["w-warsaw"],
      channelIds: [],
      checkedIds: ["w-warsaw"],
      inChannelIds: ["w-warsaw"],
      failed: false,
    };

    // Act
    const eligible = resolveEligibleWarehouseIds(input);

    // Assert
    expect(eligible).toEqual(new Set());
  });

  it("does not mark warehouses ineligible when the check failed", () => {
    // Arrange
    const input: ResolveInput = {
      warehouseIds: ["w-warsaw"],
      channelIds: ["ch-eu"],
      checkedIds: [],
      inChannelIds: [],
      failed: true,
    };

    // Act
    const eligible = resolveEligibleWarehouseIds(input);

    // Assert
    expect(eligible).toBeNull();
  });

  it("keeps a warehouse that was not included in the check", () => {
    // Arrange
    const input: ResolveInput = {
      warehouseIds: ["w-warsaw", "w-berlin"],
      channelIds: ["ch-eu"],
      checkedIds: ["w-warsaw"],
      inChannelIds: [],
      failed: false,
    };

    // Act
    const eligible = resolveEligibleWarehouseIds(input);

    // Assert
    expect(eligible).toEqual(new Set(["w-berlin"]));
  });
});

describe("warehousesUnlinkedByZoneChannelChange", () => {
  it("unlinks every warehouse when the zone would have no channels left", () => {
    // Arrange
    const input: UnlinkInput = {
      linked: [warsaw],
      remainingChannelIds: [],
      stillSharingIds: new Set(["w-warsaw"]),
    };

    // Act
    const unlinked = warehousesUnlinkedByZoneChannelChange(input);

    // Assert
    expect(unlinked).toEqual([warsaw]);
  });

  it("keeps a warehouse that is still in a remaining channel", () => {
    // Arrange
    const input: UnlinkInput = {
      linked: [warsaw, berlin],
      remainingChannelIds: ["ch-eu"],
      stillSharingIds: new Set(["w-warsaw"]),
    };

    // Act
    const unlinked = warehousesUnlinkedByZoneChannelChange(input);

    // Assert
    expect(unlinked).toEqual([berlin]);
  });
});
