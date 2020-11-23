import { ShippingErrorFragment } from "@saleor/fragments/types/ShippingErrorFragment";
import { ShippingErrorCode } from "@saleor/types/globalTypes";
import getShippingErrorMessage from "@saleor/utils/errors/shipping";
import { defineMessages, IntlShape } from "react-intl";

const messages = defineMessages({
  invalid: {
    defaultMessage: "Value is invalid",
    description: "error message"
  },
  price: {
    defaultMessage: "Maximum price cannot be lower than minimum",
    description: "error message"
  },
  weight: {
    defaultMessage: "Maximum weight cannot be lower than minimum",
    description: "error message"
  }
});

export function getShippingPriceRateErrorMessage(
  err: ShippingErrorFragment,
  intl: IntlShape
): string {
  switch (err?.code) {
    case ShippingErrorCode.MAX_LESS_THAN_MIN:
      return intl.formatMessage(messages.price);
    default:
      getShippingErrorMessage(err, intl);
  }
}

export function getShippingWeightRateErrorMessage(
  err: ShippingErrorFragment,
  intl: IntlShape
): string {
  switch (err?.code) {
    case ShippingErrorCode.MAX_LESS_THAN_MIN:
      return intl.formatMessage(messages.weight);
    case ShippingErrorCode.INVALID:
      return intl.formatMessage(messages.invalid);
    default:
      getShippingErrorMessage(err, intl);
  }
}
