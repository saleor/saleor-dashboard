import {
  AttributeDetailsQuery,
  AttributeEntityTypeEnum,
  AttributeInputTypeEnum,
  AttributeListQuery,
  AttributeTypeEnum,
  ProductDetailsQuery,
} from "@dashboard/graphql";

export const attribute: AttributeDetailsQuery["attribute"] = {
  __typename: "Attribute" as "Attribute",
  availableInGrid: true,
  entityType: null,
  filterableInDashboard: false,
  filterableInStorefront: true,
  id: "UHJvZHVjdEF0dHJpYnV0ZTo5",
  inputType: AttributeInputTypeEnum.DROPDOWN,
  metadata: [
    {
      __typename: "MetadataItem",
      key: "integration.id",
      value: "100023123",
    },
  ],
  name: "Author",
  privateMetadata: [],
  slug: "author",
  storefrontSearchPosition: 2,
  type: AttributeTypeEnum.PRODUCT_TYPE,
  valueRequired: true,
  unit: null,
  choices: {
    __typename:
      "AttributeValueCountableConnection" as "AttributeValueCountableConnection",
    pageInfo: {
      __typename: "PageInfo" as "PageInfo",
      endCursor: "",
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "",
    },
    edges: [
      {
        __typename:
          "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
        cursor: "1",
        node: {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI0",
          name: "John Doe",
          reference: null,
          slug: "john-doe",
          plainText: null,
          richText: null,
          boolean: null,
          date: null,
          dateTime: null,
          value: null,
        },
      },
      {
        __typename:
          "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
        cursor: "2",
        node: {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI1",
          name: "Milionare Pirate",
          reference: null,
          slug: "milionare-pirate",
          plainText: null,
          richText: null,
          boolean: null,
          date: null,
          dateTime: null,
          value: null,
        },
      },
    ],
  },
  visibleInStorefront: true,
};

export const attributes: Array<
  NonNullable<AttributeListQuery["attributes"]>["edges"][0]["node"] &
    NonNullable<ProductDetailsQuery["product"]>["attributes"][0]["attribute"]
> = [
  {
    __typename: "Attribute" as "Attribute",
    entityType: AttributeEntityTypeEnum.PRODUCT,
    filterableInDashboard: true,
    filterableInStorefront: false,
    id: "UHJvZHVjdEF0dHJpYnV0ZTo5",
    name: "Author",
    slug: "author",
    type: AttributeTypeEnum.PRODUCT_TYPE,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: false,
    unit: null,
    choices: {
      __typename:
        "AttributeValueCountableConnection" as "AttributeValueCountableConnection",
      pageInfo: {
        endCursor: "WyI4IiwgIjMiXQ==",
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "WyIwIiwgIjQ5Il0=",
        __typename: "PageInfo" as "PageInfo",
      },
      edges: [
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI0",
            name: "John Doe",
            reference: null,
            slug: "john-doe",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI1",
            name: "Milionare Pirate",
            reference: null,
            slug: "milionare-pirate",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
      ],
    },
    visibleInStorefront: true,
  },
  {
    __typename: "Attribute" as "Attribute",
    entityType: AttributeEntityTypeEnum.PAGE,
    filterableInDashboard: true,
    filterableInStorefront: false,
    id: "UHJvZHVjdEF0dHJpYnV0ZTo2",
    name: "Box Size",
    slug: "box-size",
    type: AttributeTypeEnum.PRODUCT_TYPE,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: false,
    unit: null,
    choices: {
      __typename:
        "AttributeValueCountableConnection" as "AttributeValueCountableConnection",
      pageInfo: {
        endCursor: "WyI4IiwgIjMiXQ==",
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "WyIwIiwgIjQ5Il0=",
        __typename: "PageInfo" as "PageInfo",
      },
      edges: [
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE1",
            name: "100g",
            reference: null,
            slug: "100g",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE2",
            name: "250g",
            reference: null,
            slug: "250g",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE3",
            name: "500g",
            reference: null,
            slug: "500g",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE4",
            name: "1kg",
            reference: null,
            slug: "1kg",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
      ],
    },
    visibleInStorefront: false,
  },
  {
    __typename: "Attribute" as "Attribute",
    entityType: AttributeEntityTypeEnum.PRODUCT,
    filterableInDashboard: false,
    filterableInStorefront: true,
    id: "UHJvZHVjdEF0dHJpYnV0ZToz",
    name: "Brand",
    slug: "brand",
    type: AttributeTypeEnum.PRODUCT_TYPE,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: false,
    unit: null,
    choices: {
      __typename:
        "AttributeValueCountableConnection" as "AttributeValueCountableConnection",
      pageInfo: {
        endCursor: "WyI4IiwgIjMiXQ==",
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "WyIwIiwgIjQ5Il0=",
        __typename: "PageInfo" as "PageInfo",
      },
      edges: [
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjY=",
            name: "Saleor",
            reference: null,
            slug: "saleor",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
      ],
    },
    visibleInStorefront: false,
  },
  {
    __typename: "Attribute" as "Attribute",
    entityType: AttributeEntityTypeEnum.PRODUCT,
    filterableInDashboard: true,
    filterableInStorefront: true,
    id: "UHJvZHVjdEF0dHJpYnV0ZTo4",
    name: "Candy Box Size",
    slug: "candy-box-size",
    type: AttributeTypeEnum.PRODUCT_TYPE,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: false,
    unit: null,
    choices: {
      __typename:
        "AttributeValueCountableConnection" as "AttributeValueCountableConnection",
      pageInfo: {
        endCursor: "WyI4IiwgIjMiXQ==",
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "WyIwIiwgIjQ5Il0=",
        __typename: "PageInfo" as "PageInfo",
      },
      edges: [
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjIx",
            name: "100g",
            reference: null,
            slug: "100g",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjIy",
            name: "250g",
            reference: null,
            slug: "250g",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjIz",
            name: "500g",
            reference: null,
            slug: "500g",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
      ],
    },
    visibleInStorefront: false,
  },
  {
    __typename: "Attribute" as "Attribute",
    entityType: AttributeEntityTypeEnum.PAGE,
    filterableInDashboard: true,
    filterableInStorefront: true,
    id: "UHJvZHVjdEF0dHJpYnV0ZTo1",
    name: "Coffee Genre",
    slug: "coffee-genre",
    type: AttributeTypeEnum.PRODUCT_TYPE,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: false,
    unit: null,
    choices: {
      __typename:
        "AttributeValueCountableConnection" as "AttributeValueCountableConnection",
      pageInfo: {
        endCursor: "WyI4IiwgIjMiXQ==",
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "WyIwIiwgIjQ5Il0=",
        __typename: "PageInfo" as "PageInfo",
      },
      edges: [
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjEz",
            name: "Arabica",
            reference: null,
            slug: "arabica",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE0",
            name: "Robusta",
            reference: null,
            slug: "robusta",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
      ],
    },
    visibleInStorefront: true,
  },
  {
    __typename: "Attribute" as "Attribute",
    entityType: AttributeEntityTypeEnum.PRODUCT,
    filterableInDashboard: false,
    filterableInStorefront: true,
    id: "UHJvZHVjdEF0dHJpYnV0ZToy",
    name: "Collar",
    slug: "collar",
    type: AttributeTypeEnum.PRODUCT_TYPE,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: false,
    unit: null,
    choices: {
      __typename:
        "AttributeValueCountableConnection" as "AttributeValueCountableConnection",
      pageInfo: {
        endCursor: "WyI4IiwgIjMiXQ==",
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "WyIwIiwgIjQ5Il0=",
        __typename: "PageInfo" as "PageInfo",
      },
      edges: [
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjM=",
            name: "Round",
            reference: null,
            slug: "round",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjQ=",
            name: "V-Neck",
            reference: null,
            slug: "v-neck",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjU=",
            name: "Polo",
            reference: null,
            slug: "polo",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
      ],
    },
    visibleInStorefront: true,
  },
  {
    __typename: "Attribute" as "Attribute",
    entityType: AttributeEntityTypeEnum.PAGE,
    filterableInDashboard: false,
    filterableInStorefront: false,
    id: "UHJvZHVjdEF0dHJpYnV0ZTox",
    name: "Color",
    slug: "color",
    type: AttributeTypeEnum.PRODUCT_TYPE,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: false,
    unit: null,
    choices: {
      __typename:
        "AttributeValueCountableConnection" as "AttributeValueCountableConnection",
      pageInfo: {
        endCursor: "WyI4IiwgIjMiXQ==",
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "WyIwIiwgIjQ5Il0=",
        __typename: "PageInfo" as "PageInfo",
      },
      edges: [
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE=",
            name: "Blue",
            reference: null,
            slug: "blue",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI=",
            name: "White",
            reference: null,
            slug: "white",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
      ],
    },
    visibleInStorefront: true,
  },
  {
    __typename: "Attribute" as "Attribute",
    entityType: AttributeEntityTypeEnum.PRODUCT,
    filterableInDashboard: true,
    filterableInStorefront: false,
    id: "UHJvZHVjdEF0dHJpYnV0ZToxMg==",
    name: "Cover",
    slug: "cover",
    type: AttributeTypeEnum.PRODUCT_TYPE,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: false,
    unit: null,
    choices: {
      __typename:
        "AttributeValueCountableConnection" as "AttributeValueCountableConnection",
      pageInfo: {
        endCursor: "WyI4IiwgIjMiXQ==",
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "WyIwIiwgIjQ5Il0=",
        __typename: "PageInfo" as "PageInfo",
      },
      edges: [
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjMw",
            name: "Soft",
            reference: null,
            slug: "soft",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjMx",
            name: "Hard",
            reference: null,
            slug: "hard",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjMy",
            name: "Middle soft",
            reference: null,
            slug: "middle-soft",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjMz",
            name: "Middle hard",
            reference: null,
            slug: "middle-hard",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjM0",
            name: "Middle",
            reference: null,
            slug: "middle",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjM1",
            name: "Very hard",
            reference: null,
            slug: "very-hard",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
      ],
    },
    visibleInStorefront: false,
  },
  {
    __typename: "Attribute" as "Attribute",
    entityType: AttributeEntityTypeEnum.PRODUCT,
    filterableInDashboard: true,
    filterableInStorefront: true,
    id: "UHJvZHVjdEF0dHJpYnV0ZTo3",
    name: "Flavor",
    slug: "flavor",
    type: AttributeTypeEnum.PRODUCT_TYPE,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: false,
    unit: null,
    choices: {
      __typename:
        "AttributeValueCountableConnection" as "AttributeValueCountableConnection",
      pageInfo: {
        endCursor: "WyI4IiwgIjMiXQ==",
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "WyIwIiwgIjQ5Il0=",
        __typename: "PageInfo" as "PageInfo",
      },
      edges: [
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE5",
            name: "Sour",
            reference: null,
            slug: "sour",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjIw",
            name: "Sweet",
            reference: null,
            slug: "sweet",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
      ],
    },
    visibleInStorefront: true,
  },
  {
    __typename: "Attribute" as "Attribute",
    entityType: AttributeEntityTypeEnum.PRODUCT,
    filterableInDashboard: false,
    filterableInStorefront: true,
    id: "UHJvZHVjdEF0dHJpYnV0ZToxMQ==",
    name: "Language",
    slug: "language",
    type: AttributeTypeEnum.PRODUCT_TYPE,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: false,
    unit: null,
    choices: {
      __typename:
        "AttributeValueCountableConnection" as "AttributeValueCountableConnection",
      pageInfo: {
        endCursor: "WyI4IiwgIjMiXQ==",
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "WyIwIiwgIjQ5Il0=",
        __typename: "PageInfo" as "PageInfo",
      },
      edges: [
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI4",
            name: "English",
            reference: null,
            slug: "english",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI5",
            name: "Pirate",
            reference: null,
            slug: "pirate",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
      ],
    },
    visibleInStorefront: true,
  },
  {
    __typename: "Attribute" as "Attribute",
    entityType: AttributeEntityTypeEnum.PAGE,
    filterableInDashboard: true,
    filterableInStorefront: true,
    id: "UHJvZHVjdEF0dHJpYnV0ZToxMA==",
    name: "Publisher",
    slug: "publisher",
    type: AttributeTypeEnum.PRODUCT_TYPE,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: false,
    unit: null,
    choices: {
      __typename:
        "AttributeValueCountableConnection" as "AttributeValueCountableConnection",
      pageInfo: {
        endCursor: "WyI4IiwgIjMiXQ==",
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "WyIwIiwgIjQ5Il0=",
        __typename: "PageInfo" as "PageInfo",
      },
      edges: [
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI2",
            name: "Mirumee Press",
            reference: null,
            slug: "mirumee-press",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI3",
            name: "Saleor Publishing",
            reference: null,
            slug: "saleor-publishing",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
      ],
    },
    visibleInStorefront: true,
  },
  {
    __typename: "Attribute" as "Attribute",
    entityType: AttributeEntityTypeEnum.PRODUCT,
    filterableInDashboard: true,
    filterableInStorefront: true,
    id: "UHJvZHVjdEF0dHJpYnV0ZTo0",
    name: "Size",
    slug: "size",
    type: AttributeTypeEnum.PRODUCT_TYPE,
    unit: null,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    valueRequired: false,
    choices: {
      __typename:
        "AttributeValueCountableConnection" as "AttributeValueCountableConnection",
      pageInfo: {
        endCursor: "WyI4IiwgIjMiXQ==",
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "WyIwIiwgIjQ5Il0=",
        __typename: "PageInfo" as "PageInfo",
      },
      edges: [
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjc=",
            name: "XS",
            reference: null,
            slug: "xs",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjg=",
            name: "S",
            reference: null,
            slug: "s",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjk=",
            name: "M",
            reference: null,
            slug: "m",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjEw",
            name: "L",
            reference: null,
            slug: "l",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjEx",
            name: "XL",
            reference: null,
            slug: "xl",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
        {
          __typename:
            "AttributeValueCountableEdge" as "AttributeValueCountableEdge",
          cursor: "",
          node: {
            __typename: "AttributeValue" as "AttributeValue",
            file: null,
            id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjEy",
            name: "XXL",
            reference: null,
            slug: "xxl",

            value: "",
            plainText: null,
            richText: null,
            boolean: null,
            date: null,
            dateTime: null,
          },
        },
      ],
    },
    visibleInStorefront: true,
  },
];
