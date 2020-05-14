import { ShippingErrorCode } from "@saleor/types/globalTypes";
import getShippingErrorMessage from "@saleor/utils/errors/shipping";
import { defineMessages, IntlShape } from "react-intl";

import { ShippingErrorFragment } from "../../types/ShippingErrorFragment";

const messages = defineMessages({
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
    default:
      getShippingErrorMessage(err, intl);
  }
}
