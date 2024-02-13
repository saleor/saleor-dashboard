import { SearchVariantsWithProductDataDocument } from "@dashboard/graphql";

const queryVariablesMock = {
  after: null,
  query: "",
  first: 20,
  channel: "test",
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

export const variantsWithProductDataMock = {
  request: {
    query: SearchVariantsWithProductDataDocument,
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
              id: "UHJvZHVjdFZhcmlhbnQ6MjUz",
              name: "L",
              product: {
                name: "Code Division T-shirt",
              },
            },
          },
          {
            node: {
              id: "UHJvZHVjdFZhcmlhbnQ6MTkz",
              name: "",
              product: {
                name: "Red Wine",
              },
            },
          },
          {
            node: {
              id: "UHJvZHVjdFZhcmlhbnQ6MjA2",
              name: "1l",
              product: {
                name: "Carrot Juice",
              },
            },
          },
          {
            node: {
              id: "UHJvZHVjdFZhcmlhbnQ6MzAx",
              name: "S",
              product: {
                name: "Blue Hoodie",
              },
            },
          },
          {
            node: {
              id: "UHJvZHVjdFZhcmlhbnQ6Mjcw",
              name: "XXL",
              product: {
                name: "Polo Shirt",
              },
            },
          },
          {
            node: {
              id: "UHJvZHVjdFZhcmlhbnQ6Mjk5",
              name: "XL",
              product: {
                name: "Black Hoodie",
              },
            },
          },
        ],
        pageInfo: {
          endCursor: "W251bGwsICIzNzU1ODg1OSJd",
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: "W251bGwsICIxMTgyMjM1OTEiXQ==",
        },
      },
    },
  },
};
