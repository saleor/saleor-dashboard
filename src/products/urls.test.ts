import {
  productListPath,
  productListUrlWithProductType,
  productListUrlWithProductTypes,
} from "./urls";

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

describe("productListUrlWithProductTypes", () => {
  const productTypeBaseData = [
    {
      id: "UHJvZHVjdFR5cGU6MQ",
      name: "Audiobooks",
      slug: "audiobooks",
    },
  ];

  it("returns null when no product types are provided", () => {
    // Arrange & Act
    const result = productListUrlWithProductTypes(undefined);

    // Assert
    expect(result).toBeNull();
  });

  it("builds URL with conditional filter token for a single product type slug", () => {
    // Arrange & Act
    const result = productListUrlWithProductTypes(productTypeBaseData);

    // Assert
    expect(result).not.toBeNull();
    expect(result).toContain("/products?");
    expect(result).toContain("productType");
    expect(result).toContain("audiobooks");
  });

  it("builds URL with conditional filter tokens for multiple product types", () => {
    // Arrange
    const multipleProductTypeBaseData = [
      ...productTypeBaseData,
      {
        id: "UHJvZHVjdFR5cGU6Mg",
        name: "Shirts",
        slug: "shirts",
      },
    ];

    // Act
    const result = productListUrlWithProductTypes(multipleProductTypeBaseData);

    // Assert
    expect(result).not.toBeNull();

    const expectedQuery = "0[s2.productType][0]=audiobooks&0[s2.productType][1]=shirts";
    const receivedQuery = decodeURIComponent(result!.split("?")[1]);

    expect(receivedQuery).toBe(expectedQuery);
  });
});
