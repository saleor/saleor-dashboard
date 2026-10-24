import {
  formatVariantReferenceLabel,
  getVariantReferenceLine,
  splitVariantReferenceLabel,
} from "./formatVariantReferenceLabel";

describe("formatVariantReferenceLabel", () => {
  it("joins product and variant the same way saved values do", () => {
    // Arrange // Act // Assert
    expect(formatVariantReferenceLabel("White Plimsolls", "44 / White")).toBe(
      "White Plimsolls: 44 / White",
    );
  });

  it("returns the side that exists when the other is empty", () => {
    // Arrange // Act // Assert
    expect(formatVariantReferenceLabel("Bottle", "")).toBe("Bottle");
    expect(formatVariantReferenceLabel("", "700ml")).toBe("700ml");
  });

  it("splits a saved product and variant label", () => {
    // Arrange // Act // Assert
    expect(splitVariantReferenceLabel("White Plimsolls: 44 / White")).toEqual({
      productName: "White Plimsolls",
      variantName: "44 / White",
    });
    expect(splitVariantReferenceLabel("Andean Golden Banana: 700ml")).toEqual({
      productName: "Andean Golden Banana",
      variantName: "700ml",
    });
    expect(splitVariantReferenceLabel("Plain product")).toBeNull();
  });
});

describe("getVariantReferenceLine", () => {
  it("prefers primary and caption when both are set", () => {
    // Arrange // Act // Assert
    expect(
      getVariantReferenceLine({
        label: "White Plimsolls: 44 / White",
        primary: "44 / White",
        caption: "White Plimsolls",
      }),
    ).toEqual({
      variantName: "44 / White",
      productName: "White Plimsolls",
    });
  });

  it("splits a saved combined label when primary is missing", () => {
    // Arrange // Act // Assert
    expect(getVariantReferenceLine({ label: "White Plimsolls: 44 / White" })).toEqual({
      variantName: "44 / White",
      productName: "White Plimsolls",
    });
  });

  it("uses caption when the label is already the variant name", () => {
    // Arrange // Act // Assert
    expect(
      getVariantReferenceLine({
        label: "44 / White",
        caption: "White Plimsolls",
      }),
    ).toEqual({
      variantName: "44 / White",
      productName: "White Plimsolls",
    });
  });
});
