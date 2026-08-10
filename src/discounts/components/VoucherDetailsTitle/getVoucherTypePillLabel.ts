import {
  DiscountValueTypeEnum,
  type VoucherDetailsFragment,
  VoucherTypeEnum,
} from "@dashboard/graphql";
import { type IntlShape } from "react-intl";

import { voucherDetailsTitleMessages as messages } from "./messages";

type VoucherTypePillSource = Pick<VoucherDetailsFragment, "type" | "discountValueType">;

export const getVoucherTypePillLabel = (
  voucher: VoucherTypePillSource,
  intl: IntlShape,
): string => {
  if (voucher.type === VoucherTypeEnum.SHIPPING) {
    return intl.formatMessage(messages.freeShipping);
  }

  const scope =
    voucher.type === VoucherTypeEnum.SPECIFIC_PRODUCT
      ? intl.formatMessage(messages.scopeProducts)
      : intl.formatMessage(messages.scopeEntireOrder);

  const amount =
    voucher.discountValueType === DiscountValueTypeEnum.PERCENTAGE
      ? intl.formatMessage(messages.amountPercentage)
      : intl.formatMessage(messages.amountFixed);

  return intl.formatMessage(messages.scopeAmount, { scope, amount });
};
