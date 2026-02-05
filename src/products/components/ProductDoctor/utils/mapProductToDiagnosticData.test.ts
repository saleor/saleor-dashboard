import { ProductDetailsQuery } from "@dashboard/graphql";

import { mapProductToDiagnosticData } from "./mapProductToDiagnosticData";

// Type alias for cleaner test code
type ProductInput = ProductDetailsQuery["product"];

/**
 * Minimal type representing the fields actually used by mapProductToDiagnosticData.
 * This allows tests to provide only the relevant data without fighting complex generated types.
 */
interface TestProductInput {
  id?: string;
  name?: string;
  productType?: {
    isShippingRequired?: boolean;
  } | null;
  channelListings?: Array<{
    channel: { id: string; name: string; slug: string };
    isPublished: boolean;
    publishedAt?: string | null;
    isAvailableForPurchase?: boolean | null;
    availableForPurchaseAt?: string | null;
    visibleInListings: boolean;
  }>;
  variants?: Array<{
    id: string;
    name: string;
    channelListings?: Array<{
      channel: { id: string };
      price?: { amount: number } | null;
    }>;
    stocks?: Array<{
      warehouse: { id: string };
      quantity: number;
    }>;
  }>;
}

/**
 * Factory function to create test product input data.
 *
 * Note: We use TestProductInput (a simplified type) because:
 * 1. ProductInput is a complex generated GraphQL type with many required fields
 * 2. mapProductToDiagnosticData only accesses specific fields we provide
 * 3. Tests intentionally provide partial data to verify edge case handling
 */
const createTestProduct = (overrides: TestProductInput = {}): ProductInput =>
  ({
    id: "test-product",
    name: "Test Product",
    productType: {
      isShippingRequired: true,
    },
    channelListings: [],
    variants: [],
    ...overrides,
  }) as unknown as ProductInput;

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
    // Arrange - use type assertion for partial mock
    const product = {
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
    } as ProductInput;

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

  it("should default isShippingRequired to true when productType is null", () => {
    // Arrange - edge case: product without productType (requires manual cast)
    const product = {
      ...createTestProduct(),
      productType: null,
    } as unknown as ProductInput;

    // Act
    const result = mapProductToDiagnosticData(product);

    // Assert - should default to true (safer for diagnostics - shows more warnings)
    expect(result?.isShippingRequired).toBe(true);
  });

  it("should default isShippingRequired to true when isShippingRequired is undefined", () => {
    // Arrange - edge case: productType exists but isShippingRequired is undefined (requires manual cast)
    const product = {
      ...createTestProduct(),
      productType: {
        id: "pt-1",
        name: "Some Type",
        // isShippingRequired intentionally omitted (undefined)
      },
    } as unknown as ProductInput;

    // Act
    const result = mapProductToDiagnosticData(product);

    // Assert - should default to true (safer for diagnostics - shows more warnings)
    expect(result?.isShippingRequired).toBe(true);
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
