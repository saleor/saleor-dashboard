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

  it("should include the product media alt translation announcement", () => {
    // Arrange
    const rippleIds = allRipples.map(ripple => ripple.ID);

    // Act
    const hasProductMediaAltTranslationRipple = rippleIds.includes("product-media-alt-translation");

    // Assert
    expect(hasProductMediaAltTranslationRipple).toBe(true);
  });

  it("should define ripple text as messages so it can be translated", () => {
    // Arrange
    const fields = ["oneLiner", "contextual", "global"] as const;

    // Act
    const plainStrings = allRipples.flatMap(ripple =>
      fields
        .filter(field => typeof ripple.content[field] === "string")
        .map(field => `${ripple.ID}.${field}`),
    );

    // Assert
    expect(plainStrings).toEqual([]);
  });
});
