import { SearchProductsQuery } from "@dashboard/graphql";

import { getProductsFromSearchResults } from "./utils";

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
