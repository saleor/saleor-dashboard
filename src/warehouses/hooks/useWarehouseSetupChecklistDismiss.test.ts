import { act, renderHook } from "@testing-library/react";

import {
  isWarehouseSetupChecklistVisible,
  useWarehouseSetupChecklistDismiss,
} from "./useWarehouseSetupChecklistDismiss";

describe("isWarehouseSetupChecklistVisible", () => {
  it("stays up while the location is in no channel, even if it was skipped before", () => {
    // Arrange
    const base = {
      membershipReady: true,
      inChannel: false,
      emphasized: false,
    };

    // Assert
    expect(isWarehouseSetupChecklistVisible(base)).toBe(true);
    expect(isWarehouseSetupChecklistVisible({ ...base, inChannel: true })).toBe(false);
    expect(isWarehouseSetupChecklistVisible({ ...base, membershipReady: false })).toBe(false);
  });

  it("stays up in the older stock mode until a shipping zone is linked", () => {
    // Arrange
    const inChannelNoZone = {
      membershipReady: true,
      inChannel: true,
      emphasized: false,
      shippingZoneRequired: true,
      hasShippingZone: false,
    };

    // Assert
    expect(isWarehouseSetupChecklistVisible(inChannelNoZone)).toBe(true);
    expect(isWarehouseSetupChecklistVisible({ ...inChannelNoZone, hasShippingZone: true })).toBe(
      false,
    );
  });

  it("comes back from the menu even after required steps are done", () => {
    // Arrange
    const hidden = {
      membershipReady: true,
      inChannel: true,
      emphasized: false,
      shippingZoneRequired: true,
      hasShippingZone: true,
    };

    // Act
    const reopened = isWarehouseSetupChecklistVisible({ ...hidden, emphasized: true });

    // Assert
    expect(isWarehouseSetupChecklistVisible(hidden)).toBe(false);
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

    act(() => {
      result.current.dismiss(0);
    });

    expect(result.current.isDismissed).toBe(true);
  });
});
