import { pageListProps, sortPageProps } from "@dashboard/fixtures";
import {
  WarehouseClickAndCollectOptionEnum,
  type WarehouseWithShippingFragment,
} from "@dashboard/graphql";
import { PaginatorContext, type PaginatorContextValues } from "@dashboard/hooks/usePaginator";
import { warehouseList } from "@dashboard/warehouses/fixtures";
import { WarehouseListUrlSortField } from "@dashboard/warehouses/urls";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { type ComponentProps, type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { WarehouseList } from "./WarehouseList";

type StatusProps = Pick<
  ComponentProps<typeof WarehouseList>,
  "membership" | "channelsByWarehouseId" | "legacyStockAvailability"
>;

const paginatorValue: PaginatorContextValues = {
  paginatorType: "link",
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

const warehouse: WarehouseWithShippingFragment = {
  ...warehouseList[1],
  clickAndCollectOption: WarehouseClickAndCollectOptionEnum.LOCAL,
};

const renderList = (statusProps: StatusProps): ReturnType<typeof render> =>
  render(
    <TestWrapper>
      <WarehouseList
        {...pageListProps.default}
        {...sortPageProps}
        sort={{ ...sortPageProps.sort, sort: WarehouseListUrlSortField.name }}
        warehouses={[warehouse]}
        onRemove={jest.fn()}
        {...statusProps}
      />
    </TestWrapper>,
  );

describe("WarehouseList", () => {
  it("shows whether the location can sell, and pickup only when it is on", () => {
    // Arrange
    const statusProps: StatusProps = {
      membership: "ready",
      channelsByWarehouseId: {},
      legacyStockAvailability: false,
    };

    // Act
    renderList(statusProps);

    // Assert
    expect(screen.getByText("Port Danielshire, United Arab Emirates")).toBeInTheDocument();
    expect(screen.getByText("Not in a channel")).toBeInTheDocument();
    expect(screen.getByTestId("warehouse-pickup-pill")).toHaveTextContent("Pickup");
    expect(screen.queryByText("Stock here")).not.toBeInTheDocument();
    expect(screen.queryByText("Any location")).not.toBeInTheDocument();
  });

  it("shows a dash when membership cannot be loaded", () => {
    // Arrange
    const statusProps: StatusProps = {
      membership: "unavailable",
      channelsByWarehouseId: {},
      legacyStockAvailability: true,
    };

    // Act
    renderList(statusProps);

    // Assert
    expect(screen.getByTestId("warehouse-list-status-unknown")).toHaveTextContent("—");
    expect(screen.queryByText("Not in a channel")).not.toBeInTheDocument();
    expect(screen.queryByText("No shipping zone")).not.toBeInTheDocument();
  });

  it("waits for the stock mode before showing the status", () => {
    // Arrange
    const statusProps: StatusProps = {
      membership: "ready",
      channelsByWarehouseId: {},
      legacyStockAvailability: undefined,
    };

    // Act
    renderList(statusProps);

    // Assert
    expect(screen.queryByText("Not in a channel")).not.toBeInTheDocument();
  });
});
