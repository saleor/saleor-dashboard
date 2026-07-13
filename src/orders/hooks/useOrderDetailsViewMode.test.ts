import { listSettingsStorageKey } from "@dashboard/hooks/useListSettings";
import { useOrderDetailsViewMode } from "@dashboard/orders/hooks/useOrderDetailsViewMode";
import { LEGACY_ORDER_DETAILS_VIEW_MODE_KEY } from "@dashboard/orders/utils/orderDetailsViewMode";
import { ListViews } from "@dashboard/types";
import Wrapper from "@test/wrapper";
import { act, renderHook, waitFor } from "@testing-library/react";

describe("useOrderDetailsViewMode", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to matrix when no preference is stored", () => {
    // Arrange // Act
    const { result } = renderHook(() => useOrderDetailsViewMode(), { wrapper: Wrapper });

    // Assert
    expect(result.current.viewMode).toBe("matrix");
    expect(result.current.showCanceledFulfillments).toBe(false);
  });

  it("persists view mode in list settings", () => {
    // Arrange
    const { result } = renderHook(() => useOrderDetailsViewMode(), { wrapper: Wrapper });

    // Act
    act(() => {
      result.current.setViewMode("matrix");
    });

    // Assert
    expect(result.current.viewMode).toBe("matrix");

    const stored = JSON.parse(window.localStorage.getItem(listSettingsStorageKey) ?? "{}");

    expect(stored[ListViews.ORDER_DETAILS_LIST].viewMode).toBe("matrix");
  });

  it("persists canceled fulfillments toggle in list settings", () => {
    // Arrange
    const { result } = renderHook(() => useOrderDetailsViewMode(), { wrapper: Wrapper });

    // Act
    act(() => {
      result.current.setShowCanceledFulfillments(true);
    });

    // Assert
    expect(result.current.showCanceledFulfillments).toBe(true);

    const stored = JSON.parse(window.localStorage.getItem(listSettingsStorageKey) ?? "{}");

    expect(stored[ListViews.ORDER_DETAILS_LIST].showCanceledFulfillments).toBe(true);
  });

  it("migrates legacy localStorage key into list settings", async () => {
    // Arrange
    window.localStorage.setItem(LEGACY_ORDER_DETAILS_VIEW_MODE_KEY, "matrix");

    // Act
    const { result } = renderHook(() => useOrderDetailsViewMode(), { wrapper: Wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.viewMode).toBe("matrix");
    });
    expect(window.localStorage.getItem(LEGACY_ORDER_DETAILS_VIEW_MODE_KEY)).toBeNull();
  });
});
