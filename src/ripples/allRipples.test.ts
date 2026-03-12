import { allRipples } from "@dashboard/ripples/allRipples";

describe("allRipples", () => {
  it("should include each ripple at most once", () => {
    // Arrange
    const rippleIds = allRipples.map(ripple => ripple.ID);

    // Act
    const duplicateIds = rippleIds.filter((id, index) => rippleIds.indexOf(id) !== index);

    // Assert
    expect(duplicateIds).toEqual([]);
  });
});
