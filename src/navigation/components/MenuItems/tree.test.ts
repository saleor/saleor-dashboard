// @ts-strict-ignore
import { MenuItemFragment } from "@dashboard/graphql";
import { MenuTreeItem } from "@dashboard/navigation/types";

import { getDiff } from "./tree";

const originalTree: MenuTreeItem[] = [
  {
    children: [
      {
        children: [],
        id: "0jewelry",
        data: { name: "Jewelry" } as MenuItemFragment,
      },
      {
        children: [],
        id: "1glasses",
        data: { name: "Glasses" } as MenuItemFragment,
      },
    ],
    id: "2accessories",
    data: { name: "Accessories" } as MenuItemFragment,
  },
  {
    children: [],
    id: "3groceries",
    data: { name: "Groceries" } as MenuItemFragment,
  },
  {
    children: [],
    id: "4apparel",
    data: { name: "Apparel" } as MenuItemFragment,
  },
];

describe("MenuItems tree - getDiff", () => {
  it("should return orinal tree when no changes", () => {
    const diff = getDiff(originalTree, []);

    expect(diff).toMatchSnapshot();
  });
  it("should return array with operations", () => {
    const diff = getDiff(originalTree, [
      {
        children: [
          {
            children: [],
            id: "1glasses",
            data: { name: "Glasses" } as MenuItemFragment,
          },
          {
            children: [],
            id: "4apparel",
            data: { name: "Apparel" } as MenuItemFragment,
          },
        ],
        id: "2accessories",
        data: { name: "Accessories" } as MenuItemFragment,
      },
      {
        children: [
          {
            children: [],
            id: "0jewelry",
            data: { name: "Jewelry" } as MenuItemFragment,
          },
        ],
        id: "3groceries",
        data: { name: "Groceries" } as MenuItemFragment,
      },
    ]);

    expect(diff).toMatchSnapshot();
  });
});
