import { variant } from "@dashboard/products/fixtures";

import { getAvailabilityCountForVariant } from "./availabilityCount";

const mockedVariant = variant("");

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

describe("getAvailabilityCountForVariant", () => {
  it("should return correct counts when all channels are selected", () => {
    const item = {
      ...mockedVariant,
      product: {
        ...mockedVariant.product,
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

    const result = getAvailabilityCountForVariant(item, mockedListings);

    expect(result).toEqual({
      publishedInChannelsCount: 2,
      availableChannelsCount: 2,
    });
  });

  it("should return correct counts when some channels are selected", () => {
    const item = {
      ...mockedVariant,
      product: {
        ...mockedVariant.product,
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
    const mockedListingsSome = mockedListings.slice(0, 1);

    const result = getAvailabilityCountForVariant(item, mockedListingsSome);

    expect(result).toEqual({
      publishedInChannelsCount: 1,
      availableChannelsCount: 2,
    });
  });

  it("should return correct counts when no channels are available", () => {
    const item = {
      ...mockedVariant,
      product: {
        ...mockedVariant.product,
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

    const result = getAvailabilityCountForVariant(item, []);

    expect(result).toEqual({
      publishedInChannelsCount: 0,
      availableChannelsCount: 2,
    });
  });
});
