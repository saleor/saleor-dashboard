import {
  isProductListedInChannel,
  isProductMissingCategory,
  type ProductChannelListings,
} from "./bulkPublishProductChannelFilter";

const createProduct = (channelIds: string[]): ProductChannelListings => ({
  channelListings: channelIds.map(channelId => ({ channel: { id: channelId } })),
});

describe("isProductListedInChannel", () => {
  it("detects when a product is listed in the target channel", () => {
    // Arrange
    const product = createProduct(["ch1", "ch2"]);

    // Act & Assert
    expect(isProductListedInChannel(product, "ch1")).toBe(true);
    expect(isProductListedInChannel(product, "ch3")).toBe(false);
  });

  it("treats missing channel listings as not listed", () => {
    // Arrange
    const product: ProductChannelListings = { channelListings: null };

    // Act & Assert
    expect(isProductListedInChannel(product, "ch1")).toBe(false);
  });
});

describe("isProductMissingCategory", () => {
  it("detects products without a category", () => {
    // Arrange & Act & Assert
    expect(isProductMissingCategory({ category: null })).toBe(true);
    expect(isProductMissingCategory({ category: undefined })).toBe(true);
    expect(isProductMissingCategory({ category: { id: "cat1" } })).toBe(false);
  });
});
