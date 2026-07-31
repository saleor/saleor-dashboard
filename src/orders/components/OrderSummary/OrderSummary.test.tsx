import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { OrderSummary } from "./OrderSummary";

const RouterWrapper = ({ children }: { children: ReactNode }) => (
  <Wrapper>
    <MemoryRouter>{children}</MemoryRouter>
  </Wrapper>
);

// `unconfirmed()` has zero charged/authorized amounts and no payment history.
const orderWithNoPayment = OrderFixture.unconfirmed().build();

describe("OrderSummary", () => {
  it("should render summary title", () => {
    // Arrange
    const order = OrderFixture.fulfilled().build();

    // Act
    render(
      <RouterWrapper>
        <OrderSummary order={order} />
      </RouterWrapper>,
    );

    // Assert
    expect(screen.getByText("Summary")).toBeInTheDocument();
  });

  it("should render the payment-mode actions it is given", () => {
    // Arrange
    const order = OrderFixture.fulfilled().build();

    // Act
    render(
      <RouterWrapper>
        <OrderSummary order={order} actions={<button>Mode action</button>} />
      </RouterWrapper>,
    );

    // Assert
    expect(screen.getByText("Mode action")).toBeInTheDocument();
  });

  describe("PaymentsSummaryEmptyState", () => {
    it("should display empty state with CreditCard icon when hasNoPayment is true", () => {
      // Arrange + Act
      render(
        <RouterWrapper>
          <OrderSummary order={orderWithNoPayment} />
        </RouterWrapper>,
      );

      // Assert
      expect(screen.getByText("No payment received")).toBeInTheDocument();
    });

    it("should display instruction message in empty state", () => {
      // Arrange + Act
      render(
        <RouterWrapper>
          <OrderSummary order={orderWithNoPayment} />
        </RouterWrapper>,
      );

      // Assert
      expect(
        screen.getByText("Mark as paid manually if the payment is confirmed"),
      ).toBeInTheDocument();
    });

    it("should not display empty state when order has transactions", () => {
      // Arrange
      const order = OrderFixture.unconfirmed().withTransaction().build();

      // Act
      render(
        <RouterWrapper>
          <OrderSummary order={order} />
        </RouterWrapper>,
      );

      // Assert
      expect(screen.queryByText("No payment received")).not.toBeInTheDocument();
      expect(
        screen.queryByText("Mark as paid manually if the payment is confirmed"),
      ).not.toBeInTheDocument();
    });
  });
});
