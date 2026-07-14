import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { FulfillmentStatus, OrderErrorCode, type OrderErrorFragment } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import OrderFulfillmentCancelDialog from "./OrderFulfillmentCancelDialog";

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe("OrderFulfillmentCancelDialog", () => {
  const warehouses = [
    { __typename: "Warehouse" as const, id: "wh-1", name: "Warehouse A" },
    { __typename: "Warehouse" as const, id: "wh-2", name: "Warehouse B" },
  ];

  const defaultProps = {
    confirmButtonState: "default" as ConfirmButtonTransitionState,
    errors: [],
    open: true,
    warehouses,
    fulfillmentStatus: FulfillmentStatus.FULFILLED,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
  };

  it("renders warehouse select when fulfillment is not waiting for approval", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <OrderFulfillmentCancelDialog {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("Cancel Fulfillment")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Canceling a fulfillment will restock products at the selected warehouse. The warehouse this fulfillment shipped from is pre-selected./,
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("cancel-fulfillment-select-field")).toBeInTheDocument();
    expect(screen.getByTestId("submit")).toBeDisabled();
    expect(screen.getByTestId("submit")).toHaveTextContent("Cancel fulfillment");
  });

  it("pre-selects the fulfillment warehouse when provided", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <OrderFulfillmentCancelDialog {...defaultProps} defaultWarehouseId="wh-2" />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("submit")).not.toBeDisabled();
    expect(screen.getByDisplayValue("Warehouse B")).toBeInTheDocument();
  });

  it("hides warehouse select when fulfillment is waiting for approval", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <OrderFulfillmentCancelDialog
          {...defaultProps}
          fulfillmentStatus={FulfillmentStatus.WAITING_FOR_APPROVAL}
        />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("Cancel Fulfillment")).toBeInTheDocument();
    expect(
      screen.getByText(
        /This fulfillment has not been approved yet. Canceling removes the pending shipment/,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("cancel-fulfillment-select-field")).not.toBeInTheDocument();
    expect(screen.getByTestId("submit")).not.toBeDisabled();
  });

  it("displays error messages when provided", () => {
    // Arrange
    const errors = [{ code: OrderErrorCode.GRAPHQL_ERROR }] as unknown as OrderErrorFragment[];

    // Act
    render(
      <Wrapper>
        <OrderFulfillmentCancelDialog {...defaultProps} errors={errors} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getAllByTestId("dialog-error")).toHaveLength(1);
  });
});
