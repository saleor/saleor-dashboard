import {
  AllocationStrategyEnum,
  ChannelFragment,
  ProductChannelListingAddInput,
} from "@dashboard/graphql";

import { mergeFormDataWithChannelSummaries } from "./mergeChannelSummaries";
import { ChannelSummary } from "./types";

const createMockSummary = (overrides?: Partial<ChannelSummary>): ChannelSummary => ({
  id: "channel-1",
  name: "Default Channel",
  slug: "default-channel",
  currencyCode: "USD",
  isActive: true,
  isPublished: false,
  publishedAt: null,
  isAvailableForPurchase: false,
  availableForPurchaseAt: null,
  visibleInListings: false,
  warehouseCount: 1,
  warehouseNames: ["Warehouse 1"],
  shippingZoneCount: 1,
  shippingZoneNames: ["Zone 1"],
  countryCount: 1,
  ...overrides,
});

const createMockChannel = (overrides?: Partial<ChannelFragment>): ChannelFragment => ({
  __typename: "Channel",
  id: "channel-new",
  name: "New Channel",
  slug: "new-channel",
  currencyCode: "EUR",
  isActive: true,
  defaultCountry: {
    __typename: "CountryDisplay",
    code: "DE",
    country: "Germany",
  },
  stockSettings: {
    __typename: "StockSettings",
    allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
  },
  ...overrides,
});

describe("mergeFormDataWithChannelSummaries", () => {
  it("should return original summaries when formChannelData is undefined", () => {
    // Arrange
    const summaries = [createMockSummary()];

    // Act
    const result = mergeFormDataWithChannelSummaries(summaries, undefined, undefined);

    // Assert
    expect(result).toEqual(summaries);
  });

  it("should merge form data with existing summaries", () => {
    // Arrange
    const summaries = [createMockSummary({ id: "channel-1", isPublished: false })];
    const formData: ProductChannelListingAddInput[] = [
      {
        channelId: "channel-1",
        isPublished: true,
        publishedAt: "2024-06-15T00:00:00Z",
      },
    ];

    // Act
    const result = mergeFormDataWithChannelSummaries(summaries, formData, undefined);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].isPublished).toBe(true);
    expect(result[0].publishedAt).toBe("2024-06-15T00:00:00Z");
  });

  it("should not override with undefined values", () => {
    // Arrange
    const summaries = [
      createMockSummary({
        id: "channel-1",
        isPublished: true,
        publishedAt: "2024-01-01T00:00:00Z",
      }),
    ];
    const formData: ProductChannelListingAddInput[] = [
      {
        channelId: "channel-1",
        // isPublished is undefined - should keep original
        visibleInListings: true,
      },
    ];

    // Act
    const result = mergeFormDataWithChannelSummaries(summaries, formData, undefined);

    // Assert
    expect(result[0].isPublished).toBe(true); // Kept original
    expect(result[0].publishedAt).toBe("2024-01-01T00:00:00Z"); // Kept original
    expect(result[0].visibleInListings).toBe(true); // Updated
  });

  it("should create summaries for newly added channels", () => {
    // Arrange
    const summaries = [createMockSummary({ id: "channel-1" })];
    const channels = [createMockChannel({ id: "channel-new", name: "New Channel" })];
    const formData: ProductChannelListingAddInput[] = [
      { channelId: "channel-1" },
      {
        channelId: "channel-new",
        isPublished: true,
        publishedAt: "2024-06-15T00:00:00Z",
      },
    ];

    // Act
    const result = mergeFormDataWithChannelSummaries(summaries, formData, channels);

    // Assert
    expect(result).toHaveLength(2);

    const newChannel = result.find(s => s.id === "channel-new");

    expect(newChannel).toBeDefined();
    expect(newChannel?.name).toBe("New Channel");
    expect(newChannel?.isPublished).toBe(true);
    expect(newChannel?.warehouseCount).toBe("unknown");
  });

  it("should not create summary for channel without metadata", () => {
    // Arrange
    const summaries: ChannelSummary[] = [];
    const channels: ChannelFragment[] = []; // Channel not in list
    const formData: ProductChannelListingAddInput[] = [
      { channelId: "unknown-channel", isPublished: true },
    ];

    // Act
    const result = mergeFormDataWithChannelSummaries(summaries, formData, channels);

    // Assert
    expect(result).toHaveLength(0);
  });

  it("should use defaults for missing form data fields on new channels", () => {
    // Arrange
    const summaries: ChannelSummary[] = [];
    const channels = [createMockChannel({ id: "channel-new" })];
    const formData: ProductChannelListingAddInput[] = [
      { channelId: "channel-new" }, // Minimal form data
    ];

    // Act
    const result = mergeFormDataWithChannelSummaries(summaries, formData, channels);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].isPublished).toBe(false);
    expect(result[0].publishedAt).toBeNull();
    expect(result[0].isAvailableForPurchase).toBe(false);
    expect(result[0].availableForPurchaseAt).toBeNull();
    expect(result[0].visibleInListings).toBe(false);
  });

  it("should preserve original summary fields not in form data", () => {
    // Arrange
    const summaries = [
      createMockSummary({
        id: "channel-1",
        warehouseCount: 5,
        warehouseNames: ["W1", "W2"],
        shippingZoneCount: 3,
      }),
    ];
    const formData: ProductChannelListingAddInput[] = [
      { channelId: "channel-1", isPublished: true },
    ];

    // Act
    const result = mergeFormDataWithChannelSummaries(summaries, formData, undefined);

    // Assert
    expect(result[0].warehouseCount).toBe(5);
    expect(result[0].warehouseNames).toEqual(["W1", "W2"]);
    expect(result[0].shippingZoneCount).toBe(3);
  });
});
