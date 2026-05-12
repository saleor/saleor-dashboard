import {
  type MoneyFragment,
  type OrderDetailsFragment,
  OrderDiscountType,
  type OrderLineFragment,
  VoucherTypeEnum,
} from "@dashboard/graphql";

import {
  type LinePriceWaterfall,
  type PriceFactor,
  type PriceFactorLink,
  type PriceWarning,
} from "./types";

const roundMinor = (n: number) => Math.round(n * 100) / 100;

/**
 * Sub-cent residuals are absorbed silently. We only emit shares / adjustments
 * for amounts that are at least 1 minor unit, since anything below is
 * floating-point noise from converting backend integer minor units to JS.
 */
const ZERO_TOLERANCE = 0.005;

const moneyOf = (amount: number, currency: string): MoneyFragment => ({
  __typename: "Money",
  amount: roundMinor(amount),
  currency,
});

const isShippingVoucher = (order: OrderDetailsFragment) =>
  order.voucher?.type === VoucherTypeEnum.SHIPPING;

/**
 * Resolve a deep-link to the source entity behind a factor. Today only
 * vouchers can be linked: the order keeps a direct FK (`Order.voucher.id`)
 * and we route to the voucher detail page. Promotion factors return
 * `undefined` because `OrderLineDiscount` and `OrderDiscount` do not expose a
 * `promotionId` on the schema; when Saleor adds that FK the renderer can
 * extend `PriceFactorLink` with a `promotion` variant.
 */
const voucherLink = (order: OrderDetailsFragment): PriceFactorLink | undefined =>
  order.voucher?.id ? { kind: "voucher", voucherId: order.voucher.id } : undefined;

/**
 * Build the typed price waterfall for a single order line.
 *
 * Strategy: line-level discounts are taken straight from `line.discounts[]`
 * (backend truth, one record per line). The order-level slice for this line
 * is *derived* from the recorded line total:
 *
 *   remainingDiscount = start - sum(line.discounts[].total) - end
 *
 * That single number is the actual amount the backend allocated to this line
 * from order-level discounts. We then distribute it across the order's
 * `OrderDiscount` records proportionally to their `total` weights, with the
 * last record absorbing any rounding remainder. By construction
 * `start - sum(factors) = end` exactly.
 *
 * The split between order-level records is approximate when more than one
 * exists (the API stores one `OrderDiscount.total` per order, not per line),
 * but the running total in the waterfall always reconciles to the recorded
 * line total.
 */
export function buildLineWaterfall(
  line: OrderLineFragment,
  order: OrderDetailsFragment,
): LinePriceWaterfall {
  const currency = line.totalPrice.gross.currency;
  const start = moneyOf(line.undiscountedUnitPrice.gross.amount * line.quantity, currency);
  const end = moneyOf(line.totalPrice.gross.amount, currency);

  const factors: PriceFactor[] = [];
  const warnings: PriceWarning[] = [];

  const lineDiscounts = line.discounts ?? [];
  const hasManualLine = lineDiscounts.some(d => d.type === OrderDiscountType.MANUAL);
  const hasAutomaticLine = lineDiscounts.some(d => d.type !== OrderDiscountType.MANUAL);

  // Backend should have cleared non-manual discounts when a manual was added,
  // but guard against in-flight inconsistency.
  if (hasManualLine && hasAutomaticLine) {
    warnings.push({
      id: "manual_overrides_automatic",
      message:
        "Manual line discount coexists with an automatic discount. " +
        "Manual takes precedence; the automatic record should be ignored.",
    });
  }

  // Emit catalogue + voucher line factors first, manual last (manual is
  // semantically applied last per backend precedence rules).
  const orderedDiscounts = [
    ...lineDiscounts.filter(d => d.type !== OrderDiscountType.MANUAL),
    ...lineDiscounts.filter(d => d.type === OrderDiscountType.MANUAL),
  ];

  for (const d of orderedDiscounts) {
    switch (d.type) {
      case OrderDiscountType.PROMOTION:
      case OrderDiscountType.SALE:
        factors.push({
          kind: "catalogue_promotion",
          name: d.translatedName || d.name,
          reason: d.reason,
          signedDelta: d.total,
          sourceType: d.type,
        });
        break;

      case OrderDiscountType.VOUCHER:
        factors.push({
          kind: "voucher_line",
          name: d.translatedName || d.name,
          code: line.voucherCode ?? order.voucherCode ?? null,
          signedDelta: d.total,
          link: voucherLink(order),
        });
        break;

      case OrderDiscountType.MANUAL:
        factors.push({
          kind: "manual_line",
          reason: d.reason,
          signedDelta: d.total,
        });
        break;

      // Order-level kinds shouldn't appear on `line.discounts`; ignore safely.
      case OrderDiscountType.ORDER_PROMOTION:
      default:
        break;
    }
  }

  const lineLevelTotal = lineDiscounts.reduce((acc, d) => acc + (d.total?.amount ?? 0), 0);
  // Total amount the line absorbed from order-level discounts. Positive when
  // a discount was applied (the typical case); negative is rare and means the
  // backend re-priced the line upward (e.g. a plugin override).
  const remainingDiscount = roundMinor(start.amount - lineLevelTotal - end.amount);

  if (Math.abs(remainingDiscount) > ZERO_TOLERANCE) {
    const orderRecords = (order.discounts ?? []).filter(od => {
      if (od.type === OrderDiscountType.VOUCHER && isShippingVoucher(order)) return false;

      const t = od.total ?? od.amount;

      return Boolean(t && Math.abs(t.amount) > 0);
    });

    if (orderRecords.length === 0) {
      // Unexplained residual — surface honestly so the math still reconciles.
      factors.push({
        kind: "other_adjustment",
        value: moneyOf(Math.abs(remainingDiscount), currency),
        direction: remainingDiscount > 0 ? "minus" : "plus",
      });
    } else {
      const totalWeight = orderRecords.reduce(
        (acc, od) => acc + Math.abs(((od.total ?? od.amount) as MoneyFragment).amount),
        0,
      );

      let allocated = 0;

      orderRecords.forEach((od, idx) => {
        const orderTotal = od.total ?? od.amount;

        if (!orderTotal) return;

        const isLast = idx === orderRecords.length - 1;
        let share: number;

        if (isLast) {
          // Last record absorbs any rounding remainder so the sum reconciles.
          share = roundMinor(remainingDiscount - allocated);
        } else if (totalWeight > 0) {
          const ratio = Math.abs(orderTotal.amount) / totalWeight;

          share = roundMinor(remainingDiscount * ratio);
          allocated += share;
        } else {
          share = roundMinor(remainingDiscount / orderRecords.length);
          allocated += share;
        }

        if (Math.abs(share) < ZERO_TOLERANCE) return;

        const lineShare = moneyOf(share, currency);

        switch (od.type) {
          case OrderDiscountType.VOUCHER:
            factors.push({
              kind: "voucher_order_share",
              name: order.voucher?.name ?? od.translatedName ?? od.name,
              code: order.voucherCode ?? order.voucher?.code ?? null,
              lineShare,
              link: voucherLink(order),
            });
            break;

          case OrderDiscountType.ORDER_PROMOTION:
          case OrderDiscountType.PROMOTION:
            factors.push({
              kind: "order_promotion_share",
              name: od.translatedName || od.name,
              lineShare,
              sourceType: od.type,
            });
            break;

          case OrderDiscountType.MANUAL:
            factors.push({
              kind: "manual_order_share",
              reason: od.reason,
              lineShare,
            });
            break;

          default:
            break;
        }
      });

      // Only warn about approximation when the split is genuinely a guess —
      // i.e. there is more than one order-level record contributing.
      if (orderRecords.length > 1) {
        warnings.push({
          id: "order_discount_propagated_to_line",
          message:
            "This line absorbs a slice of multiple order-level discounts. " +
            "The split between records is approximate; the line total reconciles exactly.",
        });
      }
    }
  }

  return {
    lineId: line.id,
    variantName: line.variant?.name ?? "",
    productName: line.productName,
    quantity: line.quantity,
    start,
    factors,
    end,
    warnings,
  };
}
