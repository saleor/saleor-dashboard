import { isRowVisibleInContainer } from "./isRowVisibleInContainer";

describe("isRowVisibleInContainer", () => {
  const container: DOMRect = {
    top: 100,
    bottom: 400,
    left: 0,
    right: 200,
    width: 200,
    height: 300,
    x: 0,
    y: 100,
    toJSON: () => ({}),
  };

  it("returns true when the row fully overlaps the viewport", () => {
    // Arrange
    const row: DOMRect = { ...container, top: 150, bottom: 200, height: 50, y: 150 };

    // Act / Assert
    expect(isRowVisibleInContainer(row, container)).toBe(true);
  });

  it("returns true when the row is only partially visible", () => {
    // Arrange
    const row: DOMRect = { ...container, top: 380, bottom: 430, height: 50, y: 380 };

    // Act / Assert
    expect(isRowVisibleInContainer(row, container)).toBe(true);
  });

  it("returns false when the row is above the viewport", () => {
    // Arrange
    const row: DOMRect = { ...container, top: 20, bottom: 70, height: 50, y: 20 };

    // Act / Assert
    expect(isRowVisibleInContainer(row, container)).toBe(false);
  });

  it("returns false when the row is below the viewport", () => {
    // Arrange
    const row: DOMRect = { ...container, top: 450, bottom: 500, height: 50, y: 450 };

    // Act / Assert
    expect(isRowVisibleInContainer(row, container)).toBe(false);
  });
});
