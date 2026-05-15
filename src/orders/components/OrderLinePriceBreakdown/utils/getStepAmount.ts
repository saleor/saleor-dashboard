import { type MoneyFragment } from "@dashboard/graphql";

import { type PriceFactor } from "./types";

export interface StepAmount {
  /** Money to display in the middle column (always non-negative). */
  display: MoneyFragment;
  /** Signed contribution to the running total: negative for discounts,
   *  positive for upward adjustments. */
  delta: number;
  /** Sign prefix shown next to the displayed amount. */
  sign: "minus" | "plus" | "none";
}

/**
 * Map a typed `PriceFactor` to the per-step view-model the waterfall renderer
 * needs: the absolute amount to display, the signed delta to fold into the
 * running total, and the prefix sign.
 *
 * The running-total invariant (`start + Σdelta = end`) of the waterfall
 * depends on this mapping: a wrong sign or wrong source field here breaks
 * reconciliation silently. Tested exhaustively per `PriceFactor.kind`.
 */
export function getStepAmount(factor: PriceFactor): StepAmount {
  switch (factor.kind) {
    case "catalogue_promotion":
    case "voucher_line":
    case "manual_line":
    case "gift_line":
      return { display: factor.signedDelta, delta: -factor.signedDelta.amount, sign: "minus" };
    case "voucher_order_share":
    case "order_promotion_share":
    case "manual_order_share":
    case "order_level_combined":
      return { display: factor.lineShare, delta: -factor.lineShare.amount, sign: "minus" };
    case "other_adjustment":
      return {
        display: factor.value,
        delta: factor.direction === "minus" ? -factor.value.amount : factor.value.amount,
        sign: factor.direction,
      };
  }
}
