import { type CategoryFragment } from "@dashboard/graphql";

import {
  buildDepthByCategoryId,
  buildParentByCategoryId,
  buildVisibleRows,
  collectDescendantIds,
} from "./categoryTree";

const createCategory = (id: string, name = id): CategoryFragment =>
  ({
    __typename: "Category",
    id,
    name,
    children: {
      __typename: "CategoryCountableConnection",
      totalCount: 0,
    },
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 0,
    },
  }) as CategoryFragment;

describe("categoryTree utils", () => {
  it("should collect descendants recursively", () => {
    // Arrange
    const root = createCategory("root");
    const firstChild = createCategory("first-child");
    const secondChild = createCategory("second-child");
    const nestedChild = createCategory("nested-child");
    const childrenMap: Record<string, CategoryFragment[]> = {
      [root.id]: [firstChild, secondChild],
      [firstChild.id]: [nestedChild],
      [secondChild.id]: [],
      [nestedChild.id]: [],
    };

    // Act
    const result = collectDescendantIds(root.id, parentId => childrenMap[parentId] ?? []);

    // Assert
    expect(result).toEqual(["first-child", "nested-child", "second-child"]);
  });

  it("should build visible rows only for expanded branches", () => {
    // Arrange
    const rootA = createCategory("a");
    const rootB = createCategory("b");
    const childA1 = createCategory("a-1");
    const childA2 = createCategory("a-2");
    const nestedA11 = createCategory("a-1-1");
    const childrenMap: Record<string, CategoryFragment[]> = {
      [rootA.id]: [childA1, childA2],
      [rootB.id]: [],
      [childA1.id]: [nestedA11],
      [childA2.id]: [],
      [nestedA11.id]: [],
    };

    // Act
    const rows = buildVisibleRows(
      [rootA, rootB],
      new Set([rootA.id, childA1.id]),
      parentId => childrenMap[parentId] ?? [],
    );

    // Assert
    expect(rows.map(row => row.category.id)).toEqual(["a", "a-1", "a-1-1", "a-2", "b"]);
    expect(rows.map(row => row.depth)).toEqual([0, 1, 2, 1, 0]);
  });

  it("should build depth map for visible rows", () => {
    // Arrange
    const rows = [
      { category: createCategory("root"), depth: 0, parentId: null },
      { category: createCategory("child"), depth: 1, parentId: "root" },
      { category: createCategory("nested"), depth: 2, parentId: "child" },
    ];

    // Act
    const result = buildDepthByCategoryId(rows);

    // Assert
    expect(result).toEqual({
      root: 0,
      child: 1,
      nested: 2,
    });
  });

  it("should build parent map for visible rows", () => {
    // Arrange
    const rows = [
      { category: createCategory("root"), depth: 0, parentId: null },
      { category: createCategory("child"), depth: 1, parentId: "root" },
      { category: createCategory("nested"), depth: 2, parentId: "child" },
    ];

    // Act
    const result = buildParentByCategoryId(rows);

    // Assert
    expect(result).toEqual({
      root: null,
      child: "root",
      nested: "child",
    });
  });
});
