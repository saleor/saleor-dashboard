import { SearchVariantsWithProductDataDocument } from "@dashboard/graphql";
import { allPermissions } from "@dashboard/hooks/makeQuery";

const queryVariablesMock = {
  ...allPermissions,
  after: null,
  query: "",
  first: 20,
  channel: "test",
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
