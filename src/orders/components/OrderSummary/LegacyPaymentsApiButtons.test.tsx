import { OrderAction, OrderStatus } from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LegacyPaymentsApiButtons } from "./LegacyPaymentsApiButtons";

const renderButtons = (actions: OrderAction[], handlers = {}) => {
  const order = OrderFixture.fulfilled().withLegacyPayments().withActions(actions).build();

  render(
    <Wrapper>
      <LegacyPaymentsApiButtons order={order} {...handlers} />
    </Wrapper>,
  );
};

describe("LegacyPaymentsApiButtons", () => {
  it.each([
    [OrderAction.CAPTURE, "Capture"],
    [OrderAction.REFUND, "Refund"],
    [OrderAction.VOID, "Void"],
  ])("shows the %s button when the order allows it", (action, label) => {
    // Arrange + Act
    renderButtons([action], { onMarkAsPaid: jest.fn() });

    // Assert
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("shows Mark as Paid when the order allows it and a handler is supplied", () => {
    // Arrange + Act
    renderButtons([OrderAction.MARK_AS_PAID], { onMarkAsPaid: jest.fn() });

    // Assert
    expect(screen.getByTestId("mark-as-paid-button")).toBeInTheDocument();
  });

  it("shows every action the order allows", () => {
    // Arrange + Act
    renderButtons(
      [OrderAction.CAPTURE, OrderAction.REFUND, OrderAction.VOID, OrderAction.MARK_AS_PAID],
      { onMarkAsPaid: jest.fn() },
    );

    // Assert
    expect(screen.getByText("Capture")).toBeInTheDocument();
    expect(screen.getByText("Refund")).toBeInTheDocument();
    expect(screen.getByText("Void")).toBeInTheDocument();
    expect(screen.getByTestId("mark-as-paid-button")).toBeInTheDocument();
  });

  it("renders nothing when the order allows no payment action", () => {
    // Arrange + Act
    renderButtons([], { onMarkAsPaid: jest.fn() });

    // Assert
    expect(screen.queryByText("Capture")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mark-as-paid-button")).not.toBeInTheDocument();
  });

  it("renders nothing for a canceled order", () => {
    // Arrange
    const order = {
      ...OrderFixture.fulfilled().withActions([OrderAction.CAPTURE]).build(),
      status: OrderStatus.CANCELED,
    };

    // Act
    render(
      <Wrapper>
        <LegacyPaymentsApiButtons order={order} onCapture={jest.fn()} />
      </Wrapper>,
    );

    // Assert
    expect(screen.queryByText("Capture")).not.toBeInTheDocument();
  });

  it.each([
    ["onCapture", OrderAction.CAPTURE, "Capture"],
    ["onRefund", OrderAction.REFUND, "Refund"],
    ["onVoid", OrderAction.VOID, "Void"],
    ["onMarkAsPaid", OrderAction.MARK_AS_PAID, "Mark as Paid"],
  ])("calls %s when its button is clicked", async (handlerName, action, label) => {
    // Arrange
    const handler = jest.fn();

    renderButtons([action], { [handlerName]: handler });

    // Act
    await userEvent.click(screen.getByText(label));

    // Assert
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
