import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import { Button } from "@saleor/macaw-ui-next";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

import { AssignableListCard } from "./AssignableListCard";
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

describe("AssignableListCard", () => {
  it("renders the search band and pagination footer as owned chrome", () => {
    // Arrange & Act
    render(
      <AssignableListCard
        title="Attribute Values"
        headerEnd={<Button variant="secondary">Assign value</Button>}
        search={<input aria-label="Search attribute values" />}
        footer={
          <AssignableListPagination
            numberOfRows={10}
            onUpdateListSettings={jest.fn()}
            inset="card"
          />
        }
        data-test-id="assignable-list-card"
      >
        <div>table</div>
      </AssignableListCard>,
      { wrapper: TestWrapper },
    );

    // Assert
    expect(screen.getByTestId("assignable-list-card")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Attribute Values" })).toBeInTheDocument();
    expect(screen.getByTestId("assignable-list-search")).toBeInTheDocument();
    expect(screen.getByTestId("assignable-list-pagination")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Assign value" })).toBeInTheDocument();
  });

  it("omits the search band when no search is passed", () => {
    // Arrange & Act
    render(
      <AssignableListCard title="Products">
        <div>table</div>
      </AssignableListCard>,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.queryByTestId("assignable-list-search")).not.toBeInTheDocument();
  });
});
