import { isWarehouseSetupChecklistVisible } from "./warehouseSetupChecklistVisibility";

type ChecklistVisibilityInput = Parameters<typeof isWarehouseSetupChecklistVisible>[0];

describe("isWarehouseSetupChecklistVisible", () => {
  it("stays up while the location is in no channel, even if it was skipped before", () => {
    // Arrange
    const base: ChecklistVisibilityInput = {
      membershipReady: true,
      inChannel: false,
      emphasized: false,
    };

    // Act
    const notInChannel = isWarehouseSetupChecklistVisible(base);
    const inChannel = isWarehouseSetupChecklistVisible({ ...base, inChannel: true });
    const membershipLoading = isWarehouseSetupChecklistVisible({
      ...base,
      membershipReady: false,
    });

    // Assert
    expect(notInChannel).toBe(true);
    expect(inChannel).toBe(false);
    expect(membershipLoading).toBe(false);
  });

  it("stays up in the older stock mode until a shipping zone is linked", () => {
    // Arrange
    const inChannelNoZone: ChecklistVisibilityInput = {
      membershipReady: true,
      inChannel: true,
      emphasized: false,
      shippingZoneRequired: true,
      hasShippingZone: false,
    };

    // Act
    const withoutZone = isWarehouseSetupChecklistVisible(inChannelNoZone);
    const withZone = isWarehouseSetupChecklistVisible({
      ...inChannelNoZone,
      hasShippingZone: true,
    });

    // Assert
    expect(withoutZone).toBe(true);
    expect(withZone).toBe(false);
  });

  it("comes back from the menu even after required steps are done", () => {
    // Arrange
    const hidden: ChecklistVisibilityInput = {
      membershipReady: true,
      inChannel: true,
      emphasized: false,
      shippingZoneRequired: true,
      hasShippingZone: true,
    };

    // Act
    const visibleWhenDone = isWarehouseSetupChecklistVisible(hidden);
    const reopened = isWarehouseSetupChecklistVisible({ ...hidden, emphasized: true });

    // Assert
    expect(visibleWhenDone).toBe(false);
    expect(reopened).toBe(true);
  });
});
