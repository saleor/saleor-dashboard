import {
  GiftLabelsDocument,
  RuleConditionsSelectedOptionsDetailsDocument,
} from "@dashboard/graphql";

const queryVariablesMock = {
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

export const conditionsValuesLabelsMock = {
  request: {
    query: RuleConditionsSelectedOptionsDetailsDocument,
    variables: {
      ...queryVariablesMock,
      categoriesIds: [],
      collectionsIds: [],
      productsIds: ["UHJvZHVjdDo3OQ==", "UHJvZHVjdDoxMTU="],
      variantsIds: ["UHJvZHVjdFZhcmlhbnQ6OTg3", "UHJvZHVjdFZhcmlhbnQ6MjE1"],
    },
  },
  result: {
    data: {
      categories: {
        edges: [],
      },
      collections: {
        edges: [],
      },
      products: {
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
        ],
      },
      productVariants: {
        edges: [
          {
            node: {
              id: "UHJvZHVjdFZhcmlhbnQ6OTg3",
              name: "45cm x 45cm",
            },
          },
          {
            node: {
              id: "UHJvZHVjdFZhcmlhbnQ6MjE1",
              name: "1l",
            },
          },
        ],
      },
    },
  },
};

export const emptyGiftsLabelsMock = {
  request: {
    query: GiftLabelsDocument,
    variables: {
      ...queryVariablesMock,
      ids: [],
    },
  },
  result: {
    data: {
      search: {
        edges: [],
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

export const giftsLabelsMock = {
  request: {
    query: GiftLabelsDocument,
    variables: {
      ...queryVariablesMock,
      ids: [
        "UHJvZHVjdFZhcmlhbnQ6MTkz",
        "UHJvZHVjdFZhcmlhbnQ6Mjk5",
        "UHJvZHVjdFZhcmlhbnQ6MjA2",
      ],
    },
  },
  result: {
    data: {
      productVariants: {
        edges: [
          {
            node: {
              id: "UHJvZHVjdFZhcmlhbnQ6MjUz",
              name: "L",
              product: {
                name: "Code Division T-shirt",
                __typename: "Product",
              },
              __typename: "ProductVariant",
            },
            __typename: "ProductVariantCountableEdge",
          },
          {
            node: {
              id: "UHJvZHVjdFZhcmlhbnQ6MTkz",
              name: "",
              product: {
                name: "Red Wine",
                __typename: "Product",
              },
              __typename: "ProductVariant",
            },
            __typename: "ProductVariantCountableEdge",
          },
          {
            node: {
              id: "UHJvZHVjdFZhcmlhbnQ6MjA2",
              name: "1l",
              product: {
                name: "Carrot Juice",
                __typename: "Product",
              },
              __typename: "ProductVariant",
            },
            __typename: "ProductVariantCountableEdge",
          },
        ],
      },
    },
  },
};
