import { savedReferencePosition } from "./savedReferencePosition";

describe("savedReferencePosition", () => {
  it("keeps the saved number after the row has moved", () => {
    // Arrange
    const provisional = new Map<string, number>();
    const savedIds = ["p1", "p2", "p3"];

    // Act
    const moved = savedReferencePosition({ id: "p3", savedIds, provisional });
    const shifted = savedReferencePosition({ id: "p1", savedIds, provisional });

    // Assert
    expect(moved).toBe(3);
    expect(shifted).toBe(1);
  });

  it("assigns a stable number to a reference added since the last save", () => {
    // Arrange
    const provisional = new Map<string, number>();
    const savedIds = ["p1", "p2"];

    // Act
    const first = savedReferencePosition({ id: "new", savedIds, provisional });
    const again = savedReferencePosition({ id: "new", savedIds, provisional });

    // Assert
    expect(first).toBe(3);
    expect(again).toBe(3);
  });

  it("returns null when there is no saved order", () => {
    // Arrange
    const provisional = new Map<string, number>();

    // Act
    const position = savedReferencePosition({
      id: "p1",
      savedIds: undefined,
      provisional,
    });

    // Assert
    expect(position).toBeNull();
  });
});
