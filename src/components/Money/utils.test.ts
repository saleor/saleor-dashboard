import { IMoney } from "@dashboard/utils/intl";

import { Locale } from "../Locale";
import { getMoney } from "./utils";

describe("getMoney", () => {
  it("should trim fraction digits to maximum allowed", () => {
    // Arrange
    const moneyObject: IMoney = {
      amount: 140.33434,
      currency: "PLN",
    };
    const locale: Locale = Locale.PL;

    // Act
    const result = getMoney(moneyObject, locale);

    // Assert
    expect(result).toBe("140,33");
  });
});
