import { OrderDiscountType } from "@dashboard/graphql";

export type DiscountTypeCategory = "manual" | "voucher" | "promotion" | "other";

export function getDiscountTypeCategory(type: OrderDiscountType): DiscountTypeCategory {
  switch (type) {
    case OrderDiscountType.MANUAL:
      return "manual";
    case OrderDiscountType.VOUCHER:
      return "voucher";
    case OrderDiscountType.ORDER_PROMOTION:
    case OrderDiscountType.PROMOTION:
    case OrderDiscountType.SALE:
      return "promotion";
    default:
      return "other";
  }
}
