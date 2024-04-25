import { TransactionActionEnum } from "@dashboard/graphql";
import { orderTransactions } from "@dashboard/orders/fixtures";

import { submitCardMessages } from "./components/TransactionSubmitCard/messages";
import { canSendRefundDuringReturn, getReturnRefundValue } from "./utils";

describe("getReturnRefundValue", () => {
  it("should return empty string if autoGrantRefund is false", () => {
    // Arrange
    const testData = {
      autoGrantRefund: false,
      isAmountDirty: false,
      customRefundValue: undefined,
      amountData: undefined,
    };
    // Act
    const result = getReturnRefundValue(testData);

    // Assert
    expect(result).toEqual("");
  });
  it("should return customRefundValue as string if autoGrantRefund is true and isAmountDirty is true", () => {
    // Arrange
    const testData = {
      autoGrantRefund: true,
      isAmountDirty: true,
      customRefundValue: 123,
      amountData: undefined,
    };
    // Act
    const result = getReturnRefundValue(testData);

    // Assert
    expect(result).toEqual("123");
  });
  it("should return empty string if autoGrantRefund is true, isAmountDirty is true, but customRefundValue is undefined", () => {
    // Arrange
    const testData = {
      autoGrantRefund: true,
      isAmountDirty: true,
      customRefundValue: undefined,
      amountData: undefined,
    };
    // Act
    const result = getReturnRefundValue(testData);

    // Assert
    expect(result).toEqual("");
  });
  it("should return refundTotalAmount as string if autoGrantRefund is true, isAmountDirty is false, and amountData is defined", () => {
    // Arrange
    const testData = {
      autoGrantRefund: true,
      isAmountDirty: false,
      customRefundValue: undefined,
      amountData: {
        refundTotalAmount: {
          amount: 456.78,
          currency: "USD",
        },
        maxRefund: {
          amount: 456.78,
          currency: "USD",
        },
        previouslyRefunded: {
          amount: 0,
          currency: "USD",
        },
        authorizedAmount: {
          amount: 456.78,
          currency: "USD",
        },
      },
    };
    // Act
    const result = getReturnRefundValue(testData);

    // Assert
    expect(result).toEqual("456.78");
  });
  it("should return empty string if autoGrantRefund is true, isAmountDirty is false, but amountData is undefined", () => {
    // Arrange
    const testData = {
      autoGrantRefund: true,
      isAmountDirty: false,
      customRefundValue: undefined,
      amountData: undefined,
    };
    // Act
    const result = getReturnRefundValue(testData);

    // Assert
    expect(result).toEqual("");
  });
});
describe("canSendRefundDuringReturn", () => {
  it("should return false when autoGrantRefund is false", () => {
    // Arrange
    const transactionMock = orderTransactions[0];
    const autoGrantRefund = false;
    // Act
    const result = canSendRefundDuringReturn({
      autoGrantRefund,
      transactions: [transactionMock],
    });

    // Assert
    expect(result).toEqual({
      value: false,
      reason: submitCardMessages.cantSendRefundGrantFirst,
    });
  });
  it("should return false when there are no transactions", () => {
    // Arrange
    const autoGrantRefund = true;
    // Act
    const result = canSendRefundDuringReturn({
      autoGrantRefund,
      transactions: [],
    });

    // Assert
    expect(result).toEqual({
      value: false,
      reason: submitCardMessages.cantSendRefundNoTransactions,
    });
  });
  it("should return false when there are multiple transactions", () => {
    // Arrange
    const transactionMock = orderTransactions[0];
    const autoGrantRefund = true;
    // Act
    const result = canSendRefundDuringReturn({
      autoGrantRefund,
      transactions: [transactionMock, transactionMock],
    });

    // Assert
    expect(result).toEqual({
      value: false,
      reason: submitCardMessages.cantSendRefundMultipleTransactions,
    });
  });
  it("should return false when the transaction does not include a refund action", () => {
    // Arrange
    const transactionMock = { ...orderTransactions[0], actions: [] };
    const autoGrantRefund = true;
    // Act
    const result = canSendRefundDuringReturn({
      autoGrantRefund,
      transactions: [transactionMock],
    });

    // Assert
    expect(result).toEqual({
      value: false,
      reason: submitCardMessages.cantSendRefundNonRefundable,
    });
  });
  it("should return true when all conditions are met", () => {
    // Arrange
    const transactionMock = {
      ...orderTransactions[0],
      actions: [TransactionActionEnum.REFUND],
    };
    const autoGrantRefund = true;
    const result = canSendRefundDuringReturn({
      autoGrantRefund,
      transactions: [transactionMock],
    });

    expect(result).toEqual({
      value: true,
      reason: null,
    });
  });
});
