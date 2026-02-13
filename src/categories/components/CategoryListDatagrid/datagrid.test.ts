import { CategoryFragment } from "@dashboard/graphql";
import { GridCellKind } from "@glideapps/glide-data-grid";

import { categoryListExpandColumn, createGetCellContent } from "./datagrid";

const nameColumn = { id: "name", title: "Name", width: 320 };
const subcategoriesColumn = { id: "subcategories", title: "Subcategories", width: 180 };
const productsColumn = { id: "products", title: "Products", width: 180 };

const makeCategory = (id: string, childrenCount: number, name = "Category"): CategoryFragment =>
  ({
    __typename: "Category",
    id,
    name,
    children: {
      __typename: "CategoryCountableConnection",
      totalCount: childrenCount,
    },
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 10,
    },
  }) as CategoryFragment;

describe("CategoryListDatagrid createGetCellContent", () => {
  it("should return empty expand cell when category has no subcategories", () => {
    // Arrange
    const columns = [categoryListExpandColumn, nameColumn, subcategoriesColumn, productsColumn];
    const categories: CategoryFragment[] = [makeCategory("cat-1", 0)];
    const getCellContent = createGetCellContent(categories, columns);

    // Act
    const result = getCellContent([0, 0]);

    // Assert
    expect(result).toMatchObject({
      kind: GridCellKind.Text,
      data: "",
      cursor: "default",
      readonly: true,
    });
  });

  it("should return loading cell for subcategories while children are loading", () => {
    // Arrange
    const columns = [categoryListExpandColumn, nameColumn, subcategoriesColumn, productsColumn];
    const categories: CategoryFragment[] = [makeCategory("cat-1", 3)];
    const getCellContent = createGetCellContent(categories, columns, {
      isCategoryChildrenLoading: categoryId => categoryId === "cat-1",
    });

    // Act
    const result = getCellContent([0, 0]);

    // Assert
    expect(result).toMatchObject({
      kind: GridCellKind.Custom,
      data: {
        kind: "spinner-cell",
      },
    });
  });

  it("should return expanded and collapsed chevrons", () => {
    // Arrange
    const columns = [categoryListExpandColumn, nameColumn, subcategoriesColumn, productsColumn];
    const categories: CategoryFragment[] = [makeCategory("cat-1", 2)];
    const getCollapsedCell = createGetCellContent(categories, columns, {
      isCategoryExpanded: () => false,
    });
    const getExpandedCell = createGetCellContent(categories, columns, {
      isCategoryExpanded: () => true,
    });

    // Act
    const collapsedCell = getCollapsedCell([0, 0]);
    const expandedCell = getExpandedCell([0, 0]);

    // Assert
    expect(collapsedCell).toMatchObject({
      kind: GridCellKind.Custom,
      data: {
        kind: "chevron-cell",
        direction: "right",
      },
    });
    expect(expandedCell).toMatchObject({
      kind: GridCellKind.Custom,
      data: {
        kind: "chevron-cell",
        direction: "down",
      },
    });
  });

  it("should indent category name based on depth", () => {
    // Arrange
    const columns = [nameColumn, subcategoriesColumn, productsColumn];
    const categories: CategoryFragment[] = [makeCategory("cat-1", 0, "Phones")];
    const getCellContent = createGetCellContent(categories, columns, {
      getCategoryDepth: () => 2,
    });

    // Act
    const result = getCellContent([0, 0]);

    // Assert
    expect(result).toMatchObject({
      kind: GridCellKind.Text,
      data: "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Phones",
    });
  });
});
