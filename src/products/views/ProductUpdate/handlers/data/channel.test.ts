import {
  type DatagridChange,
  type DatagridChangeOpts,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { type ProductDetailsVariantFragment } from "@dashboard/graphql";

import { getUpdateVariantChannelInputs } from "./channel";

const LISTED_CHANNEL = "Q2hhbm5lbDox";
const OTHER_LISTED_CHANNEL = "Q2hhbm5lbDot";
const UNLISTED_CHANNEL = "Q2hhbm5lbDod";
const LISTING_ID = "UHJvZHVjdFZhcmlhbnRDaGFubmVsTGlzdGluZzoyNjA=";
const OTHER_LISTING_ID = "UHJvZHVjdFZhcmlhbnRDaGFubmVsTGlzdGluZzoyNjD=";

const variant = {
  channelListings: [
    { id: LISTING_ID, channel: { id: LISTED_CHANNEL } },
    { id: OTHER_LISTING_ID, channel: { id: OTHER_LISTED_CHANNEL } },
  ],
} as Pick<ProductDetailsVariantFragment, "channelListings">;

const priceChange = (channelId: string, value: number | null, row = 1): DatagridChange => ({
  column: `channel:${channelId}`,
  row,
  data: { kind: "money-cell", value, currency: "USD" },
});

const availabilityChange = (channelId: string, value: boolean, row = 1): DatagridChange => ({
  column: `availableInChannel:${channelId}`,
  row,
  data: value,
});

const changes = (...updates: DatagridChange[]): DatagridChangeOpts => ({
  added: [],
  removed: [],
  updates,
});

describe("getUpdateVariantChannelInputs", () => {
  test("should update prices of existing listings", () => {
    // Arrange
    const data = changes(
      priceChange(LISTED_CHANNEL, 43343),
      priceChange(OTHER_LISTED_CHANNEL, 123),
    );

    // Act
    const result = getUpdateVariantChannelInputs(data, 1, variant);

    // Assert
    expect(result).toEqual({
      create: [],
      remove: [],
      update: [
        { channelListing: LISTING_ID, price: 43343 },
        { channelListing: OTHER_LISTING_ID, price: 123 },
      ],
    });
  });

  test("should mark existing listing unavailable instead of removing it", () => {
    // Arrange
    const data = changes(availabilityChange(OTHER_LISTED_CHANNEL, false));

    // Act
    const result = getUpdateVariantChannelInputs(data, 1, variant);

    // Assert
    expect(result).toEqual({
      create: [],
      remove: [],
      update: [{ channelListing: OTHER_LISTING_ID, isAvailableForPurchase: false }],
    });
  });

  test("should mark existing listing available without touching its price", () => {
    // Arrange
    const data = changes(availabilityChange(LISTED_CHANNEL, true));

    // Act
    const result = getUpdateVariantChannelInputs(data, 1, variant);

    // Assert
    expect(result).toEqual({
      create: [],
      remove: [],
      update: [{ channelListing: LISTING_ID, isAvailableForPurchase: true }],
    });
  });

  test("should use the latest availability change for a channel", () => {
    // Arrange
    const data = changes(
      availabilityChange(LISTED_CHANNEL, false),
      availabilityChange(LISTED_CHANNEL, true),
    );

    // Act
    const result = getUpdateVariantChannelInputs(data, 1, variant);

    // Assert
    expect(result.update).toEqual([{ channelListing: LISTING_ID, isAvailableForPurchase: true }]);
  });

  test("should combine price edit and availability into one listing update", () => {
    // Arrange
    const data = changes(
      priceChange(LISTED_CHANNEL, 15),
      availabilityChange(LISTED_CHANNEL, false),
    );

    // Act
    const result = getUpdateVariantChannelInputs(data, 1, variant);

    // Assert
    expect(result.update).toEqual([
      { channelListing: LISTING_ID, price: 15, isAvailableForPurchase: false },
    ]);
  });

  test("should create available listing with zero price when ticking an unlisted channel", () => {
    // Arrange
    const data = changes(availabilityChange(UNLISTED_CHANNEL, true));

    // Act
    const result = getUpdateVariantChannelInputs(data, 1, variant);

    // Assert
    expect(result).toEqual({
      create: [{ channelId: UNLISTED_CHANNEL, price: 0, isAvailableForPurchase: true }],
      remove: [],
      update: [],
    });
  });

  test("should create listing with entered price for an unlisted channel", () => {
    // Arrange
    const data = changes(
      availabilityChange(UNLISTED_CHANNEL, true),
      priceChange(UNLISTED_CHANNEL, 10),
    );

    // Act
    const result = getUpdateVariantChannelInputs(data, 1, variant);

    // Assert
    expect(result.create).toEqual([
      { channelId: UNLISTED_CHANNEL, price: 10, isAvailableForPurchase: true },
    ]);
  });

  test("should create unavailable listing when price was entered and availability unticked", () => {
    // Arrange
    const data = changes(
      priceChange(UNLISTED_CHANNEL, 10),
      availabilityChange(UNLISTED_CHANNEL, false),
    );

    // Act
    const result = getUpdateVariantChannelInputs(data, 1, variant);

    // Assert
    expect(result.create).toEqual([
      { channelId: UNLISTED_CHANNEL, price: 10, isAvailableForPurchase: false },
    ]);
  });

  test("should not create listing when unlisted channel is unticked without price", () => {
    // Arrange
    const data = changes(availabilityChange(UNLISTED_CHANNEL, false));

    // Act
    const result = getUpdateVariantChannelInputs(data, 1, variant);

    // Assert
    expect(result).toEqual({ create: [], remove: [], update: [] });
  });

  test("should ignore cleared price instead of removing the listing", () => {
    // Arrange
    const data = changes(priceChange(LISTED_CHANNEL, null));

    // Act
    const result = getUpdateVariantChannelInputs(data, 1, variant);

    // Assert
    expect(result).toEqual({ create: [], remove: [], update: [] });
  });

  test("should ignore changes from other rows and non-channel columns", () => {
    // Arrange
    const data = changes(priceChange(LISTED_CHANNEL, 43343, 11), {
      column: "attribute:1",
      row: 1,
      data: { value: { value: "test" } },
    });

    // Act
    const result = getUpdateVariantChannelInputs(data, 1, variant);

    // Assert
    expect(result).toEqual({ create: [], remove: [], update: [] });
  });
});
