import { CompactSelection, type GridSelection } from "@glideapps/glide-data-grid";

import {
  getRowIdsFromSelection,
  getVisibleGridSelection,
  preventRowClickOnSelectionCheckbox,
} from "./utils";

const selectionOf = (...rows: number[]): GridSelection => ({
  rows: rows.reduce((acc, row) => acc.add(row), CompactSelection.empty()),
  columns: CompactSelection.empty(),
});

describe("preventRowClickOnSelectionCheckbox", () => {
  it("prevents the row click on the selection checkbox column", () => {
    // Arrange & Act & Assert
    expect(preventRowClickOnSelectionCheckbox("checkbox", -1)).toBe(true);
  });

  it("allows the row click on data columns", () => {
    // Arrange & Act & Assert
    expect(preventRowClickOnSelectionCheckbox("checkbox", 0)).toBe(false);
  });

  it("allows the row click when the row marker is not a checkbox", () => {
    // Arrange & Act & Assert
    expect(preventRowClickOnSelectionCheckbox("number", -1)).toBe(false);
    expect(preventRowClickOnSelectionCheckbox("none", -1)).toBe(false);
  });
});

describe("getRowIdsFromSelection", () => {
  const items = [{ id: "first" }, { id: "second" }, { id: "third" }];

  it("resolves selected row indices to ids", () => {
    // Arrange & Act
    const ids = getRowIdsFromSelection([0, 2], items);

    // Assert
    expect(ids).toEqual(["first", "third"]);
  });

  it("keeps the order the rows were given in", () => {
    // Arrange & Act
    const ids = getRowIdsFromSelection([2, 0, 1], items);

    // Assert
    expect(ids).toEqual(["third", "first", "second"]);
  });

  it("drops indices past the end of the list instead of throwing", () => {
    // Arrange - a selection made before the list shrank still holds the old indices
    // Act
    const ids = getRowIdsFromSelection([0, 1, 2, 3, 17], items);

    // Assert
    expect(ids).toEqual(["first", "second", "third"]);
  });

  it("returns no ids when every selected index is out of range", () => {
    // Arrange & Act
    const ids = getRowIdsFromSelection([7, 8], items);

    // Assert
    expect(ids).toEqual([]);
  });

  it("returns no ids when the list is empty, undefined or null", () => {
    // Arrange & Act & Assert
    expect(getRowIdsFromSelection([0, 1], [])).toEqual([]);
    expect(getRowIdsFromSelection([0, 1], undefined)).toEqual([]);
    expect(getRowIdsFromSelection([0, 1], null)).toEqual([]);
  });

  it("skips holes so a sparse list never yields undefined ids", () => {
    // Arrange - Relay results can carry gaps while a page is being replaced
    const sparse = [{ id: "first" }, undefined, { id: "third" }] as Array<{ id: string }>;

    // Act
    const ids = getRowIdsFromSelection([0, 1, 2], sparse);

    // Assert
    expect(ids).toEqual(["first", "third"]);
  });

  it("drops empty ids so bulk actions never receive a blank string", () => {
    // Arrange
    const withBlank = [{ id: "first" }, { id: "" }, { id: "third" }];

    // Act
    const ids = getRowIdsFromSelection([0, 1, 2], withBlank);

    // Assert
    expect(ids).toEqual(["first", "third"]);
  });

  it("returns no ids for an empty selection", () => {
    // Arrange & Act & Assert
    expect(getRowIdsFromSelection([], items)).toEqual([]);
  });
});

describe("getVisibleGridSelection", () => {
  it("leaves an in-range selection untouched", () => {
    // Arrange
    const selection = selectionOf(1, 2);

    // Act
    const result = getVisibleGridSelection(selection, 5);

    // Assert
    expect(result.visibleRows).toEqual([1, 2]);
    expect(result.prunedSelection).toBeUndefined();
  });

  it("drops indices past the last rendered row", () => {
    // Arrange
    const selection = selectionOf(0, 1, 2, 3, 7, 19);

    // Act
    const result = getVisibleGridSelection(selection, 3);

    // Assert
    expect(result.visibleRows).toEqual([0, 1, 2]);
    expect(result.prunedSelection).toBeDefined();
    expect(Array.from(result.prunedSelection?.rows ?? [])).toEqual([0, 1, 2]);
  });

  it("returns no visible rows when the list emptied out", () => {
    // Arrange & Act
    const result = getVisibleGridSelection(selectionOf(1, 2), 0);

    // Assert
    expect(result.visibleRows).toEqual([]);
    expect(Array.from(result.prunedSelection?.rows ?? [])).toEqual([]);
  });

  it("clears a current cell that sits past the last rendered row", () => {
    // Arrange
    const selection: GridSelection = {
      ...selectionOf(0, 5),
      current: {
        cell: [0, 5],
        range: { x: 0, y: 5, width: 1, height: 1 },
        rangeStack: [],
      },
    };

    // Act
    const result = getVisibleGridSelection(selection, 3);

    // Assert
    expect(result.visibleRows).toEqual([0]);
    expect(result.prunedSelection?.current).toBeUndefined();
  });

  it("keeps the pruned selection stable when the list later grows", () => {
    // Arrange - page size was lowered, then raised again
    const { prunedSelection } = getVisibleGridSelection(selectionOf(0, 1, 2, 3, 7, 19), 3);

    // Act
    const afterGrow = getVisibleGridSelection(prunedSelection ?? selectionOf(), 20);

    // Assert - dead indices must not come back
    expect(afterGrow.visibleRows).toEqual([0, 1, 2]);
    expect(afterGrow.prunedSelection).toBeUndefined();
  });
});
