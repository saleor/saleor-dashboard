// @ts-strict-ignore
import { mockResizeObserver } from "@dashboard/components/Datagrid/testUtils";
import { FulfillmentStatus, OrderAction } from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import { buildOrderLineLifecycle } from "@dashboard/orders/utils/buildOrderLineLifecycle";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { OrderLineMatrixDatagrid } from "./OrderLineMatrixDatagrid";

const order = OrderFixture.fulfilled().build();
const lifecycleRows = buildOrderLineLifecycle(order);

const defaultProps = {
  order,
  lines: lifecycleRows,
  loading: false,
  expandedLineId: null,
  onToggleExpand: jest.fn(),
  onOrderLineShowMetadata: jest.fn(),
  onShowLinePriceBreakdown: jest.fn(),
};

const renderDatagrid = (props = {}) =>
  render(
    <MemoryRouter>
      <Wrapper>
        <OrderLineMatrixDatagrid {...defaultProps} {...props} />
      </Wrapper>
    </MemoryRouter>,
  );

describe("OrderLineMatrixDatagrid", () => {
  beforeEach(() => {
    mockResizeObserver();
    window.localStorage.clear();
  });

  it("renders order lines in the datagrid", () => {
    // Arrange // Act
    renderDatagrid();

    // Assert
    expect(screen.getByTestId("list")).toBeInTheDocument();
  });

  it("renders row metadata action", () => {
    // Arrange // Act
    renderDatagrid();

    // Assert
    expect(screen.getByTestId("show-metadata-button")).toBeInTheDocument();
  });

  it("renders line action menu when return or refund actions are available", () => {
    // Arrange // Act
    renderDatagrid();

    // Assert
    expect(screen.getByTestId("show-more-button")).toBeInTheDocument();
  });

  it("opens line action menu with return and refund entries", async () => {
    // Arrange
    const user = userEvent.setup();
    const orderWithRefund = {
      ...order,
      actions: [OrderAction.REFUND],
    };

    renderDatagrid({
      order: orderWithRefund,
      lines: buildOrderLineLifecycle(orderWithRefund),
    });

    // Act
    await user.click(screen.getByTestId("show-more-button"));

    // Assert
    expect(screen.getByText("Return this line")).toBeInTheDocument();
    expect(screen.getByText("Refund this line")).toBeInTheDocument();
    expect(screen.getByText("Product details")).toBeInTheDocument();
    expect(screen.getByTestId("order-line-return")).toBeInTheDocument();
    expect(screen.getByTestId("order-line-refund")).toBeInTheDocument();
  });

  it("renders only product link when no line actions are available", () => {
    // Arrange
    const nonActionOrder = OrderFixture.fulfilled().build();
    const orderWithoutActions = {
      ...nonActionOrder,
      actions: nonActionOrder.actions.filter(action => action !== OrderAction.REFUND),
      fulfillments: nonActionOrder.fulfillments.map(fulfillment => ({
        ...fulfillment,
        status: FulfillmentStatus.RETURNED,
        lines: fulfillment.lines?.map(line => ({
          ...line,
          quantity: 0,
        })),
      })),
      lines: nonActionOrder.lines.map(line => ({
        ...line,
        quantityToFulfill: 0,
        quantityFulfilled: 0,
      })),
    };

    // Act
    renderDatagrid({
      order: orderWithoutActions,
      lines: buildOrderLineLifecycle(orderWithoutActions),
    });

    // Assert
    expect(screen.queryByTestId("show-more-button")).not.toBeInTheDocument();
    expect(screen.getByTestId("row-action-button")).toBeInTheDocument();
  });
});
