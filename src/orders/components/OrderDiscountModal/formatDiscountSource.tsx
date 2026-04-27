import {
  type DiscountTypeCategory,
  getDiscountTypeCategory,
} from "@dashboard/orders/utils/discounts";
import { type AutomaticDiscountInfo } from "@dashboard/products/components/OrderDiscountProviders/types";
import { Text } from "@saleor/macaw-ui-next";
import { Fragment, type ReactElement } from "react";
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
});

const discountSourceMessages: Record<DiscountTypeCategory, MessageDescriptor> = {
  manual: discountSourceLabels.genericSource,
  voucher: discountSourceLabels.voucherSource,
  promotion: discountSourceLabels.promotionSource,
  other: discountSourceLabels.genericSource,
};

const getDiscountSourceLabel = (type: AutomaticDiscountInfo["type"], intl: IntlShape): string =>
  intl.formatMessage(discountSourceMessages[getDiscountTypeCategory(type)]);

export function formatDiscountSource(
  discounts: AutomaticDiscountInfo[],
  intl: IntlShape,
): ReactElement | string {
  if (discounts.length === 0) {
    return intl.formatMessage(discountSourceLabels.genericSource);
  }

  return (
    <>
      {discounts.map((discount, index) => {
        const typeLabel = getDiscountSourceLabel(discount.type, intl);
        const separator = index > 0 ? ", " : "";

        if (discount.name) {
          return (
            <Fragment key={index}>
              {separator}
              {typeLabel}{" "}
              <Text as="span" size={2} fontWeight="bold" color="default1">
                &quot;{discount.name}&quot;
              </Text>
            </Fragment>
          );
        }

        return (
          <Fragment key={index}>
            {separator}
            {typeLabel}
          </Fragment>
        );
      })}
    </>
  );
}
