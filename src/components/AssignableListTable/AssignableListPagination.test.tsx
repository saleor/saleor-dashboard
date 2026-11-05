import { PaginatorContext, type PaginatorContextValues } from "@dashboard/hooks/usePaginator";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

import { AssignableListPagination } from "./AssignableListPagination";

const paginatorValue: PaginatorContextValues = {
  paginatorType: "click",
  hasNextPage: true,
  hasPreviousPage: false,
  loadNextPage: jest.fn(),
  loadPreviousPage: jest.fn(),
};

const TestWrapper = ({ children }: { children: ReactNode }): React.ReactNode => (
  <Wrapper>
    <PaginatorContext.Provider value={paginatorValue}>{children}</PaginatorContext.Provider>
  </Wrapper>
);

describe("AssignableListPagination", () => {
  it("renders compact row-count and page controls", () => {
    // Arrange & Act
    render(
      <AssignableListPagination numberOfRows={20} onUpdateListSettings={jest.fn()} inset="drag" />,
      { wrapper: TestWrapper },
    );

    // Assert
    expect(screen.getByText("No. of rows")).toBeInTheDocument();
    expect(screen.getByTestId("button-pagination-back")).toBeDisabled();
    expect(screen.getByTestId("button-pagination-next")).not.toBeDisabled();
  });

  it("stays on an empty page while there are other pages", () => {
    // Arrange & Act
    render(
      <AssignableListPagination
        hasRows={false}
        numberOfRows={10}
        onUpdateListSettings={jest.fn()}
      />,
      { wrapper: TestWrapper },
    );

    // Assert
    expect(screen.getByTestId("assignable-list-pagination")).toBeInTheDocument();
  });

  it("stays on an emptied last page so Previous can be reached", () => {
    // Arrange
    const lastPage: PaginatorContextValues = {
      ...paginatorValue,
      hasNextPage: false,
      hasPreviousPage: true,
    };

    // Act
    render(
      <Wrapper>
        <PaginatorContext.Provider value={lastPage}>
          <AssignableListPagination
            hasRows={false}
            numberOfRows={10}
            onUpdateListSettings={jest.fn()}
          />
        </PaginatorContext.Provider>
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("button-pagination-back")).not.toBeDisabled();
  });

  it("hides on an empty list with no other pages", () => {
    // Arrange
    const singlePage: PaginatorContextValues = {
      ...paginatorValue,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    // Act
    render(
      <Wrapper>
        <PaginatorContext.Provider value={singlePage}>
          <AssignableListPagination
            hasRows={false}
            numberOfRows={10}
            onUpdateListSettings={jest.fn()}
          />
        </PaginatorContext.Provider>
      </Wrapper>,
    );

    // Assert
    expect(screen.queryByTestId("assignable-list-pagination")).not.toBeInTheDocument();
  });
});
