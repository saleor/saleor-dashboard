import { buildChannelShippingZoneCountMap, getChannelListSetupState } from "./channelListSetup";

describe("getChannelListSetupState", () => {
  it("reports missing warehouse and shipping when both are absent", () => {
    // Arrange / Act
    const state = getChannelListSetupState({
      warehouseCount: 0,
      shippingZoneCount: 0,
    });

    // Assert
    expect(state.kind).toBe("needs_warehouse_and_shipping");
    expect(state.warehouseIsBlocker).toBe(true);
    expect(state.shippingIsBlocker).toBe(true);
    expect(state.coreReady).toBe(false);
  });

  it("reports missing warehouse when shipping status is unknown", () => {
    // Arrange / Act
    const state = getChannelListSetupState({
      warehouseCount: 0,
      shippingZoneCount: undefined,
    });

    // Assert
    expect(state.kind).toBe("needs_warehouse");
    expect(state.shippingIsBlocker).toBe(false);
    expect(state.coreReady).toBe(false);
  });

  it("reports missing shipping when warehouse is assigned", () => {
    // Arrange / Act
    const state = getChannelListSetupState({
      warehouseCount: 1,
      shippingZoneCount: 0,
    });

    // Assert
    expect(state.kind).toBe("needs_shipping");
    expect(state.coreReady).toBe(false);
  });

  it("treats unknown shipping as complete once warehouse exists", () => {
    // Arrange / Act
    const state = getChannelListSetupState({
      warehouseCount: 1,
      shippingZoneCount: undefined,
    });

    // Assert
    expect(state.kind).toBe("complete");
    expect(state.coreReady).toBe(true);
  });

  it("reports complete when warehouse and shipping are assigned", () => {
    // Arrange / Act
    const state = getChannelListSetupState({
      warehouseCount: 2,
      shippingZoneCount: 1,
    });

    // Assert
    expect(state.kind).toBe("complete");
    expect(state.coreReady).toBe(true);
  });
});

describe("buildChannelShippingZoneCountMap", () => {
  it("counts zones per channel id", () => {
    // Arrange / Act
    const counts = buildChannelShippingZoneCountMap([
      { channels: [{ id: "ch-1" }, { id: "ch-2" }] },
      { channels: [{ id: "ch-1" }] },
      { channels: [] },
    ]);

    // Assert
    expect(counts.get("ch-1")).toBe(2);
    expect(counts.get("ch-2")).toBe(1);
    expect(counts.get("ch-3")).toBeUndefined();
  });
});
