import { rippleExpandedSubcategories } from "@dashboard/categories/ripples/expandedSubcategories";

describe("rippleExpandedSubcategories", () => {
  it("should define expandable subcategories feature ripple", () => {
    // Arrange
    // Act
    const ripple = rippleExpandedSubcategories;

    // Assert
    expect(ripple).toMatchObject({
      type: "feature",
      ID: "expandable-subcategories",
      TTL_seconds: 60 * 60 * 24 * 7,
      content: {
        oneLiner: "Expandable subcategories in category list",
      },
    });
    expect(ripple.dateAdded).toEqual(new Date(2026, 1, 8));
  });
});
