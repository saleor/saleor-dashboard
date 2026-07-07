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
      screen.getByText(/Canceling a fulfillment will restock products at a selected warehouse/),
    ).toBeInTheDocument();
    expect(screen.getByTestId("cancel-fulfillment-select-field")).toBeInTheDocument();
    expect(screen.getByTestId("submit")).toBeDisabled();
    expect(screen.getByTestId("submit")).toHaveTextContent("Cancel fulfillment");
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
