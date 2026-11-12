import { type ProductVariantSibling } from "@dashboard/products/hooks/useProductVariantSiblings";

import { getVariantNeighbours } from "./variantNeighbours";

const variant = (id: string): ProductVariantSibling => ({
  __typename: "ProductVariant",
  id,
  name: `Variant ${id}`,
  sku: `SKU-${id}`,
  media: [],
});

const variants: ProductVariantSibling[] = [variant("a"), variant("b"), variant("c")];

describe("getVariantNeighbours", () => {
  it("reports the place and both neighbours of a variant in the middle of the list", () => {
    // Arrange & Act
    const result = getVariantNeighbours({ variants, currentId: "b", isFiltered: false });

    // Assert
    expect(result).toEqual({ position: 2, previousId: "a", nextId: "c", isLastLoaded: false });
  });

  it("has no previous variant for the first one", () => {
    // Arrange & Act
    const result = getVariantNeighbours({ variants, currentId: "a", isFiltered: false });

    // Assert
    expect(result).toEqual({ position: 1, previousId: null, nextId: "b", isLastLoaded: false });
  });

  it("has no next variant for the last loaded one, and says more may follow", () => {
    // Arrange & Act
    const result = getVariantNeighbours({ variants, currentId: "c", isFiltered: false });

    // Assert
    expect(result).toEqual({ position: 3, previousId: "b", nextId: null, isLastLoaded: true });
  });

  it("knows nothing about a variant outside the loaded pages", () => {
    // Arrange & Act
    const result = getVariantNeighbours({ variants, currentId: "z", isFiltered: false });

    // Assert
    expect(result).toEqual({ position: null, previousId: null, nextId: null, isLastLoaded: false });
  });

  it("does not take places from search results", () => {
    // Arrange: "b" is second in the results, which is not its place in the product
    const searchResults = [variant("x"), variant("b")];

    // Act
    const result = getVariantNeighbours({
      variants: searchResults,
      currentId: "b",
      isFiltered: true,
    });

    // Assert
    expect(result).toEqual({ position: null, previousId: null, nextId: null, isLastLoaded: false });
  });

  it("knows nothing when no variant is open (creating a variant)", () => {
    // Arrange & Act
    const result = getVariantNeighbours({ variants, currentId: undefined, isFiltered: false });

    // Assert
    expect(result).toEqual({ position: null, previousId: null, nextId: null, isLastLoaded: false });
  });
});
