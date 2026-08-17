import {
  productListUrlForAllProducts,
  productListUrlWithChannelCatalogFilters,
} from "./productListCatalogUrls";

const channel = {
  id: "Q2hhbm5lbDox",
  name: "United States",
  slug: "us",
};

describe("productListUrlForAllProducts", () => {
  it("returns the unfiltered product list path", () => {
    // Arrange & Act
    const result = productListUrlForAllProducts();

    // Assert
    expect(result).toBe("/products/");
  });
});

describe("productListUrlWithChannelCatalogFilters", () => {
  it("builds product list URL filtered by channel only", () => {
    // Arrange & Act
    const result = productListUrlWithChannelCatalogFilters({ channel });

    // Assert
    expect(result.startsWith("/products/?")).toBe(true);
    expect(result).toContain("channel");
    expect(result).toContain("us");
  });

  it("builds product list URL filtered by channel and unpublished state", () => {
    // Arrange & Act
    const result = productListUrlWithChannelCatalogFilters({
      channel,
      isPublished: false,
    });

    // Assert
    expect(result).toContain("isPublished");
    expect(result).toContain("false");
    expect(result).toContain("us");
  });

  it("builds product list URL filtered by channel and published state", () => {
    // Arrange & Act
    const result = productListUrlWithChannelCatalogFilters({
      channel,
      isPublished: true,
    });

    // Assert
    expect(result).toContain("isPublished");
    expect(result).toContain("true");
    expect(result).toContain("us");
  });
});
