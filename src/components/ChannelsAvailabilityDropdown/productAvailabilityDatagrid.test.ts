import { createIntl } from "react-intl";

import { messages, productAvailabilityMessages } from "./messages";
import {
  getProductAvailabilityCellDisplay,
  getProductAvailabilityListingsForDisplay,
  getProductAvailabilityStatusCell,
} from "./productAvailabilityDatagrid";
import { type ProductChannelListing } from "./productUtils";

const intl = createIntl({ locale: "en", messages: {} });

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

describe("getProductAvailabilityListingsForDisplay", () => {
  it("returns the selected channel listing when a channel filter is active", () => {
    // Arrange
    const selected = createListing({
      channel: channelA,
      isPublished: true,
      publishedAt: "2026-01-01T00:00:00Z",
    });
    const listings = [
      selected,
      createListing({
        channel: channelB,
        isPublished: false,
      }),
    ];

    // Act
    const result = getProductAvailabilityListingsForDisplay(listings, selected);

    // Assert
    expect(result).toEqual([selected]);
  });

  it("returns all listings when no channel filter is active", () => {
    // Arrange
    const listings = [createListing({ channel: channelA }), createListing({ channel: channelB })];

    // Act
    const result = getProductAvailabilityListingsForDisplay(listings);

    // Assert
    expect(result).toEqual(listings);
  });
});

describe("getProductAvailabilityCellDisplay", () => {
  it("returns no channels label when there are no listings", () => {
    // Act
    const display = getProductAvailabilityCellDisplay([], intl, dateNow);

    // Assert
    expect(display.dotStatus).toBe("error");
    expect(display.label).toBe(intl.formatMessage(messages.noChannels));
  });

  it("returns live in some channels summary for mixed listings", () => {
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
        isPublished: false,
      }),
    ];

    // Act
    const display = getProductAvailabilityCellDisplay(listings, intl, dateNow);

    // Assert
    expect(display.dotStatus).toBe("warning");
    expect(display.label).toBe(
      intl.formatMessage(productAvailabilityMessages.summaryLiveInSome, {
        liveCount: 1,
        count: 2,
      }),
    );
  });

  it("returns warning dot for live product in an inactive channel", () => {
    // Arrange
    const listing = createListing({
      channel: { ...channelA, isActive: false },
      isPublished: true,
      publishedAt: "2026-01-01T00:00:00Z",
      availableForPurchaseAt: "2026-01-01T00:00:00Z",
    });

    // Act
    const display = getProductAvailabilityCellDisplay([listing], intl, dateNow);

    // Assert
    expect(display.dotStatus).toBe("warning");
    expect(display.label).toBe(intl.formatMessage(productAvailabilityMessages.statusLive));
  });
});

describe("getProductAvailabilityStatusCell", () => {
  it("returns a status cell with the computed label and dot status", () => {
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
    const cell = getProductAvailabilityStatusCell(listings, intl, dateNow);

    // Assert
    expect(cell.data.kind).toBe("status-cell");
    expect(cell.data.status).toBe("success");
    expect(cell.data.value).toBe(
      intl.formatMessage(productAvailabilityMessages.summaryAllLive, { count: 2 }),
    );
  });
});
