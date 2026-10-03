import { pageListProps, sortPageProps } from "@dashboard/fixtures";
import { WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import { warehouseList } from "@dashboard/warehouses/fixtures";
import { WarehouseListUrlSortField } from "@dashboard/warehouses/urls";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import WarehouseList from "./WarehouseList";

const TestWrapper = ({ children }: { children: ReactNode }): ReactNode => (
  <Wrapper>
    <PaginatorContext.Provider
      value={{
        paginatorType: "click",
        hasNextPage: false,
        hasPreviousPage: false,
        loadNextPage: jest.fn(),
        loadPreviousPage: jest.fn(),
      }}
    >
      <MemoryRouter>{children}</MemoryRouter>
    </PaginatorContext.Provider>
  </Wrapper>
);

const props = {
  ...pageListProps.default,
  ...sortPageProps,
  sort: { ...sortPageProps.sort, sort: WarehouseListUrlSortField.name },
  onRemove: jest.fn(),
};

describe("WarehouseList", () => {
  it("labels warehouses customers can collect from as Pickup", () => {
    // Arrange
    const warehouses = [
      {
        ...warehouseList[0],
        name: "Downtown",
        clickAndCollectOption: WarehouseClickAndCollectOptionEnum.LOCAL,
      },
      {
        ...warehouseList[1],
        name: "Uptown",
        clickAndCollectOption: WarehouseClickAndCollectOptionEnum.ALL,
      },
      {
        ...warehouseList[2],
        name: "Storage",
        clickAndCollectOption: WarehouseClickAndCollectOptionEnum.DISABLED,
      },
    ];

    // Act
    render(<WarehouseList {...props} warehouses={warehouses} />, { wrapper: TestWrapper });

    // Assert
    expect(screen.getAllByTestId("warehouse-pickup-label")).toHaveLength(2);
    expect(screen.getByTestId("warehouse-entry-downtown")).toHaveTextContent("Pickup");
    expect(screen.getByTestId("warehouse-entry-uptown")).toHaveTextContent("Pickup");
    expect(screen.getByTestId("warehouse-entry-storage")).not.toHaveTextContent("Pickup");
  });
});
