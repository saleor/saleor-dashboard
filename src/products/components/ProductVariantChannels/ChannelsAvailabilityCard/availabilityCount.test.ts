import {
  ChannelPriceAndPreorderData,
  IChannelPriceAndPreorderArgs,
} from "@dashboard/channels/utils";
import {
  ProductVariantCreateDataQuery,
  ProductVariantFragment,
} from "@dashboard/graphql";
import { FormsetData } from "@dashboard/hooks/useFormset";

import {
  getAvailabilityCountForProduct,
  getAvailabilityCountForVariant,
} from "./availabilityCount";

const mockedListings = [
  {
    id: "1",
    label: "Channel-PLN",
  },
  {
    id: "2",
    label: "Channel-USD",
  },
] as unknown as FormsetData<
  ChannelPriceAndPreorderData,
  IChannelPriceAndPreorderArgs
>;

const mockedVariant = {
  product: {
    channelListings: [
      {
        channel: { id: "1" },
        isPublished: true,
      },
      {
        channel: { id: "2" },
        isPublished: true,
      },
    ],
  },
} as unknown as ProductVariantFragment;

const mockedProduct = {
  channelListings: [
    {
      channel: { id: "1" },
      isPublished: true,
    },
    {
      channel: { id: "2" },
      isPublished: true,
    },
  ],
} as unknown as ProductVariantCreateDataQuery["product"];

describe("getAvailabilityCountForVariant", () => {
  it("should return correct counts when all channels are selected", () => {
    // Arrange
    const item = mockedVariant;
    const listings = mockedListings;

    // Act
    const result = getAvailabilityCountForVariant(item, listings);

    // Assert
    expect(result).toEqual({
      publishedInChannelsCount: 2,
      availableChannelsCount: 2,
    });
  });

  it("should return correct counts when some channels are selected", () => {
    // Arrange
    const item = mockedVariant;
    const listings = mockedListings.slice(0, 1);

    // Act
    const result = getAvailabilityCountForVariant(item, listings);

    // Assert
    expect(result).toEqual({
      publishedInChannelsCount: 1,
      availableChannelsCount: 2,
    });
  });

  it("should return correct counts when no channels are available", () => {
    // Arrange
    const item = mockedVariant;
    const listings = [] as FormsetData<
      ChannelPriceAndPreorderData,
      IChannelPriceAndPreorderArgs
    >;

    // Act
    const result = getAvailabilityCountForVariant(item, listings);

    // Assert
    expect(result).toEqual({
      publishedInChannelsCount: 0,
      availableChannelsCount: 2,
    });
  });
});

describe("getAvailabilityCountForProduct", () => {
  it("should return correct counts when all channels are selected", () => {
    // Arrange
    const item = mockedProduct;
    const listings = mockedListings;

    // Act
    const result = getAvailabilityCountForProduct(item, listings);

    // Assert
    expect(result).toEqual({
      publishedInChannelsCount: 2,
      availableChannelsCount: 2,
    });
  });

  it("should return correct counts when some channels are selected", () => {
    // Arrange
    const item = mockedProduct;
    const listings = mockedListings.slice(0, 1);

    // Act
    const result = getAvailabilityCountForProduct(item, listings);

    // Assert
    expect(result).toEqual({
      publishedInChannelsCount: 1,
      availableChannelsCount: 2,
    });
  });

  it("should return correct counts when no channels are available", () => {
    // Arrange
    const item = mockedProduct;
    const listings = [] as FormsetData<
      ChannelPriceAndPreorderData,
      IChannelPriceAndPreorderArgs
    >;

    // Act
    const result = getAvailabilityCountForProduct(item, listings);

    // Assert
    expect(result).toEqual({
      publishedInChannelsCount: 0,
      availableChannelsCount: 2,
    });
  });
});
