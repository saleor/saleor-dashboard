// @ts-strict-ignore
import { mockResizeObserver } from "@dashboard/components/Datagrid/testUtils";
import { WeightUnitsEnum } from "@dashboard/graphql";
import { listSettingsStorageKey } from "@dashboard/hooks/useListSettings";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import { ListViews } from "@dashboard/types";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { OrderDetailsItemsSection } from "./OrderDetailsItemsSection";

const order = OrderFixture.fulfilled().build();

const defaultProps = {
  order,
  shop: {
    __typename: "Shop" as const,
    fulfillmentAllowUnpaid: true,
    fulfillmentAutoApprove: true,
    defaultWeightUnit: WeightUnitsEnum.KG,
    countries: [],
    availablePaymentGateways: [],
  },
  loading: false,
  canFulfill: true,
  notAllowedToFulfillUnpaid: false,
  onOrderFulfill: jest.fn(),
  onOrderReturn: jest.fn(),
  onFulfillmentApprove: jest.fn(),
  onFulfillmentCancel: jest.fn(),
  onFulfillmentTrackingNumberUpdate: jest.fn(),
  onOrderLineShowMetadata: jest.fn(),
  onFulfillmentShowMetadata: jest.fn(),
};

const renderSection = (props = {}) =>
  render(
    <MemoryRouter>
      <Wrapper>
        <OrderDetailsItemsSection {...defaultProps} {...props} />
      </Wrapper>
    </MemoryRouter>,
  );

describe("OrderDetailsItemsSection", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockResizeObserver();
  });

  it("renders timeline view by default", () => {
    // Arrange // Act
    renderSection();

    // Assert
    expect(screen.getByTestId("order-items-view-timeline")).toBeInTheDocument();
    expect(screen.getByTestId("fulfilled-order-section")).toBeInTheDocument();
  });

  it("switches to line matrix view", async () => {
    // Arrange
    const user = userEvent.setup();

    renderSection();

    // Act
    await user.click(screen.getByTestId("order-items-view-matrix"));

    // Assert
    expect(screen.queryByTestId("fulfilled-order-section")).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "Quantities show where each unit is in the fulfillment lifecycle. Click a line's status to view and manage its shipments.",
      ),
    ).toBeInTheDocument();
  });

  it("persists matrix view mode in list settings", async () => {
    // Arrange
    const user = userEvent.setup();

    renderSection();

    // Act
    await user.click(screen.getByTestId("order-items-view-matrix"));

    // Assert
    const stored = JSON.parse(window.localStorage.getItem(listSettingsStorageKey) ?? "{}");

    expect(stored[ListViews.ORDER_DETAILS_LIST].viewMode).toBe("matrix");
  });

  it("hides canceled fulfillments behind a toggle in timeline view", async () => {
    // Arrange
    const user = userEvent.setup();
    const orderWithCanceled = OrderFixture.fulfilled().withCanceledFulfillment().build();

    renderSection({ order: orderWithCanceled });

    // Assert
    expect(screen.getAllByTestId("fulfilled-order-section")).toHaveLength(1);
    expect(screen.getByTestId("toggle-canceled-fulfillments")).toBeInTheDocument();

    // Act
    await user.click(screen.getByTestId("toggle-canceled-fulfillments"));

    // Assert
    expect(screen.getAllByTestId("fulfilled-order-section")).toHaveLength(2);
  });
});
