import { hasDiscountValue } from "./utils";

describe("MoneyCell utils", () => {
  describe("hasDiscountValue", () => {
    it("should return true if value is not undefined, null or empty string", () => {
      expect(hasDiscountValue(0)).toBe(true);
      expect(hasDiscountValue(144)).toBe(true);
      expect(hasDiscountValue(undefined)).toBe(false);
      expect(hasDiscountValue(null)).toBe(false);
    });
  });
});
