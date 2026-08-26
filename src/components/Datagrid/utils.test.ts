import { getRowIdsFromSelection, preventRowClickOnSelectionCheckbox } from "./utils";

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

  it("returns no ids for an empty selection", () => {
    // Arrange & Act & Assert
    expect(getRowIdsFromSelection([], items)).toEqual([]);
  });
});
