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
            },
          },
          {
            node: {
              id: "Q2F0ZWdvcnk6OA==",
              name: "Groceries",
            },
          },
          {
            node: {
              id: "Q2F0ZWdvcnk6OQ==",
              name: "Apparel",
            },
          },
          {
            node: {
              id: "Q2F0ZWdvcnk6MTA=",
              name: "T-shirts",
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
              id: "UHJvZHVjdDo3OQ==",
              name: "Bean Juice",
            },
          },
          {
            node: {
              id: "UHJvZHVjdDoxMTU=",
              name: "Black Hoodie",
            },
          },
          {
            node: {
              id: "UHJvZHVjdDo3Mw==",
              name: "Carrot Juice",
            },
          },
          {
            node: {
              id: "UHJvZHVjdDo4OQ==",
              name: "Code Division T-shirt",
            },
          },
          {
            node: {
              id: "UHJvZHVjdDo4NQ==",
              name: "Colored Parrot Cushion",
            },
          },
        ],
        pageInfo: {
          endCursor: "WyJsYWtlLXR1bmVzIl0=",
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: "WyJiZWFuLWp1aWNlIl0=",
        },
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
