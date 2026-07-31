import { OrderAction } from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TransactionsApiButtons } from "./TransactionsApiButtons";

// `unconfirmed()` has zero charged/authorized amounts and no payment history,
// which is the only state where the transactions view offers "Mark as Paid".
const orderWithNoPayment = () => OrderFixture.unconfirmed().withActions([OrderAction.MARK_AS_PAID]);

describe("TransactionsApiButtons", () => {
  it("shows Mark as Paid when the order has no payment and allows the action", () => {
    // Arrange
    const order = orderWithNoPayment().build();

    // Act
    render(
      <Wrapper>
        <TransactionsApiButtons order={order} onMarkAsPaid={jest.fn()} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("mark-as-paid-button")).toBeInTheDocument();
  });

  it("calls onMarkAsPaid when the button is clicked", async () => {
    // Arrange
    const onMarkAsPaid = jest.fn();

    render(
      <Wrapper>
        <TransactionsApiButtons order={orderWithNoPayment().build()} onMarkAsPaid={onMarkAsPaid} />
      </Wrapper>,
    );

    // Act
    await userEvent.click(screen.getByTestId("mark-as-paid-button"));

    // Assert
    expect(onMarkAsPaid).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["transactions", orderWithNoPayment().withTransaction()],
    ["payments", orderWithNoPayment().withLegacyPayments()],
    ["granted refunds", orderWithNoPayment().withGrantedRefund()],
    ["gift cards", orderWithNoPayment().withGiftCards()],
  ])("hides Mark as Paid when the order already has %s", (_label, fixture) => {
    // Arrange + Act
    render(
      <Wrapper>
        <TransactionsApiButtons order={fixture.build()} onMarkAsPaid={jest.fn()} />
      </Wrapper>,
    );

    // Assert
    expect(screen.queryByTestId("mark-as-paid-button")).not.toBeInTheDocument();
  });

  it("hides Mark as Paid when the order does not allow the action", () => {
    // Arrange
    const order = OrderFixture.unconfirmed().withActions([]).build();

    // Act
    render(
      <Wrapper>
        <TransactionsApiButtons order={order} onMarkAsPaid={jest.fn()} />
      </Wrapper>,
    );

    // Assert
    expect(screen.queryByTestId("mark-as-paid-button")).not.toBeInTheDocument();
  });

  it("hides Mark as Paid when no handler is supplied", () => {
    // Arrange + Act
    render(
      <Wrapper>
        <TransactionsApiButtons order={orderWithNoPayment().build()} />
      </Wrapper>,
    );

    // Assert
    expect(screen.queryByTestId("mark-as-paid-button")).not.toBeInTheDocument();
  });
});
