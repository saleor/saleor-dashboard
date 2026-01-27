import { getAvailabilityStatus, isPurchasable } from "./availabilityStatus";
import { ChannelSummary } from "./types";

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

describe("getAvailabilityStatus", () => {
  const NOW = new Date("2024-06-15T12:00:00Z").getTime();

  it("should return 'hidden' when product is not published", () => {
    // Arrange
    const summary = createMockSummary({ isPublished: false });

    // Act
    const result = getAvailabilityStatus(summary, NOW);

    // Assert
    expect(result).toBe("hidden");
  });

  it("should return 'live' when published with no date", () => {
    // Arrange
    const summary = createMockSummary({ isPublished: true, publishedAt: null });

    // Act
    const result = getAvailabilityStatus(summary, NOW);

    // Assert
    expect(result).toBe("live");
  });

  it("should return 'live' when published with past date", () => {
    // Arrange
    const pastDate = new Date("2024-01-01T00:00:00Z").toISOString();
    const summary = createMockSummary({ isPublished: true, publishedAt: pastDate });

    // Act
    const result = getAvailabilityStatus(summary, NOW);

    // Assert
    expect(result).toBe("live");
  });

  it("should return 'scheduled' when published with future date", () => {
    // Arrange
    const futureDate = new Date("2024-12-31T00:00:00Z").toISOString();
    const summary = createMockSummary({ isPublished: true, publishedAt: futureDate });

    // Act
    const result = getAvailabilityStatus(summary, NOW);

    // Assert
    expect(result).toBe("scheduled");
  });

  it("should return 'live' when publishedAt is within clock tolerance (2 seconds)", () => {
    // Arrange - date is 1 second in the future (within tolerance)
    const nearFutureDate = new Date(NOW + 1000).toISOString();
    const summary = createMockSummary({ isPublished: true, publishedAt: nearFutureDate });

    // Act
    const result = getAvailabilityStatus(summary, NOW);

    // Assert
    expect(result).toBe("live");
  });

  it("should return 'scheduled' when publishedAt is beyond clock tolerance", () => {
    // Arrange - date is 3 seconds in the future (beyond 2s tolerance)
    const futureDate = new Date(NOW + 3000).toISOString();
    const summary = createMockSummary({ isPublished: true, publishedAt: futureDate });

    // Act
    const result = getAvailabilityStatus(summary, NOW);

    // Assert
    expect(result).toBe("scheduled");
  });
});

describe("isPurchasable", () => {
  const NOW = new Date("2024-06-15T12:00:00Z").getTime();

  it("should return false when no availableForPurchaseAt date is set", () => {
    // Arrange
    const summary = createMockSummary({ availableForPurchaseAt: null });

    // Act
    const result = isPurchasable(summary, NOW);

    // Assert
    expect(result).toBe(false);
  });

  it("should return true when availableForPurchaseAt is in the past", () => {
    // Arrange
    const pastDate = new Date("2024-01-01T00:00:00Z").toISOString();
    const summary = createMockSummary({ availableForPurchaseAt: pastDate });

    // Act
    const result = isPurchasable(summary, NOW);

    // Assert
    expect(result).toBe(true);
  });

  it("should return false when availableForPurchaseAt is in the future", () => {
    // Arrange
    const futureDate = new Date("2024-12-31T00:00:00Z").toISOString();
    const summary = createMockSummary({ availableForPurchaseAt: futureDate });

    // Act
    const result = isPurchasable(summary, NOW);

    // Assert
    expect(result).toBe(false);
  });

  it("should return true when availableForPurchaseAt equals current time", () => {
    // Arrange
    const currentDate = new Date(NOW).toISOString();
    const summary = createMockSummary({ availableForPurchaseAt: currentDate });

    // Act
    const result = isPurchasable(summary, NOW);

    // Assert
    expect(result).toBe(true);
  });
});
