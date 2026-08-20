import {
  buildBulkPublishVariantChannelListingsInput,
  type BulkPublishVariantChannelListingSource,
} from "./bulkPublishVariantChannelListings";

const listedVariant: BulkPublishVariantChannelListingSource = {
  channelListings: [{ id: "listing-1", channel: { id: "ch1" } }],
};
const unlistedVariant: BulkPublishVariantChannelListingSource = { channelListings: [] };

describe("buildBulkPublishVariantChannelListingsInput", () => {
  it("updates an existing listing when a price is given", () => {
    // Act
    const input = buildBulkPublishVariantChannelListingsInput({
      variant: listedVariant,
      channelId: "ch1",
      price: "20",
    });

    // Assert
    expect(input).toEqual({ update: [{ channelListing: "listing-1", price: "20" }] });
  });

  it("leaves an existing price untouched when the price is blank", () => {
    // Act
    const input = buildBulkPublishVariantChannelListingsInput({
      variant: listedVariant,
      channelId: "ch1",
    });

    // Assert
    expect(input).toBeUndefined();
  });

  it("updates only the cost price when the price is blank", () => {
    // Act
    const input = buildBulkPublishVariantChannelListingsInput({
      variant: listedVariant,
      channelId: "ch1",
      costPrice: "5",
    });

    // Assert
    expect(input).toEqual({ update: [{ channelListing: "listing-1", costPrice: "5" }] });
  });

  it("creates a listing when the variant has none and a price is given", () => {
    // Act
    const input = buildBulkPublishVariantChannelListingsInput({
      variant: unlistedVariant,
      channelId: "ch1",
      price: "20",
      costPrice: "5",
    });

    // Assert
    expect(input).toEqual({ create: [{ channelId: "ch1", price: "20", costPrice: "5" }] });
  });

  it("leaves an unlisted variant alone when there is no price to create a listing with", () => {
    // Act
    const input = buildBulkPublishVariantChannelListingsInput({
      variant: unlistedVariant,
      channelId: "ch1",
      costPrice: "5",
    });

    // Assert
    expect(input).toBeUndefined();
  });

  it("ignores listings from other channels when deciding create vs update", () => {
    // Arrange
    const variant: BulkPublishVariantChannelListingSource = {
      channelListings: [{ id: "listing-other", channel: { id: "ch2" } }],
    };

    // Act
    const input = buildBulkPublishVariantChannelListingsInput({
      variant,
      channelId: "ch1",
      price: "20",
    });

    // Assert
    expect(input).toEqual({ create: [{ channelId: "ch1", price: "20" }] });
  });

  it("treats a zero price as a real value, not a blank", () => {
    // Act
    const input = buildBulkPublishVariantChannelListingsInput({
      variant: listedVariant,
      channelId: "ch1",
      price: "0",
    });

    // Assert
    expect(input).toEqual({ update: [{ channelListing: "listing-1", price: "0" }] });
  });
});
