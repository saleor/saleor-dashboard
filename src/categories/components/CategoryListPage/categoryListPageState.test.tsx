import { type CategoryFragment } from "@dashboard/graphql";
import { render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { type ReactNode } from "react";

import {
  type CategoryListPageState,
  CategoryListPageStateProvider,
  useCategoryListPageState,
} from "./categoryListPageState";

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

describe("categoryListPageState", () => {
  it("should return provided state from hook", () => {
    // Arrange
    const state = createState({
      subcategoryPageSize: 75,
      hasExpandedSubcategories: true,
      selectedCategoriesIds: ["cat-1"],
    });
    const wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
      <CategoryListPageStateProvider value={state}>{children}</CategoryListPageStateProvider>
    );

    // Act
    const { result } = renderHook(() => useCategoryListPageState(), { wrapper });

    // Assert
    expect(result.current.subcategoryPageSize).toBe(75);
    expect(result.current.hasExpandedSubcategories).toBe(true);
    expect(result.current.selectedCategoriesIds).toEqual(["cat-1"]);
  });

  it("should propagate provider value updates", () => {
    // Arrange
    const TestConsumer = (): JSX.Element => {
      const { subcategoryPageSize } = useCategoryListPageState();

      return <span data-test-id="subcategory-page-size">{subcategoryPageSize}</span>;
    };
    const firstState = createState({ subcategoryPageSize: 20 });
    const secondState = createState({ subcategoryPageSize: 120 });
    const { rerender } = render(
      <CategoryListPageStateProvider value={firstState}>
        <TestConsumer />
      </CategoryListPageStateProvider>,
    );

    // Act
    rerender(
      <CategoryListPageStateProvider value={secondState}>
        <TestConsumer />
      </CategoryListPageStateProvider>,
    );

    // Assert
    expect(screen.getByTestId("subcategory-page-size")).toHaveTextContent("120");
  });

  it("should throw when hook is used outside provider", () => {
    // Arrange
    // Act
    const { result } = renderHook(() => useCategoryListPageState());

    // Assert
    expect(result.error).toEqual(expect.any(Error));
    expect(result.error?.message).toContain(
      "useCategoryListPageState must be used within CategoryListPageStateProvider",
    );
  });

  it("should keep state isolated between separate providers", () => {
    // Arrange
    const TestConsumer = ({ testId }: { testId: string }): JSX.Element => {
      const { subcategoryPageSize } = useCategoryListPageState();

      return <span data-test-id={testId}>{subcategoryPageSize}</span>;
    };

    // Act
    render(
      <>
        <CategoryListPageStateProvider value={createState({ subcategoryPageSize: 30 })}>
          <TestConsumer testId="provider-a" />
        </CategoryListPageStateProvider>
        <CategoryListPageStateProvider value={createState({ subcategoryPageSize: 90 })}>
          <TestConsumer testId="provider-b" />
        </CategoryListPageStateProvider>
      </>,
    );

    // Assert
    expect(screen.getByTestId("provider-a")).toHaveTextContent("30");
    expect(screen.getByTestId("provider-b")).toHaveTextContent("90");
  });
});
