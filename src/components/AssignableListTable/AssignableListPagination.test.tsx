import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

import { AssignableListPagination } from "./AssignableListPagination";

const paginatorValue = {
  paginatorType: "click" as const,
  hasNextPage: true,
  hasPreviousPage: false,
  loadNextPage: jest.fn(),
  loadPreviousPage: jest.fn(),
};

const TestWrapper = ({ children }: { children: ReactNode }): JSX.Element => (
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
});
