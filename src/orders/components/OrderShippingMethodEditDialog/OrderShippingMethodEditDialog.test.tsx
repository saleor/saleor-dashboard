import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { order } from "@dashboard/orders/fixtures";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import OrderShippingMethodEditDialog from "./OrderShippingMethodEditDialog";

describe("OrderShippingMethodEditDialog", () => {
  const shippingMethods = order("").shippingMethods!;
  const mockShippingPrice = {
    __typename: "TaxedMoney" as const,
    gross: {
      __typename: "Money" as const,
      amount: 10,
      currency: "USD",
    },
    net: {
      __typename: "Money" as const,
      amount: 10,
      currency: "USD",
    },
    tax: {
      __typename: "Money" as const,
      amount: 0,
      currency: "USD",
    },
  };

  const defaultProps = {
    confirmButtonState: "default" as ConfirmButtonTransitionState,
    errors: [],
    open: true,
    shippingMethod: shippingMethods[1].id,
    shippingMethodName: shippingMethods[1].name,
    shippingPrice: mockShippingPrice,
    shippingMethods,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
  };

  it("renders with available shipping methods", () => {
    render(
      <Wrapper>
        <OrderShippingMethodEditDialog {...defaultProps} />
      </Wrapper>,
    );

    expect(screen.getByText("Edit Shipping Method")).toBeInTheDocument();

    expect(screen.getByTestId("shipping-method-select")).toBeInTheDocument();
  });

  it("renders 'No shipping method' option when isClearable is true", () => {
    render(
      <Wrapper>
        <OrderShippingMethodEditDialog
          {...defaultProps}
          isClearable={true}
          shippingMethod={null} // Selected value is null (None)
        />
      </Wrapper>,
    );

    expect(screen.getByText("No shipping method")).toBeInTheDocument();
  });

  it("renders current shipping method name when selected", () => {
    render(
      <Wrapper>
        <OrderShippingMethodEditDialog {...defaultProps} />
      </Wrapper>,
    );

    expect(screen.getByText(shippingMethods[1].name)).toBeInTheDocument();
  });
});
