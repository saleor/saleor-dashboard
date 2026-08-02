import { type Products } from "@dashboard/components/AssignProductDialog/types";

import { isProductListedInChannel } from "./bulkPublishProductChannelFilter";

const createProduct = (id: string, channelIds: string[]): Products[number] =>
  ({
    id,
    name: `Product ${id}`,
    channelListings: channelIds.map(channelId => ({
      channel: { id: channelId },
    })),
  }) as Products[number];

describe("isProductListedInChannel", () => {
  it("detects when a product is listed in the target channel", () => {
    // Arrange
    const product = createProduct("p1", ["ch1", "ch2"]);

    // Act & Assert
    expect(isProductListedInChannel(product, "ch1")).toBe(true);
    expect(isProductListedInChannel(product, "ch3")).toBe(false);
  });

  it("treats missing channel listings as not listed", () => {
    // Arrange
    const product = {
      id: "p1",
      name: "Product p1",
      channelListings: undefined,
    } as Products[number];

    // Act & Assert
    expect(isProductListedInChannel(product, "ch1")).toBe(false);
  });
});
