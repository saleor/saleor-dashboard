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
      /** A free-gift line added by an `ORDER_PROMOTION` rule. The line carries
       *  `isGift = true` and a single `OrderLineDiscount` of type
       *  `ORDER_PROMOTION` whose `total` equals the catalog price — the gift's
       *  full value, billed at zero. */
      kind: "gift_line";
      promotionName: string | null;
      signedDelta: MoneyFragment;
    }
  | {
      kind: "manual_order_share";
      reason: string | null;
      lineShare: MoneyFragment;
    }
  | {
      /** Multiple order-level discounts contributed to this line and the
       *  backend does not surface a per-record-per-line decomposition. We
       *  show the combined slice (exact) and the contributing records by
       *  name, without inventing per-record amounts. */
      kind: "order_level_combined";
      lineShare: MoneyFragment;
      contributors: PriceFactorContributor[];
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

/**
 * Named source behind a combined order-level factor. Carries enough to render
 * a label (and a voucher deep-link when available) but no per-record amount —
 * the backend does not store a per-line breakdown of order-level discounts,
 * and we will not fabricate one.
 */
export type PriceFactorContributor =
  | {
      kind: "voucher";
      name: string | null;
      code: string | null;
      link?: PriceFactorLink;
    }
  | { kind: "order_promotion"; name: string | null }
  | { kind: "manual"; reason: string | null };

export type PriceWarningId =
  /** A `MANUAL` discount coexists with non-manual line discounts. Backend
   * normally clears non-manual when a manual is added; this surfaces the rare
   * case where the data is in an unexpected state. */
  "manual_overrides_automatic";

/**
 * Typed warning emitted by the builder. Carries only the discriminator (and
 * any structured metadata future warnings need); user-facing copy lives in
 * `messages.ts` and is resolved by the renderer via `react-intl`.
 */
export interface PriceWarning {
  id: PriceWarningId;
}

export interface LinePriceWaterfall {
  lineId: string;
  variantName: string;
  productName: string;
  productSku: string | null;
  thumbnailUrl: string | null;
  quantity: number;
  /** Currency-minor-unit precision for arithmetic on this waterfall. Sourced
   *  from the line's `Money.fractionDigits` (backend truth) when available,
   *  with a client-side fallback derived from `currency` for fixtures/stories
   *  that don't surface the field. */
  fractionDigits: number;
  /** undiscountedUnitPrice.gross * quantity */
  start: MoneyFragment;
  /** Steps applied in order: line-level first (catalogue, voucher, manual),
   *  then the order-level slice derived from `start - lineDeltas - end`.
   *  When exactly one order-level record contributed, that slice is emitted
   *  as a per-kind share; with multiple records it collapses into a single
   *  `order_level_combined` factor (Saleor doesn't surface per-record-per-line
   *  attribution). By construction the running total reconciles to `end`
   *  exactly. */
  factors: PriceFactor[];
  /** totalPrice.gross (final paid for the line; tax-inclusive in the same
   *  units as the catalog price). */
  end: MoneyFragment;
  /** True when the line's unit price was set custom (via a price override on
   *  the checkout/order line) rather than derived from the catalog price. The
   *  base (`start`) row surfaces this so the "original price" is understood as
   *  an overridden value, not the catalog value. */
  isPriceOverridden: boolean;
  /** Human-readable reason recorded alongside the price override, when the app
   *  that set it provided one. Null when overridden without a reason or not
   *  overridden at all. */
  priceOverrideReason: string | null;
  warnings: PriceWarning[];
}
