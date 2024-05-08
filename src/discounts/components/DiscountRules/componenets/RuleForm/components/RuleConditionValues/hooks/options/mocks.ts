import {
  SearchCategoriesDocument,
  SearchCollectionsDocument,
  SearchProductsDocument,
  SearchVariantsDocument,
} from "@dashboard/graphql";

const queryVariablesMock = {
  after: null,
  first: 20,
  query: "",
  PERMISSION_HANDLE_CHECKOUTS: false,
  PERMISSION_HANDLE_PAYMENTS: false,
  PERMISSION_HANDLE_TAXES: false,
  PERMISSION_IMPERSONATE_USER: false,
  PERMISSION_MANAGE_APPS: false,
  PERMISSION_MANAGE_CHANNELS: false,
  PERMISSION_MANAGE_CHECKOUTS: false,
  PERMISSION_MANAGE_DISCOUNTS: false,
  PERMISSION_MANAGE_GIFT_CARD: false,
  PERMISSION_MANAGE_MENUS: false,
  PERMISSION_MANAGE_OBSERVABILITY: false,
  PERMISSION_MANAGE_ORDERS: false,
  PERMISSION_MANAGE_ORDERS_IMPORT: false,
  PERMISSION_MANAGE_PAGES: false,
  PERMISSION_MANAGE_PAGE_TYPES_AND_ATTRIBUTES: false,
  PERMISSION_MANAGE_PLUGINS: false,
  PERMISSION_MANAGE_PRODUCTS: false,
  PERMISSION_MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES: false,
  PERMISSION_MANAGE_SETTINGS: false,
  PERMISSION_MANAGE_SHIPPING: false,
  PERMISSION_MANAGE_STAFF: false,
  PERMISSION_MANAGE_TAXES: false,
  PERMISSION_MANAGE_TRANSLATIONS: false,
  PERMISSION_MANAGE_USERS: false,
};

export const searchCategoriesMock = {
  request: {
    query: SearchCategoriesDocument,
    variables: {
      ...queryVariablesMock,
    },
  },
  result: {
    data: {
      search: {
        edges: [
          {
            node: {
              id: "Q2F0ZWdvcnk6Nw==",
              name: "Accessories",
              ancestors: [],
            },
          },
          {
            node: {
              id: "Q2F0ZWdvcnk6OA==",
              name: "Groceries",
              ancestors: [],
            },
          },
          {
            node: {
              id: "Q2F0ZWdvcnk6OQ==",
              name: "Apparel",
              ancestors: [],
            },
          },
          {
            node: {
              id: "Q2F0ZWdvcnk6MTA=",
              name: "T-shirts",
              ancestors: [],
            },
          },
        ],
        pageInfo: {
          endCursor: "WyI0OTgiXQ==",
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: "WyI3Il0=",
        },
      },
    },
  },
};

export const searchCollectionsMock = {
  request: {
    query: SearchCollectionsDocument,
    variables: {
      ...queryVariablesMock,
      channel: "test",
    },
  },
  result: {
    data: {
      search: {
        edges: [
          {
            node: {
              id: "Q29sbGVjdGlvbjoz",
              name: "Featured Products",
            },
          },
          {
            node: {
              id: "Q29sbGVjdGlvbjox",
              name: "Summer collection",
            },
          },
          {
            node: {
              id: "Q29sbGVjdGlvbjoy",
              name: "Winter sale",
            },
          },
        ],
        pageInfo: {
          endCursor: "WyJ3aW50ZXItc2FsZSJd",
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: "WyJmZWF0dXJlZC1wcm9kdWN0cyJd",
        },
      },
    },
  },
};

export const searchProductsMock = {
  request: {
    query: SearchProductsDocument,
    variables: {
      ...queryVariablesMock,
      channel: "test",
    },
  },
  result: {
    data: {
      search: {
        edges: [
          {
            node: {
              id: "UHJvZHVjdDo3Mg==",
              name: "Apple Juice",
              thumbnail: {
                url: "https://feature-checkout-and-order-promotions.api.saleor.rocks/thumbnail/UHJvZHVjdE1lZGlhOjc=/256/",
                __typename: "Image",
              },
              channelListings: [],
              variants: [
                {
                  id: "UHJvZHVjdFZhcmlhbnQ6MjAz",
                  name: "1l",
                  sku: "43226647",
                  channelListings: [
                    {
                      channel: {
                        id: "Q2hhbm5lbDox",
                        isActive: true,
                        name: "Channel-USD",
                        currencyCode: "USD",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 5,
                        currency: "USD",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                    {
                      channel: {
                        id: "Q2hhbm5lbDoy",
                        isActive: true,
                        name: "Channel-PLN",
                        currencyCode: "PLN",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 20,
                        currency: "PLN",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                  ],
                  __typename: "ProductVariant",
                },
                {
                  id: "UHJvZHVjdFZhcmlhbnQ6MjA0",
                  name: "2l",
                  sku: "80884671",
                  channelListings: [
                    {
                      channel: {
                        id: "Q2hhbm5lbDox",
                        isActive: true,
                        name: "Channel-USD",
                        currencyCode: "USD",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 7,
                        currency: "USD",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                    {
                      channel: {
                        id: "Q2hhbm5lbDoy",
                        isActive: true,
                        name: "Channel-PLN",
                        currencyCode: "PLN",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 28,
                        currency: "PLN",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                  ],
                  __typename: "ProductVariant",
                },
                {
                  id: "UHJvZHVjdFZhcmlhbnQ6MjAy",
                  name: "500ml",
                  sku: "93855755",
                  channelListings: [
                    {
                      channel: {
                        id: "Q2hhbm5lbDox",
                        isActive: true,
                        name: "Channel-USD",
                        currencyCode: "USD",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 5,
                        currency: "USD",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                    {
                      channel: {
                        id: "Q2hhbm5lbDoy",
                        isActive: true,
                        name: "Channel-PLN",
                        currencyCode: "PLN",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 20,
                        currency: "PLN",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                  ],
                  __typename: "ProductVariant",
                },
              ],
              collections: [],
              __typename: "Product",
            },
            __typename: "ProductCountableEdge",
          },
          {
            node: {
              id: "UHJvZHVjdDo3NA==",
              name: "Banana Juice",
              thumbnail: {
                url: "https://feature-checkout-and-order-promotions.api.saleor.rocks/thumbnail/UHJvZHVjdE1lZGlhOjk=/256/",
                __typename: "Image",
              },
              channelListings: [],
              variants: [
                {
                  id: "UHJvZHVjdFZhcmlhbnQ6MjA5",
                  name: "1l",
                  sku: "27512590",
                  channelListings: [
                    {
                      channel: {
                        id: "Q2hhbm5lbDox",
                        isActive: true,
                        name: "Channel-USD",
                        currencyCode: "USD",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 5,
                        currency: "USD",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                    {
                      channel: {
                        id: "Q2hhbm5lbDoy",
                        isActive: true,
                        name: "Channel-PLN",
                        currencyCode: "PLN",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 20,
                        currency: "PLN",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                  ],
                  __typename: "ProductVariant",
                },
                {
                  id: "UHJvZHVjdFZhcmlhbnQ6MjEw",
                  name: "2l",
                  sku: "40636347",
                  channelListings: [
                    {
                      channel: {
                        id: "Q2hhbm5lbDox",
                        isActive: true,
                        name: "Channel-USD",
                        currencyCode: "USD",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 7,
                        currency: "USD",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                    {
                      channel: {
                        id: "Q2hhbm5lbDoy",
                        isActive: true,
                        name: "Channel-PLN",
                        currencyCode: "PLN",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 28,
                        currency: "PLN",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                  ],
                  __typename: "ProductVariant",
                },
                {
                  id: "UHJvZHVjdFZhcmlhbnQ6MjA4",
                  name: "500ml",
                  sku: "45328412",
                  channelListings: [
                    {
                      channel: {
                        id: "Q2hhbm5lbDox",
                        isActive: true,
                        name: "Channel-USD",
                        currencyCode: "USD",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 5,
                        currency: "USD",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                    {
                      channel: {
                        id: "Q2hhbm5lbDoy",
                        isActive: true,
                        name: "Channel-PLN",
                        currencyCode: "PLN",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 20,
                        currency: "PLN",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                  ],
                  __typename: "ProductVariant",
                },
              ],
              collections: [],
              __typename: "Product",
            },
            __typename: "ProductCountableEdge",
          },
          {
            node: {
              id: "UHJvZHVjdDo3OQ==",
              name: "Bean Juice",
              thumbnail: {
                url: "https://feature-checkout-and-order-promotions.api.saleor.rocks/thumbnail/UHJvZHVjdE1lZGlhOjE0/256/",
                __typename: "Image",
              },
              channelListings: [],
              variants: [
                {
                  id: "UHJvZHVjdFZhcmlhbnQ6MjI1",
                  name: "2l",
                  sku: "21438542",
                  channelListings: [
                    {
                      channel: {
                        id: "Q2hhbm5lbDox",
                        isActive: true,
                        name: "Channel-USD",
                        currencyCode: "USD",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 7,
                        currency: "USD",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                    {
                      channel: {
                        id: "Q2hhbm5lbDoy",
                        isActive: true,
                        name: "Channel-PLN",
                        currencyCode: "PLN",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 28,
                        currency: "PLN",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                  ],
                  __typename: "ProductVariant",
                },
                {
                  id: "UHJvZHVjdFZhcmlhbnQ6MjIz",
                  name: "500ml",
                  sku: "57211177",
                  channelListings: [
                    {
                      channel: {
                        id: "Q2hhbm5lbDox",
                        isActive: true,
                        name: "Channel-USD",
                        currencyCode: "USD",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 5,
                        currency: "USD",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                    {
                      channel: {
                        id: "Q2hhbm5lbDoy",
                        isActive: true,
                        name: "Channel-PLN",
                        currencyCode: "PLN",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 20,
                        currency: "PLN",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                  ],
                  __typename: "ProductVariant",
                },
                {
                  id: "UHJvZHVjdFZhcmlhbnQ6MjI0",
                  name: "1l",
                  sku: "57423879",
                  channelListings: [
                    {
                      channel: {
                        id: "Q2hhbm5lbDox",
                        isActive: true,
                        name: "Channel-USD",
                        currencyCode: "USD",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 5,
                        currency: "USD",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                    {
                      channel: {
                        id: "Q2hhbm5lbDoy",
                        isActive: true,
                        name: "Channel-PLN",
                        currencyCode: "PLN",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 20,
                        currency: "PLN",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                  ],
                  __typename: "ProductVariant",
                },
              ],
              collections: [],
              __typename: "Product",
            },
            __typename: "ProductCountableEdge",
          },
          {
            node: {
              id: "UHJvZHVjdDoxMTU=",
              name: "Black Hoodie",
              thumbnail: {
                url: "https://feature-checkout-and-order-promotions.api.saleor.rocks/thumbnail/UHJvZHVjdE1lZGlhOjQ2/256/",
                __typename: "Image",
              },
              channelListings: [],
              variants: [
                {
                  id: "UHJvZHVjdFZhcmlhbnQ6Mjk5",
                  name: "XL",
                  sku: "19230637",
                  channelListings: [
                    {
                      channel: {
                        id: "Q2hhbm5lbDox",
                        isActive: true,
                        name: "Channel-USD",
                        currencyCode: "USD",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 5,
                        currency: "USD",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                    {
                      channel: {
                        id: "Q2hhbm5lbDoy",
                        isActive: true,
                        name: "Channel-PLN",
                        currencyCode: "PLN",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 20,
                        currency: "PLN",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                  ],
                  __typename: "ProductVariant",
                },
                {
                  id: "UHJvZHVjdFZhcmlhbnQ6Mjk4",
                  name: "L",
                  sku: "22119503",
                  channelListings: [
                    {
                      channel: {
                        id: "Q2hhbm5lbDox",
                        isActive: true,
                        name: "Channel-USD",
                        currencyCode: "USD",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 5,
                        currency: "USD",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                    {
                      channel: {
                        id: "Q2hhbm5lbDoy",
                        isActive: true,
                        name: "Channel-PLN",
                        currencyCode: "PLN",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 20,
                        currency: "PLN",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                  ],
                  __typename: "ProductVariant",
                },
                {
                  id: "UHJvZHVjdFZhcmlhbnQ6MzAw",
                  name: "XXL",
                  sku: "61630747",
                  channelListings: [
                    {
                      channel: {
                        id: "Q2hhbm5lbDox",
                        isActive: true,
                        name: "Channel-USD",
                        currencyCode: "USD",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 5,
                        currency: "USD",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                    {
                      channel: {
                        id: "Q2hhbm5lbDoy",
                        isActive: true,
                        name: "Channel-PLN",
                        currencyCode: "PLN",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 20,
                        currency: "PLN",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                  ],
                  __typename: "ProductVariant",
                },
                {
                  id: "UHJvZHVjdFZhcmlhbnQ6Mjk2",
                  name: "S",
                  sku: "62783187",
                  channelListings: [
                    {
                      channel: {
                        id: "Q2hhbm5lbDox",
                        isActive: true,
                        name: "Channel-USD",
                        currencyCode: "USD",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 5,
                        currency: "USD",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                    {
                      channel: {
                        id: "Q2hhbm5lbDoy",
                        isActive: true,
                        name: "Channel-PLN",
                        currencyCode: "PLN",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 20,
                        currency: "PLN",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                  ],
                  __typename: "ProductVariant",
                },
                {
                  id: "UHJvZHVjdFZhcmlhbnQ6Mjk3",
                  name: "M",
                  sku: "91406604",
                  channelListings: [
                    {
                      channel: {
                        id: "Q2hhbm5lbDox",
                        isActive: true,
                        name: "Channel-USD",
                        currencyCode: "USD",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 5,
                        currency: "USD",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                    {
                      channel: {
                        id: "Q2hhbm5lbDoy",
                        isActive: true,
                        name: "Channel-PLN",
                        currencyCode: "PLN",
                        __typename: "Channel",
                      },
                      price: {
                        amount: 20,
                        currency: "PLN",
                        __typename: "Money",
                      },
                      __typename: "ProductVariantChannelListing",
                    },
                  ],
                  __typename: "ProductVariant",
                },
              ],
              collections: [],
              __typename: "Product",
            },
            __typename: "ProductCountableEdge",
          },
        ],
        pageInfo: {
          endCursor: "WyJwaW5lYXBwbGUtanVpY2UiXQ==",
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: "WyJhcHBsZS1qdWljZSJd",
          __typename: "PageInfo",
        },
        __typename: "ProductCountableConnection",
      },
    },
    extensions: {
      cost: {
        requestedQueryCost: 120,
        maximumAvailable: 50000,
      },
    },
  },
};

export const searchVariantsMock = {
  request: {
    query: SearchVariantsDocument,
    variables: {
      ...queryVariablesMock,
      channel: "test",
    },
  },
  result: {
    data: {
      search: {
        edges: [
          {
            node: {
              id: "UHJvZHVjdFZhcmlhbnQ6OTg3",
              name: "45cm x 45cm",
            },
          },
          {
            node: {
              id: "UHJvZHVjdFZhcmlhbnQ6MjE0",
              name: "500ml",
            },
          },
          {
            node: {
              id: "UHJvZHVjdFZhcmlhbnQ6OTg4",
              name: "55cm x 55cm",
            },
          },
          {
            node: {
              id: "UHJvZHVjdFZhcmlhbnQ6MjE1",
              name: "1l",
            },
          },
          {
            node: {
              id: "UHJvZHVjdFZhcmlhbnQ6MjE2",
              name: "2l",
            },
          },
        ],
        pageInfo: {
          endCursor: "W251bGwsICIyMTQzODU0MiJd",
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: "WyIwIiwgIjEyMzEyM2FzZHp4YzEyMyJd",
        },
      },
    },
  },
};
