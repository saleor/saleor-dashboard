import { mapProductToDiagnosticData, ProductDiagnosticInput } from "./mapProductToDiagnosticData";

/**
 * Factory function to create test product input data.
 */
const createTestProduct = (
  overrides: Partial<ProductDiagnosticInput> = {},
): ProductDiagnosticInput => ({
  id: "test-product",
  name: "Test Product",
  productType: {
    isShippingRequired: true,
  },
  channelListings: [],
  variants: [],
  ...overrides,
});

describe("mapProductToDiagnosticData", () => {
  it("should return null when product is null", () => {
    // Act
    const result = mapProductToDiagnosticData(null);

    // Assert
    expect(result).toBeNull();
  });

  it("should return null when product is undefined", () => {
    // Act
    const result = mapProductToDiagnosticData(undefined);

    // Assert
    expect(result).toBeNull();
  });

  it("should map product data to diagnostic structure with isShippingRequired", () => {
    // Arrange
    const product: ProductDiagnosticInput = {
      id: "product-1",
      name: "Test Product",
      productType: {
        isShippingRequired: true,
      },
      channelListings: [
        {
          channel: {
            id: "channel-1",
            name: "Default Channel",
            slug: "default-channel",
          },
          isPublished: true,
          publishedAt: "2024-01-01T00:00:00Z",
          isAvailableForPurchase: true,
          availableForPurchaseAt: "2024-01-01T00:00:00Z",
          visibleInListings: true,
        },
      ],
      variants: [
        {
          id: "variant-1",
          name: "Variant A",
          channelListings: [
            {
              channel: { id: "channel-1" },
              price: { amount: 10.0 },
            },
          ],
          stocks: [
            {
              warehouse: { id: "warehouse-1" },
              quantity: 100,
            },
          ],
        },
      ],
    };

    // Act
    const result = mapProductToDiagnosticData(product);

    // Assert
    expect(result).toEqual({
      id: "product-1",
      name: "Test Product",
      isShippingRequired: true,
      channelListings: [
        {
          channel: {
            id: "channel-1",
            name: "Default Channel",
            slug: "default-channel",
          },
          isPublished: true,
          publishedAt: "2024-01-01T00:00:00Z",
          isAvailableForPurchase: true,
          availableForPurchaseAt: "2024-01-01T00:00:00Z",
          visibleInListings: true,
        },
      ],
      variants: [
        {
          id: "variant-1",
          name: "Variant A",
          channelListings: [
            {
              channel: { id: "channel-1" },
              price: { amount: 10.0 },
            },
          ],
          stocks: [
            {
              warehouse: { id: "warehouse-1" },
              quantity: 100,
            },
          ],
        },
      ],
    });
  });

  it("should map non-shippable product (isShippingRequired: false)", () => {
    // Arrange - digital product that doesn't require shipping
    const product = createTestProduct({
      id: "product-digital",
      name: "Digital Product",
      productType: { isShippingRequired: false },
    });

    // Act
    const result = mapProductToDiagnosticData(product);

    // Assert
    expect(result?.isShippingRequired).toBe(false);
  });

  it("should handle empty channelListings and variants", () => {
    // Arrange
    const product = createTestProduct({
      id: "product-2",
      name: "Empty Product",
    });

    // Act
    const result = mapProductToDiagnosticData(product);

    // Assert
    expect(result).toEqual({
      id: "product-2",
      name: "Empty Product",
      isShippingRequired: true,
      channelListings: [],
      variants: [],
    });
  });

  it("should convert undefined dates to null", () => {
    // Arrange
    const product = createTestProduct({
      id: "product-3",
      name: "Product with undefined dates",
      channelListings: [
        {
          channel: {
            id: "channel-1",
            name: "Channel",
            slug: "channel",
          },
          isPublished: false,
          publishedAt: undefined,
          isAvailableForPurchase: false,
          availableForPurchaseAt: undefined,
          visibleInListings: false,
        },
      ],
    });

    // Act
    const result = mapProductToDiagnosticData(product);

    // Assert
    expect(result?.channelListings[0].publishedAt).toBeNull();
    expect(result?.channelListings[0].availableForPurchaseAt).toBeNull();
  });
});
