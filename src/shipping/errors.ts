// @ts-strict-ignore
import { ShippingErrorCode, type ShippingErrorFragment } from "@dashboard/graphql";
import getShippingErrorMessage from "@dashboard/utils/errors/shipping";
import { defineMessages, type IntlShape } from "react-intl";

const messages = defineMessages({
  invalid: {
    id: "57IYpr",
    defaultMessage: "Value is invalid",
    description: "error message",
  },
  price: {
    id: "oIL8jk",
    defaultMessage: "Maximum price must be higher than minimum",
    description: "error message",
  },
  weight: {
    id: "M3OlSr",
    defaultMessage: "Maximum weight must be higher than minimum",
    description: "error message",
  },
});

export function getShippingWeightRateErrorMessage(
  err: ShippingErrorFragment,
  intl: IntlShape,
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
