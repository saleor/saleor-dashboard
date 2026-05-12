import { type MoneyFragment, type OrderDiscountType } from "@dashboard/graphql";

/**
 * Optional pointer from a factor to its source entity in the dashboard.
 *
 * Currently only vouchers can be deep-linked — `Order.voucher.id` exposes the
 * FK once a voucher is attached to the order. Promotion factors carry no
 * link because `OrderLineDiscount` and `OrderDiscount` do not surface a
 * `promotionId` on the schema. When Saleor exposes that FK the union should
 * gain a `{ kind: "promotion"; promotionId: string }` variant; renderer and
 * builder are shaped around the `kind` discriminator already.
 */
export type PriceFactorLink = { kind: "voucher"; voucherId: string };

/**
 * The structural invariant of PriceDoctor: every price step is a typed record.
 * Future "machine-legible" surfaces (JSON export, MCP tool) re-emit this shape.
 *
 * `signedDelta` for line-derived factors is the discount AMOUNT, expressed as a
 * positive number (the same convention `OrderLineDiscount.total` uses on the
 * backend). Order-derived factors carry `lineShare`: the per-line slice the
 * backend allocated from a whole-order discount.
 */
export type PriceFactor =
  | {
      kind: "catalogue_promotion";
      name: string | null;
      signedDelta: MoneyFragment;
      reason?: string | null;
      sourceType: OrderDiscountType.PROMOTION | OrderDiscountType.SALE;
    }
  | {
      kind: "voucher_line";
      name: string | null;
      code?: string | null;
      signedDelta: MoneyFragment;
      link?: PriceFactorLink;
    }
  | {
      kind: "voucher_order_share";
      name: string | null;
      code?: string | null;
      lineShare: MoneyFragment;
      link?: PriceFactorLink;
    }
  | {
      kind: "order_promotion_share";
      name: string | null;
      lineShare: MoneyFragment;
      sourceType: OrderDiscountType.ORDER_PROMOTION | OrderDiscountType.PROMOTION;
    }
  | {
      kind: "manual_line";
      reason: string | null;
      signedDelta: MoneyFragment;
    }
  | {
      kind: "manual_order_share";
      reason: string | null;
      lineShare: MoneyFragment;
    }
  | {
      /** A residual that the backend applied to the line but that we cannot
       *  attribute to a specific record (no order-level discount documents it,
       *  or backend re-priced via a plugin). Surfaced honestly so the running
       *  total still reconciles to the recorded line total. */
      kind: "other_adjustment";
      value: MoneyFragment;
      /** "minus" reduces the line total; "plus" increases it. */
      direction: "minus" | "plus";
    };

export type PriceWarningId =
  /** A `MANUAL` discount coexists with non-manual line discounts. Backend
   * normally clears non-manual when a manual is added; this surfaces the rare
   * case where the data is in an unexpected state. */
  | "manual_overrides_automatic"
  /** Multiple order-level discount records were spread across the line; the
   *  per-record allocation is approximate (the API publishes one number per
   *  order, not per line). The line total still reconciles exactly. */
  | "order_discount_propagated_to_line";

export interface PriceWarning {
  id: PriceWarningId;
  /** A short human-readable hint. Use `messages.ts` for translations. */
  message: string;
}

export interface LinePriceWaterfall {
  lineId: string;
  variantName: string;
  productName: string;
  quantity: number;
  /** undiscountedUnitPrice.gross * quantity */
  start: MoneyFragment;
  /** Steps applied in order: line-level first (catalogue, voucher, manual),
   *  then order-level shares derived from `start - lineDeltas - end` and
   *  distributed across order discount records by their `total` weights.
   *  By construction the running total reconciles to `end` exactly. */
  factors: PriceFactor[];
  /** totalPrice.gross (final paid for the line; tax-inclusive in the same
   *  units as the catalog price). */
  end: MoneyFragment;
  warnings: PriceWarning[];
}
