import { DiscountErrorFragment } from "@saleor/fragments/types/DiscountErrorFragment";
import { commonMessages } from "@saleor/intl";
import { DiscountErrorCode } from "@saleor/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
  alreadyExists: {
    defaultMessage: "Promo code already exists",
    description: "error message"
  }
});

function getDiscountErrorMessage(
  err: Omit<DiscountErrorFragment, "__typename"> | undefined,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case DiscountErrorCode.ALREADY_EXISTS:
        return intl.formatMessage(messages.alreadyExists);
      case DiscountErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      case DiscountErrorCode.INVALID:
        return intl.formatMessage(commonErrorMessages.invalid);
      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export default getDiscountErrorMessage;
