import { act, renderHook } from "@testing-library/react";

import { useRowSelection } from "./useRowSelection";

describe("useRowSelection", () => {
  it("should set selected rows with setSelectedRows", () => {
    // Arrange
    const { result } = renderHook(() => useRowSelection());
    const nextSelectedIds = ["cat-1", "cat-2"];

    // Act
    act(() => {
      result.current.setSelectedRows(nextSelectedIds);
    });

    // Assert
    expect(result.current.selectedRowIds).toEqual(nextSelectedIds);
  });

  it("should exclude selected rows with excludeFromSelected", () => {
    // Arrange
    const { result } = renderHook(() => useRowSelection());

    act(() => {
      result.current.setSelectedRows(["cat-1", "cat-2", "cat-3"]);
    });

    // Act
    act(() => {
      result.current.excludeFromSelected(["cat-2", "cat-4"]);
    });

    // Assert
    expect(result.current.selectedRowIds).toEqual(["cat-1", "cat-3"]);
  });

  it("should call datagrid clear callback and clear selected ids", () => {
    // Arrange
    const clearCallback = jest.fn();
    const { result } = renderHook(() => useRowSelection());

    act(() => {
      result.current.setSelectedRows(["cat-1"]);
      result.current.setClearDatagridRowSelectionCallback(clearCallback);
    });

    // Act
    act(() => {
      result.current.clearRowSelection();
    });

    // Assert
    expect(clearCallback).toHaveBeenCalledTimes(1);
    expect(result.current.selectedRowIds).toEqual([]);
  });

  it("clears the selection when the reset key changes", () => {
    // Arrange
    const clearCallback = jest.fn();
    const { result, rerender } = renderHook(
      ({ resetKey }: { resetKey: string }) => useRowSelection(undefined, { resetKey }),
      { initialProps: { resetKey: "voucher-1,voucher-2" } },
    );

    act(() => {
      result.current.setSelectedRows(["voucher-1"]);
      result.current.setClearDatagridRowSelectionCallback(clearCallback);
    });

    // Act
    rerender({ resetKey: "voucher-3,voucher-1" });

    // Assert
    expect(clearCallback).toHaveBeenCalledTimes(1);
    expect(result.current.selectedRowIds).toEqual([]);
  });

  it("keeps the selection while the reset key stays the same", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ resetKey }: { resetKey: string }) => useRowSelection(undefined, { resetKey }),
      { initialProps: { resetKey: "voucher-1,voucher-2" } },
    );

    act(() => {
      result.current.setSelectedRows(["voucher-1"]);
    });

    // Act
    rerender({ resetKey: "voucher-1,voucher-2" });

    // Assert
    expect(result.current.selectedRowIds).toEqual(["voucher-1"]);
  });
});
