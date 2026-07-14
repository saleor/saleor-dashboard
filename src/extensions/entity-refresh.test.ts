import { act, renderHook } from "@testing-library/react";

import { useRegisterEntityRefresh, useTriggerEntityRefresh } from "./entity-refresh";

describe("entity-refresh", () => {
  it("triggers the registered page's refresh function", () => {
    // Arrange
    const refresh = jest.fn();

    renderHook(() => useRegisterEntityRefresh(refresh));

    const { result } = renderHook(() => useTriggerEntityRefresh());

    // Act
    act(() => result.current());

    // Assert
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("does nothing when no page is registered", () => {
    // Arrange
    const { result } = renderHook(() => useTriggerEntityRefresh());

    // Act & Assert - should not throw
    expect(() => act(() => result.current())).not.toThrow();
  });

  it("calls the latest refresh function after a re-render (no stale closure)", () => {
    // Arrange
    const firstRefresh = jest.fn();
    const secondRefresh = jest.fn();

    const { rerender } = renderHook(({ refresh }) => useRegisterEntityRefresh(refresh), {
      initialProps: { refresh: firstRefresh },
    });
    const { result } = renderHook(() => useTriggerEntityRefresh());

    // Act - simulate e.g. order 5 -> order 6 (same component re-renders with a new refetch)
    rerender({ refresh: secondRefresh });
    act(() => result.current());

    // Assert
    expect(secondRefresh).toHaveBeenCalledTimes(1);
    expect(firstRefresh).not.toHaveBeenCalled();
  });

  it("clears the slot on unmount", () => {
    // Arrange
    const refresh = jest.fn();
    const { unmount } = renderHook(() => useRegisterEntityRefresh(refresh));
    const { result } = renderHook(() => useTriggerEntityRefresh());

    // Act
    unmount();
    act(() => result.current());

    // Assert
    expect(refresh).not.toHaveBeenCalled();
  });

  it("does not clobber a newer registration when an older page unmounts", () => {
    // Arrange - page A registers, then page B mounts before A unmounts (React route transition)
    const refreshA = jest.fn();
    const refreshB = jest.fn();
    const pageA = renderHook(() => useRegisterEntityRefresh(refreshA));

    renderHook(() => useRegisterEntityRefresh(refreshB));

    const { result } = renderHook(() => useTriggerEntityRefresh());

    // Act - the older page A unmounts after B took the slot
    pageA.unmount();
    act(() => result.current());

    // Assert - B still owns the slot
    expect(refreshB).toHaveBeenCalledTimes(1);
    expect(refreshA).not.toHaveBeenCalled();
  });
});
