import { act, renderHook } from "@testing-library/react";

import { useClearRowSelectionOnRowsChange, useRowSelection } from "./useRowSelection";

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
});

describe("useClearRowSelectionOnRowsChange", () => {
  type Row = { id: string };
  type Rows = Row[] | undefined;

  const renderListSelection = (initialRows: Rows) =>
    renderHook(
      ({ rows }: { rows: Rows }) => {
        const selection = useRowSelection();

        useClearRowSelectionOnRowsChange({ rows, clearRowSelection: selection.clearRowSelection });

        return selection;
      },
      { initialProps: { rows: initialRows } },
    );
  const shownRows: Row[] = [{ id: "product-1" }, { id: "product-2" }];

  it("clears the selection when the rows shown are reordered", () => {
    // Arrange
    const { result, rerender } = renderListSelection(shownRows);
    const clearDatagridSelection = jest.fn();

    act(() => {
      result.current.setSelectedRows(["product-1"]);
      result.current.setClearDatagridRowSelectionCallback(clearDatagridSelection);
    });

    // Act
    rerender({ rows: [{ id: "product-2" }, { id: "product-1" }] });

    // Assert
    expect(result.current.selectedRowIds).toEqual([]);
    expect(clearDatagridSelection).toHaveBeenCalledTimes(1);
  });

  it("keeps the selection when a refetch returns the same rows", () => {
    // Arrange
    const { result, rerender } = renderListSelection(shownRows);

    act(() => {
      result.current.setSelectedRows(["product-1"]);
    });

    // Act
    rerender({ rows: [{ id: "product-1" }, { id: "product-2" }] });

    // Assert
    expect(result.current.selectedRowIds).toEqual(["product-1"]);
  });

  it("keeps the selection while the query has no data and the same rows come back", () => {
    // Arrange
    const { result, rerender } = renderListSelection(shownRows);

    act(() => {
      result.current.setSelectedRows(["product-1"]);
    });

    // Act
    // e.g. the list query is skipped while a dialog reloads the filters
    rerender({ rows: undefined });
    rerender({ rows: [{ id: "product-1" }, { id: "product-2" }] });

    // Assert
    expect(result.current.selectedRowIds).toEqual(["product-1"]);
  });

  it("clears the selection when other rows come back after a gap without data", () => {
    // Arrange
    const { result, rerender } = renderListSelection(shownRows);

    act(() => {
      result.current.setSelectedRows(["product-1"]);
    });

    // Act
    rerender({ rows: undefined });
    rerender({ rows: [{ id: "product-3" }] });

    // Assert
    expect(result.current.selectedRowIds).toEqual([]);
  });
});
