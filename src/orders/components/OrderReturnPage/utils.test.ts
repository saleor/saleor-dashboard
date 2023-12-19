import { getReturnRefundValue } from "./utils";

describe("getReturnRefundValue", () => {
  it("should return empty string if autoGrantRefund is false", () => {
    const result = getReturnRefundValue({
      autoGrantRefund: false,
      isAmountDirty: false,
      customRefundValue: undefined,
      amountData: undefined,
    });
    expect(result).toEqual("");
  });

  it("should return customRefundValue as string if autoGrantRefund is true and isAmountDirty is true", () => {
    const result = getReturnRefundValue({
      autoGrantRefund: true,
      isAmountDirty: true,
      customRefundValue: 123,
      amountData: undefined,
    });
    expect(result).toEqual("123");
  });

  it("should return empty string if autoGrantRefund is true, isAmountDirty is true, but customRefundValue is undefined", () => {
    const result = getReturnRefundValue({
      autoGrantRefund: true,
      isAmountDirty: true,
      customRefundValue: undefined,
      amountData: undefined,
    });
    expect(result).toEqual("");
  });

  it("should return refundTotalAmount as string if autoGrantRefund is true, isAmountDirty is false, and amountData is defined", () => {
    const result = getReturnRefundValue({
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
    });
    expect(result).toEqual("456.78");
  });

  it("should return empty string if autoGrantRefund is true, isAmountDirty is false, but amountData is undefined", () => {
    const result = getReturnRefundValue({
      autoGrantRefund: true,
      isAmountDirty: false,
      customRefundValue: undefined,
      amountData: undefined,
    });
    expect(result).toEqual("");
  });
});
