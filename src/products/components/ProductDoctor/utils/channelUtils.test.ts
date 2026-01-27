import { ProductChannelListingAddInput } from "@dashboard/graphql";

import {
  countIssuesBySeverity,
  filterChannelsBySearch,
  getDirtyChannelIds,
  groupIssuesByChannel,
  paginateItems,
} from "./channelUtils";
import { AvailabilityIssue, ChannelSummary } from "./types";

const createMockSummary = (overrides?: Partial<ChannelSummary>): ChannelSummary => ({
  id: "channel-1",
  name: "Default Channel",
  slug: "default-channel",
  currencyCode: "USD",
  isActive: true,
  isPublished: true,
  publishedAt: null,
  isAvailableForPurchase: true,
  availableForPurchaseAt: null,
  visibleInListings: true,
  warehouseCount: 1,
  warehouseNames: ["Warehouse 1"],
  shippingZoneCount: 1,
  shippingZoneNames: ["Zone 1"],
  countryCount: 1,
  ...overrides,
});

const createMockIssue = (overrides?: Partial<AvailabilityIssue>): AvailabilityIssue => ({
  id: "issue-1",
  severity: "error",
  channelId: "channel-1",
  channelName: "Default Channel",
  message: "Test issue",
  description: "Test description",
  ...overrides,
});

describe("groupIssuesByChannel", () => {
  it("should return empty map when no issues", () => {
    // Act
    const result = groupIssuesByChannel([]);

    // Assert
    expect(result.size).toBe(0);
  });

  it("should group issues by channel ID", () => {
    // Arrange
    const issues: AvailabilityIssue[] = [
      createMockIssue({ id: "1", channelId: "channel-1" }),
      createMockIssue({ id: "2", channelId: "channel-1" }),
      createMockIssue({ id: "3", channelId: "channel-2" }),
    ];

    // Act
    const result = groupIssuesByChannel(issues);

    // Assert
    expect(result.size).toBe(2);
    expect(result.get("channel-1")).toHaveLength(2);
    expect(result.get("channel-2")).toHaveLength(1);
  });
});

describe("getDirtyChannelIds", () => {
  it("should return empty array when formChannelData is undefined", () => {
    // Arrange
    const summaries = [createMockSummary()];

    // Act
    const result = getDirtyChannelIds(summaries, undefined);

    // Assert
    expect(result).toEqual([]);
  });

  it("should return empty array when no channels have changes", () => {
    // Arrange - form data must match all comparable fields in summary
    const summaries = [
      createMockSummary({
        id: "channel-1",
        isPublished: true,
        publishedAt: "2024-01-01T00:00:00Z",
        isAvailableForPurchase: true,
        availableForPurchaseAt: "2024-01-01T00:00:00Z",
        visibleInListings: true,
      }),
    ];
    const formData: ProductChannelListingAddInput[] = [
      {
        channelId: "channel-1",
        isPublished: true,
        publishedAt: "2024-01-01T00:00:00Z",
        isAvailableForPurchase: true,
        availableForPurchaseAt: "2024-01-01T00:00:00Z",
        visibleInListings: true,
      },
    ];

    // Act
    const result = getDirtyChannelIds(summaries, formData);

    // Assert
    expect(result).toEqual([]);
  });

  it("should return channel IDs that have changes", () => {
    // Arrange
    const summaries = [
      createMockSummary({
        id: "channel-1",
        isPublished: true,
        publishedAt: null,
        isAvailableForPurchase: false,
        availableForPurchaseAt: null,
        visibleInListings: false,
      }),
      createMockSummary({
        id: "channel-2",
        isPublished: false,
        publishedAt: null,
        isAvailableForPurchase: false,
        availableForPurchaseAt: null,
        visibleInListings: false,
      }),
    ];
    const formData: ProductChannelListingAddInput[] = [
      {
        channelId: "channel-1",
        isPublished: false, // Changed from true
        publishedAt: null,
        isAvailableForPurchase: false,
        availableForPurchaseAt: null,
        visibleInListings: false,
      },
      {
        channelId: "channel-2",
        isPublished: false, // No change
        publishedAt: null,
        isAvailableForPurchase: false,
        availableForPurchaseAt: null,
        visibleInListings: false,
      },
    ];

    // Act
    const result = getDirtyChannelIds(summaries, formData);

    // Assert
    expect(result).toEqual(["channel-1"]);
  });
});

describe("filterChannelsBySearch", () => {
  it("should return all summaries when search query is empty", () => {
    // Arrange
    const summaries = [
      createMockSummary({ id: "1", name: "Channel A" }),
      createMockSummary({ id: "2", name: "Channel B" }),
    ];

    // Act
    const result = filterChannelsBySearch(summaries, "");

    // Assert
    expect(result).toHaveLength(2);
  });

  it("should filter by channel name (case insensitive)", () => {
    // Arrange
    const summaries = [
      createMockSummary({ id: "1", name: "America Channel", currencyCode: "USD" }),
      createMockSummary({ id: "2", name: "Europe Channel", currencyCode: "EUR" }),
    ];

    // Act
    const result = filterChannelsBySearch(summaries, "america");

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("America Channel");
  });

  it("should filter by currency code", () => {
    // Arrange
    const summaries = [
      createMockSummary({ id: "1", name: "Channel A", currencyCode: "USD" }),
      createMockSummary({ id: "2", name: "Channel B", currencyCode: "EUR" }),
    ];

    // Act
    const result = filterChannelsBySearch(summaries, "eur");

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].currencyCode).toBe("EUR");
  });

  it("should trim whitespace from search query", () => {
    // Arrange
    const summaries = [createMockSummary({ id: "1", name: "Test Channel" })];

    // Act
    const result = filterChannelsBySearch(summaries, "  test  ");

    // Assert
    expect(result).toHaveLength(1);
  });
});

describe("paginateItems", () => {
  it("should return first page items", () => {
    // Arrange
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Act
    const result = paginateItems(items, 1, 3);

    // Assert
    expect(result).toEqual([1, 2, 3]);
  });

  it("should return second page items", () => {
    // Arrange
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Act
    const result = paginateItems(items, 2, 3);

    // Assert
    expect(result).toEqual([4, 5, 6]);
  });

  it("should return partial last page", () => {
    // Arrange
    const items = [1, 2, 3, 4, 5];

    // Act
    const result = paginateItems(items, 2, 3);

    // Assert
    expect(result).toEqual([4, 5]);
  });

  it("should return empty array for page beyond data", () => {
    // Arrange
    const items = [1, 2, 3];

    // Act
    const result = paginateItems(items, 5, 3);

    // Assert
    expect(result).toEqual([]);
  });
});

describe("countIssuesBySeverity", () => {
  it("should return zero counts for empty array", () => {
    // Act
    const result = countIssuesBySeverity([]);

    // Assert
    expect(result).toEqual({ errorCount: 0, warningCount: 0 });
  });

  it("should count errors and warnings correctly", () => {
    // Arrange
    const issues: AvailabilityIssue[] = [
      createMockIssue({ severity: "error" }),
      createMockIssue({ severity: "error" }),
      createMockIssue({ severity: "warning" }),
      createMockIssue({ severity: "info" }),
    ];

    // Act
    const result = countIssuesBySeverity(issues);

    // Assert
    expect(result).toEqual({ errorCount: 2, warningCount: 1 });
  });
});
