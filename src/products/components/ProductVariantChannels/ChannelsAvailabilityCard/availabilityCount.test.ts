import { product, variant } from "@dashboard/products/fixtures";

import {
  getAvailabilityCountForProduct,
  getAvailabilityCountForVariant,
} from "./availabilityCount";

const variantFixture = variant("");
const productFixture = product("");

const mockedChannel = {
  __typename: "Channel" as const,
  currencyCode: "USD",
  name: "Channel",
};

const mockedProductListing = {
  __typename: "ProductChannelListing" as const,
  id: "UHJvZHVjdENoYW5uZWxMaXN0aW5nOjQ=",
  publicationDate: "2020-01-01",
};

const mockedListings = [
  {
    data: {
      costPrice: "4",
      currency: "PLN",
      id: "1",
      name: "Channel-PLN",
      price: "20",
      preorderThreshold: null,
      soldUnits: 0,
    },
    id: "1",
    label: "Channel-PLN",
    value: {
      costPrice: "4",
      price: "20",
      preorderThreshold: null,
    },
  },
  {
    data: {
      costPrice: "",
      currency: "USD",
      id: "2",
      name: "Channel-USD",
      price: "4",
      preorderThreshold: null,
      soldUnits: 0,
    },
    id: "2",
    label: "Channel-USD",
    value: {
      costPrice: "",
      price: "4",
      preorderThreshold: null,
    },
  },
];

const mockedVariant = {
  ...variantFixture,
  product: {
    ...variantFixture.product,
    channelListings: [
      {
        ...mockedProductListing,
        channel: { id: "1", ...mockedChannel },
        isPublished: true,
      },
      {
        ...mockedProductListing,
        channel: { id: "2", ...mockedChannel },
        isPublished: true,
      },
    ],
  },
};

const mockedProduct = {
  ...productFixture,
  channelListings: [
    {
      ...mockedProductListing,
      channel: { id: "1", ...mockedChannel },
      isPublished: true,
    },
    {
      ...mockedProductListing,
      channel: { id: "2", ...mockedChannel },
      isPublished: true,
    },
  ],
};

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
    const listings = [];

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
    const listings = [];

    // Act
    const result = getAvailabilityCountForProduct(item, listings);

    // Assert
    expect(result).toEqual({
      publishedInChannelsCount: 0,
      availableChannelsCount: 2,
    });
  });
});
