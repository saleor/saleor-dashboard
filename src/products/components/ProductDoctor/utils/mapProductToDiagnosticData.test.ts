import { ProductDetailsQuery } from "@dashboard/graphql";

import { mapProductToDiagnosticData } from "./mapProductToDiagnosticData";

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
    // Arrange
    const product: ProductDetailsQuery["product"] = {
      __typename: "Product",
      id: "product-1",
      name: "Test Product",
      channelListings: [
        {
          __typename: "ProductChannelListing",
          channel: {
            __typename: "Channel",
            id: "channel-1",
            name: "Default Channel",
            slug: "default-channel",
            currencyCode: "USD",
          },
          isPublished: true,
          publishedAt: "2024-01-01T00:00:00Z",
          isAvailableForPurchase: true,
          availableForPurchaseAt: "2024-01-01T00:00:00Z",
          visibleInListings: true,
          availableForPurchase: null,
          pricing: null,
        },
      ],
      variants: [
        {
          __typename: "ProductVariant",
          id: "variant-1",
          name: "Variant A",
          channelListings: [
            {
              __typename: "ProductVariantChannelListing",
              channel: {
                __typename: "Channel",
                id: "channel-1",
              },
              price: {
                __typename: "Money",
                amount: 10.0,
                currency: "USD",
              },
              costPrice: null,
              preorderThreshold: null,
            },
          ],
          stocks: [
            {
              __typename: "Stock",
              warehouse: {
                __typename: "Warehouse",
                id: "warehouse-1",
                name: "Warehouse A",
              },
              quantity: 100,
              quantityAllocated: 0,
            },
          ],
          sku: "SKU-001",
          attributes: [],
          media: [],
          metadata: [],
          privateMetadata: [],
          preorder: null,
          quantityLimitPerCustomer: null,
          trackInventory: true,
        },
      ],
      // Additional required fields for ProductDetailsQuery
      slug: "test-product",
      description: null,
      seoTitle: null,
      seoDescription: null,
      rating: null,
      defaultVariant: null,
      category: null,
      collections: [],
      metadata: [],
      privateMetadata: [],
      productType: {
        __typename: "ProductType",
        id: "type-1",
        name: "Type",
        hasVariants: true,
        variantAttributes: [],
      },
      weight: null,
      taxClass: null,
      attributes: [],
      media: [],
    };

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
              channel: {
                id: "channel-1",
              },
              price: {
                __typename: "Money",
                amount: 10.0,
                currency: "USD",
              },
            },
          ],
          stocks: [
            {
              warehouse: {
                id: "warehouse-1",
              },
              quantity: 100,
            },
          ],
        },
      ],
    });
  });

  it("should handle empty channelListings and variants", () => {
    // Arrange
    const product: ProductDetailsQuery["product"] = {
      __typename: "Product",
      id: "product-2",
      name: "Empty Product",
      channelListings: [],
      variants: [],
      slug: "empty-product",
      description: null,
      seoTitle: null,
      seoDescription: null,
      rating: null,
      defaultVariant: null,
      category: null,
      collections: [],
      metadata: [],
      privateMetadata: [],
      productType: {
        __typename: "ProductType",
        id: "type-1",
        name: "Type",
        hasVariants: false,
        variantAttributes: [],
      },
      weight: null,
      taxClass: null,
      attributes: [],
      media: [],
    };

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
    const product: ProductDetailsQuery["product"] = {
      __typename: "Product",
      id: "product-3",
      name: "Product with undefined dates",
      channelListings: [
        {
          __typename: "ProductChannelListing",
          channel: {
            __typename: "Channel",
            id: "channel-1",
            name: "Channel",
            slug: "channel",
            currencyCode: "USD",
          },
          isPublished: false,
          publishedAt: undefined as unknown as string | null,
          isAvailableForPurchase: false,
          availableForPurchaseAt: undefined as unknown as string | null,
          visibleInListings: false,
          availableForPurchase: null,
          pricing: null,
        },
      ],
      variants: [],
      slug: "product-undefined",
      description: null,
      seoTitle: null,
      seoDescription: null,
      rating: null,
      defaultVariant: null,
      category: null,
      collections: [],
      metadata: [],
      privateMetadata: [],
      productType: {
        __typename: "ProductType",
        id: "type-1",
        name: "Type",
        hasVariants: false,
        variantAttributes: [],
      },
      weight: null,
      taxClass: null,
      attributes: [],
      media: [],
    };

    // Act
    const result = mapProductToDiagnosticData(product);

    // Assert
    expect(result?.channelListings[0].publishedAt).toBeNull();
    expect(result?.channelListings[0].availableForPurchaseAt).toBeNull();
  });
});
