import { categoryUrl } from "@dashboard/categories/urls";
import { CategoryFragment } from "@dashboard/graphql";
import { CompactSelection, GridSelection } from "@glideapps/glide-data-grid";
import { render } from "@testing-library/react";

import { CategoryListDatagrid } from "./CategoryListDatagrid";

const navigateMock = jest.fn();
let datagridProps: Record<string, any> = {};

jest.mock("@dashboard/hooks/useNavigator", () => () => navigateMock);
jest.mock("@dashboard/hooks/useBackLinkWithState", () => ({
  getPrevLocationState: () => undefined,
}));
jest.mock("@dashboard/components/Datagrid/ColumnPicker/ColumnPicker", () => ({
  ColumnPicker: () => null,
}));
jest.mock("@dashboard/components/TablePagination", () => ({
  DatagridPagination: () => null,
}));
jest.mock("@dashboard/components/Datagrid/Datagrid", () => ({
  __esModule: true,
  default: (props: Record<string, any>) => {
    datagridProps = props;

    return null;
  },
}));
jest.mock("@dashboard/components/Datagrid/ColumnPicker/useColumns", () => ({
  useColumns: () => ({
    handlers: {
      onMove: jest.fn(),
      onResize: jest.fn(),
      onToggle: jest.fn(),
    },
    selectedColumns: [],
    staticColumns: [],
    visibleColumns: [
      { id: "name", title: "Name", width: 320 },
      { id: "subcategories", title: "Subcategories", width: 160 },
      { id: "products", title: "Products", width: 160 },
    ],
  }),
}));
jest.mock("react-router", () => ({
  useLocation: () => ({
    pathname: "/categories/",
    search: "",
    hash: "",
    state: undefined,
  }),
}));

const createCategory = (id: string, childrenCount: number): CategoryFragment =>
  ({
    __typename: "Category",
    id,
    name: `Category ${id}`,
    children: {
      __typename: "CategoryCountableConnection",
      totalCount: childrenCount,
    },
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 10,
    },
  }) as CategoryFragment;

const baseProps = {
  disabled: false,
  settings: {
    rowNumber: 20,
    columns: [],
  },
  categories: [createCategory("cat-1", 1), createCategory("cat-2", 0), createCategory("cat-3", 2)],
  onSelectCategoriesIds: jest.fn(),
  onUpdateListSettings: jest.fn(),
};

describe("CategoryListDatagrid", () => {
  beforeEach(() => {
    datagridProps = {};
    navigateMock.mockReset();
  });

  it("should map selected category ids to controlled row selection", () => {
    // Arrange
    render(
      <CategoryListDatagrid
        {...baseProps}
        selectedCategoriesIds={["cat-2", "missing-id"]}
        onSelectedCategoriesIdsChange={jest.fn()}
      />,
    );

    // Act
    const selectedRows = datagridProps.controlledSelection.rows.toArray();

    // Assert
    expect(selectedRows).toEqual([1]);
    expect(typeof datagridProps.onControlledSelectionChange).toBe("function");
  });

  it("should map controlled row selection back to category ids", () => {
    // Arrange
    const onSelectedCategoriesIdsChange = jest.fn();

    render(
      <CategoryListDatagrid
        {...baseProps}
        selectedCategoriesIds={[]}
        onSelectedCategoriesIdsChange={onSelectedCategoriesIdsChange}
      />,
    );

    const selection: GridSelection = {
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty().add(0).add(2),
    };

    // Act
    datagridProps.onControlledSelectionChange(selection);

    // Assert
    expect(onSelectedCategoriesIdsChange).toHaveBeenCalledWith(["cat-1", "cat-3"]);
  });

  it("should trigger expand toggle only for expandable non-loading rows", () => {
    // Arrange
    const onCategoryExpandToggle = jest.fn();

    render(
      <CategoryListDatagrid
        {...baseProps}
        isCategoryExpanded={() => false}
        isCategoryChildrenLoading={categoryId => categoryId === "cat-3"}
        onCategoryExpandToggle={onCategoryExpandToggle}
      />,
    );

    // Act
    datagridProps.onRowClick([0, 0]);
    datagridProps.onRowClick([0, 1]);
    datagridProps.onRowClick([0, 2]);

    // Assert
    expect(onCategoryExpandToggle).toHaveBeenCalledTimes(1);
    expect(onCategoryExpandToggle).toHaveBeenCalledWith("cat-1");
  });

  it("should navigate to details when clicking non-expand columns", () => {
    // Arrange
    render(<CategoryListDatagrid {...baseProps} />);

    // Act
    datagridProps.onRowClick([0, 0]);

    // Assert
    expect(navigateMock).toHaveBeenCalledWith(categoryUrl("cat-1"));
  });
});
