import { type CategoryListRow } from "@dashboard/categories/views/CategoryList/types";
import { type CategoryFragment } from "@dashboard/graphql";
import { render, screen } from "@testing-library/react";

import { type CategoryListPageState, CategoryListPageStateProvider } from "./categoryListPageState";
import { useCategoryListPageState } from "./categoryListPageState";

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

const rowsFixture: CategoryListRow[] = categoriesFixture.map(category => ({
  type: "category",
  category,
  depth: 0,
  parentId: null,
}));

const createState = (overrides: Partial<CategoryListPageState> = {}): CategoryListPageState => ({
  rows: rowsFixture,
  selectedCategoriesIds: [],
  onCategoriesDelete: jest.fn(),
  onSelectCategoriesIds: jest.fn(),
  onSelectedCategoriesIdsChange: jest.fn(),
  isCategoryExpanded: jest.fn(() => false),
  onCategoryExpandToggle: jest.fn(),
  isCategoryChildrenLoading: jest.fn(() => false),
  isLoadingMoreSubcategories: jest.fn(() => false),
  getCategoryDepth: jest.fn(() => 0),
  onLoadMoreSubcategories: jest.fn(),
  hasExpandedSubcategories: false,
  onCollapseAllSubcategories: jest.fn(),
  ...overrides,
});

describe("categoryListPageState", () => {
  it("should expose rows from provider value", () => {
    // Arrange
    const RowCount = () => {
      const { rows } = useCategoryListPageState();

      return <span data-test-id="row-count">{rows.length}</span>;
    };

    // Act
    render(
      <CategoryListPageStateProvider value={createState()}>
        <RowCount />
      </CategoryListPageStateProvider>,
    );

    // Assert
    expect(screen.getByTestId("row-count")).toHaveTextContent("1");
  });

  it("should update atom value when provider value changes", () => {
    // Arrange
    const RowCount = ({ testId }: { testId: string }) => {
      const { rows } = useCategoryListPageState();

      return <span data-test-id={testId}>{rows.length}</span>;
    };
    const firstState = createState({
      rows: rowsFixture,
    });
    const secondState = createState({
      rows: [...rowsFixture, ...rowsFixture],
    });

    // Act
    const { rerender } = render(
      <CategoryListPageStateProvider value={firstState}>
        <RowCount testId="first-row-count" />
      </CategoryListPageStateProvider>,
    );

    rerender(
      <CategoryListPageStateProvider value={secondState}>
        <RowCount testId="second-row-count" />
      </CategoryListPageStateProvider>,
    );

    // Assert
    expect(screen.getByTestId("second-row-count")).toHaveTextContent("2");
  });

  it("should keep provider scopes isolated", () => {
    // Arrange
    const RowCount = ({ testId }: { testId: string }) => {
      const { rows } = useCategoryListPageState();

      return <span data-test-id={testId}>{rows.length}</span>;
    };

    // Act
    render(
      <>
        <CategoryListPageStateProvider value={createState({ rows: rowsFixture })}>
          <RowCount testId="first-provider" />
        </CategoryListPageStateProvider>
        <CategoryListPageStateProvider
          value={createState({
            rows: [...rowsFixture, ...rowsFixture, ...rowsFixture],
          })}
        >
          <RowCount testId="second-provider" />
        </CategoryListPageStateProvider>
      </>,
    );

    // Assert
    expect(screen.getByTestId("first-provider")).toHaveTextContent("1");
    expect(screen.getByTestId("second-provider")).toHaveTextContent("3");
  });
});
