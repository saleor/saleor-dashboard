import { formatVariantReferenceLabel } from "./formatVariantReferenceLabel";

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
});
