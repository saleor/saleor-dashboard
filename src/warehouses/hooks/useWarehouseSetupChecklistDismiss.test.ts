import { act, renderHook } from "@testing-library/react";

import {
  isWarehouseSetupChecklistVisible,
  useWarehouseSetupChecklistDismiss,
} from "./useWarehouseSetupChecklistDismiss";

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

describe("useWarehouseSetupChecklistDismiss", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts visible and hides after dismiss for that warehouse", () => {
    // Arrange
    const { result } = renderHook(() => useWarehouseSetupChecklistDismiss("warehouse-1"));

    // Assert
    expect(result.current.isDismissed).toBe(false);

    // Act
    act(() => {
      result.current.dismiss(0);
    });

    // Assert
    expect(result.current.isDismissed).toBe(true);
  });

  it("does not dismiss other warehouses", () => {
    // Arrange
    const { result: first } = renderHook(() => useWarehouseSetupChecklistDismiss("warehouse-1"));

    // Act
    act(() => {
      first.current.dismiss(0);
    });

    const { result: second } = renderHook(() => useWarehouseSetupChecklistDismiss("warehouse-2"));

    // Assert
    expect(second.current.isDismissed).toBe(false);
  });

  it("undismisses so the checklist can be shown again", () => {
    // Arrange
    const { result } = renderHook(() => useWarehouseSetupChecklistDismiss("warehouse-1"));

    act(() => {
      result.current.dismiss(0);
    });
    expect(result.current.isDismissed).toBe(true);

    // Act
    act(() => {
      result.current.undismiss();
    });

    // Assert
    expect(result.current.isDismissed).toBe(false);
  });

  it("ignores a stored value that is not a list of ids", () => {
    // Arrange
    localStorage.setItem("warehouse-setup-checklist-dismissed-ids", JSON.stringify({ bad: true }));

    // Act
    const { result } = renderHook(() => useWarehouseSetupChecklistDismiss("warehouse-1"));

    // Assert
    expect(result.current.isDismissed).toBe(false);

    // Act
    act(() => {
      result.current.dismiss(0);
    });

    // Assert
    expect(result.current.isDismissed).toBe(true);
  });
});
