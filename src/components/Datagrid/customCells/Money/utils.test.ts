import { canShowCurrency, hasDiscountValue } from "./utils";

describe("MoneyCell utils", () => {
  describe("hasDiscountValue", () => {
    it("should return true if value is not undefined, null", () => {
      expect(hasDiscountValue(0)).toBe(true);
      expect(hasDiscountValue(144)).toBe(true);
      expect(hasDiscountValue(undefined)).toBe(false);
      expect(hasDiscountValue(null)).toBe(false);
    });
  });

  describe("canShowCurrency", () => {
    // Cell padding is 8px on each side and 8px between currency and prices,
    // so a 160px cell leaves 136px for currency plus prices.
    const cellWidth = 160;

    it("shows the currency when it fits next to the prices", () => {
      // Arrange
      const widths = { cellWidth, currencyWidth: 20, pricesWidth: 116 };

      // Act
      const result = canShowCurrency(widths);

      // Assert
      expect(result).toBe(true);
    });

    it("hides the currency when the prices would overlap it", () => {
      // Arrange
      const widths = { cellWidth, currencyWidth: 20, pricesWidth: 117 };

      // Act
      const result = canShowCurrency(widths);

      // Assert
      expect(result).toBe(false);
    });
  });
});
