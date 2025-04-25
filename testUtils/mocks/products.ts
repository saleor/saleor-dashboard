import { MockedResponse } from "@apollo/client/testing";
import { productListQuery } from "@dashboard/products/queries";

export const productsMocks: MockedResponse[] = [
  {
    request: {
      query: productListQuery,
      variables: {
        first: 3,
        hasChannel: true,
        hasSelectedAttributes: true,
      },
    },
    result: {
      data: {
        products: {
          edges: [
            {
              node: {
                id: "UHJvZHVjdDo3Mg==",
                name: "Apple Juice",
                thumbnail: {
                  url: "https://wb-t-3-4-6.staging.saleor.cloud/media/thumbnails/products/saleordemoproduct_fd_juice_06_XO6p2Xu_thumbnail_256.png",
                  __typename: "Image",
                },
                productType: {
                  id: "UHJvZHVjdFR5cGU6OQ==",
                  name: "Juice",
                  hasVariants: true,
                  __typename: "ProductType",
                },
                channelListings: [
                  {
                    isPublished: true,
                    publishedAt: "2020-01-01",
                    isAvailableForPurchase: true,
                    availableForPurchase: "2020-08-31",
                    visibleInListings: true,
                    channel: {
                      id: "Q2hhbm5lbDox",
                      name: "Default channel",
                      currencyCode: "USD",
                      __typename: "Channel",
                    },
                    __typename: "ProductChannelListing",
                    pricing: {
                      priceRange: {
                        start: {
                          net: {
                            amount: 5.0,
                            currency: "USD",
                            __typename: "Money",
                          },
                          __typename: "TaxedMoney",
                        },
                        stop: {
                          net: {
                            amount: 7.0,
                            currency: "USD",
                            __typename: "Money",
                          },
                          __typename: "TaxedMoney",
                        },
                        __typename: "TaxedMoneyRange",
                      },
                      __typename: "ProductPricingInfo",
                    },
                  },
                ],
                __typename: "Product",
                updatedAt: "2021-03-10T12:31:34.521213+00:00",
                attributes: [
                  {
                    attribute: {
                      id: "QXR0cmlidXRlOjE2",
                      __typename: "Attribute",
                    },
                    values: [
                      {
                        id: "QXR0cmlidXRlVmFsdWU6Mw==",
                        name: "Apple",
                        slug: "apple",
                        file: null,
                        reference: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                        value: "",
                        __typename: "AttributeValue",
                      },
                    ],
                    __typename: "SelectedAttribute",
                  },
                ],
              },
              __typename: "ProductCountableEdge",
            },
            {
              node: {
                id: "UHJvZHVjdDo3NA==",
                name: "Banana Juice",
                thumbnail: {
                  url: "https://wb-t-3-4-6.staging.saleor.cloud/media/thumbnails/products/saleordemoproduct_fd_juice_01_thumbnail_256.png",
                  __typename: "Image",
                },
                productType: {
                  id: "UHJvZHVjdFR5cGU6OQ==",
                  name: "Juice",
                  hasVariants: true,
                  __typename: "ProductType",
                },
                channelListings: [
                  {
                    isPublished: true,
                    publishedAt: "2020-01-01",
                    isAvailableForPurchase: true,
                    availableForPurchase: "2020-08-31",
                    visibleInListings: true,
                    channel: {
                      id: "Q2hhbm5lbDox",
                      name: "Default channel",
                      currencyCode: "USD",
                      __typename: "Channel",
                    },
                    __typename: "ProductChannelListing",
                    pricing: {
                      priceRange: {
                        start: {
                          net: {
                            amount: 5.0,
                            currency: "USD",
                            __typename: "Money",
                          },
                          __typename: "TaxedMoney",
                        },
                        stop: {
                          net: {
                            amount: 7.0,
                            currency: "USD",
                            __typename: "Money",
                          },
                          __typename: "TaxedMoney",
                        },
                        __typename: "TaxedMoneyRange",
                      },
                      __typename: "ProductPricingInfo",
                    },
                  },
                ],
                __typename: "Product",
                updatedAt: "2021-03-10T12:31:34.897799+00:00",
                attributes: [
                  {
                    attribute: {
                      id: "QXR0cmlidXRlOjE2",
                      __typename: "Attribute",
                    },
                    values: [
                      {
                        id: "QXR0cmlidXRlVmFsdWU6NTA=",
                        name: "Banana",
                        slug: "banana",
                        file: null,
                        reference: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                        value: "",
                        __typename: "AttributeValue",
                      },
                    ],
                    __typename: "SelectedAttribute",
                  },
                ],
              },
              __typename: "ProductCountableEdge",
            },
            {
              node: {
                id: "UHJvZHVjdDoxMjI=",
                name: "Bathroom Songs",
                thumbnail: {
                  url: "https://wb-t-3-4-6.staging.saleor.cloud/media/thumbnails/products/saleor-digital-03_4_thumbnail_256.png",
                  __typename: "Image",
                },
                productType: {
                  id: "UHJvZHVjdFR5cGU6MTU=",
                  name: "Audiobook",
                  hasVariants: true,
                  __typename: "ProductType",
                },
                channelListings: [
                  {
                    isPublished: true,
                    publishedAt: "2020-01-01",
                    isAvailableForPurchase: true,
                    availableForPurchase: "2020-08-31",
                    visibleInListings: false,
                    channel: {
                      id: "Q2hhbm5lbDox",
                      name: "Default channel",
                      currencyCode: "USD",
                      __typename: "Channel",
                    },
                    __typename: "ProductChannelListing",
                    pricing: {
                      priceRange: {
                        start: {
                          net: {
                            amount: 6.0,
                            currency: "USD",
                            __typename: "Money",
                          },
                          __typename: "TaxedMoney",
                        },
                        stop: {
                          net: {
                            amount: 6.0,
                            currency: "USD",
                            __typename: "Money",
                          },
                          __typename: "TaxedMoney",
                        },
                        __typename: "TaxedMoneyRange",
                      },
                      __typename: "ProductPricingInfo",
                    },
                  },
                ],
                __typename: "Product",
                updatedAt: "2021-03-10T12:31:40.785454+00:00",
                attributes: [
                  {
                    attribute: {
                      id: "QXR0cmlidXRlOjI2",
                      __typename: "Attribute",
                    },
                    values: [
                      {
                        id: "QXR0cmlidXRlVmFsdWU6ODY=",
                        name: "Digital Audio",
                        slug: "digital-audio",
                        file: null,
                        reference: null,
                        boolean: null,
                        date: null,
                        dateTime: null,
                        value: "",
                        __typename: "AttributeValue",
                      },
                    ],
                    __typename: "SelectedAttribute",
                  },
                ],
              },
              __typename: "ProductCountableEdge",
            },
          ],
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: true,
            startCursor: "WyJhcHBsZS1qdWljZSJd",
            endCursor: "WyJiYXRocm9vbS1zb25ncyJd",
            __typename: "PageInfo",
          },
          totalCount: 41,
          __typename: "ProductCountableConnection",
        },
      },
      extensions: {
        cost: { requestedQueryCost: 13, maximumAvailable: 50000 },
      },
    },
  },
];

export default productsMocks;
