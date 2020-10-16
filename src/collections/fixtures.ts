import { content } from "../storybook/stories/components/RichTextEditor";
import { CollectionDetails_collection } from "./types/CollectionDetails";
import { CollectionList_collections_edges_node } from "./types/CollectionList";

export const collections: CollectionList_collections_edges_node[] = [
  {
    __typename: "Collection",
    id: "Q29sbGVjdGlvbjox",
    isPublished: true,
    name: "Summer collection",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4
    }
  },
  {
    __typename: "Collection",
    id: "Q29sbGVjdGlvbjoy",
    isPublished: true,
    name: "Winter sale",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4
    }
  },
  {
    __typename: "Collection",
    id: "Q29sbGVjdGlvbjoz",
    isPublished: true,
    name: "Vintage vibes",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4
    }
  },
  {
    __typename: "Collection",
    id: "Q29sbGVjdGlvbjoa",
    isPublished: true,
    name: "Merry Christmas",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4
    }
  },
  {
    __typename: "Collection",
    id: "Q29sbGVjdGlvbjob",
    isPublished: true,
    name: "80s Miami",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4
    }
  },
  {
    __typename: "Collection",
    id: "Q29sbGVjdGlvbjoc",
    isPublished: true,
    name: "Yellow Submarine 2019",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4
    }
  }
];
export const collection: (
  placeholderCollectionImage: string,
  placeholderProductImage: string
) => CollectionDetails_collection = (
  placeholderCollectionImage,
  placeholderImage
) => ({
  __typename: "Collection",
  backgroundImage: {
    __typename: "Image",
    alt: "Alt text",
    url: placeholderCollectionImage
  },
  descriptionJson: JSON.stringify(content),
  id: "Q29sbGVjdGlvbjox",
  isPublished: true,
  name: "Summer collection",
  products: {
    __typename: "ProductCountableConnection",
    edges: [
      {
        __typename: "ProductCountableEdge",
        node: {
          __typename: "Product",
          channelListing: [
            {
              __typename: "ProductChannelListing",
              availableForPurchase: null,
              channel: {
                __typename: "Channel",
                currencyCode: "USD",
                id: "123",
                name: "Channel1"
              },
              discountedPrice: {
                __typename: "Money",
                amount: 1,
                currency: "USD"
              },
              isAvailableForPurchase: false,
              isPublished: true,
              publicationDate: "2020-07-14",
              visibleInListings: true
            },
            {
              __typename: "ProductChannelListing",
              availableForPurchase: null,
              channel: {
                __typename: "Channel",
                currencyCode: "USD",
                id: "124",
                name: "Channel2"
              },
              discountedPrice: {
                __typename: "Money",
                amount: 1,
                currency: "USD"
              },
              isAvailableForPurchase: false,
              isPublished: false,
              publicationDate: "2020-07-30",
              visibleInListings: true
            }
          ],
          id: "UHJvZHVjdDoxNw==",
          name: "Murray Inc",
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Mg==",
            name: "Mugs"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      },
      {
        __typename: "ProductCountableEdge",
        node: {
          __typename: "Product",
          channelListing: [
            {
              __typename: "ProductChannelListing",
              availableForPurchase: null,
              channel: {
                __typename: "Channel",
                currencyCode: "USD",
                id: "123",
                name: "Channel1"
              },
              discountedPrice: {
                __typename: "Money",
                amount: 1,
                currency: "USD"
              },
              isAvailableForPurchase: false,
              isPublished: true,
              publicationDate: "2020-07-14",
              visibleInListings: true
            },
            {
              __typename: "ProductChannelListing",
              availableForPurchase: null,
              channel: {
                __typename: "Channel",
                currencyCode: "USD",
                id: "124",
                name: "Channel2"
              },
              discountedPrice: {
                __typename: "Money",
                amount: 1,
                currency: "USD"
              },
              isAvailableForPurchase: false,
              isPublished: false,
              publicationDate: "2020-07-30",
              visibleInListings: true
            }
          ],
          id: "UHJvZHVjdDoyNw==",
          name: "Williams-Taylor",
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Mw==",
            name: "Coffee"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      },
      {
        __typename: "ProductCountableEdge",
        node: {
          __typename: "Product",
          channelListing: [
            {
              __typename: "ProductChannelListing",
              availableForPurchase: null,
              channel: {
                __typename: "Channel",
                currencyCode: "USD",
                id: "123",
                name: "Channel1"
              },
              discountedPrice: {
                __typename: "Money",
                amount: 1,
                currency: "USD"
              },
              isAvailableForPurchase: false,
              isPublished: true,
              publicationDate: "2020-07-14",
              visibleInListings: false
            },
            {
              __typename: "ProductChannelListing",
              availableForPurchase: null,
              channel: {
                __typename: "Channel",
                currencyCode: "USD",
                id: "124",
                name: "Channel2"
              },
              discountedPrice: {
                __typename: "Money",
                amount: 1,
                currency: "USD"
              },
              isAvailableForPurchase: false,
              isPublished: false,
              publicationDate: "2020-07-30",
              visibleInListings: false
            }
          ],
          id: "UHJvZHVjdDoyOQ==",
          name: "Hebert-Sherman",
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Mw==",
            name: "Coffee"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      },
      {
        __typename: "ProductCountableEdge",
        node: {
          __typename: "Product",
          channelListing: [
            {
              __typename: "ProductChannelListing",
              availableForPurchase: null,
              channel: {
                __typename: "Channel",
                currencyCode: "USD",
                id: "123",
                name: "Channel1"
              },
              discountedPrice: {
                __typename: "Money",
                amount: 1,
                currency: "USD"
              },
              isAvailableForPurchase: false,
              isPublished: true,
              publicationDate: "2020-07-14",
              visibleInListings: false
            },
            {
              __typename: "ProductChannelListing",
              availableForPurchase: null,
              channel: {
                __typename: "Channel",
                currencyCode: "USD",
                id: "124",
                name: "Channel2"
              },
              discountedPrice: {
                __typename: "Money",
                amount: 1,
                currency: "USD"
              },
              isAvailableForPurchase: false,
              isPublished: false,
              publicationDate: "2020-07-30",
              visibleInListings: false
            }
          ],
          id: "UHJvZHVjdDo1Mw==",
          name: "Estes, Johnson and Graham",
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Ng==",
            name: "Books"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      }
    ],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: "",
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: ""
    }
  },
  publicationDate: "2018-08-25T18:45:54.125Z",
  seoDescription: "",
  seoTitle: ""
});
