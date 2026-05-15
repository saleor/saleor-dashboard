import { roundMoneyByDigits } from "@dashboard/components/Money";
import { getCurrencyDecimalPoints } from "@dashboard/components/PriceField/utils";
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
  type PriceFactorContributor,
  type PriceFactorLink,
  type PriceWarning,
} from "./types";

/** Sub-minor-unit residuals are absorbed silently. Tolerance is half a minor
 *  unit so anything below the currency's representable precision is ignored. */
const zeroTolerance = (fractionDigits: number): number => 0.5 / 10 ** fractionDigits;

const moneyOf = (amount: number, currency: string, fractionDigits: number): MoneyFragment => ({
  __typename: "Money",
  amount: roundMoneyByDigits(amount, fractionDigits),
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
 * from order-level discounts. When exactly one `OrderDiscount` record applies
 * to the order, we emit it as a per-kind share (the slice equals the record's
 * effect on this line). When two or more apply we cannot honestly attribute
 * a per-record amount per line — Saleor stores one `OrderDiscount.total` per
 * order, not per line. In that case we collapse them into a single
 * `order_level_combined` factor: the slice (exact) plus the contributing
 * records by name. By construction `start - sum(factors) = end` exactly.
 */
export function buildLineWaterfall(
  line: OrderLineFragment,
  order: OrderDetailsFragment,
): LinePriceWaterfall {
  const currency = line.totalPrice.gross.currency;
  // Trust the API's `Money.fractionDigits` (spread `MoneyWithFractionDigits` in
  // the OrderLine fragment); fall back to client-side derivation for fixtures
  // and any consumer that doesn't surface the field on the wire.
  const fractionDigits = line.totalPrice.gross.fractionDigits ?? getCurrencyDecimalPoints(currency);
  const start = moneyOf(
    line.undiscountedUnitPrice.gross.amount * line.quantity,
    currency,
    fractionDigits,
  );
  const end = moneyOf(line.totalPrice.gross.amount, currency, fractionDigits);

  const factors: PriceFactor[] = [];
  const warnings: PriceWarning[] = [];

  const lineDiscounts = line.discounts ?? [];
  const hasManualLine = lineDiscounts.some(d => d.type === OrderDiscountType.MANUAL);
  const hasAutomaticLine = lineDiscounts.some(d => d.type !== OrderDiscountType.MANUAL);

  // Backend should have cleared non-manual discounts when a manual was added,
  // but guard against in-flight inconsistency.
  if (hasManualLine && hasAutomaticLine) {
    warnings.push({ id: "manual_overrides_automatic" });
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
          code: line.voucherCode || order.voucherCode || null,
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

      // Saleor records free-gift lines (gifts granted by an ORDER_PROMOTION
      // rule) as a single OrderLineDiscount of type ORDER_PROMOTION on the
      // gift line itself, with `total` equal to the catalog price.
      case OrderDiscountType.ORDER_PROMOTION:
        if (line.isGift) {
          factors.push({
            kind: "gift_line",
            promotionName: d.translatedName || d.name,
            signedDelta: d.total,
          });
        } else {
          // Defensive: ORDER_PROMOTION on a non-gift line shouldn't happen
          // per backend contract, but if it does we still attribute the
          // amount honestly instead of silently dropping it.
          factors.push({
            kind: "catalogue_promotion",
            name: d.translatedName || d.name,
            reason: d.reason,
            signedDelta: d.total,
            sourceType: OrderDiscountType.PROMOTION,
          });
        }

        break;

      default:
        break;
    }
  }

  const lineLevelTotal = lineDiscounts.reduce((acc, d) => acc + (d.total?.amount ?? 0), 0);
  // Total amount the line absorbed from order-level discounts. Positive when
  // a discount was applied (the typical case); negative is rare and means the
  // backend re-priced the line upward (e.g. a plugin override).
  const remainingDiscount = roundMoneyByDigits(
    start.amount - lineLevelTotal - end.amount,
    fractionDigits,
  );
  const tolerance = zeroTolerance(fractionDigits);

  if (Math.abs(remainingDiscount) > tolerance) {
    const orderRecords = (order.discounts ?? []).filter(od => {
      if (od.type === OrderDiscountType.VOUCHER && isShippingVoucher(order)) return false;

      const t = od.total ?? od.amount;

      return Boolean(t && Math.abs(t.amount) > 0);
    });

    if (orderRecords.length === 0) {
      // Unexplained residual — surface honestly so the math still reconciles.
      factors.push({
        kind: "other_adjustment",
        value: moneyOf(Math.abs(remainingDiscount), currency, fractionDigits),
        direction: remainingDiscount > 0 ? "minus" : "plus",
      });
    } else if (orderRecords.length === 1) {
      // Single record: the line slice equals the record's effect on this
      // line, so per-kind attribution is exact. Emit the matching share.
      const od = orderRecords[0];
      const lineShare = moneyOf(remainingDiscount, currency, fractionDigits);

      switch (od.type) {
        case OrderDiscountType.VOUCHER:
          factors.push({
            kind: "voucher_order_share",
            name: order.voucher?.name || od.translatedName || od.name,
            code: order.voucherCode || order.voucher?.code || null,
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
    } else {
      // Multiple records: collapse into one combined factor. We name the
      // contributors but do not invent per-record amounts — Saleor does not
      // expose a per-record-per-line decomposition.
      const contributors: PriceFactorContributor[] = orderRecords
        .map((od): PriceFactorContributor | null => {
          switch (od.type) {
            case OrderDiscountType.VOUCHER:
              return {
                kind: "voucher",
                name: order.voucher?.name || od.translatedName || od.name,
                code: order.voucherCode || order.voucher?.code || null,
                link: voucherLink(order),
              };
            case OrderDiscountType.ORDER_PROMOTION:
            case OrderDiscountType.PROMOTION:
              return { kind: "order_promotion", name: od.translatedName || od.name };
            case OrderDiscountType.MANUAL:
              return { kind: "manual", reason: od.reason };
            default:
              return null;
          }
        })
        .filter((c): c is PriceFactorContributor => c !== null);

      factors.push({
        kind: "order_level_combined",
        lineShare: moneyOf(remainingDiscount, currency, fractionDigits),
        contributors,
      });
    }
  }

  return {
    lineId: line.id,
    variantName: line.variant?.name ?? "",
    productName: line.productName,
    productSku: line.productSku ?? null,
    thumbnailUrl: line.thumbnail?.url ?? null,
    quantity: line.quantity,
    fractionDigits,
    start,
    factors,
    end,
    warnings,
  };
}
