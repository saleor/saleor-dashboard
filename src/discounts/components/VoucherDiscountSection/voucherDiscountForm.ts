import { type VoucherDetailsPageFormData } from "@dashboard/discounts/components/VoucherDetailsPage";
import { DiscountTypeEnum } from "@dashboard/discounts/types";
import { VoucherTypeEnum } from "@dashboard/graphql";

export const voucherDiscountScope = {
  entireOrder: VoucherTypeEnum.ENTIRE_ORDER,
  specificProduct: VoucherTypeEnum.SPECIFIC_PRODUCT,
  shipping: "SHIPPING",
} as const;

export type VoucherDiscountScope = (typeof voucherDiscountScope)[keyof typeof voucherDiscountScope];

export const voucherDiscountAmountType = {
  percentage: "PERCENTAGE",
  fixed: "FIXED",
} as const;

export type VoucherDiscountAmountType =
  (typeof voucherDiscountAmountType)[keyof typeof voucherDiscountAmountType];

export const isShippingVoucher = (
  data: Pick<VoucherDetailsPageFormData, "discountType">,
): boolean => data.discountType === DiscountTypeEnum.SHIPPING;

export const getVoucherDiscountScope = (
  data: Pick<VoucherDetailsPageFormData, "discountType" | "type">,
): VoucherDiscountScope => {
  if (isShippingVoucher(data)) {
    return voucherDiscountScope.shipping;
  }

  if (data.type === VoucherTypeEnum.SPECIFIC_PRODUCT) {
    return voucherDiscountScope.specificProduct;
  }

  return voucherDiscountScope.entireOrder;
};

export const getVoucherDiscountAmountType = (
  data: Pick<VoucherDetailsPageFormData, "discountType">,
): VoucherDiscountAmountType =>
  data.discountType === DiscountTypeEnum.VALUE_FIXED
    ? voucherDiscountAmountType.fixed
    : voucherDiscountAmountType.percentage;
