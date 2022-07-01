import { MenuDetailsFragment, MenuDetailsQuery } from "@saleor/graphql";

import { menu } from "../../fixtures";
import { TreeOperation } from "../MenuItems";
import { computeRelativeTree } from "./tree";

const relativeOutput: Array<MenuDetailsQuery["menu"]["items"]> = [
  // no moves
  [
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6Nw==",
        name: "Accessories",
      },
      children: [
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OAX==",
            name: "Jewelry",
          },
          children: [],
          collection: null,
          id: "0jewelry",
          level: 0,
          name: "Jewelry",
          page: null,
          url: null,
        },
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OQX==",
            name: "Glasses",
          },
          children: [],
          collection: null,
          id: "1glasses",
          level: 0,
          name: "Glasses",
          page: null,
          url: null,
        },
      ],
      collection: null,
      id: "2accessories",
      level: 0,
      name: "Accessories",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OA==",
        name: "Groceries",
      },
      children: [],
      collection: null,
      id: "3groceries",
      level: 0,
      name: "Groceries",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OQ==",
        name: "Apparel",
      },
      children: [],
      collection: null,
      id: "4apparel",
      level: 0,
      name: "Apparel",
      page: null,
      url: null,
    },
  ],
  // moves one in root
  [
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6Nw==",
        name: "Accessories",
      },
      children: [
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OAX==",
            name: "Jewelry",
          },
          children: [],
          collection: null,
          id: "0jewelry",
          level: 0,
          name: "Jewelry",
          page: null,
          url: null,
        },
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OQX==",
            name: "Glasses",
          },
          children: [],
          collection: null,
          id: "1glasses",
          level: 0,
          name: "Glasses",
          page: null,
          url: null,
        },
      ],
      collection: null,
      id: "2accessories",
      level: 0,
      name: "Accessories",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OQ==",
        name: "Apparel",
      },
      children: [],
      collection: null,
      id: "4apparel",
      level: 0,
      name: "Apparel",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OA==",
        name: "Groceries",
      },
      children: [],
      collection: null,
      id: "3groceries",
      level: 0,
      name: "Groceries",
      page: null,
      url: null,
    },
  ],
  // moves two in root
  [
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OQ==",
        name: "Apparel",
      },
      children: [],
      collection: null,
      id: "4apparel",
      level: 0,
      name: "Apparel",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OA==",
        name: "Groceries",
      },
      children: [],
      collection: null,
      id: "3groceries",
      level: 0,
      name: "Groceries",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6Nw==",
        name: "Accessories",
      },
      children: [
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OAX==",
            name: "Jewelry",
          },
          children: [],
          collection: null,
          id: "0jewelry",
          level: 0,
          name: "Jewelry",
          page: null,
          url: null,
        },
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OQX==",
            name: "Glasses",
          },
          children: [],
          collection: null,
          id: "1glasses",
          level: 0,
          name: "Glasses",
          page: null,
          url: null,
        },
      ],
      collection: null,
      id: "2accessories",
      level: 0,
      name: "Accessories",
      page: null,
      url: null,
    },
  ],
  // empty move
  [
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6Nw==",
        name: "Accessories",
      },
      children: [
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OAX==",
            name: "Jewelry",
          },
          children: [],
          collection: null,
          id: "0jewelry",
          level: 0,
          name: "Jewelry",
          page: null,
          url: null,
        },
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OQX==",
            name: "Glasses",
          },
          children: [],
          collection: null,
          id: "1glasses",
          level: 0,
          name: "Glasses",
          page: null,
          url: null,
        },
      ],
      collection: null,
      id: "2accessories",
      level: 0,
      name: "Accessories",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OA==",
        name: "Groceries",
      },
      children: [],
      collection: null,
      id: "3groceries",
      level: 0,
      name: "Groceries",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OQ==",
        name: "Apparel",
      },
      children: [],
      collection: null,
      id: "4apparel",
      level: 0,
      name: "Apparel",
      page: null,
      url: null,
    },
  ],
  // moves every
  [
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OA==",
        name: "Groceries",
      },
      children: [],
      collection: null,
      id: "3groceries",
      level: 0,
      name: "Groceries",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OQ==",
        name: "Apparel",
      },
      children: [],
      collection: null,
      id: "4apparel",
      level: 0,
      name: "Apparel",
      page: null,
      url: null,
    },

    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6Nw==",
        name: "Accessories",
      },
      children: [
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OAX==",
            name: "Jewelry",
          },
          children: [],
          collection: null,
          id: "0jewelry",
          level: 0,
          name: "Jewelry",
          page: null,
          url: null,
        },
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OQX==",
            name: "Glasses",
          },
          children: [],
          collection: null,
          id: "1glasses",
          level: 0,
          name: "Glasses",
          page: null,
          url: null,
        },
      ],
      collection: null,
      id: "2accessories",
      level: 0,
      name: "Accessories",
      page: null,
      url: null,
    },
  ],
  // moves children
  [
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6Nw==",
        name: "Accessories",
      },
      children: [
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OQX==",
            name: "Glasses",
          },
          children: [],
          collection: null,
          id: "1glasses",
          level: 0,
          name: "Glasses",
          page: null,
          url: null,
        },
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OAX==",
            name: "Jewelry",
          },
          children: [],
          collection: null,
          id: "0jewelry",
          level: 0,
          name: "Jewelry",
          page: null,
          url: null,
        },
      ],
      collection: null,
      id: "2accessories",
      level: 0,
      name: "Accessories",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OA==",
        name: "Groceries",
      },
      children: [],
      collection: null,
      id: "3groceries",
      level: 0,
      name: "Groceries",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OQ==",
        name: "Apparel",
      },
      children: [],
      collection: null,
      id: "4apparel",
      level: 0,
      name: "Apparel",
      page: null,
      url: null,
    },
  ],
  // moves child outside
  [
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OQX==",
        name: "Glasses",
      },
      children: [],
      collection: null,
      id: "1glasses",
      level: 0,
      name: "Glasses",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6Nw==",
        name: "Accessories",
      },
      children: [
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OAX==",
            name: "Jewelry",
          },
          children: [],
          collection: null,
          id: "0jewelry",
          level: 0,
          name: "Jewelry",
          page: null,
          url: null,
        },
      ],
      collection: null,
      id: "2accessories",
      level: 0,
      name: "Accessories",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OA==",
        name: "Groceries",
      },
      children: [],
      collection: null,
      id: "3groceries",
      level: 0,
      name: "Groceries",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OQ==",
        name: "Apparel",
      },
      children: [],
      collection: null,
      id: "4apparel",
      level: 0,
      name: "Apparel",
      page: null,
      url: null,
    },
  ],
  // moves child outside and puts it in location
  [
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6Nw==",
        name: "Accessories",
      },
      children: [
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OAX==",
            name: "Jewelry",
          },
          children: [],
          collection: null,
          id: "0jewelry",
          level: 0,
          name: "Jewelry",
          page: null,
          url: null,
        },
      ],
      collection: null,
      id: "2accessories",
      level: 0,
      name: "Accessories",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OA==",
        name: "Groceries",
      },
      children: [],
      collection: null,
      id: "3groceries",
      level: 0,
      name: "Groceries",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OQX==",
        name: "Glasses",
      },
      children: [],
      collection: null,
      id: "1glasses",
      level: 0,
      name: "Glasses",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OQ==",
        name: "Apparel",
      },
      children: [],
      collection: null,
      id: "4apparel",
      level: 0,
      name: "Apparel",
      page: null,
      url: null,
    },
  ],
  // moves child inside
  [
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6Nw==",
        name: "Accessories",
      },
      children: [
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OA==",
            name: "Groceries",
          },
          children: [],
          collection: null,
          id: "3groceries",
          level: 0,
          name: "Groceries",
          page: null,
          url: null,
        },
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OAX==",
            name: "Jewelry",
          },
          children: [],
          collection: null,
          id: "0jewelry",
          level: 0,
          name: "Jewelry",
          page: null,
          url: null,
        },
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OQX==",
            name: "Glasses",
          },
          children: [],
          collection: null,
          id: "1glasses",
          level: 0,
          name: "Glasses",
          page: null,
          url: null,
        },
      ],
      collection: null,
      id: "2accessories",
      level: 0,
      name: "Accessories",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OQ==",
        name: "Apparel",
      },
      children: [],
      collection: null,
      id: "4apparel",
      level: 0,
      name: "Apparel",
      page: null,
      url: null,
    },
  ],
  // moves child inside then outside then changes index
  [
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6Nw==",
        name: "Accessories",
      },
      children: [
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OA==",
            name: "Groceries",
          },
          children: [],
          collection: null,
          id: "3groceries",
          level: 0,
          name: "Groceries",
          page: null,
          url: null,
        },
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OAX==",
            name: "Jewelry",
          },
          children: [],
          collection: null,
          id: "0jewelry",
          level: 0,
          name: "Jewelry",
          page: null,
          url: null,
        },
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OQX==",
            name: "Glasses",
          },
          children: [],
          collection: null,
          id: "1glasses",
          level: 0,
          name: "Glasses",
          page: null,
          url: null,
        },
      ],
      collection: null,
      id: "2accessories",
      level: 0,
      name: "Accessories",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OQ==",
        name: "Apparel",
      },
      children: [],
      collection: null,
      id: "4apparel",
      level: 0,
      name: "Apparel",
      page: null,
      url: null,
    },
  ],
  // moves item as last child and moves it up
  [
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6Nw==",
        name: "Accessories",
      },
      children: [
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OAX==",
            name: "Jewelry",
          },
          children: [],
          collection: null,
          id: "0jewelry",
          level: 0,
          name: "Jewelry",
          page: null,
          url: null,
        },
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OA==",
            name: "Groceries",
          },
          children: [],
          collection: null,
          id: "3groceries",
          level: 0,
          name: "Groceries",
          page: null,
          url: null,
        },
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OQX==",
            name: "Glasses",
          },
          children: [],
          collection: null,
          id: "1glasses",
          level: 0,
          name: "Glasses",
          page: null,
          url: null,
        },
      ],
      collection: null,
      id: "2accessories",
      level: 0,
      name: "Accessories",
      page: null,
      url: null,
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OQ==",
        name: "Apparel",
      },
      children: [],
      collection: null,
      id: "4apparel",
      level: 0,
      name: "Apparel",
      page: null,
      url: null,
    },
  ],
];

const secondTestTable: TreeOperation[][] = [
  // no moves
  [],
  // moves one in root
  [{ id: "4apparel", sortOrder: -1, type: "move" }],
  // moves two in root
  [
    { id: "2accessories", sortOrder: 2, type: "move" },
    { id: "4apparel", sortOrder: -1, type: "move" },
  ],
  // empty move
  [
    { id: "2accessories", sortOrder: 0, type: "move" },
    { id: "4apparel", sortOrder: 0, type: "move" },
  ],
  // move every
  [
    { id: "2accessories", sortOrder: 1, type: "move" },
    { id: "4apparel", sortOrder: -2, type: "move" },
    { id: "3groceries", sortOrder: -1, type: "move" },
  ],
  // moves children
  [
    {
      id: "1glasses",
      sortOrder: -1,
      type: "move",
      parentId: "2accessories",
    },
  ],
  // moves children outside
  [
    {
      id: "1glasses",
      sortOrder: 3,
      type: "move",
      simulatedMove: true,
    },
    {
      id: "1glasses",
      sortOrder: 0 - 3,
      type: "move",
    },
  ],
  // moves children outside and puts it in a location
  [
    {
      id: "1glasses",
      sortOrder: 3,
      type: "move",
      simulatedMove: true,
    },
    {
      id: "1glasses",
      sortOrder: 2 - 3,
      type: "move",
    },
  ],
  // moves child inside
  [
    {
      id: "3groceries",
      parentId: "2accessories",
      sortOrder: 2,
      type: "move",
      simulatedMove: true,
    },
    {
      id: "3groceries",
      parentId: "2accessories",
      sortOrder: 0 - 2,
      type: "move",
    },
  ],
  // moves child inside, moves it and puts it back
  [
    {
      id: "3groceries",
      parentId: "2accessories",
      sortOrder: 0,
      type: "move",
    },
    {
      id: "3groceries",
      sortOrder: 1,
      type: "move",
    },
    {
      id: "3groceries",
      sortOrder: 1,
      type: "move",
    },
    {
      id: "3groceries",
      sortOrder: -2,
      type: "move",
    },
    {
      id: "3groceries",
      parentId: "2accessories",
      sortOrder: 0,
      type: "move",
    },
  ],
  // moves item as last child and moves it up
  [
    {
      id: "3groceries",
      parentId: "2accessories",
      sortOrder: 2,
      type: "move",
    },
    {
      id: "1glasses",
      parentId: "2accessories",
      sortOrder: 1,
      type: "move",
    },
  ],
];

const testTable: TreeOperation[][] = [
  [],
  [
    { id: "1glasses", parentId: "0jewelry", sortOrder: 0, type: "move" },
    {
      id: "2accessories",
      parentId: "3groceries",
      sortOrder: 0,
      type: "move",
    },
  ],
  [
    { id: "1glasses", parentId: "0jewelry", sortOrder: 0, type: "move" },
    {
      id: "2accessories",
      parentId: "3groceries",
      sortOrder: 0,
      type: "move",
    },
    {
      id: "3groceries",
      parentId: "4apparel",
      sortOrder: 0,
      type: "move",
    },
  ],
  [
    { id: "0jewelry", sortOrder: 1, type: "move" },
    { id: "1glasses", sortOrder: 1, type: "move" },
    {
      id: "4apparel",
      parentId: "3groceries",
      sortOrder: 0,
      type: "move",
    },
    {
      id: "3groceries",
      parentId: "0jewelry",
      sortOrder: 0,
      type: "move",
    },
    { id: "0jewelry", parentId: "1glasses", sortOrder: 0, type: "move" },
    {
      id: "1glasses",
      parentId: "2accessories",
      sortOrder: 0,
      type: "move",
    },
    { id: "1glasses", sortOrder: 1, type: "move" },
    { id: "0jewelry", sortOrder: 2, type: "move" },
  ],
  [
    { id: "1glasses", sortOrder: 1, type: "move" },
    { id: "1glasses", parentId: "0jewelry", sortOrder: 0, type: "move" },
    { id: "0jewelry", sortOrder: 1, type: "move" },
    {
      id: "0jewelry",
      parentId: "2accessories",
      sortOrder: 0,
      type: "move",
    },
    { id: "3groceries", sortOrder: 0, type: "move" },
    {
      id: "2accessories",
      parentId: "3groceries",
      sortOrder: 0,
      type: "move",
    },
    { id: "2accessories", sortOrder: 1, type: "move" },
    { id: "0jewelry", sortOrder: 2, type: "move" },
    { id: "1glasses", sortOrder: 3, type: "move" },
    { id: "4apparel", sortOrder: 0, type: "move" },
    { id: "1glasses", sortOrder: 1, type: "move" },
    { id: "2accessories", sortOrder: 0, type: "move" },
    {
      id: "4apparel",
      parentId: "2accessories",
      sortOrder: 0,
      type: "move",
    },
    {
      id: "3groceries",
      parentId: "1glasses",
      sortOrder: 0,
      type: "move",
    },
    { id: "0jewelry", sortOrder: 0, type: "move" },
    {
      id: "0jewelry",
      parentId: "2accessories",
      sortOrder: 0,
      type: "move",
    },
    {
      id: "4apparel",
      parentId: "2accessories",
      sortOrder: 0,
      type: "move",
    },
    {
      id: "0jewelry",
      parentId: "2accessories",
      sortOrder: 0,
      type: "move",
    },
    {
      id: "1glasses",
      parentId: "2accessories",
      sortOrder: 2,
      type: "move",
    },
    {
      id: "0jewelry",
      parentId: "2accessories",
      sortOrder: 2,
      type: "move",
    },
    {
      id: "1glasses",
      parentId: "2accessories",
      sortOrder: 2,
      type: "move",
    },
    {
      id: "4apparel",
      parentId: "2accessories",
      sortOrder: 2,
      type: "move",
    },
    {
      id: "3groceries",
      parentId: "0jewelry",
      sortOrder: 0,
      type: "move",
    },
    { id: "4apparel", parentId: "1glasses", sortOrder: 0, type: "move" },
    { id: "1glasses", sortOrder: 1, type: "move" },
    { id: "0jewelry", sortOrder: 1, type: "move" },
    {
      id: "2accessories",
      parentId: "4apparel",
      sortOrder: 0,
      type: "move",
    },
  ],
  [{ id: "2accessories", type: "remove" }],
  [
    { id: "2accessories", type: "remove" },
    { id: "4apparel", sortOrder: 0, type: "move" },
    { id: "3groceries", type: "remove" },
  ],
];

// Readability FTW
function innerTreeToString(
  tree: MenuDetailsFragment["items"][0],
  level: number,
): string {
  return (
    "\n" +
    "··".repeat(level) +
    tree.name +
    tree.children.reduce(
      (acc, node) => acc + innerTreeToString(node, level + 1),
      "",
    )
  );
}
function treeToString(tree: MenuDetailsFragment["items"]): string {
  return tree.reduce((acc, node) => acc + innerTreeToString(node, 0), "");
}

describe("Properly computes trees", () => {
  testTable.forEach(testData =>
    it("#", () => {
      const computedTree = computeRelativeTree(menu.items, testData);
      expect(treeToString(computedTree)).toMatchSnapshot();
    }),
  );
});

describe("Properly computes relative trees", () => {
  it("doesn't move anything", () => {
    const computedTree = computeRelativeTree(menu.items, secondTestTable[0]);
    expect(computedTree).toEqual(relativeOutput[0]);
  });

  it("moves one root element", () => {
    const computedTree = computeRelativeTree(menu.items, secondTestTable[1]);
    expect(computedTree).toEqual(relativeOutput[1]);
  });

  it("moves two root element", () => {
    const computedTree = computeRelativeTree(menu.items, secondTestTable[2]);
    expect(computedTree).toEqual(relativeOutput[2]);
  });

  it("empty moves", () => {
    const computedTree = computeRelativeTree(menu.items, secondTestTable[3]);
    expect(computedTree).toEqual(relativeOutput[3]);
  });

  it("moves every element", () => {
    const computedTree = computeRelativeTree(menu.items, secondTestTable[4]);
    expect(computedTree).toEqual(relativeOutput[4]);
  });

  it("moves children", () => {
    const computedTree = computeRelativeTree(menu.items, secondTestTable[5]);
    expect(computedTree).toEqual(relativeOutput[5]);
  });

  it("moves child outside", () => {
    const computedTree = computeRelativeTree(menu.items, secondTestTable[6]);
    expect(computedTree).toEqual(relativeOutput[6]);
  });

  it("moves child outside and puts it in a location", () => {
    const computedTree = computeRelativeTree(menu.items, secondTestTable[7]);
    expect(computedTree).toEqual(relativeOutput[7]);
  });

  it("moves child inside", () => {
    const computedTree = computeRelativeTree(menu.items, secondTestTable[8]);
    expect(computedTree).toEqual(relativeOutput[8]);
  });

  it("moves child inside then outside then changes index", () => {
    const computedTree = computeRelativeTree(menu.items, secondTestTable[9]);
    expect(computedTree).toEqual(relativeOutput[9]);
  });

  it("moves item as last child and moves it up", () => {
    const computedTree = computeRelativeTree(menu.items, secondTestTable[10]);
    expect(computedTree).toEqual(relativeOutput[10]);
  });
});
