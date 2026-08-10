import { buildGiftCardSaveComposition, hasGiftCardSaveComposition } from "./saveComposition";

describe("buildGiftCardSaveComposition", () => {
  it("returns tags when tags changed", () => {
    // Arrange
    const composition = buildGiftCardSaveComposition(["tags"]);

    // Assert
    expect(composition.hasTags).toBe(true);
    expect(composition.hasExpiry).toBe(false);
    expect(hasGiftCardSaveComposition(composition)).toBe(true);
  });

  it("returns expiry when expiryDate changed", () => {
    // Arrange
    const composition = buildGiftCardSaveComposition(["expiryDate"]);

    // Assert
    expect(composition.hasTags).toBe(false);
    expect(composition.hasExpiry).toBe(true);
    expect(hasGiftCardSaveComposition(composition)).toBe(true);
  });

  it("returns both segments when both fields changed", () => {
    // Arrange
    const composition = buildGiftCardSaveComposition(["tags", "expiryDate"]);

    // Assert
    expect(composition.hasTags).toBe(true);
    expect(composition.hasExpiry).toBe(true);
  });

  it("returns empty composition when nothing changed", () => {
    // Arrange
    const composition = buildGiftCardSaveComposition([]);

    // Assert
    expect(composition.hasTags).toBe(false);
    expect(composition.hasExpiry).toBe(false);
    expect(hasGiftCardSaveComposition(composition)).toBe(false);
  });

  it("ignores unrelated field names", () => {
    // Arrange
    const composition = buildGiftCardSaveComposition(["metadata"]);

    // Assert
    expect(hasGiftCardSaveComposition(composition)).toBe(false);
  });
});
