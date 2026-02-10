import { rippleExpandedSubcategories } from "@dashboard/categories/ripples/expandedSubcategories";
import { allRipples } from "@dashboard/ripples/allRipples";

describe("allRipples", () => {
  it("should include expandable subcategories ripple exactly once", () => {
    // Arrange
    const matchingRipples = allRipples.filter(
      ripple => ripple.ID === rippleExpandedSubcategories.ID,
    );

    // Act
    const count = matchingRipples.length;

    // Assert
    expect(count).toBe(1);
    expect(matchingRipples[0]).toBe(rippleExpandedSubcategories);
  });
});
