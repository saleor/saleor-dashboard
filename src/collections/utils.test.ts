import { type SearchProductsQuery } from "@dashboard/graphql";

import {
  getProductsFromSearchResults,
  isProductAssignedToCollection,
  type ProductCollections,
} from "./utils";

const createProduct = (collectionIds: string[]): ProductCollections => ({
  collections: collectionIds.map(id => ({ id })),
});

describe("getProductsFromSearchResults", () => {
  it("should return empty array when searchResults is undefined", () => {
    // Arrange
    const searchResults = undefined;

    // Act
    const result = getProductsFromSearchResults(searchResults);

    // Assert
    expect(result).toEqual([]);
  });

  it("should return products from search results", () => {
    // Arrange
    const searchResults = {
      search: {
        edges: [
          {
            node: { id: 1 },
          },
          {
            node: { id: 2 },
          },
        ],
      },
    } as unknown as SearchProductsQuery;

    // Act
    const result = getProductsFromSearchResults(searchResults);

    // Assert
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });
});

describe("isProductAssignedToCollection", () => {
  const assigned = createProduct(["col-1"]);
  const inOtherCollection = createProduct(["col-2"]);
  const unassigned = createProduct([]);

  it("should treat nothing as assigned when collection id is missing", () => {
    // Act
    const result = isProductAssignedToCollection(assigned, undefined);

    // Assert
    expect(result).toBe(false);
  });

  it("should detect a product assigned to the given collection", () => {
    // Act
    const result = isProductAssignedToCollection(assigned, "col-1");

    // Assert
    expect(result).toBe(true);
  });

  it.each([
    ["the product is only in other collections", inOtherCollection],
    ["the product is in no collection", unassigned],
  ])("should return false when %s", (_, product) => {
    // Act
    const result = isProductAssignedToCollection(product, "col-1");

    // Assert
    expect(result).toBe(false);
  });

  it("should tolerate a missing collections field", () => {
    // Arrange — `collections` is nullable on the search fragment
    const product: ProductCollections = { collections: null };

    // Act
    const result = isProductAssignedToCollection(product, "col-1");

    // Assert
    expect(result).toBe(false);
  });
});
