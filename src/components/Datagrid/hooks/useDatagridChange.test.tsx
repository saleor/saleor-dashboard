// @ts-strict-ignore
import { act, renderHook } from "@testing-library/react";

import { type AvailableColumn } from "../types";
import useDatagridChange, {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "./useDatagridChange";

const columns: AvailableColumn[] = [
  { id: "name", title: "Name", width: 100 },
  { id: "sku", title: "SKU", width: 100 },
  { id: "size", title: "Size", width: 100 },
];
const GridContext = ({ children }) => {
  const stateProps = useDatagridChangeState();

  return (
    <DatagridChangeStateContext.Provider value={stateProps}>
      {children}
    </DatagridChangeStateContext.Provider>
  );
};

function setupHook(materializeTrailingGhostOnEdit = false) {
  return renderHook(
    () =>
      useDatagridChange(columns, 10, undefined, undefined, {
        materializeTrailingGhostOnEdit,
      }),
    {
      wrapper: GridContext,
    },
  );
}

describe("useDatagridChange", () => {
  it("properly adds row", () => {
    const { result } = setupHook();

    act(result.current.onRowAdded);
    expect(result.current.added).toHaveLength(1);
    expect(result.current.added[0]).toBe(10);
  });
  it("properly removes rows", () => {
    const { result } = setupHook();

    act(() => {
      result.current.onRowsRemoved([7]);
    });
    act(() => {
      result.current.onRowsRemoved([7]);
    });
    expect(result.current.removed).toHaveLength(2);
    expect(result.current.removed[0]).toBe(7);
    expect(result.current.removed[1]).toBe(8);
  });
  it("properly removes added rows", () => {
    const { result } = setupHook();

    act(result.current.onRowAdded);
    act(() => {
      result.current.onRowsRemoved([7]);
    });
    act(() => {
      result.current.onRowsRemoved([9]);
    });
    expect(result.current.added).toHaveLength(0);
    expect(result.current.removed).toHaveLength(1);
    expect(result.current.removed[0]).toBe(7);
  });
  it("properly removes added rows 2", () => {
    const { result } = setupHook();

    act(result.current.onRowAdded);
    act(result.current.onRowAdded);
    act(() => {
      result.current.onRowsRemoved([10]);
    });
    expect(result.current.added).toHaveLength(1);
    expect(result.current.added[0]).toBe(10);
    expect(result.current.removed).toHaveLength(0);
  });
  it("properly removes added rows 3", () => {
    const { result } = setupHook();

    act(result.current.onRowAdded);
    act(result.current.onRowAdded);
    act(() => {
      result.current.onRowsRemoved([10]);
    });
    act(() => {
      result.current.onRowsRemoved([10]);
    });
    expect(result.current.added).toHaveLength(0);
    expect(result.current.removed).toHaveLength(0);
  });
  it("properly updates changes after row removal", () => {
    const { result } = setupHook();

    act(() => {
      result.current.onCellEdited([1, 1], {} as any);
    });
    act(() => {
      result.current.onRowsRemoved([0]);
    });
    expect(result.current.changes.current).toHaveLength(1);
    expect(result.current.changes.current[0].row).toBe(0);
  });
  it("properly updates changes after row removal 2", () => {
    const { result } = setupHook();

    act(result.current.onRowAdded);
    act(() => {
      result.current.onCellEdited([1, 10], {} as any);
    });
    act(() => {
      result.current.onRowsRemoved([0]);
    });
    expect(result.current.changes.current).toHaveLength(1);
    expect(result.current.changes.current[0].row).toBe(9);
  });
  it("does not treat an edit of an existing row as a new variant", () => {
    // Arrange
    const { result } = setupHook(true);

    // Act
    act(() => {
      result.current.onCellEdited([0, 0], { data: "Existing" } as any);
    });

    // Assert
    expect(result.current.added).toEqual([]);
  });
  it("materializes the trailing ghost only after the first edit", () => {
    // Arrange
    const { result } = setupHook(true);

    // Act
    act(() => {
      result.current.onCellEdited([0, 10], { data: "New" } as any);
    });

    // Assert
    expect(result.current.added).toEqual([10]);
    expect(result.current.changes.current).toEqual([{ column: "name", row: 10, data: "New" }]);
  });
  it("does not rematerialize the same ghost after it is already added", () => {
    // Arrange
    const { result } = setupHook(true);

    // Act
    act(() => {
      result.current.onCellEdited([0, 10], { data: "New" } as any);
    });
    act(() => {
      result.current.onCellEdited([1, 10], { data: "SKU-1" } as any);
    });

    // Assert
    expect(result.current.added).toEqual([10]);
  });
});
