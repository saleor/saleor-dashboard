import { act, renderHook } from "@testing-library/react";

import { useProductTypePdpSchematicDismiss } from "./useProductTypePdpSchematicDismiss";

describe("useProductTypePdpSchematicDismiss", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts visible and hides after dismiss", () => {
    // Arrange
    const { result } = renderHook(() => useProductTypePdpSchematicDismiss());

    // Assert
    expect(result.current.isDismissed).toBe(false);

    // Act
    act(() => {
      result.current.dismiss();
    });

    // Assert
    expect(result.current.isDismissed).toBe(true);
  });

  it("stays dismissed across hook remounts — one preference for all product types", () => {
    // Arrange
    const { result: first } = renderHook(() => useProductTypePdpSchematicDismiss());

    // Act
    act(() => {
      first.current.dismiss();
    });

    const { result: second } = renderHook(() => useProductTypePdpSchematicDismiss());

    // Assert
    expect(second.current.isDismissed).toBe(true);
  });

  it("undismisses so the schematic can be shown again", () => {
    // Arrange
    const { result } = renderHook(() => useProductTypePdpSchematicDismiss());

    act(() => {
      result.current.dismiss();
    });
    expect(result.current.isDismissed).toBe(true);

    // Act
    act(() => {
      result.current.undismiss();
    });

    // Assert
    expect(result.current.isDismissed).toBe(false);
  });
});
