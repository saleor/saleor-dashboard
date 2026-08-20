import {
  type BulkPublishListedProduct,
  getBulkPublishCurrentListing,
  getBulkPublishCurrentListings,
} from "./bulkPublishCurrentListings";
import { BULK_PUBLISH_PRICE_SAMPLE_LIMIT } from "./types";

const buildProduct = ({
  id = "p1",
  prices,
  totalCount,
}: {
  id?: string;
  prices: Array<number | null>;
  totalCount?: number;
}): BulkPublishListedProduct => ({
  id,
  productVariants: {
    totalCount: totalCount ?? prices.length,
    edges: prices.map(amount => ({
      node: {
        channelListings: amount === null ? [] : [{ channel: { id: "ch1" }, price: { amount } }],
      },
    })),
  },
});

describe("getBulkPublishCurrentListing", () => {
  it("returns a single price when every variant shares one", () => {
    // Arrange
    const product = buildProduct({ prices: [24, 24, 24] });

    // Act
    const listing = getBulkPublishCurrentListing({ product, channelId: "ch1" });

    // Assert
    expect(listing).toEqual({
      price: { min: 24, max: 24, isMixed: false },
      listedVariantCount: 3,
      unlistedVariantCount: 0,
    });
  });

  it("returns a mixed range when variant prices differ", () => {
    // Arrange
    const product = buildProduct({ prices: [10, 25, 18] });

    // Act
    const listing = getBulkPublishCurrentListing({ product, channelId: "ch1" });

    // Assert
    expect(listing?.price).toEqual({ min: 10, max: 25, isMixed: true });
  });

  it("counts variants that have no listing in the channel", () => {
    // Arrange
    const product = buildProduct({ prices: [12, null, null] });

    // Act
    const listing = getBulkPublishCurrentListing({ product, channelId: "ch1" });

    // Assert
    expect(listing).toEqual({
      price: { min: 12, max: 12, isMixed: false },
      listedVariantCount: 1,
      unlistedVariantCount: 2,
    });
  });

  it("reports every variant as unlisted when none is priced in the channel", () => {
    // Arrange
    const product = buildProduct({ prices: [null, null] });

    // Act
    const listing = getBulkPublishCurrentListing({ product, channelId: "ch1" });

    // Assert
    expect(listing).toEqual({
      price: undefined,
      listedVariantCount: 0,
      unlistedVariantCount: 2,
    });
  });

  it("ignores prices from other channels", () => {
    // Arrange
    const product: BulkPublishListedProduct = {
      id: "p1",
      productVariants: {
        totalCount: 1,
        edges: [{ node: { channelListings: [{ channel: { id: "ch2" }, price: { amount: 9 } }] } }],
      },
    };

    // Act
    const listing = getBulkPublishCurrentListing({ product, channelId: "ch1" });

    // Assert
    expect(listing?.price).toBeUndefined();
    expect(listing?.unlistedVariantCount).toBe(1);
  });

  it("returns nothing when variants exceed the sample limit, so counts are never partial", () => {
    // Arrange
    const product = buildProduct({
      prices: [10, 20],
      totalCount: BULK_PUBLISH_PRICE_SAMPLE_LIMIT + 1,
    });

    // Act & Assert
    expect(getBulkPublishCurrentListing({ product, channelId: "ch1" })).toBeUndefined();
  });

  it("returns nothing for a product with no variants", () => {
    // Arrange
    const product = buildProduct({ prices: [] });

    // Act & Assert
    expect(getBulkPublishCurrentListing({ product, channelId: "ch1" })).toBeUndefined();
  });
});

describe("getBulkPublishCurrentListings", () => {
  it("maps every product it can describe", () => {
    // Arrange
    const products = [
      buildProduct({ id: "p1", prices: [15] }),
      buildProduct({ id: "p2", prices: [null] }),
      buildProduct({ id: "p3", prices: [1], totalCount: BULK_PUBLISH_PRICE_SAMPLE_LIMIT + 1 }),
    ];

    // Act
    const listings = getBulkPublishCurrentListings({ products, channelId: "ch1" });

    // Assert
    expect(listings.get("p1")?.price?.min).toBe(15);
    expect(listings.get("p2")?.unlistedVariantCount).toBe(1);
    expect(listings.has("p3")).toBe(false);
  });
});
