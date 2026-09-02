import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { ProductListPagination } from "./ProductListPagination";

const paginatorValue = {
  paginatorType: "click" as const,
  hasNextPage: true,
  hasPreviousPage: false,
  loadNextPage: jest.fn(),
  loadPreviousPage: jest.fn(),
};

const TestWrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <Wrapper>
    <MemoryRouter>
      <PaginatorContext.Provider value={paginatorValue}>{children}</PaginatorContext.Provider>
    </MemoryRouter>
  </Wrapper>
);

describe("ProductListPagination", () => {
  it("uses the same products label in list and grid", () => {
    // Arrange & Act
    render(
      <ProductListPagination
        settings={{ rowNumber: 20 }}
        disabled={false}
        onUpdateListSettings={jest.fn()}
      />,
      { wrapper: TestWrapper },
    );

    // Assert
    expect(screen.getByText("No. of products")).toBeInTheDocument();
    expect(screen.queryByText("No. of rows")).not.toBeInTheDocument();
  });
});
