import { OrderDetailsFragment, TransactionActionEnum } from "@dashboard/graphql";
import { intlMock } from "@test/intl";

import { refundGridMessages } from "./messages";
import { canAddRefund } from "./utils";

describe("canAddRefund", () => {
  it("returns false when there are no transactions", () => {
    // Arrange
    const transactions: OrderDetailsFragment["transactions"] = [];
    const intl = intlMock;

    // Act
    const result = canAddRefund({ transactions, intl });

    // Assert
    expect(result).toEqual({
      canRefund: false,
      reason: refundGridMessages.noTransactionsToRefund.defaultMessage,
    });
  });

  it("returns false when all transactions are non-refundable", () => {
    // Arrange
    const transactions = [
      {
        actions: [TransactionActionEnum.CHARGE, TransactionActionEnum.CANCEL],
      },
    ] as unknown as OrderDetailsFragment["transactions"];
    const intl = intlMock;

    // Act
    const result = canAddRefund({ transactions, intl });

    // Assert
    expect(result).toEqual({
      canRefund: false,
      reason: refundGridMessages.allTransactionsNonRefundable.defaultMessage,
    });
  });

  it("returns true when there is at least one refundable transaction", () => {
    // Arrange
    const transactions = [
      {
        actions: [TransactionActionEnum.REFUND],
      },
    ] as unknown as OrderDetailsFragment["transactions"];
    const intl = intlMock;

    // Act
    const result = canAddRefund({ transactions, intl });

    // Assert
    expect(result).toEqual({
      canRefund: true,
    });
  });
});
