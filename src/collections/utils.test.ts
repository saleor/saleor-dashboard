import { type SearchProductsQuery } from "@dashboard/graphql";

import { excludeProductsInCollection, getProductsFromSearchResults } from "./utils";

type SearchProduct = Parameters<typeof excludeProductsInCollection>[0][number];

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

describe("excludeProductsInCollection", () => {
  it("should return all products when collection id is missing", () => {
    // Arrange
    const products: SearchProduct[] = [
      { id: "1", collections: [{ id: "col-1" }] },
      { id: "2", collections: [] },
    ] as SearchProduct[];

    // Act
    const result = excludeProductsInCollection(products, undefined);

    // Assert
    expect(result).toEqual(products);
  });

  it("should exclude products already assigned to the collection", () => {
    // Arrange
    const products: SearchProduct[] = [
      { id: "1", collections: [{ id: "col-1" }] },
      { id: "2", collections: [{ id: "col-2" }] },
      { id: "3", collections: [] },
    ] as SearchProduct[];

    // Act
    const result = excludeProductsInCollection(products, "col-1");

    // Assert
    expect(result).toEqual([
      { id: "2", collections: [{ id: "col-2" }] },
      { id: "3", collections: [] },
    ]);
  });
});
