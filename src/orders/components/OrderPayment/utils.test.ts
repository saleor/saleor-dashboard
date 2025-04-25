import { IMoney } from "@dashboard/utils/intl";

import { getDiscountAmount } from "./utils";

describe("getDiscountAmount", () => {
  it("should return negative amount when amount greater than 0", () => {
    // Arrange
    const amount: IMoney = {
      amount: 5,
      currency: "USD",
    };

    // Act
    const result = getDiscountAmount(amount);

    // Assert
    expect(result).toEqual({ currency: "USD", amount: -5 });
  });

  it("should return 0 when amount equal 0", () => {
    // Arrange
    const amount: IMoney = {
      amount: 0,
      currency: "USD",
    };

    // Act
    const result = getDiscountAmount(amount);

    // Assert
    expect(result).toEqual({ currency: "USD", amount: 0 });
  });

  it("should return same amount when amount is negative", () => {
    // Arrange
    const amount: IMoney = {
      amount: -4,
      currency: "USD",
    };

    // Act
    const result = getDiscountAmount(amount);

    // Assert
    expect(result).toEqual({ currency: "USD", amount: -4 });
  });
});
