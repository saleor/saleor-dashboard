import { type CategoryFragment } from "@dashboard/graphql";

import {
  getSelectedWithLoadedDescendants,
  removeDescendantsFromDeselectedParents,
} from "./categorySelection";

const createCategory = (id: string): CategoryFragment =>
  ({
    __typename: "Category",
    id,
    name: id,
    children: {
      __typename: "CategoryCountableConnection",
      totalCount: 0,
    },
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 0,
    },
  }) as CategoryFragment;

describe("categorySelection utils", () => {
  it("should include loaded descendants when parent is selected", () => {
    // Arrange
    const childrenMap: Record<string, CategoryFragment[]> = {
      parent: [createCategory("child"), createCategory("child-2")],
      child: [createCategory("nested")],
      "child-2": [],
      nested: [],
    };

    // Act
    const result = getSelectedWithLoadedDescendants(["parent"], id => childrenMap[id] ?? []);

    // Assert
    expect(result).toEqual(["parent", "child", "nested", "child-2"]);
  });

  it("should remove descendants for deselected parent", () => {
    // Arrange
    const childrenMap: Record<string, CategoryFragment[]> = {
      parent: [createCategory("child")],
      child: [createCategory("nested")],
      nested: [],
    };

    // Act
    const result = removeDescendantsFromDeselectedParents(
      ["other"],
      ["parent", "child", "nested", "other"],
      id => childrenMap[id] ?? [],
    );

    // Assert
    expect(result).toEqual(["other"]);
  });

  it("should not remove descendants for unrelated branches", () => {
    // Arrange
    const childrenMap: Record<string, CategoryFragment[]> = {
      parent: [createCategory("child")],
      child: [],
      other: [createCategory("other-child")],
      "other-child": [],
    };

    // Act
    const result = removeDescendantsFromDeselectedParents(
      ["other", "other-child"],
      ["parent", "child", "other", "other-child"],
      id => childrenMap[id] ?? [],
    );

    // Assert
    expect(result).toEqual(["other", "other-child"]);
  });
});
