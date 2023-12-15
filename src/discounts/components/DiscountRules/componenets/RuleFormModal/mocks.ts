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
        edges: [],
        pageInfo: {
          endCursor: null,
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
        },
        totalCount: 0,
      },
    },
  },
};

export const seatchCollectionMock = {
  request: {
    query: SearchCollectionsDocument,
    variables: {
      ...queryVariablesMock,
      channel: "PLN",
    },
  },
  result: {
    data: {
      search: {
        edges: [],
        pageInfo: {
          endCursor: null,
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
        },
        totalCount: 0,
      },
    },
  },
};

export const searchProductsMock = {
  request: {
    query: SearchProductsDocument,
    variables: {
      ...queryVariablesMock,
      channel: "PLN",
    },
  },
  result: {
    data: {
      search: {
        edges: [
          {
            node: {
              thumbnail: null,
              variants: [],
              collections: [],
              id: "UHJvZHVjdDo3OQ==",
              name: "Bean Juice",
            },
          },
        ],
        pageInfo: {
          endCursor: null,
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
        },
        totalCount: 0,
      },
    },
  },
};

export const seatchVariantsMock = {
  request: {
    query: SearchVariantsDocument,
    variables: {
      ...queryVariablesMock,
      channel: "PLN",
    },
  },
  result: {
    data: {
      search: {
        edges: [],
        pageInfo: {
          endCursor: null,
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
        },
        totalCount: 0,
      },
    },
  },
};
