// @ts-strict-ignore
import { mockResizeObserver } from "@dashboard/components/Datagrid/testUtils";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import { buildOrderLineLifecycle } from "@dashboard/orders/utils/buildOrderLineLifecycle";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
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
});
