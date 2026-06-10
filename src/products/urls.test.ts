import { productListPath, productListUrlWithProductType } from "./urls";

describe("productListUrlWithProductType", () => {
  it("should return productListPath when product type is undefined", () => {
    // Arrange & Act
    const result = productListUrlWithProductType(undefined);

    // Assert
    expect(result).toBe(productListPath);
  });

  it("should return productListPath when product type slug is missing", () => {
    // Arrange & Act
    const result = productListUrlWithProductType({
      id: "UHJvZHVjdFR5cGU6MQ",
      name: "Apparel",
      slug: "",
    });

    // Assert
    expect(result).toBe(productListPath);
  });

  it("should build URL with conditional filter token for product type slug", () => {
    // Arrange
    const productType = {
      id: "UHJvZHVjdFR5cGU6MQ",
      name: "Apparel",
      slug: "apparel",
    };

    // Act
    const result = productListUrlWithProductType(productType);

    // Assert
    expect(result).toContain("/products?");
    expect(result).toContain("productType");
    expect(result).toContain("apparel");
  });
});
