import {
  type DiscountTypeCategory,
  getDiscountTypeCategory,
} from "@dashboard/orders/utils/discounts";
import { type AutomaticDiscountInfo } from "@dashboard/products/components/OrderDiscountProviders/types";
import { defineMessages, type IntlShape, type MessageDescriptor } from "react-intl";

const discountSourceLabels = defineMessages({
  voucherSource: {
    id: "9GevHe",
    defaultMessage: "voucher",
    description: "discount type label in line discount modal",
  },
  promotionSource: {
    id: "cwYYx4",
    defaultMessage: "promotion",
    description: "discount type label in line discount modal",
  },
  genericSource: {
    id: "jLePAq",
    defaultMessage: "a voucher or promotion",
    description: "fallback discount source label in line discount modal",
  },
  namedSource: {
    id: "tIdHHK",
    defaultMessage: '{type} "{name}"',
    description: "named discount source in line discount modal, e.g. promotion Summer Sale",
  },
});

const discountSourceMessages: Record<DiscountTypeCategory, MessageDescriptor> = {
  manual: discountSourceLabels.genericSource,
  voucher: discountSourceLabels.voucherSource,
  promotion: discountSourceLabels.promotionSource,
  other: discountSourceLabels.genericSource,
};

const getDiscountSourceLabel = (type: AutomaticDiscountInfo["type"], intl: IntlShape): string =>
  intl.formatMessage(discountSourceMessages[getDiscountTypeCategory(type)]);

export function formatDiscountSource(discounts: AutomaticDiscountInfo[], intl: IntlShape): string {
  if (discounts.length === 0) {
    return intl.formatMessage(discountSourceLabels.genericSource);
  }

  const parts = discounts.map(d => {
    const typeLabel = getDiscountSourceLabel(d.type, intl);

    if (d.name) {
      return intl.formatMessage(discountSourceLabels.namedSource, {
        type: typeLabel,
        name: d.name,
      });
    }

    return typeLabel;
  });

  return parts.join(", ");
}
