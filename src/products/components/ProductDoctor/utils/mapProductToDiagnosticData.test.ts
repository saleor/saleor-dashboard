import { ProductDetailsQuery } from "@dashboard/graphql";

import { mapProductToDiagnosticData } from "./mapProductToDiagnosticData";

// Type alias for cleaner test code
type ProductInput = ProductDetailsQuery["product"];

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

  it("should map product data to diagnostic structure", () => {
    // Arrange - use type assertion for partial mock
    const product = {
      id: "product-1",
      name: "Test Product",
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
    } as ProductInput;

    // Act
    const result = mapProductToDiagnosticData(product);

    // Assert
    expect(result).toEqual({
      id: "product-1",
      name: "Test Product",
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

  it("should handle empty channelListings and variants", () => {
    // Arrange
    const product = {
      id: "product-2",
      name: "Empty Product",
      channelListings: [],
      variants: [],
    } as unknown as ProductInput;

    // Act
    const result = mapProductToDiagnosticData(product);

    // Assert
    expect(result).toEqual({
      id: "product-2",
      name: "Empty Product",
      channelListings: [],
      variants: [],
    });
  });

  it("should convert undefined dates to null", () => {
    // Arrange
    const product = {
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
      variants: [],
    } as unknown as ProductInput;

    // Act
    const result = mapProductToDiagnosticData(product);

    // Assert
    expect(result?.channelListings[0].publishedAt).toBeNull();
    expect(result?.channelListings[0].availableForPurchaseAt).toBeNull();
  });
});
