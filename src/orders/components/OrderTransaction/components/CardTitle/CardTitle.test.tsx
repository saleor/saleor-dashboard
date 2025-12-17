import { TransactionActionEnum, TransactionItemFragment } from "@dashboard/graphql";
import { prepareMoney, transactions } from "@dashboard/orders/fixtures";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ExtendedOrderTransaction } from "../../types";
import { OrderTransactionCardTitle } from "./CardTitle";

const createTransaction = (
  overrides: Partial<TransactionItemFragment> & { index?: number } = {},
): ExtendedOrderTransaction => ({
  ...transactions.chargeSuccess[0],
  index: 0,
  ...overrides,
});

describe("OrderTransactionCardTitle", () => {
  describe("amounts display logic", () => {
    it("only displays amounts greater than zero", () => {
      // Arrange
      const transaction = createTransaction({
        chargedAmount: prepareMoney(100),
        authorizedAmount: prepareMoney(0),
        refundedAmount: prepareMoney(50),
        canceledAmount: prepareMoney(0),
        chargePendingAmount: prepareMoney(0),
        authorizePendingAmount: prepareMoney(0),
        refundPendingAmount: prepareMoney(0),
        cancelPendingAmount: prepareMoney(0),
      });

      // Act
      render(
        <Wrapper>
          <OrderTransactionCardTitle transaction={transaction} onTransactionAction={jest.fn()} />
        </Wrapper>,
      );

      // Assert - only non-zero amounts should be displayed
      expect(screen.getByText("Charged")).toBeInTheDocument();
      expect(screen.getByText("Refunded")).toBeInTheDocument();
      expect(screen.queryByText("Authorized")).not.toBeInTheDocument();
      expect(screen.queryByText("Canceled")).not.toBeInTheDocument();
    });
  });

  describe("actions menu logic", () => {
    it("filters out REFUND action from menu", async () => {
      // Arrange
      const user = userEvent.setup();
      const transaction = createTransaction({
        actions: [
          TransactionActionEnum.CHARGE,
          TransactionActionEnum.REFUND,
          TransactionActionEnum.CANCEL,
        ],
      });

      // Act
      render(
        <Wrapper>
          <OrderTransactionCardTitle
            transaction={transaction}
            onTransactionAction={jest.fn()}
            showActions={true}
          />
        </Wrapper>,
      );
      await user.click(screen.getByTestId("transaction-menu-button"));

      // Assert - REFUND is handled separately in Send Refund view
      expect(screen.getByText("Capture")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.queryByText("Refund")).not.toBeInTheDocument();
    });

    it("hides menu when showActions is false even if actions exist", () => {
      // Arrange
      const transaction = createTransaction({
        actions: [TransactionActionEnum.CHARGE, TransactionActionEnum.CANCEL],
      });

      // Act
      render(
        <Wrapper>
          <OrderTransactionCardTitle
            transaction={transaction}
            onTransactionAction={jest.fn()}
            showActions={false}
          />
        </Wrapper>,
      );

      // Assert
      expect(screen.queryByTestId("transaction-menu-button")).not.toBeInTheDocument();
    });

    it("hides menu when actions array is empty", () => {
      // Arrange
      const transaction = createTransaction({ actions: [] });

      // Act
      render(
        <Wrapper>
          <OrderTransactionCardTitle
            transaction={transaction}
            onTransactionAction={jest.fn()}
            showActions={true}
          />
        </Wrapper>,
      );

      // Assert
      expect(screen.queryByTestId("transaction-menu-button")).not.toBeInTheDocument();
    });

    it("hides menu when only REFUND action is available", () => {
      // Arrange - REFUND gets filtered out, leaving no actions
      const transaction = createTransaction({
        actions: [TransactionActionEnum.REFUND],
      });

      // Act
      render(
        <Wrapper>
          <OrderTransactionCardTitle
            transaction={transaction}
            onTransactionAction={jest.fn()}
            showActions={true}
          />
        </Wrapper>,
      );

      // Assert
      expect(screen.queryByTestId("transaction-menu-button")).not.toBeInTheDocument();
    });

    it("calls onTransactionAction with correct transaction id and action type", async () => {
      // Arrange
      const user = userEvent.setup();
      const onTransactionAction = jest.fn();
      const transaction = createTransaction({
        id: "txn-abc-123",
        actions: [TransactionActionEnum.CANCEL],
      });

      // Act
      render(
        <Wrapper>
          <OrderTransactionCardTitle
            transaction={transaction}
            onTransactionAction={onTransactionAction}
            showActions={true}
          />
        </Wrapper>,
      );
      await user.click(screen.getByTestId("transaction-menu-button"));
      await user.click(screen.getByText("Cancel"));

      // Assert
      expect(onTransactionAction).toHaveBeenCalledWith("txn-abc-123", TransactionActionEnum.CANCEL);
    });
  });
});
