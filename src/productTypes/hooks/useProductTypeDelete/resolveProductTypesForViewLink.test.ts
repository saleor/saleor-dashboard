import { resolveProductTypesForViewLink } from "./resolveProductTypesForViewLink";

describe("resolveProductTypesForViewLink", () => {
  const productType = {
    id: "UHJvZHVjdFR5cGU6MQ",
    name: "Audiobooks",
    slug: "audiobooks",
  };

  it("returns undefined when no type ids are provided", () => {
    // Arrange & Act
    const result = resolveProductTypesForViewLink([], [productType]);

    // Assert
    expect(result).toBeUndefined();
  });

  it("returns matched product types by id", () => {
    // Arrange & Act
    const result = resolveProductTypesForViewLink([productType.id], [productType]);

    // Assert
    expect(result).toEqual([productType]);
  });

  it("falls back to a single type entry when ids do not match but only one type is provided", () => {
    // Arrange & Act
    const result = resolveProductTypesForViewLink(["different-id"], [productType]);

    // Assert
    expect(result).toEqual([productType]);
  });
});
