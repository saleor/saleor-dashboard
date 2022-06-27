import {
  CollectionDetailsQuery,
  CollectionListQuery,
  CollectionPublished,
} from "@saleor/graphql";
import { RelayToFlat } from "@saleor/types";

import * as richTextEditorFixtures from "../components/RichTextEditor/fixtures.json";
import { CollectionListFilterOpts } from "./components/CollectionListPage";

const content = richTextEditorFixtures.richTextEditor;

export const collectionListFilterOpts: CollectionListFilterOpts = {
  channel: {
    active: false,
    value: "default-channel",
    choices: [
      {
        value: "default-channel",
        label: "Default channel",
      },
    ],
  },
  status: {
    active: false,
    value: CollectionPublished.PUBLISHED,
  },
};

export const collections: RelayToFlat<CollectionListQuery["collections"]> = [
  {
    __typename: "Collection",
    channelListings: [
      {
        __typename: "CollectionChannelListing",
        channel: {
          __typename: "Channel",
          id: "123",
          name: "Channel",
        },
        isPublished: false,
        publicationDate: null,
      },
    ],
    id: "Q29sbGVjdGlvbjox",
    name: "Summer collection",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4,
    },
  },
  {
    __typename: "Collection",
    channelListings: [
      {
        __typename: "CollectionChannelListing",
        channel: {
          __typename: "Channel",
          id: "124",
          name: "Channel",
        },
        isPublished: false,
        publicationDate: null,
      },
    ],
    id: "Q29sbGVjdGlvbjoy",
    name: "Winter sale",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4,
    },
  },
  {
    __typename: "Collection",
    channelListings: [
      {
        __typename: "CollectionChannelListing",
        channel: {
          __typename: "Channel",
          id: "125",
          name: "Channel",
        },
        isPublished: false,
        publicationDate: null,
      },
    ],
    id: "Q29sbGVjdGlvbjoz",
    name: "Vintage vibes",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4,
    },
  },
  {
    __typename: "Collection",
    channelListings: [
      {
        __typename: "CollectionChannelListing",
        channel: {
          __typename: "Channel",
          id: "126",
          name: "Channel",
        },
        isPublished: false,
        publicationDate: null,
      },
    ],
    id: "Q29sbGVjdGlvbjoa",
    name: "Merry Christmas",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4,
    },
  },
  {
    __typename: "Collection",
    channelListings: [
      {
        __typename: "CollectionChannelListing",
        channel: {
          __typename: "Channel",
          id: "127",
          name: "Channel",
        },
        isPublished: false,
        publicationDate: null,
      },
    ],
    id: "Q29sbGVjdGlvbjob",
    name: "80s Miami",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4,
    },
  },
  {
    __typename: "Collection",
    channelListings: [
      {
        __typename: "CollectionChannelListing",
        channel: {
          __typename: "Channel",
          id: "128",
          name: "Channel",
        },
        isPublished: false,
        publicationDate: null,
      },
    ],
    id: "Q29sbGVjdGlvbjoc",
    name: "Yellow Submarine 2019",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4,
    },
  },
];
export const collection: (
  placeholderCollectionImage: string,
  placeholderProductImage: string,
) => CollectionDetailsQuery["collection"] = (
  placeholderCollectionImage,
  placeholderImage,
) => ({
  __typename: "Collection",
  backgroundImage: {
    __typename: "Image",
    alt: "Alt text",
    oembedData: "{}",
    url: placeholderCollectionImage,
  },
  channelListings: [
    {
      __typename: "CollectionChannelListing",
      channel: {
        __typename: "Channel",
        id: "223",
        name: "Channel",
      },
      isPublished: false,
      publicationDate: null,
    },
  ],
  description: JSON.stringify(content),
  id: "Q29sbGVjdGlvbjox",
  metadata: [
    {
      __typename: "MetadataItem",
      key: "integration.id",
      value: "100023123",
    },
  ],
  name: "Summer collection",
  privateMetadata: [],
  products: {
    __typename: "ProductCountableConnection",
    edges: [
      {
        __typename: "ProductCountableEdge",
        node: {
          __typename: "Product",
          channelListings: [
            {
              __typename: "ProductChannelListing",
              availableForPurchase: null,
              channel: {
                __typename: "Channel",
                currencyCode: "USD",
                id: "123",
                name: "Channel1",
              },
              isAvailableForPurchase: false,
              isPublished: true,
              publicationDate: "2020-07-14",
              visibleInListings: true,
            },
            {
              __typename: "ProductChannelListing",
              availableForPurchase: null,
              channel: {
                __typename: "Channel",
                currencyCode: "USD",
                id: "124",
                name: "Channel2",
              },
              isAvailableForPurchase: false,
              isPublished: false,
              publicationDate: "2020-07-30",
              visibleInListings: true,
            },
          ],
          id: "UHJvZHVjdDoxNw==",
          name: "Murray Inc",
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Mg==",
            name: "Mugs",
          },
          thumbnail: { __typename: "Image", url: placeholderImage },
        },
      },
      {
        __typename: "ProductCountableEdge",
        node: {
          __typename: "Product",
          channelListings: [
            {
              __typename: "ProductChannelListing",
              availableForPurchase: null,
              channel: {
                __typename: "Channel",
                currencyCode: "USD",
                id: "123",
                name: "Channel1",
              },
              isAvailableForPurchase: false,
              isPublished: true,
              publicationDate: "2020-07-14",
              visibleInListings: true,
            },
            {
              __typename: "ProductChannelListing",
              availableForPurchase: null,
              channel: {
                __typename: "Channel",
                currencyCode: "USD",
                id: "124",
                name: "Channel2",
              },
              isAvailableForPurchase: false,
              isPublished: false,
              publicationDate: "2020-07-30",
              visibleInListings: true,
            },
          ],
          id: "UHJvZHVjdDoyNw==",
          name: "Williams-Taylor",
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Mw==",
            name: "Coffee",
          },
          thumbnail: { __typename: "Image", url: placeholderImage },
        },
      },
      {
        __typename: "ProductCountableEdge",
        node: {
          __typename: "Product",
          channelListings: [
            {
              __typename: "ProductChannelListing",
              availableForPurchase: null,
              channel: {
                __typename: "Channel",
                currencyCode: "USD",
                id: "123",
                name: "Channel1",
              },
              isAvailableForPurchase: false,
              isPublished: true,
              publicationDate: "2020-07-14",
              visibleInListings: false,
            },
            {
              __typename: "ProductChannelListing",
              availableForPurchase: null,
              channel: {
                __typename: "Channel",
                currencyCode: "USD",
                id: "124",
                name: "Channel2",
              },
              isAvailableForPurchase: false,
              isPublished: false,
              publicationDate: "2020-07-30",
              visibleInListings: false,
            },
          ],
          id: "UHJvZHVjdDoyOQ==",
          name: "Hebert-Sherman",
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Mw==",
            name: "Coffee",
          },
          thumbnail: { __typename: "Image", url: placeholderImage },
        },
      },
      {
        __typename: "ProductCountableEdge",
        node: {
          __typename: "Product",
          channelListings: [
            {
              __typename: "ProductChannelListing",
              availableForPurchase: null,
              channel: {
                __typename: "Channel",
                currencyCode: "USD",
                id: "123",
                name: "Channel1",
              },
              isAvailableForPurchase: false,
              isPublished: true,
              publicationDate: "2020-07-14",
              visibleInListings: false,
            },
            {
              __typename: "ProductChannelListing",
              availableForPurchase: null,
              channel: {
                __typename: "Channel",
                currencyCode: "USD",
                id: "124",
                name: "Channel2",
              },
              isAvailableForPurchase: false,
              isPublished: false,
              publicationDate: "2020-07-30",
              visibleInListings: false,
            },
          ],
          id: "UHJvZHVjdDo1Mw==",
          name: "Estes, Johnson and Graham",
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Ng==",
            name: "Books",
          },
          thumbnail: { __typename: "Image", url: placeholderImage },
        },
      },
    ],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: "",
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "",
    },
  },
  seoDescription: "",
  seoTitle: "",
  slug: "summer-collection",
});
