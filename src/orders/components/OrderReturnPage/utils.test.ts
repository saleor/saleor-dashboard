import { getReturnRefundValue } from "./utils";

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
