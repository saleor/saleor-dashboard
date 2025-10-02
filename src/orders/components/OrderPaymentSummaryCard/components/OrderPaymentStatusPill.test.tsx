import { OrderChargeStatusEnum, PaymentChargeStatusEnum } from "@dashboard/graphql";
import { render, screen } from "@testing-library/react";

import { OrderPaymentStatusPill, OrderPaymentStatusPillProps } from "./OrderPaymentStatusPill";

// Mock the transformPaymentStatus function
jest.mock("@dashboard/misc", () => ({
  ...(jest.requireActual("@dashboard/misc") as object),
  transformPaymentStatus: jest.fn().mockReturnValue({
    status: "success",
    localized: "Paid",
  }),
}));

// It's tricky to render Pill component
// The mock contains the most important part - label and color
jest.mock("@dashboard/components/Pill", () => ({
  Pill: ({ label, color }: { label: string; color: string }) => <div color={color}>{label}</div>,
}));

describe("OrderPaymentStatusPill", () => {
  it("returns null when order is undefined", () => {
    // Arrange & Act
    const { container } = render(<OrderPaymentStatusPill order={undefined} />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("displays overcharged status when order is overcharged", () => {
    // Arrange
    const order = {
      paymentStatus: PaymentChargeStatusEnum.FULLY_CHARGED,
      chargeStatus: OrderChargeStatusEnum.OVERCHARGED,
    } satisfies OrderPaymentStatusPillProps["order"];

    // Act
    render(<OrderPaymentStatusPill order={order} />);

    // Assert
    expect(screen.getByText("Overcharged")).toBeInTheDocument();
  });

  it("displays regular payment status when order is not overcharged", () => {
    // Arrange
    const order = {
      paymentStatus: PaymentChargeStatusEnum.FULLY_CHARGED,
      chargeStatus: OrderChargeStatusEnum.FULL,
    } satisfies OrderPaymentStatusPillProps["order"];

    // Act
    render(<OrderPaymentStatusPill order={order} />);

    // Assert
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });
});
