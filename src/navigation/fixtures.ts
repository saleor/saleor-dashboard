import { MenuDetails_menu } from "./types/MenuDetails";
import { MenuList_menus_edges_node } from "./types/MenuList";

export const menuList: MenuList_menus_edges_node[] = [
  {
    __typename: "Menu",
    id: "TWVudTox",
    items: [
      { __typename: "MenuItem", id: "TWVudUl0ZW06MQ==" },
      { __typename: "MenuItem", id: "TWVudUl0ZW06Mg==" },
      { __typename: "MenuItem", id: "TWVudUl0ZW06Mw==" }
    ],
    name: "navbar"
  },
  {
    __typename: "Menu",
    id: "TWVudToy",
    items: [
      { __typename: "MenuItem", id: "TWVudUl0ZW06NA==" },
      { __typename: "MenuItem", id: "TWVudUl0ZW06Nw==" }
    ],
    name: "footer"
  }
];

export const menu: MenuDetails_menu = {
  __typename: "Menu",
  id: "TWVudTox",
  items: [
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6Nw==",
        name: "Accessories"
      },
      children: [
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OAX==",
            name: "Jewelry"
          },
          children: [],
          collection: null,
          id: "0jewelry",
          level: 0,
          name: "Jewelry",
          page: null,
          url: null
        },
        {
          __typename: "MenuItem",
          category: {
            __typename: "Category",
            id: "Q2F0ZWdvcnk6OQX==",
            name: "Glasses"
          },
          children: [],
          collection: null,
          id: "1glasses",
          level: 0,
          name: "Glasses",
          page: null,
          url: null
        }
      ],
      collection: null,
      id: "2accessories",
      level: 0,
      name: "Accessories",
      page: null,
      url: null
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OA==",
        name: "Groceries"
      },
      children: [],
      collection: null,
      id: "3groceries",
      level: 0,
      name: "Groceries",
      page: null,
      url: null
    },
    {
      __typename: "MenuItem",
      category: {
        __typename: "Category",
        id: "Q2F0ZWdvcnk6OQ==",
        name: "Apparel"
      },
      children: [],
      collection: null,
      id: "4apparel",
      level: 0,
      name: "Apparel",
      page: null,
      url: null
    }
  ],
  name: "navbar"
};
