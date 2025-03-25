import { SearchCatalogQuery } from "@dashboard/graphql";
import { intlMock } from "@test/intl";

import { searchInCatalog } from "./catalog";

describe("NavigatorSearch / modes / searchInCatalog", () => {
  const intl = intlMock;
  const navigate = jest.fn();

  it("should return variants if search is a sku", () => {
    // Arrange
    const mockCatalog: SearchCatalogQuery = {
      productVariants: {
        edges: [
          {
            node: {
              id: "1",
              name: "Small",
              sku: "PROD-SMALL",
              product: {
                id: "prod1",
                name: "T-Shirt",
                thumbnail: null,
                category: {
                  name: "Apparel",
                },
              },
            },
          },
        ],
      },
    } as SearchCatalogQuery;

    // Act
    const results = searchInCatalog("PROD-SMALL", intl, navigate, mockCatalog);

    // Assert
    expect(results).toHaveLength(1);
    expect(results[0].searchValue).toContain("PROD-SMALL");
  });

  it("should return both product and its variant", () => {
    // Arrange
    const mockCatalog: SearchCatalogQuery = {
      products: {
        edges: [
          {
            node: {
              id: "prod1",
              name: "T-Shirt",
              thumbnail: null,
              category: {
                name: "Apparel",
              },
            },
          },
        ],
      },
      productVariants: {
        edges: [
          {
            node: {
              id: "1",
              name: "Small",
              sku: "PROD-SMALL",
              product: {
                id: "prod1",
                name: "T-Shirt",
                thumbnail: null,
                category: {
                  name: "Apparel",
                },
              },
            },
          },
        ],
      },
    } as SearchCatalogQuery;

    // Act
    const results = searchInCatalog("T-Shirt", intl, navigate, mockCatalog);

    // Assert
    expect(results).toHaveLength(2);
    expect(results[0].label).toBe("T-Shirt");
    expect(results[1].searchValue).toContain("PROD-SMALL");
  });
});
