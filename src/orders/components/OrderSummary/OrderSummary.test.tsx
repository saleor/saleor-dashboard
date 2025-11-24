import { OrderAction } from "@dashboard/graphql";
import { order as orderFixture, prepareMoney } from "@dashboard/orders/fixtures";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OrderSummary } from "./OrderSummary";

// Helper to create order with no payment (hasNoPayment === true)
const createOrderWithNoPayment = (actions: OrderAction[] = [OrderAction.MARK_AS_PAID]) => ({
  ...orderFixture("test-id"),
  actions,
  transactions: [],
  payments: [],
  grantedRefunds: [],
  giftCards: [],
  totalAuthorized: prepareMoney(0),
  totalCharged: prepareMoney(0),
});

const transaction = {
  __typename: "TransactionItem" as const,
  id: "transaction-id",
  pspReference: "psp-ref",
  externalUrl: "https://example.com/transaction",
  createdAt: "2023-01-01T12:00:00Z",
  name: "Transaction",
  events: [],
  actions: [],
  authorizedAmount: {
    __typename: "Money" as const,
    amount: 100,
    currency: "USD",
  },
  chargedAmount: {
    __typename: "Money" as const,
    amount: 100,
    currency: "USD",
  },
  refundedAmount: {
    __typename: "Money" as const,
    amount: 0,
    currency: "USD",
  },
  canceledAmount: {
    __typename: "Money" as const,
    amount: 0,
    currency: "USD",
  },
  authorizePendingAmount: {
    __typename: "Money" as const,
    amount: 0,
    currency: "USD",
  },
  chargePendingAmount: {
    __typename: "Money" as const,
    amount: 0,
    currency: "USD",
  },
  refundPendingAmount: {
    __typename: "Money" as const,
    amount: 0,
    currency: "USD",
  },
  cancelPendingAmount: {
    __typename: "Money" as const,
    amount: 0,
    currency: "USD",
  },
};

describe("OrderSummary", () => {
  describe("Basic Rendering", () => {
    it("should render order summary title", () => {
      // Arrange
      const mockOrder = orderFixture("test-id");
      const onMarkAsPaid = jest.fn();

      // Act
      render(
        <Wrapper>
          <OrderSummary order={mockOrder} onMarkAsPaid={onMarkAsPaid} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Order summary")).toBeInTheDocument();
    });
  });

  describe("Transactions API Mode", () => {
    it("should show TransactionsApiButtons when useLegacyPaymentsApi is false", () => {
      // Arrange
      const mockOrder = createOrderWithNoPayment();
      const onMarkAsPaid = jest.fn();

      // Act
      render(
        <Wrapper>
          <OrderSummary
            order={mockOrder}
            onMarkAsPaid={onMarkAsPaid}
            useLegacyPaymentsApi={false}
          />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Mark as Paid")).toBeInTheDocument();
    });

    it("should show TransactionsApiButtons when useLegacyPaymentsApi is undefined", () => {
      // Arrange
      const mockOrder = createOrderWithNoPayment();
      const onMarkAsPaid = jest.fn();

      // Act
      render(
        <Wrapper>
          <OrderSummary order={mockOrder} onMarkAsPaid={onMarkAsPaid} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Mark as Paid")).toBeInTheDocument();
    });

    it("should show Mark as Paid button when hasNoPayment is true and canMarkAsPaid is true", () => {
      // Arrange
      const mockOrder = createOrderWithNoPayment();
      const onMarkAsPaid = jest.fn();

      // Act
      render(
        <Wrapper>
          <OrderSummary order={mockOrder} onMarkAsPaid={onMarkAsPaid} />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Mark as Paid")).toBeInTheDocument();
    });

    it("should not show Mark as Paid button when hasNoPayment is false (has transactions)", () => {
      // Arrange
      const mockOrder = {
        ...orderFixture("test-id"),
        actions: [OrderAction.MARK_AS_PAID],
        transactions: [transaction],
        payments: [],
        grantedRefunds: [],
      };
      const onMarkAsPaid = jest.fn();

      // Act
      render(
        <Wrapper>
          <OrderSummary order={mockOrder} onMarkAsPaid={onMarkAsPaid} />
        </Wrapper>,
      );

      // Assert
      expect(screen.queryByText("Mark as Paid")).not.toBeInTheDocument();
    });

    it("should not show Mark as Paid button when hasNoPayment is false (has payments)", () => {
      // Arrange
      const mockOrder = {
        ...orderFixture("test-id"),
        actions: [OrderAction.MARK_AS_PAID],
        transactions: [],
        payments: [{ id: "payment-1" }] as any,
        grantedRefunds: [],
      };
      const onMarkAsPaid = jest.fn();

      // Act
      render(
        <Wrapper>
          <OrderSummary order={mockOrder} onMarkAsPaid={onMarkAsPaid} />
        </Wrapper>,
      );

      // Assert
      expect(screen.queryByText("Mark as Paid")).not.toBeInTheDocument();
    });

    it("should not show Mark as Paid button when canMarkAsPaid is false", () => {
      // Arrange
      const mockOrder = {
        ...orderFixture("test-id"),
        actions: [],
        transactions: [],
        payments: [],
        grantedRefunds: [],
      };
      const onMarkAsPaid = jest.fn();

      // Act
      render(
        <Wrapper>
          <OrderSummary order={mockOrder} onMarkAsPaid={onMarkAsPaid} />
        </Wrapper>,
      );

      // Assert
      expect(screen.queryByText("Mark as Paid")).not.toBeInTheDocument();
    });

    it("should call onMarkAsPaid when Mark as Paid button is clicked", async () => {
      // Arrange
      const mockOrder = createOrderWithNoPayment();
      const onMarkAsPaid = jest.fn();

      // Act
      render(
        <Wrapper>
          <OrderSummary order={mockOrder} onMarkAsPaid={onMarkAsPaid} />
        </Wrapper>,
      );

      const markAsPaidButton = screen.getByText("Mark as Paid");

      await userEvent.click(markAsPaidButton);

      // Assert
      expect(onMarkAsPaid).toHaveBeenCalledTimes(1);
    });
  });

  describe("Legacy Payments API Mode", () => {
    it("should show LegacyPaymentsApiButtons when useLegacyPaymentsApi is true", () => {
      // Arrange
      const mockOrder = {
        ...orderFixture("test-id"),
        actions: [OrderAction.CAPTURE],
      };
      const onMarkAsPaid = jest.fn();
      const onCapture = jest.fn();
      const onRefund = jest.fn();
      const onVoid = jest.fn();

      // Act
      render(
        <Wrapper>
          <OrderSummary
            order={mockOrder}
            onMarkAsPaid={onMarkAsPaid}
            useLegacyPaymentsApi={true}
            onLegacyPaymentsApiCapture={onCapture}
            onLegacyPaymentsApiRefund={onRefund}
            onLegacyPaymentsApiVoid={onVoid}
          />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Capture")).toBeInTheDocument();
    });

    it("should show Capture button when order.actions includes CAPTURE", () => {
      // Arrange
      const mockOrder = {
        ...orderFixture("test-id"),
        actions: [OrderAction.CAPTURE],
      };
      const onMarkAsPaid = jest.fn();
      const onCapture = jest.fn();
      const onRefund = jest.fn();
      const onVoid = jest.fn();

      // Act
      render(
        <Wrapper>
          <OrderSummary
            order={mockOrder}
            onMarkAsPaid={onMarkAsPaid}
            useLegacyPaymentsApi={true}
            onLegacyPaymentsApiCapture={onCapture}
            onLegacyPaymentsApiRefund={onRefund}
            onLegacyPaymentsApiVoid={onVoid}
          />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Capture")).toBeInTheDocument();
    });

    it("should show Refund button when order.actions includes REFUND", () => {
      // Arrange
      const mockOrder = {
        ...orderFixture("test-id"),
        actions: [OrderAction.REFUND],
      };
      const onMarkAsPaid = jest.fn();
      const onCapture = jest.fn();
      const onRefund = jest.fn();
      const onVoid = jest.fn();

      // Act
      render(
        <Wrapper>
          <OrderSummary
            order={mockOrder}
            onMarkAsPaid={onMarkAsPaid}
            useLegacyPaymentsApi={true}
            onLegacyPaymentsApiCapture={onCapture}
            onLegacyPaymentsApiRefund={onRefund}
            onLegacyPaymentsApiVoid={onVoid}
          />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Refund")).toBeInTheDocument();
    });

    it("should show Void button when order.actions includes VOID", () => {
      // Arrange
      const mockOrder = {
        ...orderFixture("test-id"),
        actions: [OrderAction.VOID],
      };
      const onMarkAsPaid = jest.fn();
      const onCapture = jest.fn();
      const onRefund = jest.fn();
      const onVoid = jest.fn();

      // Act
      render(
        <Wrapper>
          <OrderSummary
            order={mockOrder}
            onMarkAsPaid={onMarkAsPaid}
            useLegacyPaymentsApi={true}
            onLegacyPaymentsApiCapture={onCapture}
            onLegacyPaymentsApiRefund={onRefund}
            onLegacyPaymentsApiVoid={onVoid}
          />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Void")).toBeInTheDocument();
    });

    it("should show Mark as Paid button when order.actions includes MARK_AS_PAID", () => {
      // Arrange
      const mockOrder = {
        ...orderFixture("test-id"),
        actions: [OrderAction.MARK_AS_PAID],
      };
      const onMarkAsPaid = jest.fn();
      const onCapture = jest.fn();
      const onRefund = jest.fn();
      const onVoid = jest.fn();

      // Act
      render(
        <Wrapper>
          <OrderSummary
            order={mockOrder}
            onMarkAsPaid={onMarkAsPaid}
            useLegacyPaymentsApi={true}
            onLegacyPaymentsApiCapture={onCapture}
            onLegacyPaymentsApiRefund={onRefund}
            onLegacyPaymentsApiVoid={onVoid}
          />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByTestId("markAsPaidButton")).toBeInTheDocument();
    });

    it("should call onLegacyPaymentsApiCapture when Capture button is clicked", async () => {
      // Arrange
      const mockOrder = {
        ...orderFixture("test-id"),
        actions: [OrderAction.CAPTURE],
      };
      const onMarkAsPaid = jest.fn();
      const onCapture = jest.fn();
      const onRefund = jest.fn();
      const onVoid = jest.fn();

      // Act
      render(
        <Wrapper>
          <OrderSummary
            order={mockOrder}
            onMarkAsPaid={onMarkAsPaid}
            useLegacyPaymentsApi={true}
            onLegacyPaymentsApiCapture={onCapture}
            onLegacyPaymentsApiRefund={onRefund}
            onLegacyPaymentsApiVoid={onVoid}
          />
        </Wrapper>,
      );

      const captureButton = screen.getByText("Capture");

      await userEvent.click(captureButton);

      // Assert
      expect(onCapture).toHaveBeenCalledTimes(1);
    });

    it("should call onLegacyPaymentsApiRefund when Refund button is clicked", async () => {
      // Arrange
      const mockOrder = {
        ...orderFixture("test-id"),
        actions: [OrderAction.REFUND],
      };
      const onMarkAsPaid = jest.fn();
      const onCapture = jest.fn();
      const onRefund = jest.fn();
      const onVoid = jest.fn();

      // Act
      render(
        <Wrapper>
          <OrderSummary
            order={mockOrder}
            onMarkAsPaid={onMarkAsPaid}
            useLegacyPaymentsApi={true}
            onLegacyPaymentsApiCapture={onCapture}
            onLegacyPaymentsApiRefund={onRefund}
            onLegacyPaymentsApiVoid={onVoid}
          />
        </Wrapper>,
      );

      const refundButton = screen.getByTestId("refund-button");

      await userEvent.click(refundButton);

      // Assert
      expect(onRefund).toHaveBeenCalledTimes(1);
    });

    it("should call onLegacyPaymentsApiVoid when Void button is clicked", async () => {
      // Arrange
      const mockOrder = {
        ...orderFixture("test-id"),
        actions: [OrderAction.VOID],
      };
      const onMarkAsPaid = jest.fn();
      const onCapture = jest.fn();
      const onRefund = jest.fn();
      const onVoid = jest.fn();

      // Act
      render(
        <Wrapper>
          <OrderSummary
            order={mockOrder}
            onMarkAsPaid={onMarkAsPaid}
            useLegacyPaymentsApi={true}
            onLegacyPaymentsApiCapture={onCapture}
            onLegacyPaymentsApiRefund={onRefund}
            onLegacyPaymentsApiVoid={onVoid}
          />
        </Wrapper>,
      );

      const voidButton = screen.getByText("Void");

      await userEvent.click(voidButton);

      // Assert
      expect(onVoid).toHaveBeenCalledTimes(1);
    });

    it("should call onMarkAsPaid when Mark as Paid button is clicked in legacy mode", async () => {
      // Arrange
      const mockOrder = {
        ...orderFixture("test-id"),
        actions: [OrderAction.MARK_AS_PAID],
      };
      const onMarkAsPaid = jest.fn();
      const onCapture = jest.fn();
      const onRefund = jest.fn();
      const onVoid = jest.fn();

      // Act
      render(
        <Wrapper>
          <OrderSummary
            order={mockOrder}
            onMarkAsPaid={onMarkAsPaid}
            useLegacyPaymentsApi={true}
            onLegacyPaymentsApiCapture={onCapture}
            onLegacyPaymentsApiRefund={onRefund}
            onLegacyPaymentsApiVoid={onVoid}
          />
        </Wrapper>,
      );

      const markAsPaidButton = screen.getByTestId("markAsPaidButton");

      await userEvent.click(markAsPaidButton);

      // Assert
      expect(onMarkAsPaid).toHaveBeenCalledTimes(1);
    });

    it("should show multiple action buttons when order has multiple actions", () => {
      // Arrange
      const mockOrder = {
        ...orderFixture("test-id"),
        actions: [
          OrderAction.CAPTURE,
          OrderAction.REFUND,
          OrderAction.VOID,
          OrderAction.MARK_AS_PAID,
        ],
      };
      const onMarkAsPaid = jest.fn();
      const onCapture = jest.fn();
      const onRefund = jest.fn();
      const onVoid = jest.fn();

      // Act
      render(
        <Wrapper>
          <OrderSummary
            order={mockOrder}
            onMarkAsPaid={onMarkAsPaid}
            useLegacyPaymentsApi={true}
            onLegacyPaymentsApiCapture={onCapture}
            onLegacyPaymentsApiRefund={onRefund}
            onLegacyPaymentsApiVoid={onVoid}
          />
        </Wrapper>,
      );

      // Assert
      expect(screen.getByText("Capture")).toBeInTheDocument();
      expect(screen.getByText("Refund")).toBeInTheDocument();
      expect(screen.getByText("Void")).toBeInTheDocument();
      expect(screen.getByTestId("markAsPaidButton")).toBeInTheDocument();
    });
  });

  it("should handle orders with gift cards", () => {
    // Arrange
    const orderId = "T3JkZXI6OQ=="; // Match the ID from createOrderWithNoPayment
    const mockOrder = {
      ...createOrderWithNoPayment(),
      id: orderId,
      giftCards: [
        {
          __typename: "GiftCard" as const,
          id: "gc-1",
          last4CodeChars: "0000",
          currentBalance: { amount: 10, __typename: "Money" as const, currency: "USD" },
          events: [
            {
              __typename: "GiftCardEvent" as const,
              id: "gce-1",
              orderId,
              type: "USED_IN_ORDER" as const,
              date: "2023-01-01",
              balance: {
                __typename: "OrderEventBalance" as const,
                currentBalance: { amount: 0, __typename: "Money" as const, currency: "USD" },
                oldCurrentBalance: { amount: 10, __typename: "Money" as const, currency: "USD" },
              },
            },
          ],
        },
      ] as any,
    };
    const onMarkAsPaid = jest.fn();

    // Act
    render(
      <Wrapper>
        <OrderSummary order={mockOrder} onMarkAsPaid={onMarkAsPaid} />
      </Wrapper>,
    );

    // Assert - should not show Mark as Paid button because has gift cards
    expect(screen.queryByText("Mark as Paid")).not.toBeInTheDocument();
  });

  it("should handle orders with granted refunds", () => {
    // Arrange
    const mockOrder = {
      ...orderFixture("test-id"),
      actions: [OrderAction.MARK_AS_PAID],
      transactions: [],
      payments: [],
      grantedRefunds: [{ id: "refund-1" }] as any,
    };
    const onMarkAsPaid = jest.fn();

    // Act
    render(
      <Wrapper>
        <OrderSummary order={mockOrder} onMarkAsPaid={onMarkAsPaid} />
      </Wrapper>,
    );

    // Assert - should not show Mark as Paid button because has granted refunds
    expect(screen.queryByText("Mark as Paid")).not.toBeInTheDocument();
  });

  it("should correctly identify hasNoPayment when all payment sources are empty", () => {
    // Arrange
    const mockOrder = createOrderWithNoPayment();
    const onMarkAsPaid = jest.fn();

    // Act
    render(
      <Wrapper>
        <OrderSummary order={mockOrder} onMarkAsPaid={onMarkAsPaid} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText("Mark as Paid")).toBeInTheDocument();
  });
});
