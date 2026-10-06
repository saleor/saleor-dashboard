import {
  resolveEligibleWarehouseIds,
  splitWarehousesByZoneChannels,
  warehousesUnlinkedByZoneChannelChange,
} from "./warehouseEligibility";

const warsaw = { id: "w-warsaw", name: "Warsaw" };
const berlin = { id: "w-berlin", name: "Berlin" };

describe("splitWarehousesByZoneChannels", () => {
  it("keeps every warehouse selectable while eligibility is loading", () => {
    // Arrange / Act
    const split = splitWarehousesByZoneChannels({
      warehouses: [warsaw, berlin],
      eligibleIds: null,
    });

    // Assert
    expect(split.eligible).toEqual([warsaw, berlin]);
    expect(split.ineligible).toEqual([]);
  });

  it("separates warehouses that share no channel with the zone", () => {
    // Arrange / Act
    const split = splitWarehousesByZoneChannels({
      warehouses: [warsaw, berlin],
      eligibleIds: new Set(["w-warsaw"]),
    });

    // Assert
    expect(split.eligible).toEqual([warsaw]);
    expect(split.ineligible).toEqual([berlin]);
  });
});

describe("resolveEligibleWarehouseIds", () => {
  it("marks every warehouse ineligible when the zone has no channels", () => {
    // Arrange / Act
    const eligible = resolveEligibleWarehouseIds({
      warehouseIds: ["w-warsaw"],
      channelIds: [],
      checkedIds: ["w-warsaw"],
      inChannelIds: ["w-warsaw"],
      failed: false,
    });

    // Assert
    expect(eligible).toEqual(new Set());
  });

  it("does not mark warehouses ineligible when the check failed", () => {
    // Arrange / Act
    const eligible = resolveEligibleWarehouseIds({
      warehouseIds: ["w-warsaw"],
      channelIds: ["ch-eu"],
      checkedIds: [],
      inChannelIds: [],
      failed: true,
    });

    // Assert
    expect(eligible).toBeNull();
  });

  it("keeps a warehouse that was not included in the check", () => {
    // Arrange / Act
    const eligible = resolveEligibleWarehouseIds({
      warehouseIds: ["w-warsaw", "w-berlin"],
      channelIds: ["ch-eu"],
      checkedIds: ["w-warsaw"],
      inChannelIds: [],
      failed: false,
    });

    // Assert
    expect(eligible).toEqual(new Set(["w-berlin"]));
  });
});

describe("warehousesUnlinkedByZoneChannelChange", () => {
  it("unlinks every warehouse when the zone would have no channels left", () => {
    // Arrange / Act
    const unlinked = warehousesUnlinkedByZoneChannelChange({
      linked: [warsaw],
      remainingChannelIds: [],
      stillSharingIds: new Set(["w-warsaw"]),
    });

    // Assert
    expect(unlinked).toEqual([warsaw]);
  });

  it("keeps a warehouse that is still in a remaining channel", () => {
    // Arrange / Act
    const unlinked = warehousesUnlinkedByZoneChannelChange({
      linked: [warsaw, berlin],
      remainingChannelIds: ["ch-eu"],
      stillSharingIds: new Set(["w-warsaw"]),
    });

    // Assert
    expect(unlinked).toEqual([berlin]);
  });
});
