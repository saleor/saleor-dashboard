import { type CategoryFragment } from "@dashboard/graphql";
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

const makeCategoryRow = (
  category: CategoryFragment,
  depth = 0,
  parentId: string | null = null,
) => ({
  type: "category" as const,
  category,
  depth,
  parentId,
});

describe("CategoryListDatagrid createGetCellContent", () => {
  it("should return empty expand cell when category has no subcategories", () => {
    // Arrange
    const columns = [categoryListExpandColumn, nameColumn, subcategoriesColumn, productsColumn];
    const rows = [makeCategoryRow(makeCategory("cat-1", 0))];
    const getCellContent = createGetCellContent(rows, columns);

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
    const rows = [makeCategoryRow(makeCategory("cat-1", 3))];
    const getCellContent = createGetCellContent(rows, columns, {
      isCategoryChildrenLoading: categoryId => categoryId === "cat-1",
    });

    // Act
    const result = getCellContent([0, 0]);

    // Assert
    expect(result).toMatchObject({
      kind: GridCellKind.Custom,
      data: {
        kind: "throbber-cell",
      },
    });
  });

  it("should return expanded and collapsed chevrons", () => {
    // Arrange
    const columns = [categoryListExpandColumn, nameColumn, subcategoriesColumn, productsColumn];
    const rows = [makeCategoryRow(makeCategory("cat-1", 2))];
    const getCollapsedCell = createGetCellContent(rows, columns, {
      isCategoryExpanded: () => false,
    });
    const getExpandedCell = createGetCellContent(rows, columns, {
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
    const rows = [makeCategoryRow(makeCategory("cat-1", 0, "Phones"), 2)];
    const getCellContent = createGetCellContent(rows, columns, {
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

  it("should render load more label in name column", () => {
    // Arrange
    const columns = [nameColumn, subcategoriesColumn, productsColumn];
    const rows = [
      {
        type: "load-more" as const,
        parentId: "cat-1",
        depth: 1,
        remainingCount: 25,
      },
    ];
    const loadMoreCellThemeOverride = {
      baseFontStyle: "400 12px",
      textDark: "#2e47ba",
    };
    const getCellContent = createGetCellContent(rows, columns, {
      formatLoadMoreLabel: count => `Load ${count} more`,
      loadMoreCellThemeOverride,
    });

    // Act
    const result = getCellContent([0, 0]);

    // Assert
    expect(result).toMatchObject({
      kind: GridCellKind.Text,
      data: `${"\u00A0".repeat(4)}Load 25 more`,
      cursor: "pointer",
      style: "normal",
      themeOverride: loadMoreCellThemeOverride,
    });
  });

  it("should render load more loading state in expand column", () => {
    // Arrange
    const columns = [categoryListExpandColumn, nameColumn, subcategoriesColumn, productsColumn];
    const rows = [
      {
        type: "load-more" as const,
        parentId: "cat-1",
        depth: 1,
        remainingCount: 25,
      },
    ];
    const getCellContent = createGetCellContent(rows, columns, {
      isLoadingMoreSubcategories: parentId => parentId === "cat-1",
      formatLoadMoreLabel: count => `Load ${count} more`,
    });

    // Act
    const expandCell = getCellContent([0, 0]);
    const nameCell = getCellContent([1, 0]);

    // Assert
    expect(expandCell).toMatchObject({
      kind: GridCellKind.Custom,
      data: {
        kind: "throbber-cell",
      },
    });
    expect(nameCell).toMatchObject({
      kind: GridCellKind.Text,
      cursor: "default",
      style: "faded",
    });
  });
});
