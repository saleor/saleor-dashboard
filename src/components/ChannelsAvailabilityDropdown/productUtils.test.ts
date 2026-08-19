import { productAvailabilityMessages } from "./messages";
import {
  getProductAvailabilitySummary,
  getProductChannelAvailabilityStatus,
  getProductChannelStatusDetails,
  type ProductChannelListing,
} from "./productUtils";

const createListing = (
  overrides: Partial<ProductChannelListing> & Pick<ProductChannelListing, "channel">,
): ProductChannelListing => ({
  isPublished: false,
  publishedAt: null,
  availableForPurchaseAt: null,
  ...overrides,
});

const channelA = {
  __typename: "Channel" as const,
  id: "ch-a",
  name: "Channel A",
  slug: "channel-a",
  currencyCode: "USD",
  isActive: true,
};

const channelB = {
  __typename: "Channel" as const,
  id: "ch-b",
  name: "Channel B",
  slug: "channel-b",
  currencyCode: "USD",
  isActive: true,
};

const dateNow = Date.parse("2026-08-04T12:00:00Z");

describe("getProductChannelAvailabilityStatus", () => {
  it("returns hidden when product is not published", () => {
    // Arrange
    const listing = createListing({ channel: channelA });

    // Act
    const status = getProductChannelAvailabilityStatus(listing, dateNow);

    // Assert
    expect(status).toBe("hidden");
  });

  it("returns scheduled when publication date is in the future", () => {
    // Arrange
    const listing = createListing({
      channel: channelA,
      isPublished: true,
      publishedAt: "2026-12-01T00:00:00Z",
    });

    // Act
    const status = getProductChannelAvailabilityStatus(listing, dateNow);

    // Assert
    expect(status).toBe("scheduled");
  });

  it("returns live when product is published", () => {
    // Arrange
    const listing = createListing({
      channel: channelA,
      isPublished: true,
      publishedAt: "2026-01-01T00:00:00Z",
    });

    // Act
    const status = getProductChannelAvailabilityStatus(listing, dateNow);

    // Assert
    expect(status).toBe("live");
  });

  it("preserves live publication status when the sales channel is inactive", () => {
    // Arrange
    const listing = createListing({
      channel: { ...channelA, isActive: false },
      isPublished: true,
      publishedAt: "2026-01-01T00:00:00Z",
    });

    // Act
    const status = getProductChannelAvailabilityStatus(listing, dateNow);

    // Assert
    expect(status).toBe("live");
    expect(getProductChannelStatusDetails(listing, status, dateNow)).toEqual([
      {
        description: productAvailabilityMessages.statusDescriptionPublished,
        dotStatus: "success",
      },
      {
        description: productAvailabilityMessages.statusDescriptionChannelInactiveBlocked,
        dotStatus: "warning",
      },
    ]);
  });

  it("uses scheduled dot for scheduled publication and warning for inactive channel overlay", () => {
    // Arrange
    const listing = createListing({
      channel: { ...channelA, isActive: false },
      isPublished: true,
      publishedAt: "2026-12-01T00:00:00Z",
    });

    // Act
    const status = getProductChannelAvailabilityStatus(listing, dateNow);

    // Assert
    expect(status).toBe("scheduled");
    expect(getProductChannelStatusDetails(listing, status, dateNow)).toEqual([
      {
        description: productAvailabilityMessages.statusDescriptionScheduled,
        dotStatus: "scheduled",
      },
      {
        description: productAvailabilityMessages.statusDescriptionChannelInactiveBlocked,
        dotStatus: "warning",
      },
    ]);
  });
});

describe("getProductAvailabilitySummary", () => {
  it("returns single-channel scheduled status with scheduled dot", () => {
    // Arrange
    const listings = [
      createListing({
        channel: channelA,
        isPublished: true,
        publishedAt: "2026-12-01T00:00:00Z",
      }),
    ];

    // Act
    const summary = getProductAvailabilitySummary(listings, dateNow);

    // Assert
    expect(summary.label).toBe(productAvailabilityMessages.statusScheduled);
    expect(summary.dotStatus).toBe("scheduled");
  });

  it("returns single-channel status label", () => {
    // Arrange
    const listings = [
      createListing({
        channel: channelA,
        isPublished: true,
        publishedAt: "2026-01-01T00:00:00Z",
        availableForPurchaseAt: "2026-01-01T00:00:00Z",
      }),
    ];

    // Act
    const summary = getProductAvailabilitySummary(listings, dateNow);

    // Assert
    expect(summary.label).toBe(productAvailabilityMessages.statusLive);
    expect(summary.dotStatus).toBe("success");
    expect(summary.channels).toHaveLength(1);
  });

  it("returns warning for a published product in a single inactive channel", () => {
    // Arrange
    const listings = [
      createListing({
        channel: { ...channelA, isActive: false },
        isPublished: true,
        publishedAt: "2026-01-01T00:00:00Z",
        availableForPurchaseAt: "2026-01-01T00:00:00Z",
      }),
    ];

    // Act
    const summary = getProductAvailabilitySummary(listings, dateNow);

    // Assert
    expect(summary.label).toBe(productAvailabilityMessages.statusLive);
    expect(summary.dotStatus).toBe("warning");
    expect(summary.channels[0].status).toBe("live");
    expect(summary.channels[0].isChannelInactive).toBe(true);
    expect(summary.channels[0].statusDetails).toEqual([
      {
        description: productAvailabilityMessages.statusDescriptionPublished,
        dotStatus: "success",
      },
      {
        description: productAvailabilityMessages.statusDescriptionChannelInactiveBlocked,
        dotStatus: "warning",
      },
    ]);
  });

  it("returns aggregate live summary when live in exactly two channels", () => {
    // Arrange
    const listings = [
      createListing({
        channel: channelA,
        isPublished: true,
        publishedAt: "2026-01-01T00:00:00Z",
        availableForPurchaseAt: "2026-01-01T00:00:00Z",
      }),
      createListing({
        channel: channelB,
        isPublished: true,
        publishedAt: "2026-01-01T00:00:00Z",
        availableForPurchaseAt: "2026-01-01T00:00:00Z",
      }),
    ];

    // Act
    const summary = getProductAvailabilitySummary(listings, dateNow);

    // Assert
    expect(summary.label).toBe(productAvailabilityMessages.summaryAllLive);
    expect(summary.labelValues).toEqual({ count: 2 });
    expect(summary.dotStatus).toBe("success");
  });

  it("returns aggregate live summary when all channels are live and more than two", () => {
    // Arrange
    const channelC = {
      __typename: "Channel" as const,
      id: "ch-c",
      name: "Channel C",
      slug: "channel-c",
      currencyCode: "USD",
      isActive: true,
    };
    const listings = [
      createListing({
        channel: channelA,
        isPublished: true,
        publishedAt: "2026-01-01T00:00:00Z",
        availableForPurchaseAt: "2026-01-01T00:00:00Z",
      }),
      createListing({
        channel: channelB,
        isPublished: true,
        publishedAt: "2026-01-01T00:00:00Z",
        availableForPurchaseAt: "2026-01-01T00:00:00Z",
      }),
      createListing({
        channel: channelC,
        isPublished: true,
        publishedAt: "2026-01-01T00:00:00Z",
        availableForPurchaseAt: "2026-01-01T00:00:00Z",
      }),
    ];

    // Act
    const summary = getProductAvailabilitySummary(listings, dateNow);

    // Assert
    expect(summary.label).toBe(productAvailabilityMessages.summaryAllLive);
    expect(summary.labelValues).toEqual({ count: 3 });
    expect(summary.dotStatus).toBe("success");
  });

  it("returns partial live summary when only one channel is not live", () => {
    // Arrange
    const listings = [
      createListing({
        channel: channelA,
        isPublished: true,
        publishedAt: "2026-01-01T00:00:00Z",
      }),
      createListing({
        channel: channelB,
      }),
    ];

    // Act
    const summary = getProductAvailabilitySummary(listings, dateNow);

    // Assert
    expect(summary.label).toBe(productAvailabilityMessages.summaryLiveInSome);
    expect(summary.labelValues).toEqual({ liveCount: 1, count: 2 });
    expect(summary.dotStatus).toBe("warning");
    expect(summary.channels[1].dotStatus).toBe("warning");
  });

  it("uses error only when the product is unavailable in every channel", () => {
    // Arrange
    const listings = [createListing({ channel: channelA }), createListing({ channel: channelB })];

    // Act
    const summary = getProductAvailabilitySummary(listings, dateNow);

    // Assert
    expect(summary.label).toBe(productAvailabilityMessages.summaryNotAvailable);
    expect(summary.dotStatus).toBe("error");
    expect(summary.channels.every(channel => channel.dotStatus === "warning")).toBe(true);
  });

  it("returns partial live summary when only one channel is inactive", () => {
    // Arrange
    const listings = [
      createListing({
        channel: channelA,
        isPublished: true,
        publishedAt: "2026-01-01T00:00:00Z",
      }),
      createListing({
        channel: { ...channelB, isActive: false },
        isPublished: true,
        publishedAt: "2026-01-01T00:00:00Z",
      }),
    ];

    // Act
    const summary = getProductAvailabilitySummary(listings, dateNow);

    // Assert
    expect(summary.label).toBe(productAvailabilityMessages.summaryLiveInSome);
    expect(summary.labelValues).toEqual({ liveCount: 1, count: 2 });
    expect(summary.dotStatus).toBe("warning");
    expect(summary.channels[1].status).toBe("live");
    expect(summary.channels[1].isChannelInactive).toBe(true);
    expect(summary.channels[1].dotStatus).toBe("warning");
    expect(summary.channels[1].statusDetails).toEqual([
      {
        description: productAvailabilityMessages.statusDescriptionPublished,
        dotStatus: "success",
      },
      {
        description: productAvailabilityMessages.statusDescriptionChannelInactiveBlocked,
        dotStatus: "warning",
      },
    ]);
  });

  it("returns partial live summary when only one channel is inactive among many", () => {
    // Arrange
    const channelC = {
      __typename: "Channel" as const,
      id: "ch-c",
      name: "Channel C",
      slug: "channel-c",
      currencyCode: "USD",
      isActive: true,
    };
    const channelD = {
      __typename: "Channel" as const,
      id: "ch-d",
      name: "Channel D",
      slug: "channel-d",
      currencyCode: "USD",
      isActive: false,
    };
    const listings = [
      createListing({
        channel: channelA,
        isPublished: true,
        publishedAt: "2026-01-01T00:00:00Z",
      }),
      createListing({
        channel: channelB,
        isPublished: true,
        publishedAt: "2026-01-01T00:00:00Z",
      }),
      createListing({
        channel: channelC,
        isPublished: true,
        publishedAt: "2026-01-01T00:00:00Z",
      }),
      createListing({
        channel: channelD,
        isPublished: true,
        publishedAt: "2026-01-01T00:00:00Z",
      }),
    ];

    // Act
    const summary = getProductAvailabilitySummary(listings, dateNow);

    // Assert
    expect(summary.label).toBe(productAvailabilityMessages.summaryLiveInSome);
    expect(summary.labelValues).toEqual({ liveCount: 3, count: 4 });
    expect(summary.dotStatus).toBe("warning");
  });

  it("returns partial live summary when multiple channels are not live", () => {
    // Arrange
    const channelC = {
      __typename: "Channel" as const,
      id: "ch-c",
      name: "Channel C",
      slug: "channel-c",
      currencyCode: "USD",
      isActive: true,
    };
    const listings = [
      createListing({
        channel: channelA,
        isPublished: true,
        publishedAt: "2026-01-01T00:00:00Z",
      }),
      createListing({
        channel: channelB,
      }),
      createListing({
        channel: channelC,
      }),
    ];

    // Act
    const summary = getProductAvailabilitySummary(listings, dateNow);

    // Assert
    expect(summary.label).toBe(productAvailabilityMessages.summaryLiveInSome);
    expect(summary.labelValues).toEqual({ liveCount: 1, count: 3 });
    expect(summary.dotStatus).toBe("warning");
  });
});
