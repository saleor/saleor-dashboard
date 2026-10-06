import { pageListProps, sortPageProps } from "@dashboard/fixtures";
import { WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import { warehouseList } from "@dashboard/warehouses/fixtures";
import { WarehouseListUrlSortField } from "@dashboard/warehouses/urls";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { WarehouseList } from "./WarehouseList";

const paginatorValue = {
  paginatorType: "link" as const,
  nextHref: undefined,
  prevHref: undefined,
  hasNextPage: false,
  hasPreviousPage: false,
};

const TestWrapper = ({ children }: { children: ReactNode }): ReactNode => (
  <Wrapper>
    <PaginatorContext.Provider value={paginatorValue}>
      <MemoryRouter>{children}</MemoryRouter>
    </PaginatorContext.Provider>
  </Wrapper>
);

const warehouse = {
  ...warehouseList[1],
  clickAndCollectOption: WarehouseClickAndCollectOptionEnum.LOCAL,
};

describe("WarehouseList", () => {
  it("shows whether the location can sell, and pickup only when it is on", () => {
    // Arrange
    render(
      <TestWrapper>
        <WarehouseList
          {...pageListProps.default}
          {...sortPageProps}
          sort={{ ...sortPageProps.sort, sort: WarehouseListUrlSortField.name }}
          warehouses={[warehouse]}
          membership="ready"
          channelsByWarehouseId={{}}
          legacyStockAvailability={false}
          onRemove={jest.fn()}
        />
      </TestWrapper>,
    );

    // Assert
    expect(screen.getByText("Port Danielshire, United Arab Emirates")).toBeInTheDocument();
    expect(screen.getByText("Not in a channel")).toBeInTheDocument();
    expect(screen.getByTestId("warehouse-pickup-pill")).toHaveTextContent("Pickup");
    expect(screen.queryByText("Stock here")).not.toBeInTheDocument();
    expect(screen.queryByText("Any location")).not.toBeInTheDocument();
  });

  it("leaves the status blank when membership cannot be loaded", () => {
    // Arrange
    render(
      <TestWrapper>
        <WarehouseList
          {...pageListProps.default}
          {...sortPageProps}
          sort={{ ...sortPageProps.sort, sort: WarehouseListUrlSortField.name }}
          warehouses={[warehouse]}
          membership="unavailable"
          channelsByWarehouseId={{}}
          legacyStockAvailability={true}
          onRemove={jest.fn()}
        />
      </TestWrapper>,
    );

    // Assert
    expect(screen.queryByText("Not in a channel")).not.toBeInTheDocument();
    expect(screen.queryByText("No shipping zone")).not.toBeInTheDocument();
  });
});
