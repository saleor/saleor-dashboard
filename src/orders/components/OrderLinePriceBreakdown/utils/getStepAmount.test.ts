import { type MoneyFragment, OrderDiscountType } from "@dashboard/graphql";

import { getStepAmount } from "./getStepAmount";
import { type PriceFactor } from "./types";

const money = (amount: number, currency = "USD"): MoneyFragment => ({
  __typename: "Money" as const,
  amount,
  currency,
});

describe("getStepAmount", () => {
  describe("line-derived factors (signedDelta, sign minus)", () => {
    it("maps catalogue_promotion: display=signedDelta, delta=-amount, sign=minus", () => {
      // Arrange
      const factor: PriceFactor = {
        kind: "catalogue_promotion",
        name: "Summer sale",
        signedDelta: money(15),
        sourceType: OrderDiscountType.PROMOTION,
      };

      // Act
      const step = getStepAmount(factor);

      // Assert
      expect(step).toEqual({ display: money(15), delta: -15, sign: "minus" });
    });

    it("maps voucher_line: display=signedDelta, delta=-amount, sign=minus", () => {
      // Arrange
      const factor: PriceFactor = {
        kind: "voucher_line",
        name: "SAVE10",
        signedDelta: money(10),
      };

      // Act
      const step = getStepAmount(factor);

      // Assert
      expect(step).toEqual({ display: money(10), delta: -10, sign: "minus" });
    });

    it("maps manual_line: display=signedDelta, delta=-amount, sign=minus", () => {
      // Arrange
      const factor: PriceFactor = {
        kind: "manual_line",
        reason: "VIP",
        signedDelta: money(20),
      };

      // Act
      const step = getStepAmount(factor);

      // Assert
      expect(step).toEqual({ display: money(20), delta: -20, sign: "minus" });
    });

    it("maps gift_line: display=signedDelta, delta=-amount, sign=minus", () => {
      // Arrange
      const factor: PriceFactor = {
        kind: "gift_line",
        promotionName: "Free gift",
        signedDelta: money(50),
      };

      // Act
      const step = getStepAmount(factor);

      // Assert
      expect(step).toEqual({ display: money(50), delta: -50, sign: "minus" });
    });
  });

  describe("order-derived factors (lineShare, sign minus)", () => {
    it("maps voucher_order_share: display=lineShare, delta=-amount, sign=minus", () => {
      // Arrange
      const factor: PriceFactor = {
        kind: "voucher_order_share",
        name: "ORDER10",
        lineShare: money(7.5),
      };

      // Act
      const step = getStepAmount(factor);

      // Assert
      expect(step).toEqual({ display: money(7.5), delta: -7.5, sign: "minus" });
    });

    it("maps order_promotion_share: display=lineShare, delta=-amount, sign=minus", () => {
      // Arrange
      const factor: PriceFactor = {
        kind: "order_promotion_share",
        name: "Bundle deal",
        lineShare: money(12),
        sourceType: OrderDiscountType.ORDER_PROMOTION,
      };

      // Act
      const step = getStepAmount(factor);

      // Assert
      expect(step).toEqual({ display: money(12), delta: -12, sign: "minus" });
    });

    it("maps manual_order_share: display=lineShare, delta=-amount, sign=minus", () => {
      // Arrange
      const factor: PriceFactor = {
        kind: "manual_order_share",
        reason: "Loyalty",
        lineShare: money(3.33),
      };

      // Act
      const step = getStepAmount(factor);

      // Assert
      expect(step).toEqual({ display: money(3.33), delta: -3.33, sign: "minus" });
    });

    it("maps order_level_combined: display=lineShare, delta=-amount, sign=minus", () => {
      // Arrange
      const factor: PriceFactor = {
        kind: "order_level_combined",
        lineShare: money(8),
        contributors: [
          { kind: "voucher", name: "V1", code: "V1" },
          { kind: "manual", reason: "Goodwill" },
        ],
      };

      // Act
      const step = getStepAmount(factor);

      // Assert
      expect(step).toEqual({ display: money(8), delta: -8, sign: "minus" });
    });
  });

  describe("other_adjustment", () => {
    it("treats direction=minus as a negative contribution", () => {
      // Arrange
      const factor: PriceFactor = {
        kind: "other_adjustment",
        value: money(4.5),
        direction: "minus",
      };

      // Act
      const step = getStepAmount(factor);

      // Assert
      expect(step).toEqual({ display: money(4.5), delta: -4.5, sign: "minus" });
    });

    it("treats direction=plus as a positive contribution", () => {
      // Arrange
      const factor: PriceFactor = {
        kind: "other_adjustment",
        value: money(2.25),
        direction: "plus",
      };

      // Act
      const step = getStepAmount(factor);

      // Assert
      expect(step).toEqual({ display: money(2.25), delta: 2.25, sign: "plus" });
    });
  });

  describe("invariant: display.amount stays non-negative; delta carries the sign", () => {
    it("never returns a negative display.amount across all factor kinds", () => {
      // Arrange
      const factors: PriceFactor[] = [
        {
          kind: "catalogue_promotion",
          name: null,
          signedDelta: money(10),
          sourceType: OrderDiscountType.PROMOTION,
        },
        { kind: "voucher_line", name: null, signedDelta: money(10) },
        { kind: "manual_line", reason: null, signedDelta: money(10) },
        { kind: "gift_line", promotionName: null, signedDelta: money(10) },
        { kind: "voucher_order_share", name: null, lineShare: money(10) },
        {
          kind: "order_promotion_share",
          name: null,
          lineShare: money(10),
          sourceType: OrderDiscountType.ORDER_PROMOTION,
        },
        { kind: "manual_order_share", reason: null, lineShare: money(10) },
        { kind: "order_level_combined", lineShare: money(10), contributors: [] },
        { kind: "other_adjustment", value: money(10), direction: "minus" },
        { kind: "other_adjustment", value: money(10), direction: "plus" },
      ];

      // Act + Assert
      for (const factor of factors) {
        const step = getStepAmount(factor);

        expect(step.display.amount).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
