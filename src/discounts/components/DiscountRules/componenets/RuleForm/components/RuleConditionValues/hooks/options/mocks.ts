import {
  SearchCategoriesDocument,
  SearchCollectionsDocument,
  SearchProductsDocument,
  SearchVariantsDocument,
} from "@dashboard/graphql";
import { allPermissions } from "@dashboard/hooks/makeQuery";

const queryVariablesMock = {
  ...allPermissions,
  after: null,
  first: 20,
  query: "",
};

export const searchCategoriesMock = {
  maxUsageCount: Number.POSITIVE_INFINITY,
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
              level: 0,
              parent: null,
              ancestors: {
                edges: [],
              },
              __typename: "Category",
            },
          },
          {
            node: {
              id: "Q2F0ZWdvcnk6OA==",
              name: "Groceries",
              level: 0,
              parent: null,
              ancestors: {
                edges: [],
              },
              __typename: "Category",
            },
          },
          {
            node: {
              id: "Q2F0ZWdvcnk6OQ==",
              name: "Apparel",
              level: 0,
              parent: null,
              ancestors: {
                edges: [],
              },
              __typename: "Category",
            },
          },
          {
            node: {
              id: "Q2F0ZWdvcnk6MTA=",
              name: "T-shirts",
              level: 0,
              parent: null,
              ancestors: {
                edges: [],
              },
              __typename: "Category",
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
  maxUsageCount: Number.POSITIVE_INFINITY,
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
  maxUsageCount: Number.POSITIVE_INFINITY,
  request: {
    query: SearchProductsDocument,
    variables: {
      ...queryVariablesMock,
      channel: "test",
      includeVariants: false,
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
              productType: {
                id: "1",
                name: "Bear",
                __typename: "ProductType",
              },
              collections: [],
              category: null,
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
              productType: {
                id: "1",
                name: "Bear",
                __typename: "ProductType",
              },
              collections: [],
              category: null,
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
              productType: {
                id: "1",
                name: "Bear",
                __typename: "ProductType",
              },
              channelListings: [],
              collections: [],
              category: null,
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
              productType: {
                id: "1",
                name: "Bear",
                __typename: "ProductType",
              },
              channelListings: [],
              collections: [],
              category: null,
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
  },
};

export const searchVariantsMock = {
  maxUsageCount: Number.POSITIVE_INFINITY,
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
