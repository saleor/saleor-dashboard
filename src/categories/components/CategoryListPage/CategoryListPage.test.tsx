import { rippleExpandedSubcategories } from "@dashboard/categories/ripples/expandedSubcategories";
import { CategoryListUrlSortField } from "@dashboard/categories/urls";
import { type CategoryFragment } from "@dashboard/graphql";
import { fireEvent, render, screen } from "@testing-library/react";
import { type ComponentProps, type ReactNode } from "react";

import { CategoryListPage } from "./CategoryListPage";
import { type CategoryListPageState, CategoryListPageStateProvider } from "./categoryListPageState";

const navigateMock = jest.fn();
const rippleModelSpy = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => () => navigateMock);
jest.mock("@dashboard/extensions/extensionMountPoints", () => ({
  extensionMountPoints: {
    CATEGORY_LIST: "CATEGORY_LIST",
  },
}));
jest.mock("@dashboard/extensions/getExtensionsItems", () => ({
  getExtensionItemsForOverviewCreate: () => [],
  getExtensionsItemsForCategoryOverviewActions: () => [],
}));
jest.mock("@dashboard/extensions/hooks/useExtensions", () => ({
  useExtensions: () => ({
    CATEGORY_OVERVIEW_CREATE: [],
    CATEGORY_OVERVIEW_MORE_ACTIONS: [],
  }),
}));
jest.mock("@dashboard/intl", () => ({
  sectionNames: {
    categories: {
      defaultMessage: "Categories",
    },
  },
}));
jest.mock("@dashboard/components/AppLayout/ListFilters/components/SearchInput", () => () => null);
jest.mock("@dashboard/components/AppLayout/TopNav", () => {
  const TopNav = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const TopNavMenu = (): null => null;

  TopNav.Menu = TopNavMenu;

  return { TopNav };
});
jest.mock("@dashboard/components/BulkDeleteButton", () => ({
  BulkDeleteButton: ({ children, onClick }: { children: ReactNode; onClick: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));
jest.mock("@dashboard/components/ButtonGroupWithDropdown", () => ({
  ButtonGroupWithDropdown: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
jest.mock("@dashboard/components/Card", () => ({
  DashboardCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
jest.mock("@dashboard/components/FilterPresetsSelect", () => ({
  FilterPresetsSelect: () => null,
}));
jest.mock("@dashboard/components/Layouts", () => ({
  ListPageLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
jest.mock("@dashboard/ripples/components/Ripple", () => ({
  Ripple: ({ model }: { model: unknown }) => {
    rippleModelSpy(model);

    return <div data-test-id="ripple-badge" />;
  },
}));
jest.mock("../CategoryListDatagrid", () => ({
  CategoryListDatagrid: () => null,
}));
jest.mock("@saleor/macaw-ui-next", () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Button: ({
    children,
    disabled,
    onClick,
  }: {
    children: ReactNode;
    disabled?: boolean;
    onClick?: () => void;
  }) => (
    <button disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
  Input: ({ value, onChange }: { value: number; onChange: (event: any) => void }) => (
    <input value={value} onChange={onChange} />
  ),
  Text: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}));

const categoriesFixture: CategoryFragment[] = [
  {
    __typename: "Category",
    id: "cat-1",
    name: "Category 1",
    children: {
      __typename: "CategoryCountableConnection",
      totalCount: 0,
    },
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 0,
    },
  } as CategoryFragment,
];

const createProps = (overrides: Partial<ComponentProps<typeof CategoryListPage>> = {}) => ({
  currentTab: undefined,
  disabled: false,
  initialSearch: "",
  tabs: [],
  onAll: jest.fn(),
  onSearchChange: jest.fn(),
  onTabChange: jest.fn(),
  onTabDelete: jest.fn(),
  onTabSave: jest.fn(),
  onTabUpdate: jest.fn(),
  hasPresetsChanged: false,
  sort: {
    sort: CategoryListUrlSortField.name,
    asc: true,
  },
  onSort: jest.fn(),
  settings: {
    rowNumber: 20,
    columns: [],
  },
  onUpdateListSettings: jest.fn(),
  ...overrides,
});
const createState = (overrides: Partial<CategoryListPageState> = {}): CategoryListPageState => ({
  categories: categoriesFixture,
  selectedCategoriesIds: [],
  onCategoriesDelete: jest.fn(),
  onSelectCategoriesIds: jest.fn(),
  onSelectedCategoriesIdsChange: jest.fn(),
  isCategoryExpanded: jest.fn(() => false),
  onCategoryExpandToggle: jest.fn(),
  isCategoryChildrenLoading: jest.fn(() => false),
  getCategoryDepth: jest.fn(() => 0),
  subcategoryPageSize: 50,
  onSubcategoryPageSizeChange: jest.fn(),
  hasExpandedSubcategories: false,
  onCollapseAllSubcategories: jest.fn(),
  ...overrides,
});

const renderWithState = (
  props: Partial<ComponentProps<typeof CategoryListPage>> = {},
  state: Partial<CategoryListPageState> = {},
) =>
  render(
    <CategoryListPageStateProvider value={createState(state)}>
      <CategoryListPage {...createProps(props)} />
    </CategoryListPageStateProvider>,
  );

describe("CategoryListPage", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    rippleModelSpy.mockReset();
  });

  it("should disable collapse all button when there are no expanded subcategories", () => {
    // Arrange
    renderWithState({}, { hasExpandedSubcategories: false });

    // Act
    const collapseButton = screen.getByRole("button", { name: "Collapse all" });

    // Assert
    expect(collapseButton).toBeDisabled();
  });

  it("should call collapse all callback when collapse button is clicked", () => {
    // Arrange
    const onCollapseAllSubcategories = jest.fn();

    renderWithState({}, { hasExpandedSubcategories: true, onCollapseAllSubcategories });

    const collapseButton = screen.getByRole("button", { name: "Collapse all" });

    // Act
    fireEvent.click(collapseButton);

    // Assert
    expect(onCollapseAllSubcategories).toHaveBeenCalledTimes(1);
  });

  it("should render ripple with expandable subcategories model", () => {
    // Arrange
    renderWithState();

    // Act
    const renderedRippleModel = rippleModelSpy.mock.calls[0][0];

    // Assert
    expect(renderedRippleModel).toBe(rippleExpandedSubcategories);
  });

  it("should show bulk delete button when selected categories are present", () => {
    // Arrange
    renderWithState({}, { selectedCategoriesIds: ["cat-1"] });

    // Act
    const bulkDeleteButton = screen.getByRole("button", { name: "Delete categories" });

    // Assert
    expect(bulkDeleteButton).toBeInTheDocument();
  });
});
